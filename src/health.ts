/**
 * M5 · MEMBER 5 · Server health monitoring
 *
 * Owner (GitHub): @gueylo
 * AI task       : A5 (evaluate.py) in swe3513-cat1 repository
 *
 * Provides:
 *   pingServer()           – single GET /health call, returns boolean
 *   useServerHealth()      – React hook that auto-pings on mount and
 *                            exposes { online, checking, retry }
 */
import { useCallback, useEffect, useState } from 'react';
import { BASE_URL, TIMEOUT_MS } from './config';

// ── pingServer ────────────────────────────────────────────────
/**
 * Ping the FastAPI /health endpoint.
 *
 * @returns true when the server responds with HTTP 200, false otherwise.
 */
export async function pingServer(): Promise<boolean> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(id);
  }
}

// ── useServerHealth hook ──────────────────────────────────────
/** @deprecated use HealthState */
export type HealthStatus = HealthState;

export type HealthState = {
  /** true when /health returned 200 on the most recent ping */
  online:   boolean;
  /** true while a ping is in flight */
  checking: boolean;
  /** call this to immediately re-ping (e.g. from a Retry button) */
  retry:    () => void;
};

/**
 * React hook that pings the server once on mount and exposes
 * live status + a retry callback for the StatusBanner.
 */
export function useServerHealth(): HealthState {
  const [online,   setOnline]   = useState(false);
  const [checking, setChecking] = useState(true);

  const retry = useCallback(async () => {
    setChecking(true);
    const ok = await pingServer();
    setOnline(ok);
    setChecking(false);
  }, []);

  useEffect(() => {
    retry();
  }, [retry]);

  return { online, checking, retry };
}
