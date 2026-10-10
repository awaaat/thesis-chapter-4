// src/services/api.js
//
// Talks to the real Django backend (see leads/views.py — ContactView,
// visitors/views.py — TrackPageView, jobs/views.py — job endpoints).

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

class ApiError extends Error {
  constructor(message, status, fieldErrors) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors || null;
  }
}

async function submitLead(formData = {}) {
  const payload = {
    name: formData.name?.trim() || "",
    email: formData.email?.trim() || "",
    service: formData.service || formData.service_interest || formData.subject || "General Inquiry",
    message: formData.message || "",
    company: formData.company || "",
    phone: formData.phone || "",
    page_url: typeof window !== "undefined" ? window.location.href : "",
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/contact/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
  } catch (networkErr) {
    throw new ApiError(
      "Couldn't reach the server. Check your connection and try again, or email us directly at info@scapedatasolutions.com",
      0
    );
  }

  if (response.status === 429) {
    throw new ApiError("Too many submissions — please wait a minute and try again.", 429);
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // empty/non-JSON body
  }

  if (!response.ok) {
    if (response.status === 400 && data && typeof data === "object") {
      const firstField = Object.keys(data)[0];
      const firstMsg = Array.isArray(data[firstField]) ? data[firstField][0] : data[firstField];
      throw new ApiError(firstMsg || "Please check the form and try again.", 400, data);
    }
    throw new ApiError(
      "Something went wrong sending your message. Please try again or email us directly at info@scapedatasolutions.com",
      response.status
    );
  }

  return data;
}

async function trackPageView(arg) {
  const loc = typeof window !== "undefined" ? window.location : null;

  let url = loc ? loc.href : "";
  let title = typeof document !== "undefined" ? document.title : "";
  let referrer = typeof document !== "undefined" ? document.referrer : "";

  if (typeof arg === "string") {
    const path = arg.startsWith("/") ? arg : `/${arg}`;
    url = loc ? `${loc.origin}${path}` : path;
  } else if (arg && typeof arg === "object") {
    url = arg.url || url;
    title = arg.title ?? title;
    referrer = arg.referrer ?? referrer;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/track-visit/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ url, title, referrer }),
    });

    if (!response.ok) {
      console.warn("trackPageView: backend returned", response.status);
    }
  } catch (err) {
    console.warn("trackPageView failed:", err.message);
  }
}

// ─── Jobs: GET /api/jobs/, GET /api/jobs/<slug>/, POST /api/jobs/<slug>/apply/ ───

async function fetchJobs(filters = {}) {
  const params = new URLSearchParams(filters);
  const qs = params.toString();
  const res = await fetch(`${API_BASE_URL}/jobs/${qs ? `?${qs}` : ""}`, {
    credentials: "include",
  });
  if (!res.ok) throw new ApiError("Could not load job listings.", res.status);
  return res.json();
}

async function fetchJobDetail(slug) {
  const res = await fetch(`${API_BASE_URL}/jobs/${slug}/`, { credentials: "include" });
  if (!res.ok) throw new ApiError("Job not found.", res.status);
  return res.json();
}

async function submitJobApplication(slug, formData) {
  // formData must be a FormData instance — must include a `resume` file field
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/jobs/${slug}/apply/`, {
      method: "POST",
      credentials: "include",
      body: formData, // do NOT set Content-Type — browser sets the multipart boundary
    });
  } catch {
    throw new ApiError("Couldn't reach the server. Check your connection and try again.", 0);
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // no body
  }

  if (!response.ok) {
    if (data && typeof data === "object") {
      const firstField = Object.keys(data)[0];
      const firstMsg = Array.isArray(data[firstField]) ? data[firstField][0] : data[firstField];
      throw new ApiError(firstMsg || "Application failed. Please try again.", response.status, data);
    }
    throw new ApiError("Application failed. Please try again.", response.status);
  }

  return data; // { message: "Application received — thank you! ..." }
}

export const apiService = { submitLead, trackPageView, fetchJobs, fetchJobDetail, submitJobApplication };
export { submitLead, trackPageView, fetchJobs, fetchJobDetail, submitJobApplication };
export default apiService;
