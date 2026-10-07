// Tests for M1 (src/logic.ts). Do not edit; the lecturer grades with these.
// Run: npm run test:logic
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkDelivery, isValidFarmerId, riskLabel, totals } from '../src/logic.ts';

// Skipped (not failed) until the owner deletes the 'TODO M1' lines, so pull requests stay green.
const NOT_STARTED = readFileSync(new URL('../src/logic.ts', import.meta.url), 'utf8').includes('TODO M1');
const opts = { skip: NOT_STARTED ? 'M1 not started: delete the "TODO M1" lines in src/logic.ts when you begin' : false };

test('M1 accepts a correct farmer code', opts, () => {
  assert.equal(isValidFarmerId('FRM-0012'), true);
});

test('M1 rejects wrong farmer codes', opts, () => {
  for (const bad of ['frm-0012', 'FRM-12', 'FRM-00120', ' FRM-0012', 'PLT-0012', '']) {
    assert.equal(isValidFarmerId(bad), false, `"${bad}" should be rejected`);
  }
});

test('M1 checkDelivery accepts good input (code is trimmed and upper-cased first)', opts, () => {
  assert.equal(checkDelivery(' frm-0012 ', '18.5', '7', '1.5'), '');
  assert.equal(checkDelivery('FRM-0012', '60', '0', '0'), '');
});

test('M1 checkDelivery explains each problem', opts, () => {
  assert.equal(checkDelivery('FRM-12', '18', '7', '1'), 'Enter a farmer code like FRM-0012');
  for (const l of ['', '0', '61', 'abc']) {
    assert.equal(checkDelivery('FRM-0012', l, '7', '1'), 'Litres must be more than 0 and at most 60', `litres "${l}"`);
  }
  for (const t of ['', '-1', '46']) {
    assert.equal(checkDelivery('FRM-0012', '18', t, '1'), 'Temperature must be 0 to 45 °C', `temp "${t}"`);
  }
  for (const h of ['', '25']) {
    assert.equal(checkDelivery('FRM-0012', '18', '7', h), 'Hours since milking must be 0 to 24', `hours "${h}"`);
  }
});

test('M1 riskLabel uses the same limits as the API', opts, () => {
  assert.deepEqual([0, 0.29, 0.3, 0.59, 0.6, 1].map(riskLabel), ['Low', 'Low', 'Medium', 'Medium', 'High', 'High']);
  assert.equal(riskLabel(null), 'Not checked');
});

test('M1 totals', opts, () => {
  const d = (id: string, litres: number, risk: number | null) =>
    ({ id, farmerId: 'FRM-0001', litres, tempC: 7, hours: 1, risk, sent: false });
  assert.deepEqual(totals([d('1', 10.25, 0.1), d('2', 20, 0.8), d('3', 5, null)]), { count: 3, litres: 35.3, highRisk: 1 });
  assert.deepEqual(totals([]), { count: 0, litres: 0, highRisk: 0 });
});
