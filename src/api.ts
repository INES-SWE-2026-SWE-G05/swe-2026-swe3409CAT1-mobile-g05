/**
 * M4 · MEMBER 2 · API integration layer
 *
 * Owner (GitHub): @umkalsumkarim72
 * AI task       : A2 (stats.py) in swe3513-cat1 repository
 *
 * Provides typed wrappers for the FastAPI backend endpoints:
 *   getRisk()       → POST /risk
 *   sendDelivery()  → POST /deliveries
 *   getSummary()    → GET  /summary
 *
 * All functions handle network errors gracefully and return
 * null (or fallback values) so the app stays usable offline.
 */
import { BASE_URL, TIMEOUT_MS } from './config';
import type { NewDelivery, Delivery } from './logic';

export type RiskResponse   = { risk_score: number; risk_label: 'LOW' | 'MEDIUM' | 'HIGH' };
export type SummaryRow     = { sector: string; total_litres: number; deliveries: number; rejected: number; rejection_rate: number };
export type SummaryResponse = { sectors: SummaryRow[]; litres_per_day: { date: string; total_litres: number }[] };

// ── internal fetch with timeout ────────────────────────────────
async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

// ── getRisk ─────────────────────────────────────────────────────
/**
 * Ask the backend for a milk rejection risk score.
 *
 * @param delivery  The form values collected by the collector.
 * @returns         RiskResponse or null when the server is unreachable.
 */
export async function getRisk(delivery: NewDelivery): Promise<RiskResponse | null> {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/risk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        litres: delivery.litres,
        temp_c: delivery.tempC,
        hours_since_milking: delivery.hoursSinceMilking,
      }),
    });
    if (!response.ok) return null;
    return (await response.json()) as RiskResponse;
  } catch {
    return null;
  }
}

// ── sendDelivery ────────────────────────────────────────────────
/**
 * Push a completed delivery to the backend.
 *
 * @returns  true on success, false when offline or server error.
 */
export async function sendDelivery(delivery: NewDelivery, riskScore: number): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/deliveries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        farmer_id: delivery.farmerId,
        litres: delivery.litres,
        temp_c: delivery.tempC,
        hours_since_milking: delivery.hoursSinceMilking,
        risk_score: riskScore,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

// ── getSummary ──────────────────────────────────────────────────
/**
 * Fetch aggregated sector and daily-litres summary from the backend.
 *
 * @returns  SummaryResponse or null when offline.
 */
export async function getSummary(): Promise<SummaryResponse | null> {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/summary`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) return null;
    return (await response.json()) as SummaryResponse;
  } catch {
    return null;
  }
}
