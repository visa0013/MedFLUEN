'use strict';

class QuotaSetupError79 extends Error {
  constructor() { super('Dr. Byte mangler den nye kvoteopsætning. Administrator skal køre segment_7_9_dr_byte_quota.sql i Supabase.'); this.code = 'QUOTA_SETUP'; }
}

async function reserveQuota79(fetch, base, headers, signal) {
  const response = await fetch(`${base.replace(/\/$/, '')}/rest/v1/rpc/reserve_dr_byte_79`, { method: 'POST', headers, body: '{}', signal });
  if (!response.ok) throw new QuotaSetupError79();
  const result = await response.json();
  if (typeof result?.allowed !== 'boolean' || (result.allowed && typeof result.reservation_id !== 'string')) throw new QuotaSetupError79();
  return result;
}

async function finalizeQuota79(fetch, base, headers, reservationId, success, signal) {
  if (typeof reservationId !== 'string' || !reservationId) throw new QuotaSetupError79();
  const response = await fetch(`${base.replace(/\/$/, '')}/rest/v1/rpc/finalize_dr_byte_79`, { method: 'POST', headers,
    body: JSON.stringify({ p_reservation_id: reservationId, p_success: success === true }), signal });
  if (!response.ok || await response.json() !== true) throw new QuotaSetupError79();
  return true;
}

module.exports = { QuotaSetupError79, reserveQuota79, finalizeQuota79 };
