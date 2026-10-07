/**
 * M4 · MEMBER 2 · Talk to the group's Python API  (also App.tsx and src/config.ts)
 *
 * Owner (Umkalsum): @umi
 * Your AI task in the swe3513-cat1 repository: A2 (stats.py)
 *
 * WHAT MEMBER 2 DOES HERE
 * You are the mobile integrator. First write the two functions below (their
 * tests use a fake server, so you can start at once). Then, when Members 1, 3
 * and 4 have merged, finish App.tsx so a saved delivery gets its risk from the
 * API and is sent to it, put the laptop address in src/config.ts, run the app
 * on a phone and push the screenshot docs/screenshot.png.
 *
 * Rule for both functions: never throw, and give up after timeoutMs.
 *   const ctrl = new AbortController();
 *   const timer = setTimeout(() => ctrl.abort(), timeoutMs);
 *   try { ... fetch(url, { signal: ctrl.signal }) ... }
 *   catch { return <the "failed" value>; }
 *   finally { clearTimeout(timer); }
 *
 * Done means: npm run test:api -> 6 pass; App.tsx has no "TODO M4"; docs/screenshot.png pushed.
 */
import type { NewDelivery } from './logic';

/** GET {baseUrl}/risk?temp_c=<tempC>&hours=<hours>
 *  If res.ok: read the JSON and return { risk: body.risk, label: body.label }.
 *  If the answer is not ok, the network fails or the time runs out: return null. */
export async function getRisk(
  baseUrl: string, tempC: number, hours: number, timeoutMs = 5000,
): Promise<{ risk: number; label: string } | null> {
  // TODO M4: write this, then delete this TODO line.
  throw new Error('M4 getRisk is not written yet');
}

/** POST {baseUrl}/deliveries with JSON in the Python names (snake_case):
 *    { farmer_id: d.farmerId, litres: d.litres, temp_c: d.tempC, hours: d.hours }
 *  headers: { 'Content-Type': 'application/json' }.  Return res.ok (true/false); false on any error. */
export async function sendDelivery(baseUrl: string, d: NewDelivery, timeoutMs = 5000): Promise<boolean> {
  // TODO M4: write this, then delete this TODO line.
  throw new Error('M4 sendDelivery is not written yet');
}
