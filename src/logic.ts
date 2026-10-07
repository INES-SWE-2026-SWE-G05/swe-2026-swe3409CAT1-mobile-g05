/**
 * M1 · MEMBER 4 · The rules of the app (pure TypeScript, no screens)
 *
 * Owner (GitHub): @ibrahimhachim169
 * AI task       : A4 (api.py) in swe3513-cat1 repository
 *
 * WHAT MEMBER 4 DOES HERE
 * The collector types a farmer code, litres, temperature and hours since
 * milking. You write the rules that decide whether that input is acceptable,
 * how a risk number becomes a word, and the totals shown under the form.
 *
 * Done means: npm run test:logic  -> 6 pass, merged through a reviewed pull request.
 */

/** What the form produces (Member 3). */
export type NewDelivery = {
  farmerId:           string;   // e.g. "FRM-0012"
  litres:             number;
  tempC:              number;
  hoursSinceMilking:  number;
};

/** A saved delivery (extends NewDelivery with server response fields). */
export type Delivery = NewDelivery & {
  riskScore?: number;
  riskLabel?: 'LOW' | 'MEDIUM' | 'HIGH';
  sent?:      boolean;
};

/** Validation error messages keyed by field name. */
export type DeliveryErrors = Partial<Record<keyof NewDelivery, string>>;

// ── isValidFarmerId ───────────────────────────────────────────
/**
 * Return true when *id* matches the pattern FRM-NNNN
 * (FRM- followed by exactly 4 digits, case-insensitive).
 *
 * @example
 *   isValidFarmerId("FRM-0012")  // true
 *   isValidFarmerId("frm-9999")  // true
 *   isValidFarmerId("FRM-123")   // false (only 3 digits)
 *   isValidFarmerId("")          // false
 */
export function isValidFarmerId(id: string): boolean {
  return /^frm-\d{4}$/i.test(id.trim());
}

// ── checkDelivery ─────────────────────────────────────────────
/**
 * Validate all four fields of a NewDelivery.
 *
 * Rules:
 *  - farmerId   : must pass isValidFarmerId()
 *  - litres     : must be a number > 0
 *  - tempC      : must be in [0, 45]
 *  - hoursSinceMilking : must be in (0, 24]
 *
 * @returns DeliveryErrors – empty object means "all good".
 */
export function checkDelivery(d: NewDelivery): DeliveryErrors {
  const errors: DeliveryErrors = {};

  if (!isValidFarmerId(d.farmerId)) {
    errors.farmerId = 'Farmer ID must be in the format FRM-NNNN (e.g. FRM-0042)';
  }

  if (!Number.isFinite(d.litres) || d.litres <= 0) {
    errors.litres = 'Litres must be a positive number';
  }

  if (!Number.isFinite(d.tempC) || d.tempC < 0 || d.tempC > 45) {
    errors.tempC = 'Temperature must be between 0°C and 45°C';
  }

  if (!Number.isFinite(d.hoursSinceMilking) || d.hoursSinceMilking <= 0 || d.hoursSinceMilking > 24) {
    errors.hoursSinceMilking = 'Hours since milking must be between 0 and 24';
  }

  return errors;
}

// ── riskLabel ─────────────────────────────────────────────────
/**
 * Convert a numeric risk score to a human-readable label.
 *
 * Thresholds mirror the FastAPI /risk endpoint:
 *   score < 0.40  → "LOW"
 *   score < 0.70  → "MEDIUM"
 *   score ≥ 0.70  → "HIGH"
 *
 * @param score  float in [0, 1] from the server (or local fallback).
 */
export function riskLabel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (score < 0.40) return 'LOW';
  if (score < 0.70) return 'MEDIUM';
  return 'HIGH';
}

// ── totals ────────────────────────────────────────────────────
/**
 * Compute the summary figures shown in DeliveryList's header.
 *
 * @param deliveries  Array of all deliveries recorded today.
 * @returns  { count, litres, rejected, highRisk }
 */
export function totals(deliveries: Delivery[]): {
  count:    number;
  litres:   number;
  rejected: number;
  highRisk: number;
} {
  return {
    count:    deliveries.length,
    litres:   Math.round(deliveries.reduce((s, d) => s + d.litres, 0) * 10) / 10,
    // rejected = deliveries the server flagged as high-risk (score >= 0.7)
    rejected: deliveries.filter(d => (d.riskScore ?? 0) >= 0.7).length,
    highRisk: deliveries.filter(d => riskLabel(d.riskScore ?? 0) === 'HIGH').length,
  };
}

export function riskColour(label: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  switch (label) {
    case 'HIGH':   return '#ef4444';
    case 'MEDIUM': return '#f59e0b';
    default:       return '#22c55e';
  }
}

export function formatLitres(litres: number): string {
  return `${litres.toFixed(1)} L`;
}
