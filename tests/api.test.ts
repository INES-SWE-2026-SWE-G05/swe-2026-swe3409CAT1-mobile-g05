// Tests for M4 (src/api.ts). Do not edit; the lecturer grades with these.
// A tiny fake server runs on this computer, so the Python API is not needed.
// Run: npm run test:api
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { getRisk, sendDelivery } from '../src/api.ts';

const NOT_STARTED = readFileSync(new URL('../src/api.ts', import.meta.url), 'utf8').includes('TODO M4');
const opts = { skip: NOT_STARTED ? 'M4 not started: delete the "TODO M4" lines in src/api.ts when you begin' : false };

let base = '';
let lastBody = '';
let lastUrl = '';
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.url?.startsWith('/risk')) {
    lastUrl = req.url;
    const u = new URL(req.url, 'http://x');
    const t = Number(u.searchParams.get('temp_c'));
    if (t > 45) { res.statusCode = 422; return res.end('{}'); }
    return res.end(JSON.stringify({ temp_c: t, hours: 1, risk: t > 20 ? 0.81 : 0.05, label: t > 20 ? 'High' : 'Low' }));
  }
  if (req.url === '/deliveries' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      lastBody = body;
      const v = JSON.parse(body);
      res.statusCode = /^FRM-\d{4}$/.test(v.farmer_id) ? 200 : 422;
      res.end(JSON.stringify({ accepted: res.statusCode === 200 }));
    });
    return;
  }
  res.statusCode = 404;
  res.end('{}');
});

before(async () => {
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', () => r()));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
after(() => {
  server.closeAllConnections();
  server.close();
});

test('M4 getRisk calls /risk with temp_c and hours', opts, async () => {
  assert.deepEqual(await getRisk(base, 28, 6), { risk: 0.81, label: 'High' });
  assert.equal(lastUrl, '/risk?temp_c=28&hours=6');
});

test('M4 getRisk returns null when the server refuses', opts, async () => {
  assert.equal(await getRisk(base, 99, 1), null);
});

test('M4 getRisk returns null when offline', opts, async () => {
  assert.equal(await getRisk('http://127.0.0.1:9', 7, 1), null);
});

test('M4 getRisk gives up after the timeout', opts, async () => {
  const slow = http.createServer(() => {});
  await new Promise<void>((r) => slow.listen(0, '127.0.0.1', () => r()));
  const url = `http://127.0.0.1:${(slow.address() as AddressInfo).port}`;
  const start = Date.now();
  try {
    assert.equal(await getRisk(url, 7, 1, 300), null);
    assert.ok(Date.now() - start < 3000, 'Use an AbortController timeout');
  } finally {
    slow.closeAllConnections();
    slow.close();
  }
});

test('M4 sendDelivery posts JSON with snake_case keys', opts, async () => {
  assert.equal(await sendDelivery(base, { farmerId: 'FRM-0012', litres: 18.5, tempC: 7, hours: 1.5 }), true);
  assert.deepEqual(JSON.parse(lastBody), { farmer_id: 'FRM-0012', litres: 18.5, temp_c: 7, hours: 1.5 });
});

test('M4 sendDelivery returns false when refused or offline', opts, async () => {
  assert.equal(await sendDelivery(base, { farmerId: 'bad', litres: 1, tempC: 7, hours: 1 }), false);
  assert.equal(await sendDelivery('http://127.0.0.1:9', { farmerId: 'FRM-0001', litres: 1, tempC: 7, hours: 1 }), false);
});
