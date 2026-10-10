/**
 * businessIntelApi.js
 *
 * Talks to the real `business_intel` Django app:
 *   POST /api/business-intel/queries/         (BusinessQueryCreateView)
 *   GET  /api/business-intel/reports/         (BusinessReportListView)
 *   GET  /api/business-intel/reports/<uuid>/  (BusinessReportDetailView)
 *
 * All three require login now -- identity comes from the JWT
 * (authRequest attaches it, refreshes on 401), never from a
 * client-supplied email. Report generation is ASYNC (Celery); the POST
 * only returns { report_id, status: "pending" } -- poll the GET-by-id
 * endpoint until status is "ready" or "failed".
 */

import { authRequest } from './httpClient';

// Mirrors business_intel/models.py BUSINESS_CATEGORY_CHOICES exactly --
// these are the only values the backend's ChoiceField will accept.
export const BUSINESS_CATEGORIES = [
  { value: 'pharmacy', label: 'Pharmacy / Chemist' },
  { value: 'supermarket', label: 'Supermarket / Minimart' },
  { value: 'restaurant', label: 'Restaurant / Eatery' },
  { value: 'salon_barbershop', label: 'Salon / Barbershop' },
  { value: 'hardware_store', label: 'Hardware Store' },
  { value: 'electronics_shop', label: 'Electronics Shop' },
  { value: 'gym', label: 'Gym / Fitness Studio' },
  { value: 'clinic', label: 'Clinic / Medical Centre' },
  { value: 'bank_agent', label: 'Bank Agent / Mobile Money Shop' },
  { value: 'boutique_clothing', label: 'Boutique / Clothing Store' },
  { value: 'bar', label: 'Bar / Pub' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'other', label: 'Other' },
];

const CATEGORY_LABELS = Object.fromEntries(BUSINESS_CATEGORIES.map((c) => [c.value, c.label]));

// Mirrors BusinessQueryCreateSerializer's target_segment ChoiceField.
export const TARGET_SEGMENTS = [
  { value: 'budget', label: 'Budget' },
  { value: 'mid_market', label: 'Mid-market' },
  { value: 'premium', label: 'Premium' },
];

// Mirrors BusinessReport.STATUS_CHOICES on the model.
export const REPORT_TERMINAL_STATUSES = new Set(['ready', 'failed']);

const POLL_INTERVAL_MS = 4000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000; // 5 min -- generation runs many engine calls; give it room

export function categoryLabel(value, otherText) {
  if (value === 'other' && otherText) return otherText;
  return CATEGORY_LABELS[value] || value;
}

/**
 * POST /api/business-intel/queries/
 *
 * payload matches BusinessQueryCreateSerializer exactly -- NO `email`
 * field, the backend ignores it now and takes identity from the JWT:
 * {
 *   raw_location_input: string,   // required -- coords, Maps link, WhatsApp share, Plus Code, etc.
 *   business_category: string,    // required -- one of BUSINESS_CATEGORIES values above
 *   business_category_other?: string, // required BY THE BACKEND if business_category === 'other'
 *   investment_amount_kes?: number,
 *   branches_planned?: number,    // defaults to 1 server-side if omitted
 *   target_segment?: string,      // one of TARGET_SEGMENTS values above
 * }
 *
 * Resolves to { report_id, status } on 202, or throws a 402 ApiError
 * (with .userMessage) once the account's free reports are exhausted --
 * payment isn't wired in yet, so that's currently a dead end the UI
 * should surface plainly rather than let the user retry forever.
 * Throws with `.userMessage` set from the backend's LocationParseError
 * text on 400 (services.py raises this for garbage/out-of-Kenya input).
 */
export async function submitBusinessQuery(payload) {
  try {
    return await authRequest('/business-intel/queries/', {
      method: 'POST',
      body: payload,
    });
  } catch (err) {
    const detail = err?.fieldErrors?.detail || err?.message;
    if ((err?.status === 400 || err?.status === 402) && detail) {
      const wrapped = new Error(detail);
      wrapped.userMessage = detail;
      wrapped.status = err.status;
      throw wrapped;
    }
    throw err;
  }
}

/**
 * GET /api/business-intel/reports/<uuid:pk>/
 *
 * Returns the full BusinessReportSerializer payload. 403s if the report
 * belongs to a different account -- authRequest surfaces that as a
 * normal ApiError, nothing special to unwrap.
 */
export async function getBusinessReport(reportId) {
  return authRequest(`/business-intel/reports/${reportId}/`, { method: 'GET' });
}

/**
 * GET /api/business-intel/reports/
 *
 * Returns a plain array of BusinessReportListSerializer rows for the
 * logged-in account, newest first. No params -- the backend scopes
 * this to request.user, not an email you pass in.
 */
export async function listBusinessReports() {
  return authRequest('/business-intel/reports/', { method: 'GET' });
}

/**
 * Derives the same { total, ready, in_progress, failed, anomalous,
 * avg_confidence, proceed, investigate_further, avoid } shape the
 * dashboard's stat cards want, from the plain report list -- the
 * backend doesn't compute this server-side, so it's done here instead
 * of adding a second endpoint just for arithmetic.
 */
export function computeReportStats(reports) {
  const inProgress = ['pending', 'awaiting_payment', 'generating'];
  const confidences = reports
    .map((r) => r.confidence_score)
    .filter((v) => v !== null && v !== undefined);

  return {
    total: reports.length,
    ready: reports.filter((r) => r.status === 'ready').length,
    in_progress: reports.filter((r) => inProgress.includes(r.status)).length,
    failed: reports.filter((r) => r.status === 'failed').length,
    anomalous: reports.filter((r) => r.is_anomalous).length,
    avg_confidence: confidences.length
      ? confidences.reduce((a, b) => a + Number(b), 0) / confidences.length
      : null,
    proceed: reports.filter((r) => r.recommendation === 'proceed').length,
    investigate_further: reports.filter((r) => r.recommendation === 'investigate_further').length,
    avoid: reports.filter((r) => r.recommendation === 'avoid').length,
  };
}

/**
 * Polls getBusinessReport() until status is "ready" or "failed", or
 * POLL_TIMEOUT_MS elapses. Calls onUpdate(report) after every poll so
 * the UI can show live status ("pending" -> "generating" -> "ready"),
 * not just the final result.
 *
 * Returns the final report. Throws if the timeout is hit first.
 */
export async function pollBusinessReport(reportId, { onUpdate, signal } = {}) {
  const startedAt = Date.now();

  while (true) {
    if (signal?.aborted) {
      throw new DOMException('Polling aborted', 'AbortError');
    }

    const report = await getBusinessReport(reportId);
    onUpdate?.(report);

    if (REPORT_TERMINAL_STATUSES.has(report.status)) {
      return report;
    }

    if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
      const timeoutError = new Error(
        'This report is taking longer than expected to generate.'
      );
      timeoutError.userMessage = timeoutError.message;
      timeoutError.lastKnownReport = report;
      throw timeoutError;
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
}

export default {
  BUSINESS_CATEGORIES,
  TARGET_SEGMENTS,
  categoryLabel,
  submitBusinessQuery,
  getBusinessReport,
  listBusinessReports,
  computeReportStats,
  pollBusinessReport,
};