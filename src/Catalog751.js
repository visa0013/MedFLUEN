import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { saveCatalog751, moveLecture751, validateCatalog751 } from "./catalog751-model";
import "./catalog751.css";

export function useCatalog751(store, client, userId) {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  useEffect(() => {
    store.reset();
    if (!userId) return;
    const refresh = () => { if (document.visibilityState !== "hidden") store.refresh(client); };
    refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    const timer = window.setInterval(refresh, 60000);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", refresh); store.reset(); };
  }, [store, client, userId]);
  return snapshot;
}

export function CatalogEditor751({ store, client, moduleName, userId, isAdmin, onClose, language = "da" }) {
  const en = language === "en";
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const [initial, setInitial] = useState(() => ({ rows: store.catalog[moduleName] || [], revision: snapshot.revisions[moduleName] || 0 }));
  const [rows, setRows] = useState(initial.rows);
  const [title, setTitle] = useState("");
  const [group, setGroup] = useState(initial.rows[0]?.group || "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const saving = useRef(false), dialog = useRef(null), drag = useRef(null), closeRef = useRef(null);
  useEffect(() => {
    if (snapshot.status !== "ready" || dirty || busy) return;
    const shared = store.catalog[moduleName] || [];
    if (shared === initial.rows) return;
    setInitial({ rows: shared, revision: snapshot.revisions[moduleName] || 0 });
    setRows(shared);
    setGroup(current => shared.some(row => row.group === current) ? current : shared[0]?.group || "");
  }, [store, moduleName, snapshot, dirty, busy, initial.rows]);
  const groups = [...new Set([...initial.rows.map(row => row.group), ...rows.map(row => row.group)])];
  function close() {
    if (saving.current) return;
    if (!dirty || window.confirm(en ? "Discard unsaved changes?" : "Kassér de ændringer, der ikke er gemt?")) onClose();
  }
  closeRef.current = close;
  useEffect(() => {
    if (!isAdmin) return;
    const previous = document.activeElement;
    dialog.current?.querySelector("button")?.focus();
    const key = event => {
      if (event.key === "Escape") { event.preventDefault(); closeRef.current(); }
      if (event.key !== "Tab") return;
      const items = [...dialog.current.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),[tabindex="0"]')];
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("keydown", key); previous?.focus?.(); };
  }, [isAdmin]);
  if (!isAdmin) return null;
  const locked = busy || snapshot.status !== "ready";
  function change(next) { setRows(next); setDirty(true); setError(""); }
  function move(id, targetGroup, beforeId) { if (!locked) change(moveLecture751(rows, id, targetGroup, beforeId)); }
  function add() {
    if (locked) return;
    try {
      const next = validateCatalog751([...rows, { id: `L-${crypto.randomUUID()}`, title, group }], initial.rows);
      change(next); setTitle("");
    } catch (err) { setError(err.message); }
  }
  async function save() {
    if (locked || saving.current || !dirty) return;
    saving.current = true; setBusy(true); setError("");
    try {
      const result = await saveCatalog751(client, moduleName, rows, initial.revision, userId, initial.rows);
      store.accept(result); setDirty(false); onClose();
    } catch (err) { setError(err.message); }
    finally { saving.current = false; setBusy(false); }
  }
  async function reload() {
    if (busy || (dirty && !window.confirm(en ? "Discard draft and load shared list?" : "Kassér kladden og hent den fælles liste igen?"))) return;
    setBusy(true); await store.refresh(client);
    if (store.getSnapshot().status === "ready") {
      const next = { rows: store.catalog[moduleName] || [], revision: store.getSnapshot().revisions[moduleName] || 0 };
      setInitial(next); setRows(next.rows); setDirty(false); setError("");
    }
    setBusy(false);
  }
  return createPortal(<div className="mf751-overlay" onMouseDown={e => { if (e.target === e.currentTarget) close(); }}>
    <div ref={dialog} className="mf751-catalog" role="dialog" aria-modal="true" aria-labelledby="catalog751-title">
      <header><div><h2 id="catalog751-title">{en ? "Edit lectures" : "Redigér forelæsninger"}</h2><p>{moduleName}</p></div><button type="button" onClick={close} disabled={busy} aria-label={en ? "Close" : "Luk"}>×</button></header>
      <p className="mf751-intro">{en ? "Drag lectures between topics. Changes are shared with everyone; notes and cards stay attached." : "Træk forelæsninger mellem hovedemner. Ændringerne gælder alle; noter og kort følger med."}</p>
      {snapshot.status === "loading" || snapshot.status === "idle" ? <p role="status" className="mf751-intro">{en ? "Loading shared list…" : "Henter den fælles liste…"}</p> : snapshot.status !== "ready" && <p role="alert">{en ? "Shared list unavailable. Check your connection and the 7.5.1 SQL installation, then reload." : "Den fælles liste kunne ikke hentes. Kontrollér forbindelsen og SQL-installationen til 7.5.1, og hent listen igen."}</p>}
      {error && <p role="alert">{error}</p>}
      <div className="mf751-catalog-scroll">
        {groups.map(name => <section key={name} onDragOver={event => { event.preventDefault(); }} onDrop={event => { event.preventDefault(); move(drag.current, name); drag.current = null; }}>
          <h3>{name}</h3>
          {rows.filter(row => row.group === name).map((row, index, siblings) => <div key={row.id} className="mf751-lecture-row" data-lecture-id={row.id} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); event.stopPropagation(); move(drag.current, name, row.id); drag.current = null; }}>
            <span className="mf751-drag" draggable={!locked} role="img" aria-label={en ? "Drag handle" : "Træk forelæsning"} title={en ? "Drag to move" : "Træk for at flytte"} onDragStart={event => { drag.current = row.id; event.dataTransfer.setData("text/plain", row.id); event.dataTransfer.effectAllowed = "move"; }} onDragEnd={() => { drag.current = null; }}>⠿</span>
            <input aria-label={`${en ? "Title for" : "Titel for"} ${row.title}`} value={row.title} maxLength={300} disabled={locked} onChange={event => change(rows.map(item => item.id === row.id ? { ...item, title: event.target.value } : item))} />
            <select aria-label={`${en ? "Topic for" : "Hovedemne for"} ${row.title}`} value={row.group} disabled={locked} onChange={event => move(row.id, event.target.value)}>{groups.map(value => <option key={value}>{value}</option>)}</select>
            <div className="mf751-order"><button type="button" disabled={locked || index === 0} aria-label={`${en ? "Move up" : "Flyt op"}: ${row.title}`} onClick={() => move(row.id, name, siblings[index - 1].id)}>↑</button><button type="button" disabled={locked || index === siblings.length - 1} aria-label={`${en ? "Move down" : "Flyt ned"}: ${row.title}`} onClick={() => move(row.id, name, siblings[index + 2]?.id)}>↓</button></div>
          </div>)}
          {!rows.some(row => row.group === name) && <p className="mf751-empty">{en ? "Drop a lecture here" : "Slip en forelæsning her"}</p>}
        </section>)}
      </div>
      <form className="mf751-create" onSubmit={event => { event.preventDefault(); add(); }}>
        <input aria-label={en ? "New lecture title" : "Ny forelæsnings titel"} placeholder={en ? "New lecture title" : "Ny forelæsnings titel"} value={title} maxLength={300} onChange={event => setTitle(event.target.value)} disabled={locked} />
        {groups.length ? <select aria-label={en ? "Topic" : "Hovedemne"} value={group} disabled={locked} onChange={event => setGroup(event.target.value)}>{groups.map(value => <option key={value}>{value}</option>)}</select> : <input aria-label={en ? "Topic" : "Hovedemne"} placeholder={en ? "Topic" : "Hovedemne"} value={group} maxLength={120} onChange={event => setGroup(event.target.value)} disabled={locked} />}
        <button type="submit" data-action="add-lecture" disabled={locked || !title.trim() || !group.trim()}>+ {en ? "Add" : "Tilføj"}</button>
      </form>
      <footer><button type="button" onClick={reload} disabled={busy}>{en ? "Reload list" : "Hent listen igen"}</button><div><button type="button" onClick={close} disabled={busy}>{en ? "Cancel" : "Annuller"}</button><button type="button" className="mf751-primary" data-action="save-catalog" disabled={locked || !dirty} onClick={save}>{busy ? (en ? "Saving…" : "Gemmer…") : (en ? "Save for everyone" : "Gem for alle")}</button></div></footer>
    </div>
  </div>, document.body);
}
