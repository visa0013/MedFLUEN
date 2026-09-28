'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const { reserveQuota79, finalizeQuota79 } = require('./dr-byte-quota79.cjs');

test('reservation reports app limit without claiming a Google limit', async () => {
  const calls = [];
  const fetch = async (url, options) => { calls.push({ url, options }); return { ok: true, json: async () => ({ allowed: false, reason: 'user_day', retry_after_seconds: 3600 }) }; };
  const result = await reserveQuota79(fetch, 'https://example.supabase.co', { Authorization: 'Bearer token' });
  assert.equal(result.allowed, false);
  assert.equal(result.reason, 'user_day');
  assert.match(calls[0].url, /reserve_dr_byte_79$/);
  assert.equal(calls.length, 1);
});

test('finalization sends success only for a validated answer', async () => {
  const calls = [];
  const fetch = async (url, options) => { calls.push({ url, body: JSON.parse(options.body) }); return { ok: true, json: async () => true }; };
  await finalizeQuota79(fetch, 'https://example.supabase.co', {}, 'request-1', false);
  assert.deepEqual(calls[0].body, { p_reservation_id: 'request-1', p_success: false });
  assert.match(calls[0].url, /finalize_dr_byte_79$/);
});
