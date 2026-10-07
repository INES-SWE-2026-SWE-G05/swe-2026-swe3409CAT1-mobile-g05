/**
 * config.ts  –  Backend connection settings
 *
 * Owner (GitHub): @umkalsumkarim72
 * Task           : M4 – configure backend laptop IP
 *
 * HOW TO CONFIGURE
 * ─────────────────
 * 1. Find the local IP of the laptop running the FastAPI server:
 *      Windows : ipconfig  →  IPv4 Address
 *      macOS   : ifconfig en0 | grep 'inet '
 *      Linux   : ip addr show | grep 'inet '
 *
 * 2. Replace the placeholder below with that IP.
 *    The FastAPI server runs on port 8000 by default.
 *
 * 3. Make sure your phone and the laptop are on the SAME Wi-Fi network.
 *
 * Example: LAPTOP_IP = '192.168.1.42'
 */

/** IP address of the laptop running the FastAPI backend. */
export const LAPTOP_IP   = '192.168.1.100';   // ← change me

/** Port on which FastAPI listens (default 8000). */
export const API_PORT    = 8000;

/** Full base URL for all API calls. */
export const BASE_URL    = `http://${LAPTOP_IP}:${API_PORT}`;

/** Request timeout in milliseconds. After this the app goes offline mode. */
export const TIMEOUT_MS  = 4_000;
