// src/services/httpClient.js
//
// Shared fetch helper for the auth + projects APIs. Mirrors the error
// shape services/api.js already uses (ApiError with .status and
// .fieldErrors) so components can handle errors from either file the
// same way. Adds one thing api.js's public endpoints don't need: an
// Authorization header + one-shot silent token refresh on a 401.

import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./tokenStorage";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export class ApiError extends Error {
  constructor(message, status, fieldErrors) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors || null;
  }
}

async function parseErrorBody(response) {
  let data = null;
  try {
    data = await response.json();
  } catch {
    // empty/non-JSON body
  }
  return data;
}

function firstErrorMessage(data, fallback) {
  if (!data || typeof data !== "object") return fallback;
  if (data.detail) return data.detail;
  const firstField = Object.keys(data)[0];
  if (!firstField) return fallback;
  const val = data[firstField];
  return Array.isArray(val) ? val[0] : val || fallback;
}

/**
 * Plain (unauthenticated) request — signup/login/password-reset all use
 * this since there's no token yet at that point in the flow.
 */
export async function publicRequest(path, { method = "GET", body, isFormData = false } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
      credentials: "include",
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new ApiError("Couldn't reach the server. Check your connection and try again.", 0);
  }

  if (response.status === 429) {
    throw new ApiError("Too many attempts — please wait a minute and try again.", 429);
  }

  // 202/205/204 — success with no body to parse
  if (response.status === 202 || response.status === 205 || response.status === 204) {
    return null;
  }

  const data = await parseErrorBody(response);

  if (!response.ok) {
    throw new ApiError(
      firstErrorMessage(data, "Something went wrong. Please try again."),
      response.status,
      response.status === 400 ? data : null,
    );
  }

  return data;
}

/**
 * Authenticated request — attaches the access token, and if the server
 * says it's expired (401), tries ONE silent refresh via
 * /users/token/refresh/ before retrying the original request once. If
 * that also fails, clears stored tokens so AuthContext treats the user
 * as logged out rather than looping on a dead token forever.
 */
export async function authRequest(path, { method = "GET", body, isFormData = false } = {}, _retried = false) {
  const access = getAccessToken();

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(access ? { Authorization: `Bearer ${access}` } : {}),
      },
      credentials: "include",
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new ApiError("Couldn't reach the server. Check your connection and try again.", 0);
  }

  if (response.status === 401 && !_retried) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return authRequest(path, { method, body, isFormData }, true);
    }
    clearTokens();
    throw new ApiError("Your session expired — please log in again.", 401);
  }

  if (response.status === 429) {
    throw new ApiError("Too many attempts — please wait a minute and try again.", 429);
  }

  if (response.status === 202 || response.status === 205 || response.status === 204) {
    return null;
  }

  const data = await parseErrorBody(response);

  if (!response.ok) {
    throw new ApiError(
      firstErrorMessage(data, "Something went wrong. Please try again."),
      response.status,
      response.status === 400 ? data : null,
    );
  }

  return data;
}

async function tryRefresh() {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/users/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!response.ok) return false;

    const data = await response.json();
    // SIMPLE_JWT has ROTATE_REFRESH_TOKENS=True (see backend/settings.py)
    // so a new refresh token comes back too — always store both when present.
    setTokens({ access: data.access, refresh: data.refresh || refresh });
    return true;
  } catch {
    return false;
  }
}
