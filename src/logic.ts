/**
 * M1 · MEMBER 4 · The rules of the app (pure TypeScript, no screens)
 *
 * Owner (your GitHub username): @
 * Your AI task in the swe3513-cat1 repository: A4 (api.py)
 *
 * WHAT MEMBER 4 DOES HERE
 * The collector types a farmer code, litres, temperature and hours since
 * milking. You write the rules that decide whether that input is acceptable,
 * how a risk number becomes a word, and the totals shown under the form.
 * Members 2, 3 and 4 use these functions, so the types below are already
 * written: do not change them. Your tests need nothing else: start at once.
 *
 * Done means: npm run test:logic  -> 6 pass, merged through a reviewed pull request.
 */

/** What the form produces (Member 3). */
export type NewDelivery = {
  farmerId: string; // e.g. "FRM-0012"
  litres: number;
  tempC: number;    // temperature when the milk arrives
  hours: number;    // hours since milking
};

/** What the app keeps in its list (Member 2 adds id, risk and sent). */
export type Delivery = NewDelivery & {
  id: string;
  risk: number | null; // 0..1 from the API, or null when the API could not be reached
  sent: boolean;       // true when the API accepted it
};

/** true if text is exactly "FRM-" followed by 4 digits, e.g. "FRM-0012".
 *  Tip: /^FRM-\d{4}$/.test(text) */
export function isValidFarmerId(text: string): boolean {
  // TODO M1: write this, then delete this TODO line.
  throw new Error('M1 isValidFarmerId is not written yet');
}

/** Return '' when the input is fine, otherwise the FIRST problem, with exactly these messages:
 *   farmer code (trim + upper-case it first) -> 'Enter a farmer code like FRM-0012'
 *   litres empty, not a number, <= 0 or > 60 -> 'Litres must be more than 0 and at most 60'
 *   temperature empty, < 0 or > 45           -> 'Temperature must be 0 to 45 °C'
 *   hours empty, < 0 or > 24                 -> 'Hours since milking must be 0 to 24'
 *  Watch out: Number('') is 0, so check for empty text first.
 *  Tip: const l = Number(litres); if (litres.trim() === '' || !(l > 0 && l <= 60)) return '...'; */
export function checkDelivery(farmerId: string, litres: string, tempC: string, hours: string): string {
  // TODO M1: write this, then delete this TODO line.
  throw new Error('M1 checkDelivery is not written yet');
}

/** null -> 'Not checked'; below 0.3 -> 'Low'; below 0.6 -> 'Medium'; otherwise 'High'.
 *  These are the same limits as risk_label() in the Python API. */
export function riskLabel(risk: number | null): string {
  // TODO M1: write this, then delete this TODO line.
  throw new Error('M1 riskLabel is not written yet');
}

/** count = number of deliveries; litres = their sum rounded to 1 decimal
 *  (Math.round(x * 10) / 10); highRisk = deliveries whose risk is 0.6 or more (null does not count). */
export function totals(deliveries: Delivery[]): { count: number; litres: number; highRisk: number } {
  // TODO M1: write this, then delete this TODO line.
  throw new Error('M1 totals is not written yet');
}
