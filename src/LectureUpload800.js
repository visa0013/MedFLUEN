import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LectureCard800 } from './LectureCard800';
import { parseLectureFile800, lectureRecords800, mergeLecture800, lectureSchema800 } from './lecture800-model';
import { persistLecture800, readLectureCards800 } from './lecture800-storage';
import { buildLecturePrompt800, downloadLectureFile800, lectureTemplate800 } from './lecture800-prompt';
import './lecture800.css';

export function LectureUpload800({ moduleId, lectures = [], selectedLectureId = '', scope, signedIn = false, onImported, onBack }) {
  const [targetId, setTargetId] = useState(selectedLectureId || ''), [preview, setPreview] = useState(null), [existing, setExisting] = useState([]), [error, setError] = useState(''), [busy, setBusy] = useState(false), [status, setStatus] = useState(''), [index, setIndex] = useState(0), [revealed, setRevealed] = useState(false), [mode, setMode] = useState('new'), [confirmed, setConfirmed] = useState(false), [dragging, setDragging] = useState(false);
  const generation = useRef(0), saving = useRef(false), active = useRef(true);
  const lecture = lectures.find(item => item.id === targetId);
  const target = useMemo(() => ({ moduleId, lectureId: targetId, title: lecture?.title || '' }), [moduleId, targetId, lecture?.title]);
  const rows = useMemo(() => preview && lecture ? lectureRecords800(preview.package, target, preview.mediaHashes) : [], [preview, lecture, target]);
  const mismatch = preview && lecture && (preview.package.lecture.moduleId !== moduleId || preview.package.lecture.lectureId !== targetId);
  const changes = useMemo(() => mergeLecture800(existing, rows, mode), [existing, rows, mode]);
  useEffect(() => {
    active.current = true; generation.current++; setPreview(null); setExisting([]); setError(''); setBusy(false); setStatus('');
    let alive = true;
    if (scope) readLectureCards800(scope).then(records => { if (alive) setExisting(records); }, failure => { if (alive) setError(failure.message); });
    return () => { alive = false; active.current = false; generation.current++; };
  }, [scope, moduleId]);
  useEffect(() => { setConfirmed(false); setIndex(0); setRevealed(false); }, [targetId]);
  async function choose(file) {
    if (!file || busy) return;
    const request = ++generation.current; setBusy(true); setError(''); setStatus('Læser og kontrollerer pakken…'); setPreview(null); setConfirmed(false); setIndex(0); setRevealed(false);
    try {
      const result = await parseLectureFile800(file);
      if (request !== generation.current || !active.current) return;
      setPreview(result); setStatus('');
      if (!targetId && lectures.some(item => item.id === result.package.lecture.lectureId)) setTargetId(result.package.lecture.lectureId);
    } catch (failure) { if (request === generation.current && active.current) { setError(failure.message); setStatus(''); } }
    finally { if (request === generation.current && active.current) setBusy(false); }
  }
  async function confirm() {
    if (saving.current || busy || !signedIn || !preview || !lecture || (mismatch && !confirmed)) return;
    saving.current = true; setBusy(true); setError(''); const request = generation.current;
    try {
      const result = await persistLecture800(scope, preview, target, mode);
      if (request !== generation.current || !active.current) return;
      setStatus(`${result.imported} nye kort og ${result.updated} opdateringer gemt.`);
      window.dispatchEvent(new CustomEvent('medlearn-storage-update', { detail: { key: scope } }));
      onImported?.(target, result);
    } catch (failure) { if (request === generation.current && active.current) setError(failure.message); }
    finally { saving.current = false; if (request === generation.current && active.current) setBusy(false); }
  }
  async function copyPrompt() {
    try { await navigator.clipboard.writeText(buildLecturePrompt800(target)); setStatus('Prompten er kopieret. Vedhæft din PDF i ChatGPT.'); }
    catch { setError('Kunne ikke kopiere. Brug Hent genereringsprompt i stedet.'); }
  }
  return <section className="mf800-upload">
    <button type="button" className="mf800-back" onClick={onBack} disabled={busy}>← Tilbage til Træning</button>
    <header><span className="mf79-kicker">FORELÆSNING / DINE KORT</span><h1>Fra forelæsning til forståelse.</h1><p>Upload kortene fra din forelæsning. Svarpunkter, fagord og figurer følger med — samlet i dit studierum.</p></header>
    <div className="mf800-upload-layout"><div>
      <label className="mf800-target">Gem under forelæsning<select aria-label="Forelæsning" value={targetId} disabled={busy} onChange={event => setTargetId(event.target.value)}><option value="">Vælg forelæsning</option>{lectures.map(item => <option key={item.id} value={item.id}>{item.id} · {item.title}</option>)}</select></label>
      {!lectures.length && <p className="mf800-error">Dette modul har endnu ingen forelæsninger i kataloget. Opret dem under Pensum, før du importerer.</p>}
      <label className="mf800-drop" data-dragging={dragging} onDragOver={event => { event.preventDefault(); if (!busy) setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); choose(event.dataTransfer.files?.[0]); }}><input type="file" accept=".json,.zip" aria-label="Upload forelæsningspakke" disabled={busy} onChange={event => { choose(event.target.files?.[0]); event.target.value = ''; }} /><strong>{busy ? 'Kontrollerer…' : 'Vælg din forelæsningspakke'}</strong><span>JSON med tekst · ZIP med billeder</span></label>
      <p className="mf800-preview-meta">Gemmes på denne enhed under din konto. Behold pakken som backup.</p>
    </div><aside className="mf800-kit"><h2>Lav kortene med din PDF.</h2><p>Giv ChatGPT prompten og forelæsningen. Prompten samler emnerne i faglig rækkefølge og leverer en fil til denne import.</p>
      <button type="button" onClick={() => downloadLectureFile800('MedFLUEN-genereringsprompt.md', buildLecturePrompt800(target))}>Hent genereringsprompt <span aria-hidden="true">↓</span></button>
      <button type="button" onClick={copyPrompt}>Kopiér prompt <span aria-hidden="true">↗</span></button>
      <button type="button" onClick={() => downloadLectureFile800('lecture-skabelon.json', lectureTemplate800(target), 'application/json')}>Hent JSON-skabelon <span aria-hidden="true">↓</span></button>
      <button type="button" onClick={() => downloadLectureFile800('medfluen-lecture.schema.json', lectureSchema800, 'application/json')}>Hent filformat <span aria-hidden="true">↓</span></button>
      <button type="button" disabled={!lecture || busy} onClick={() => { setPreview({ package: lectureTemplate800(target, true), media: new Map() }); setIndex(0); setRevealed(false); setError(''); setConfirmed(false); }}>Afprøv med et eksempel <span aria-hidden="true">→</span></button>
    </aside></div>
    {error && <p className="mf800-error" role="alert">{error}</p>}{status && <p role="status">{status}</p>}
    {preview && <section className="mf800-preview" aria-label="Forhåndsvisning af forelæsningskort"><h2>{preview.package.lecture.title}</h2><p className="mf800-preview-meta">{preview.package.sections.length} sektioner · {preview.package.cards.length} kort · {preview.media.size} billeder</p>
      <div className="mf800-preview-meta">{[...preview.package.sections].sort((a, b) => a.order - b.order).map(section => section.title).join(' → ')}</div>
      {preview.package.warnings.length > 0 && <details open><summary>Begrænsninger fra kilden ({preview.package.warnings.length})</summary><ul>{preview.package.warnings.map((warning, i) => <li key={i}>{warning}</li>)}</ul></details>}
      {mismatch && <label className="mf800-mismatch"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />Pakken angiver {preview.package.lecture.moduleId} / {preview.package.lecture.lectureId}. Gem i stedet under {moduleId} / {targetId} · {lecture.title}.</label>}
      {rows.length > 0 ? <><div className="mf800-preview-nav"><select aria-label="Forhåndsvis kort" value={Math.min(index, rows.length - 1)} onChange={event => { setIndex(Number(event.target.value)); setRevealed(false); }}>{rows.map((row, i) => <option key={row.cardId} value={i}>{i + 1}. {row.front.da}</option>)}</select><button type="button" className="mf800-preview-toggle" onClick={() => setRevealed(value => !value)}>{revealed ? 'Skjul svar' : 'Vis svar'}</button></div><LectureCard800 key={rows[index]?.cardId || rows[0].cardId} question={rows[index] || rows[0]} revealed={revealed} previewMedia={preview.media} readOnly /></> : <p>Vælg en forelæsning ovenfor for at gennemse og gemme kortene.</p>}
      <footer className="mf800-preview-footer"><label>Genimport<select value={mode} disabled={busy} onChange={event => setMode(event.target.value)}><option value="new">Tilføj kun nye kort</option><option value="update">Opdater eksisterende indhold</option></select></label><span className="mf800-preview-meta">{changes.added} nye · {changes.updated} ændrede · {Math.max(0, rows.length - changes.added - changes.updated)} bevares</span><button type="button" className="mf800-primary" data-confirm-lecture800 disabled={busy || !signedIn || !lecture || (mismatch && !confirmed) || (!changes.added && !changes.updated)} onClick={confirm}>{busy ? 'Gemmer…' : 'Gem forelæsningskort'}</button></footer>
      {!signedIn && <p className="mf800-preview-meta">Log ind for at gemme. Du kan stadig hente prompten og gennemse pakken.</p>}
    </section>}
  </section>;
}
