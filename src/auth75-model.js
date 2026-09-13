// Supabase owns identity, OTP validation and rate limits. This actor owns only
// transient form state; passwords/codes are never retained or logged here.
export function createAuthFlow75(auth, { mode = 'login', now = Date.now, redirectTo } = {}) {
  let state = { mode, phase: 'entry', email: '', busy: false, error: '', resendAt: 0 };
  let stopped = false;
  const listeners = new Set();
  const snapshot = () => ({ ...state });
  function update(patch) { if (!stopped) { state = { ...state, ...patch }; listeners.forEach(fn => fn(snapshot())); } }
  function errorKey(error) {
    if (error?.status === 429 || ['over_email_send_rate_limit', 'over_request_rate_limit'].includes(error?.code)) return 'rate';
    if (error?.code === 'otp_expired' || state.phase === 'code') return 'code';
    if (error?.code === 'weak_password') return 'password';
    if (error?.code === 'captcha_failed') return 'captcha';
    return 'generic';
  }
  async function run(operation, next) {
    if (stopped || state.busy) return;
    update({ busy: true, error: '' });
    try {
      const result = await operation();
      if (stopped) return;
      if (result?.error) throw result.error;
      update(next(result?.data || {}));
    } catch (error) { update({ error: errorKey(error) }); }
    finally { update({ busy: false }); }
  }
  function submit({ password = '', confirmation = '', code = '' } = {}) {
    if (state.busy || stopped) return Promise.resolve();
    const email = state.email.trim();
    if (state.mode !== 'reset' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { update({ error: 'email' }); return Promise.resolve(); }
    if (state.phase === 'code') {
      if (!/^\d{6}$/.test(code)) { update({ error: 'code' }); return Promise.resolve(); }
      return run(() => auth.verifyOtp({ email, token: code, type: 'email' }), data => {
        if (!data.session) throw Error('session');
        return { phase: 'complete' };
      });
    }
    if (['signup', 'reset'].includes(state.mode) && password.length < 6) { update({ error: 'password' }); return Promise.resolve(); }
    if (state.mode === 'reset') {
      if (password !== confirmation) { update({ error: 'mismatch' }); return Promise.resolve(); }
      return run(() => auth.updateUser({ password }), () => ({ phase: 'complete' }));
    }
    if (state.mode === 'forgot') return run(() => auth.resetPasswordForEmail(email, { redirectTo }), () => ({ phase: 'sent' }));
    if (state.mode === 'signup') return run(() => auth.signUp({ email, password }), data => ({ phase: data.session ? 'complete' : 'code', resendAt: now() + 60000 }));
    if (state.mode === 'code-login') return run(() => auth.signInWithOtp({ email, options: { shouldCreateUser: false } }), () => ({ phase: 'code', resendAt: now() + 60000 }));
    return run(() => auth.signInWithPassword({ email, password }), data => {
      if (!data.session) throw Error('session');
      return { phase: 'complete' };
    });
  }
  return {
    snapshot, submit,
    email(value) { if (!state.busy && !stopped) update({ email: String(value).trim(), phase: 'entry', error: '' }); },
    navigate(next) {
      if (state.busy || stopped || !['login', 'signup', 'code-login', 'forgot', 'reset'].includes(next)) return false;
      update({ mode: next, phase: 'entry', error: '' }); return true;
    },
    resend() {
      if (state.phase !== 'code' || state.busy || stopped || now() < state.resendAt) return Promise.resolve();
      return run(() => state.mode === 'signup'
        ? auth.resend({ type: 'signup', email: state.email })
        : auth.signInWithOtp({ email: state.email, options: { shouldCreateUser: false } }),
      () => ({ resendAt: now() + 60000 }));
    },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    stop() { stopped = true; listeners.clear(); },
  };
}
