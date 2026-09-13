import React, { useEffect, useRef, useState } from 'react';
import { createDeckStore75, createDeckRemote75, deckExclusive75 } from './decks75-store';
import './decks75.css';

export function usePrivateDecks75(owner, moduleId, baseIds, client) {
  const store = useRef(null);
  const [value, setValue] = useState(null);
  const signature = JSON.stringify(baseIds);
  const scope = `${owner}:${moduleId}`;
  useEffect(() => {
    if (!owner || !moduleId) return;
    const remote = createDeckRemote75(client, moduleId);
    const instance = createDeckStore75({ owner, moduleId, storage: window.localStorage, remote, baseIds: JSON.parse(signature), uid: () => window.crypto.randomUUID(),
      exclusive: deckExclusive75(window.navigator, scope),
    });
    store.current = instance;
    const update = snapshot => setValue({ ...snapshot, scope });
    const unsubscribe = instance.subscribe(update);
    update(instance.snapshot());
    const sync = () => instance.sync();
    const storageChanged = event => { if (event.key === instance.key) { instance.reload(); sync(); } };
    window.addEventListener('online', sync); window.addEventListener('focus', sync); window.addEventListener('storage', storageChanged);
    sync();
    return () => { unsubscribe(); instance.stop(); if (store.current === instance) store.current = null; window.removeEventListener('online', sync); window.removeEventListener('focus', sync); window.removeEventListener('storage', storageChanged); };
  }, [owner, moduleId, signature, client, scope]);
  const safe = value?.scope === scope ? value : { state: { owner, moduleId, decks: [], placements: {} }, pending: 0, status: 'local', error: '' };
  return { ...safe, async change(action) {
    if (!store.current || store.current.snapshot().state.owner !== owner || store.current.snapshot().state.moduleId !== moduleId) throw Error('Dækoversigten er ikke klar endnu. Prøv igen.');
    const next = await store.current.change(action);
    store.current.sync();
    return next;
  }, retry: () => store.current?.sync(), async discardConflict(id) {
    if (!store.current || store.current.snapshot().state.owner !== owner || store.current.snapshot().state.moduleId !== moduleId) throw Error('Dækoversigten er ikke klar.');
    await store.current.discardConflict(id); await store.current.sync();
  } };
}

export function DeckDialog75({ tree, selected, mode, cardIds = [], onApply, onClose, onBusyChange, newId = () => `personal:${window.crypto.randomUUID()}`, language = 'da' }) {
  const en = language === 'en';
  const label = (da, english) => en ? english : da;
  const [name, setName] = useState(mode === 'rename' ? selected.label : '');
  const [parent, setParent] = useState(mode === 'create' ? selected.id : tree.id);
  const [target, setTarget] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const input = useRef(null);
  useEffect(() => { input.current?.focus(); input.current?.select(); }, []);
  const nodes = [];
  function flatten(node, depth = 0) { nodes.push({ ...node, depth }); (node.children || []).forEach(child => flatten(child, depth + 1)); }
  flatten(tree);
  const excluded = new Set();
  function descend(node) { excluded.add(node.id); (node.children || []).forEach(descend); }
  if (mode === 'move' || mode === 'delete') descend(selected);
  const title = ({ create: label('Nyt underdæk', 'New subdeck'), rename: label('Omdøb dæk', 'Rename deck'), move: label('Flyt dæk', 'Move deck'), delete: label('Slet dæk', 'Delete deck'), assign: label('Flyt kort', 'Move cards') })[mode];
  async function submit(event) {
    event.preventDefault(); if (lock.current) return;
    lock.current = true; onBusyChange?.(true); setBusy(true); setError('');
    try {
      const action = { type: mode, id: mode === 'create' ? newId() : selected.id };
      if (mode === 'create' || mode === 'rename') action.name = name.trim();
      if (mode === 'create' || mode === 'move') action.parent = parent;
      if (mode === 'delete' || mode === 'assign') action.target = target || null;
      if (mode === 'assign') action.cardIds = cardIds.map(String);
      await onApply(action); onClose();
    } catch (failure) {
      const messages = { name: label('Vælg et navn, der ikke allerede bruges på dette niveau.', 'Choose a unique name at this level.'), cycle: label('Et dæk kan ikke flyttes ind i sig selv.', 'A deck cannot contain itself.'), parent: label('Det overordnede dæk findes ikke længere.', 'The parent deck no longer exists.') };
      setError(messages[failure.message] || failure.message || label('Kunne ikke gemme.', 'Could not save.'));
    } finally { lock.current = false; onBusyChange?.(false); setBusy(false); }
  }
  return <form className="mf75-deck-dialog" onSubmit={submit}>
    <header><small>{label('DINE DÆK', 'YOUR DECKS')}</small><h2>{title}</h2><p>{selected.label}</p></header>
    <fieldset disabled={busy}>
      {(mode === 'create' || mode === 'rename') && <label>{label('Navn', 'Name')}<input ref={input} name="name" value={name} onChange={event => setName(event.target.value)} maxLength={100} required autoComplete="off" /></label>}
      {(mode === 'create' || mode === 'move') && <label>{label('Placering', 'Parent deck')}<select value={parent} onChange={event => setParent(event.target.value)}>{nodes.filter(node => !excluded.has(node.id)).map(node => <option key={node.id} value={node.id}>{'· '.repeat(node.depth)}{node.label}</option>)}</select></label>}
      {(mode === 'delete' || mode === 'assign') && <label>{label('Flyt kort til', 'Move cards to')}<select value={target} onChange={event => setTarget(event.target.value)}><option value="">{label('Oprindelig forelæsning', 'Original lecture')}</option>{nodes.filter(node => node.type === 'personal' && !excluded.has(node.id)).map(node => <option key={node.id} value={node.id}>{node.label}</option>)}</select></label>}
      {mode === 'delete' && <p>{label('Kun dækket fjernes. Kort og repetitionshistorik bevares; underdæk flyttes med til den valgte placering eller ét niveau op.', 'Only the deck is removed. Cards and review history stay intact; subdecks move to the selected destination or one level up.')}</p>}
    </fieldset>
    {error && <p className="mf75-deck-error" role="alert">{error}</p>}
    <footer><button type="button" disabled={busy} onClick={onClose}>{label('Annuller', 'Cancel')}</button><button className="mf75-deck-primary" type="submit" disabled={busy}>{busy ? label('Gemmer…', 'Saving…') : mode === 'create' ? label('Opret dæk', 'Create deck') : label('Gem', 'Save')}</button></footer>
  </form>;
}
