import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { annotationKey74, getAnnotationJournal74, exportSlideNotes74, slideNotes74 } from "./reader74-model";
import "./reader74.css";

export function useSlideJournal74({ client, userId, materialId, moduleName, lectureId, initial = [], onSnapshot }) {
  const callback = useRef(onSnapshot); callback.current = onSnapshot;
  const journal = useMemo(() => getAnnotationJournal74(client, {
    storage: { getItem: key => window.localStorage.getItem(key), setItem: (key, value) => window.localStorage.setItem(key, value) },
    key: annotationKey74(userId, materialId), initial,
    send: userId && materialId ? async op => {
      const row = op.row;
      const result = row ? await client.from("lecture_pdf_annotations").upsert({
        id: row.id, user_id: userId, module_name: moduleName, lecture_id: lectureId, material_id: materialId,
        page_number: Math.max(1, Number(row.page) || 1), annotation_type: row.type,
        color: row.color || "#f7d85c", payload: { ...row.payload, normalized: true }, updated_at: row.updatedAt || new Date().toISOString(),
      }, { onConflict: "id" }) : await client.from("lecture_pdf_annotations").delete().eq("id", op.id).eq("user_id", userId).eq("material_id", materialId);
      if (result.error) throw result.error;
    } : null,
  // Scope identity, not changing cache objects, owns this outbox.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [client, userId, materialId, moduleName, lectureId]);
  const snapshot = useSyncExternalStore(journal.subscribe, journal.snapshot, journal.snapshot);
  const [remoteState, setRemoteState] = useState("loading");
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let cancelled = false;
    if (!userId || !materialId) { setRemoteState("local"); return undefined; }
    setRemoteState("loading");
    const started = journal.hydrationToken();
    Promise.resolve(client.from("lecture_pdf_annotations").select("id,page_number,annotation_type,color,payload,created_at,updated_at")
      .eq("user_id", userId).eq("material_id", materialId).order("created_at", { ascending: true }))
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) throw error;
        journal.hydrate((data || []).map(r => ({ id: r.id, page: Number(r.page_number) || 1, type: r.annotation_type, color: r.color,
          payload: r.payload || {}, createdAt: r.created_at, updatedAt: r.updated_at })), started);
        setRemoteState("ready"); return journal.flush();
      }).catch(() => { if (!cancelled) setRemoteState("local"); });
    return () => { cancelled = true; };
  }, [client, userId, materialId, journal, reload]);
  useEffect(() => {
    if (materialId) callback.current?.(snapshot.rows);
  }, [journal, materialId, snapshot.rows]);
  useEffect(() => {
    if (!snapshot.pending) return undefined;
    const timer = window.setTimeout(() => journal.flush(), 650);
    return () => window.clearTimeout(timer);
  }, [journal, materialId, snapshot.revision, snapshot.pending]); // No retry loop on failed writes.
  useEffect(() => {
    const online = () => { journal.flush(); setReload(n => n + 1); };
    const leave = event => { if (journal.snapshot().status === "storage-error") { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("online", online); window.addEventListener("beforeunload", leave);
    return () => { window.removeEventListener("online", online); window.removeEventListener("beforeunload", leave); journal.flush(); };
  }, [journal]);
  return { ...snapshot, status: snapshot.status === "ready" ? remoteState : snapshot.status,
    put: (row, previous) => journal.edit({ ...row, updatedAt: new Date().toISOString() }, previous), remove: row => journal.remove(row.id),
    retry: () => { journal.flush(); setReload(n => n + 1); } };
}

// Render a deliberately small Markdown vocabulary as React nodes, never raw HTML.
function Inline74({ text }) {
  return String(text || "").split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part.startsWith("*") && part.endsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : part);
}
export function NoteText74({ text }) {
  return <div className="mf74-prose">{String(text || "").split("\n").map((line, i) => {
    if (/^##? /.test(line)) return <h3 key={i}><Inline74 text={line.replace(/^##? /, "")} /></h3>;
    if (/^- \[[ x]\] /.test(line)) return <p className="mf74-checkline" key={i}><span aria-label={line[3] === "x" ? "Afkrydset" : "Ikke afkrydset"}>{line[3] === "x" ? "☑" : "☐"}</span><Inline74 text={line.slice(6)} /></p>;
    if (/^- /.test(line)) return <p className="mf74-checkline" key={i}><span>•</span><Inline74 text={line.slice(2)} /></p>;
    return <p key={i}><Inline74 text={line || "\u00a0"} /></p>;
  })}</div>;
}

export function SlideNotes74({ annotations = [], fileName = "PDF", materialId, page = 1, numPages = 0, status = "ready", onSave, onDelete, onRetry, onPage, onClose, language = "da" }) {
  const en = language === "en";
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState("write");
  const [revealed, setRevealed] = useState(false);
  const [recallIndex, setRecallIndex] = useState(0);
  const [removed, setRemoved] = useState(null);
  const [fontSize, setFontSize] = useState(15);
  const [pageDraft, setPageDraft] = useState(String(page));
  const textarea = useRef(null);
  const notes = slideNotes74(annotations, query);
  const allNotes = slideNotes74(annotations);
  const selected = allNotes.find(n => n.id === selectedId) || allNotes.find(n => n.page === Number(page));
  const recall = notes.filter(n => String(n.payload?.question || "").trim());
  const recallNote = recall[Math.min(recallIndex, Math.max(0, recall.length - 1))];
  useEffect(() => { setSelectedId(current => annotations.find(n => n.id === current)?.page === Number(page) ? current : null); setRevealed(false); }, [materialId, page]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setPageDraft(String(page)); }, [materialId, page]);
  useEffect(() => { setQuery(""); setMode("write"); setRemoved(null); }, [materialId]);
  function choose(note) { setSelectedId(note.id); setRevealed(false); if (note.page !== Number(page)) onPage?.(note.page); }
  function jump() {
    const value = Number(pageDraft);
    if (!Number.isFinite(value) || value < 1) { setPageDraft(String(page)); return; }
    const next = Math.min(numPages || 10000, Math.max(1, Math.floor(value)));
    setPageDraft(String(next)); if (next !== page) onPage?.(next);
  }
  function update(patch) {
    if (!selected) return;
    onSave?.({ ...selected, payload: { ...selected.payload, ...patch } });
  }
  function add() {
    if (!materialId || !onSave) return;
    const note = { id: crypto.randomUUID(), type: "sticky", page: Math.max(1, Number(page) || 1), color: "#f7d85c", createdAt: new Date().toISOString(),
      payload: { kind: "slide-note", title: "", text: "", question: "", tags: [], x: .06, y: .08, normalized: true } };
    onSave(note); setSelectedId(note.id); setMode("write");
  }
  function format(before, after = "") {
    const node = textarea.current; if (!node || !selected) return;
    const text = selected.payload?.text || ""; const start = node.selectionStart; const end = node.selectionEnd;
    update({ text: text.slice(0, start) + before + text.slice(start, end) + after + text.slice(end) });
    requestAnimationFrame(() => { node.focus(); node.setSelectionRange(start + before.length, end + before.length); });
  }
  function download() {
    const blob = new Blob([exportSlideNotes74(annotations, fileName)], { type: "text/markdown;charset=utf-8" });
    const href = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = href; a.download = `${fileName.replace(/\.[^.]+$/, "")}-noter.md`; a.click(); setTimeout(() => URL.revokeObjectURL(href), 1000);
  }
  const statusText = { ready: en ? "Synced" : "Synkroniseret", saving: en ? "Saving…" : "Synkroniserer…", loading: en ? "Loading…" : "Henter…", local: en ? "Saved on this device" : "Gemt på denne enhed", "storage-error": en ? "Device storage failed — export your notes" : "Lokal lagring fejlede — eksportér dine noter" }[status] || "";
  return <section className="mf74-notes" aria-label={en ? "Slide notes" : "Slidenoter"}>
    <header className="mf74-notes-head"><div><span className="mf74-eyebrow">{en ? "YOUR READING SPACE" : "DIT LÆSEVÆRKSTED"}</span><h3>{en ? "Slide notes" : "Slidenoter"}</h3><small title={fileName}>{fileName}</small></div>{onClose && <button type="button" aria-label={en ? "Close notes" : "Luk noter"} onClick={onClose}>×</button>}</header>
    <div className="mf74-source"><button type="button" disabled={page <= 1} aria-label={en ? "Previous slide" : "Forrige slide"} onClick={() => onPage?.(Math.max(1, page - 1))}>‹</button><span>Slide <input type="number" min="1" max={numPages || 10000} aria-label={en ? "Slide number" : "Slidenummer"} value={pageDraft} onChange={e => setPageDraft(e.target.value)} onBlur={jump} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); jump(); e.currentTarget.blur(); } }} />{numPages > 0 ? ` / ${numPages}` : ""}</span><button type="button" disabled={numPages > 0 && page >= numPages} aria-label={en ? "Next slide" : "Næste slide"} onClick={() => onPage?.(page + 1)}>›</button><button type="button" className="mf74-add" disabled={!materialId || !onSave} onClick={add}>+ {en ? "Note" : "Note"}</button></div>
    <nav className="mf74-modes" aria-label={en ? "Note view" : "Notevisning"}>{[["write", en ? "Write" : "Skriv"], ["read", en ? "Read" : "Læs"], ["recall", en ? "Recall" : "Genkald"]].map(([id, label]) => <button type="button" key={id} aria-pressed={mode === id} onClick={() => { setMode(id); setRevealed(false); }}>{label}</button>)}</nav>
    <input className="mf74-search" type="search" aria-label={en ? "Search slide notes" : "Søg i slidenoter"} placeholder={en ? "Search notes, tags, slides…" : "Søg noter, mærker, slides…"} value={query} onChange={event => setQuery(event.target.value)} />
    {notes.length > 0 && <div className="mf74-note-list" aria-label={en ? "Notes by slide" : "Noter efter slide"}>{notes.map(note => <button type="button" key={note.id} aria-pressed={selected?.id === note.id} onClick={() => choose(note)}><span>{note.page}</span><span>{note.payload?.title || note.payload?.text?.split("\n")[0] || (en ? "Untitled note" : "Note uden titel")}</span></button>)}</div>}
    {query && !notes.length && <p className="mf74-empty">{en ? "No matching notes." : "Ingen noter matcher din søgning."}</p>}
    {mode === "recall" ? <div className="mf74-recall">
      {recallNote ? <><small>{Math.min(recallIndex + 1, recall.length)} / {recall.length} · Slide {recallNote.page}</small><h3>{recallNote.payload.question}</h3>{revealed ? <NoteText74 text={recallNote.payload.text} /> : <p>{en ? "Take your time. Reveal the note when you want." : "Tag dig tid. Åbn din note, når du vil."}</p>}<div className="mf74-actions"><button type="button" onClick={() => setRevealed(v => !v)}>{revealed ? (en ? "Hide note" : "Skjul note") : (en ? "Show note" : "Vis note")}</button><button type="button" onClick={() => { onPage?.(recallNote.page); }}>{en ? "Open source" : "Åbn kilden"}</button><button type="button" disabled={recall.length < 2} onClick={() => { setRecallIndex(i => (i + 1) % recall.length); setRevealed(false); }}>{en ? "Next" : "Næste"} →</button></div></> : <p className="mf74-empty">{en ? "Add a recall question to a note to explore it here. This does not change your flashcard schedule." : "Skriv et genkaldelsesspørgsmål i en note for at bruge den her. Det ændrer ikke din flashkortplan."}</p>}
    </div> : mode === "read" ? <div className="mf74-reading" style={{ fontSize }}><div className="mf74-actions"><button type="button" aria-label={en ? "Smaller text" : "Mindre tekst"} onClick={() => setFontSize(n => Math.max(13, n - 1))}>A−</button><button type="button" aria-label={en ? "Larger text" : "Større tekst"} onClick={() => setFontSize(n => Math.min(24, n + 1))}>A+</button></div>{notes.map(note => <article key={note.id}><button type="button" className="mf74-source-link" onClick={() => onPage?.(note.page)}>Slide {note.page} ↗</button><h3>{note.payload?.title}</h3><NoteText74 text={note.payload?.text} /></article>)}{!notes.length && <p className="mf74-empty">{en ? "Your notes will appear here." : "Dine noter bliver samlet her."}</p>}</div>
      : selected ? <div className="mf74-editor" key={selected.id}>
        <label>{en ? "Title" : "Titel"}<input aria-label={en ? "Note title" : "Notetitel"} value={selected.payload?.title || ""} placeholder={en ? "A short headline…" : "En kort overskrift…"} onChange={e => update({ title: e.target.value })} /></label>
        <div className="mf74-format" role="toolbar" aria-label={en ? "Text formatting" : "Tekstformatering"}>{[["B", "**", "**", en ? "Bold" : "Fed"], ["I", "*", "*", en ? "Italic" : "Kursiv"], ["H", "\n## ", "", en ? "Heading" : "Overskrift"], ["•", "\n- ", "", en ? "List" : "Punktliste"], ["☐", "\n- [ ] ", "", en ? "Checklist" : "Tjekliste"]].map(([label, before, after, title]) => <button key={label} type="button" title={title} aria-label={title} onMouseDown={e => e.preventDefault()} onClick={() => format(before, after)}>{label}</button>)}</div>
        <textarea ref={textarea} aria-label={en ? "Note text" : "Notetekst"} value={selected.payload?.text || ""} placeholder={en ? "What do you want to remember from this slide?" : "Hvad vil du huske fra dette slide?"} onChange={e => update({ text: e.target.value })} />
        <details className="mf74-extra"><summary>{en ? "Tags & recall question" : "Mærker og genkaldelsesspørgsmål"}</summary><label>{en ? "Tags, separated by commas" : "Mærker, adskilt med komma"}<input value={(selected.payload?.tags || []).join(",")} onChange={e => update({ tags: e.target.value.split(",") })} placeholder={en ? "exam, mechanism" : "eksamen, mekanisme"} /></label><label>{en ? "Recall question" : "Genkaldelsesspørgsmål"}<textarea value={selected.payload?.question || ""} onChange={e => update({ question: e.target.value })} placeholder={en ? "What would you ask yourself?" : "Hvad ville du spørge dig selv om?"} /></label></details>
        <div className="mf74-editor-foot"><button type="button" className="mf74-source-link" onClick={() => onPage?.(selected.page)}>Slide {selected.page} ↗</button><button type="button" disabled={!onDelete} onClick={() => { setRemoved(selected); onDelete?.(selected); setSelectedId(null); }}>{en ? "Delete note" : "Slet note"}</button></div>
      </div> : <div className="mf74-empty"><span className="mf74-empty-icon">✎</span><h3>{en ? "Space for your thoughts" : "Plads til dine tanker"}</h3><p>{en ? "Create a note for this slide. It is the same note you see in the PDF." : "Opret en note til dette slide. Det er den samme note, du ser i PDF’en."}</p><button type="button" disabled={!materialId} onClick={add}>{en ? "Write a slide note" : "Skriv en slidenote"}</button></div>}
    {removed && <div className="mf74-undo" role="status">{en ? "Note deleted" : "Note slettet"}<button type="button" onClick={() => { onSave?.(removed); setSelectedId(removed.id); setRemoved(null); }}>{en ? "Undo" : "Fortryd"}</button></div>}
    <footer className="mf74-status"><span role="status" data-warning={status === "local" || status === "storage-error"}>{statusText}</span>{onRetry && ["local", "storage-error"].includes(status) && <button type="button" onClick={onRetry}>{en ? "Retry sync" : "Synk igen"}</button>}<button type="button" disabled={!allNotes.length} onClick={download}>{en ? "Export" : "Eksportér"} ↓</button></footer>
  </section>;
}
