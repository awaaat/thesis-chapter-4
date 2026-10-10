// src/services/authApi.js
//
// Talks to the real Django backend's users app (see users/urls.py,
// users/views.py). Endpoint paths and response shapes here are copied
// directly from that code — not guessed.

import { publicRequest, authRequest } from "./httpClient";
import { setTokens, clearTokens } from "./tokenStorage";

/**
 * POST /api/users/signup/
 * Body: { full_name, email, phone, consent_given, privacy_policy_version, password }
 * Returns: { id, full_name, email, phone, email_verified, created_at }
 *
 * NOTE: `phone` is validated server-side as a Kenyan number
 * (users/phone_utils.py normalize_kenyan_phone) regardless of which
 * office the client is near — the signup form below reflects that in
 * its placeholder/hint text so the error isn't a surprise.
 */
export function signup({ fullName, email, phone, password, consentGiven, privacyPolicyVersion = "1.0" }) {
  return publicRequest("/users/signup/", {
    method: "POST",
    body: {
      full_name: fullName,
      email,
      phone,
      password,
      consent_given: consentGiven,
      privacy_policy_version: privacyPolicyVersion,
    },
  });
}

/** POST /api/users/verify-email/resend/  Body: { email }  → always 202 */
export function resendVerificationEmail(email) {
  return publicRequest("/users/verify-email/resend/", { method: "POST", body: { email } });
}

/**
 * POST /api/users/verify-email/confirm/
 * Body: { id, token } — both come from the link in the verification email
 * (see users/emails.py build_verification_url: /verify-email?token=...&id=...)
 * Returns the same shape as signup() on success.
 */
export function confirmEmailVerification({ id, token }) {
  return publicRequest("/users/verify-email/confirm/", { method: "POST", body: { id, token } });
}

/**
 * POST /api/users/login/
 * Body: { email, password }
 * Returns: { access, refresh, user: {id, full_name, email, phone, email_verified, created_at} | null }
 * Stores both tokens on success — AuthContext calls this, not components directly.
 */
export async function login({ email, password }) {
  const data = await publicRequest("/users/login/", { method: "POST", body: { email, password } });
  setTokens({ access: data.access, refresh: data.refresh });
  return data;
}

/** POST /api/users/logout/ — blacklists the refresh token. Requires auth. */
export async function logout(refreshToken) {
  try {
    await authRequest("/users/logout/", { method: "POST", body: { refresh: refreshToken } });
  } finally {
    // Clear local tokens regardless of whether the blacklist call
    // succeeded — a network hiccup shouldn't leave someone "stuck"
    // logged in on this device.
    clearTokens();
  }
}

/** GET /api/users/me/ — requires auth. 404 if no signup_profile exists yet. */
export function getMe() {
  return authRequest("/users/me/");
}

/** POST /api/users/change-password/ — requires auth. */
export function changePassword({ currentPassword, newPassword }) {
  return authRequest("/users/change-password/", {
    method: "POST",
    body: { current_password: currentPassword, new_password: newPassword },
  });
}

/** POST /api/users/password-reset/request/  Body: { email }  → always 202 */
export function requestPasswordReset(email) {
  return publicRequest("/users/password-reset/request/", { method: "POST", body: { email } });
}

/**
 * POST /api/users/password-reset/confirm/
 * Body: { uid, token, new_password } — uid/token come from the reset
 * link (see users/emails.py build_reset_url: /reset-password?uid=...&token=...)
 */
export function confirmPasswordReset({ uid, token, newPassword }) {
  return publicRequest("/users/password-reset/confirm/", {
    method: "POST",
    body: { uid, token, new_password: newPassword },
  });
}
