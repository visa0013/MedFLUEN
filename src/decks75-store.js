import { deckApply75 } from './decks75-model';

export function deckExclusive75(navigator, scope) {
  return async callback => {
    if (!navigator?.locks?.request) throw Error('Denne browser understøtter ikke sikker dæklagring på tværs af faner. Brug en opdateret browser over HTTPS. Dine gemte ændringer er bevaret.');
    return navigator.locks.request(`medfluen-decks75:${scope}`, callback);
  };
}

export function createDeckRemote75(client, moduleId) {
  async function call(name, parameters) {
    const result = await client.rpc(name, parameters);
    if (result.error) throw result.error;
    if (!result.data) throw Error('Dækdata kunne ikke læses. Prøv igen.');
    return result.data;
  }
  return {
    // One SQL snapshot: receipts must describe exactly the returned workspace.
    read: ids => call('read_flashcard_decks75', { p_module_id: moduleId, p_operation_ids: ids }),
    write: (data, revision, operation) => call('save_flashcard_decks75', { p_module_id: moduleId, p_expected_revision: revision, p_operation_id: operation, p_data: data }),
  };
}

// Durable local outbox + revision-checked remote writes. Injected boundaries make
// offline/retry behavior testable without using a real student's account.
export function createDeckStore75({ owner, moduleId, storage, remote, baseIds, uid, exclusive = callback => callback() }) {
  const key = `medfluen-decks75:${encodeURIComponent(owner)}:${encodeURIComponent(moduleId)}`;
  const empty = () => ({ owner, moduleId, decks: [], placements: {} });
  let envelope = { version: 1, state: empty(), revision: 0, pending: [] };
  let status = 'local', error = '', syncing = false, stopped = false;
  const listeners = new Set();
  function read() {
    const raw = storage.getItem(key);
    if (!raw) return { version: 1, state: empty(), revision: 0, pending: [] };
    const value = JSON.parse(raw);
    if (value.version !== 1 || value.state?.owner !== owner || value.state?.moduleId !== moduleId || !Array.isArray(value.pending) || !Array.isArray(value.state.decks)) throw Error('Den lokale dækfil kunne ikke læses. Den er bevaret.');
    return value;
  }
  function persist(next) {
    storage.setItem(key, JSON.stringify(next)); // Must succeed before UI acknowledges a change.
    envelope = next;
  }
  function projected(value = envelope) {
    return value.pending.reduce((state, entry) => {
      try { return deckApply75(state, entry.action, baseIds); }
      catch (failure) { failure.conflict = entry; throw failure; }
    }, value.state);
  }
  function snapshot() {
    try { return { state: projected(), pending: envelope.pending.length, status, error }; }
    catch (failure) { return { state: envelope.state, pending: envelope.pending.length, status: 'error', conflict: failure.conflict, error: `En dækændring er i konflikt (${failure.message}). Dine ventende ændringer er bevaret.` }; }
  }
  function emit() { if (!stopped) listeners.forEach(listener => listener(snapshot())); }
  try { envelope = read(); } catch (failure) { status = 'error'; error = failure.message; }
  async function change(action) {
    if (!owner || stopped) throw Error('Log ind for at gemme egne dæk.');
    await exclusive(() => {
      const current = read();
      const scoped = { ...action, owner, moduleId };
      deckApply75(projected(current), scoped, baseIds);
      persist({ ...current, pending: [...current.pending, { id: uid(), action: scoped }] });
      status = 'pending'; error = ''; emit();
    });
    return snapshot();
  }
  async function sync() {
    if (syncing || stopped || !owner) return;
    syncing = true;
    try {
      let conflicts = 0;
      while (!stopped) {
        const current = read();
        const latest = await remote.read(current.pending.map(entry => entry.id));
        if (stopped) return;
        if (latest.state?.owner !== owner || latest.state?.moduleId !== moduleId) throw Error('scope');
        await exclusive(() => {
          const fresh = read();
          const acknowledged = new Set(latest.acknowledged || []);
          // Do not regress a cache advanced by another tab while the request ran.
          if (latest.revision >= fresh.revision) persist({ ...fresh, state: latest.state, revision: latest.revision, pending: fresh.pending.filter(entry => !acknowledged.has(entry.id)) });
          else envelope = fresh;
          emit();
        });
        const entry = envelope.pending[0];
        if (!entry) { status = 'synced'; error = ''; break; }
        const next = deckApply75(envelope.state, entry.action, baseIds);
        try {
          const saved = await remote.write(next, envelope.revision, entry.id);
          if (stopped) return;
          if (saved.state?.owner !== owner || saved.state?.moduleId !== moduleId) throw Error('scope');
          await exclusive(() => {
            const fresh = read();
            persist({ ...fresh,
              state: saved.revision >= fresh.revision ? saved.state : fresh.state,
              revision: Math.max(saved.revision, fresh.revision),
              pending: fresh.pending.filter(item => item.id !== entry.id),
            });
            emit();
          });
        } catch (failure) {
          if (failure.code === '40001' && ++conflicts < 5) continue;
          throw failure;
        }
      }
    } catch (failure) {
      status = 'error'; error = failure.message || 'Synkronisering mislykkedes. Ændringerne er bevaret lokalt.';
    } finally { syncing = false; emit(); }
  }
  return {
    key, snapshot, change, sync,
    async discardConflict(id) {
      if (stopped) throw Error('Dækoversigten er lukket.');
      await exclusive(() => {
        const fresh = read();
        try { projected(fresh); }
        catch (failure) {
          if (failure.conflict?.id === id) {
            persist({ ...fresh, pending: fresh.pending.filter(entry => entry.id !== id) });
            status = 'pending'; error = ''; emit(); return;
          }
        }
        throw Error('Konflikten er ændret. Genindlæs oversigten.');
      });
    },
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    reload() { try { envelope = read(); emit(); } catch (failure) { status = 'error'; error = failure.message; emit(); } },
    stop() { stopped = true; listeners.clear(); },
  };
}
