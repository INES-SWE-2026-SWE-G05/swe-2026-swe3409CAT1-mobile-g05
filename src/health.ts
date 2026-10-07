/**
 * M5 · yaya gouni souleyman · Is the server reachable?  (also src/components/StatusBanner.tsx)
 *
 * GitHub: yayagouni0@ 
 * Your AI task in the swe3513-cat1 repository: A5 (health.ts)
 *
 * WHAT MEMBER 5 DOES HERE
 * At the collection centre the network comes and goes. The collector must see
 * at once whether deliveries reach the server or stay on the phone. You write
 * checkHealth() here, then the banner that shows it.
 * Groups of 4 have no Member 5: both files stay as they are and nobody is marked on them.
 *
 * Done means: npm run test:health -> 3 pass; StatusBanner has no "TODO M5";
 * on the phone the banner says "Server OK", and "Offline..." after you stop the API.
 */

/** GET {baseUrl}/health. Return 'ok' if the JSON is {"status":"ok"} in time, otherwise 'offline'.
 *  Never throw. Steps:
 *  1. const ctrl = new AbortController();
 *  2. const timer = setTimeout(() => ctrl.abort(), timeoutMs);
 *  3. try { const res = await fetch(`${baseUrl}/health`, { signal: ctrl.signal });
 *           const body = await res.json();
 *           return body.status === 'ok' ? 'ok' : 'offline'; }
 *     catch { return 'offline'; }
 *     finally { clearTimeout(timer); } */
export async function checkHealth(baseUrl: string, timeoutMs = 5000): Promise<'ok' | 'offline'> {
  // TODO M5: write this, then delete this TODO line.
  throw new Error('M5 checkHealth is not written yet');
}
