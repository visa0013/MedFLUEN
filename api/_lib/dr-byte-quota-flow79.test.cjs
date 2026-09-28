'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const { createHandler } = require('./dr-byte-core.cjs');

function response() {
  return { statusCode: 200, headers: {}, setHeader(key, value) { this.headers[key] = value; return this; }, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
}
function request() { return { method: 'POST', headers: { authorization: 'Bearer token-long-enough' }, body: { question: 'Forklar kort epilepsi', sources: [] } }; }
function fakeFetch(modelStatus = 200) {
  const calls = [];
  const fetch = async (url, options) => {
    calls.push({ url, options });
    if (url.endsWith('/auth/v1/user')) return { ok: true, json: async () => ({ id: 'user-1' }) };
    if (url.endsWith('/rpc/reserve_dr_byte_79')) return { ok: true, json: async () => ({ allowed: true, reservation_id: 'reservation-1' }) };
    if (url.includes(':generateContent')) return modelStatus === 200
      ? { ok: true, status: 200, json: async () => ({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify({ paragraphs: [{ text: 'Epilepsi beskriver en tilbøjelighed til anfald. Dette er generel viden.', citations: [] }] }) }] } }] }) }
      : { ok: false, status: modelStatus };
    if (url.endsWith('/rpc/finalize_dr_byte_79')) return { ok: true, json: async () => true };
    throw new Error(`Unexpected URL: ${url}`);
  };
  return { fetch, calls };
}

test('a validated answer finalizes one successful generation', async () => {
  const { fetch, calls } = fakeFetch();
  const handler = createHandler({ fetch, env: { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_PUBLISHABLE_KEY: 'anon', GEMINI_API_KEY: 'server-only' } });
  const res = response();
  await handler(request(), res);
  assert.equal(res.statusCode, 200);
  const finalize = calls.find(call => call.url.endsWith('/rpc/finalize_dr_byte_79'));
  assert.deepEqual(JSON.parse(finalize.options.body), { p_reservation_id: 'reservation-1', p_success: true });
  assert.equal(calls.filter(call => call.url.includes(':generateContent')).length, 1);
});

test('a Google limit finalizes as failed and never calls a paid backup', async () => {
  const { fetch, calls } = fakeFetch(429);
  const handler = createHandler({ fetch, env: { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_PUBLISHABLE_KEY: 'anon', GEMINI_API_KEY: 'server-only' } });
  const res = response();
  await handler(request(), res);
  assert.equal(res.statusCode, 429);
  assert.equal(res.body.error.code, 'GEMINI_QUOTA');
  const finalize = calls.find(call => call.url.endsWith('/rpc/finalize_dr_byte_79'));
  assert.deepEqual(JSON.parse(finalize.options.body), { p_reservation_id: 'reservation-1', p_success: false });
  assert.equal(calls.filter(call => call.url.includes(':generateContent')).length, 1);
});
