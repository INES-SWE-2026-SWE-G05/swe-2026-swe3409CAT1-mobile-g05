// Tests for M5 (src/health.ts). Do not edit; the lecturer grades with these.
// Run: npm run test:health
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { checkHealth } from '../src/health.ts';

const NOT_STARTED = readFileSync(new URL('../src/health.ts', import.meta.url), 'utf8').includes('TODO M5');
const opts = { skip: NOT_STARTED ? 'M5 not started: delete the "TODO M5" lines in src/health.ts when you begin' : false };

let base = '';
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(req.url === '/health' ? { status: 'ok' } : { status: 'down' }));
});
before(async () => {
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', () => r()));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
after(() => {
  server.closeAllConnections();
  server.close();
});

test('M5 checkHealth returns ok when the server answers', opts, async () => {
  assert.equal(await checkHealth(base), 'ok');
});

test('M5 checkHealth returns offline when nothing is listening', opts, async () => {
  assert.equal(await checkHealth('http://127.0.0.1:9'), 'offline');
});

test('M5 checkHealth gives up after the timeout', opts, async () => {
  const slow = http.createServer(() => {});
  await new Promise<void>((r) => slow.listen(0, '127.0.0.1', () => r()));
  const url = `http://127.0.0.1:${(slow.address() as AddressInfo).port}`;
  const start = Date.now();
  try {
    assert.equal(await checkHealth(url, 300), 'offline');
    assert.ok(Date.now() - start < 3000, 'Use an AbortController timeout');
  } finally {
    slow.closeAllConnections();
    slow.close();
  }
});
