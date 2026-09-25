import { useCallback, useEffect, useState } from 'react';
import { conversationState79, conversationTitle79 } from './drbyte79-model';
import { createConversation79, deleteConversation79, listConversations79, loadConversation79, renameConversation79, saveMessage79 } from './drbyte79-store';
import './drbyte79.css';

const stateKey79 = userId => `medfluen-drbyte79-session:${userId || 'guest'}`;

export function useDrByteHistory79(client, userId) {
  const initial = () => {
    try { return conversationState79(sessionStorage.getItem(stateKey79(userId))); }
    catch { return conversationState79(null); }
  };
  const [restored] = useState(initial);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState(restored.draft);
  const [activeId, setActiveId] = useState(restored.activeId);
  const [history, setHistory] = useState([]);
  const [syncState, setSyncState] = useState('loading');

  useEffect(() => {
    try { sessionStorage.setItem(stateKey79(userId), JSON.stringify({ activeId, draft: question })); }
    catch { /* Private mode may block session storage. The open chat still works. */ }
  }, [userId, activeId, question]);

  const refreshHistory = useCallback(async () => {
    if (!userId) return [];
    const rows = await listConversations79(client, userId);
    setHistory(rows);
    return rows;
  }, [client, userId]);

  useEffect(() => {
    let live = true;
    if (!userId) { setSyncState('unavailable'); return undefined; }
    (async () => {
      try {
        const rows = await listConversations79(client, userId);
        if (!live) return;
        setHistory(rows);
        if (restored.activeId && rows.some(row => row.id === restored.activeId)) {
          const items = await loadConversation79(client, restored.activeId);
          if (live) setMessages(items.map(item => ({ role: item.role, ...(item.body || {}) })));
        } else if (restored.activeId) setActiveId(null);
        if (live) setSyncState('saved');
      } catch { if (live) setSyncState('unavailable'); }
    })();
    return () => { live = false; };
  }, [client, userId, restored.activeId]);

  async function openConversation(id) {
    const items = await loadConversation79(client, id);
    setMessages(items.map(item => ({ role: item.role, ...(item.body || {}) })));
    setActiveId(id);
    setQuestion('');
    setSyncState('saved');
  }

  function beginConversation() {
    setActiveId(null); setMessages([]); setQuestion(''); setSyncState('saved');
  }

  async function persistExchange(userMessage, assistantMessage) {
    if (!userId) return;
    setSyncState('saving');
    try {
      let id = activeId;
      if (!id) {
        const created = await createConversation79(client, userId, conversationTitle79(userMessage.text));
        id = created.id;
        setActiveId(id);
      }
      await saveMessage79(client, id, userMessage);
      await saveMessage79(client, id, assistantMessage);
      await refreshHistory();
      setSyncState('saved');
    } catch (error) { setSyncState('error'); throw error; }
  }

  async function renameConversation(id, title) { await renameConversation79(client, id, title); await refreshHistory(); }
  async function deleteConversation(id) {
    await deleteConversation79(client, id);
    if (id === activeId) beginConversation();
    await refreshHistory();
  }

  return { messages, setMessages, question, setQuestion, activeId, history, syncState,
    refreshHistory, openConversation, beginConversation, persistExchange, renameConversation, deleteConversation };
}

export function DrByte79Rail({ history, activeId, onNew, onOpen, onRename, onDelete, syncState }) {
  const [query, setQuery] = useState('');
  const rows = history.filter(row => (row.title || '').toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  return <aside className="mf79-byte-rail" aria-label="Dr. Byte samtaler">
    <header><strong>Dr. Byte</strong><button type="button" onClick={onNew}>+ Ny samtale</button></header>
    <label className="mf79-byte-history-search">Søg samtaler<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Søg i titler" /></label>
    <div className="mf79-byte-history-list">{rows.map(row => <div className="mf79-byte-history-item" key={row.id} data-active={row.id === activeId ? 'true' : 'false'}>
      <button type="button" onClick={() => onOpen(row.id)}>{row.title || 'Ny samtale'}</button>
      <button type="button" aria-label={`Omdøb ${row.title}`} onClick={() => { const name = window.prompt('Ny titel', row.title); if (name?.trim()) onRename(row.id, name.trim()); }}>⋯</button>
      <button type="button" aria-label={`Slet ${row.title}`} onClick={() => { if (window.confirm('Slet denne samtale? PDF-filer berøres ikke.')) onDelete(row.id); }}>×</button>
    </div>)}{!rows.length && <p className="mf79-byte-empty">Ingen samtaler her endnu.</p>}</div>
    <small className="mf79-byte-sync" role="status">{syncState === 'saving' ? 'Gemmer…' : syncState === 'saved' ? 'Privat historik gemt' : syncState === 'error' ? 'Ikke synkroniseret' : syncState === 'unavailable' ? 'Historik kræver SQL-opsætning' : 'Henter historik…'}</small>
  </aside>;
}
