// src/services/ordersApi.js
// Client for the Django `orders` app (/api/orders/...). The wizard is defined by
// the backend catalog, so questions and options change without a redeploy here.

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Which storefront this build is. Sent explicitly so it also works on localhost.
export const SITE_KEY = "thesis";

export class OrderApiError extends Error {
  constructor(message, status, fieldErrors) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors || null;
  }
}

const NETWORK_MSG =
  "Couldn't reach the server. Check your connection and try again, or email us at info@scapedatasolutions.com";

async function request(path, { method = "GET", body, form } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/orders${path}`, {
      method,
      credentials: "include",
      headers: form || body === undefined ? undefined : { "Content-Type": "application/json" },
      body: form ? form : body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new OrderApiError(NETWORK_MSG, 0);
  }
  if (res.status === 204) return null;
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }

  if (res.status === 429) throw new OrderApiError("Too many requests. Please wait a minute and try again.", 429);
  if (!res.ok) {
    if (data && typeof data === "object") {
      const key = Object.keys(data)[0];
      const first = Array.isArray(data[key]) ? data[key][0] : data[key];
      const fieldErrors = res.status === 400 ? data : null;
      throw new OrderApiError(typeof first === "string" ? first : "Please check your details and try again.", res.status, fieldErrors);
    }
    throw new OrderApiError("Something went wrong. Please try again or email info@scapedatasolutions.com", res.status);
  }
  return data;
}

export const getCatalog = () => request(`/catalog/?site=${SITE_KEY}`);
export const startOrder = (payload) => request("/start/", { method: "POST", body: { site: SITE_KEY, ...payload } });
export const getOrder = (token) => request(`/${encodeURIComponent(token)}/`);
export const saveOrder = (token, payload) => request(`/${encodeURIComponent(token)}/`, { method: "PATCH", body: payload });
export const submitOrder = (token, payload = {}) => request(`/${encodeURIComponent(token)}/submit/`, { method: "POST", body: payload });
export const quickOrder = (payload) => request("/quick/", { method: "POST", body: { site: SITE_KEY, ...payload } });
export const deleteOrderFile = (token, id) => request(`/${encodeURIComponent(token)}/files/${id}/`, { method: "DELETE" });
export function uploadOrderFile(token, file) {
  const form = new FormData();
  form.append("file", file);
  return request(`/${encodeURIComponent(token)}/files/`, { method: "POST", form });
}

// ── helpers ──
const TOKEN_KEY = `scape_order_token_${SITE_KEY}`;
export const loadToken = () => { try { return localStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; } };
export const saveToken = (t) => { try { localStorage.setItem(TOKEN_KEY, t); } catch { /* private mode */ } };
export const clearToken = () => { try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ } };

export function attribution() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const utm = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => {
    if (p.get(k)) utm[k] = p.get(k).slice(0, 200);
  });
  return { page_url: window.location.href.slice(0, 500), referrer: (document.referrer || "").slice(0, 500), utm };
}
