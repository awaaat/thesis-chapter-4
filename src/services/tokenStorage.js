// src/services/tokenStorage.js
//
// Thin localStorage wrapper — the one place that knows the actual
// storage keys, so nothing else in the app hardcodes them.

const ACCESS_KEY = "sds_access_token";
const REFRESH_KEY = "sds_refresh_token";

export function getAccessToken() {
  try {
    return localStorage.getItem(ACCESS_KEY);
  } catch {
    return null;
  }
}

export function getRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_KEY);
  } catch {
    return null;
  }
}

export function setTokens({ access, refresh }) {
  try {
    if (access) localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  } catch {
    // localStorage unavailable (private browsing, etc.) — auth just
    // won't persist across a reload; not fatal.
  }
}

export function clearTokens() {
  try {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  } catch {
    // ignore
  }
}

export function isLoggedIn() {
  return Boolean(getAccessToken());
}
