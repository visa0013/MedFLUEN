import React, { useEffect, useRef } from 'react';
import './lecture800.css';

export function LectureTransition804({ sections = [], queue, lectureTitle, now = Date.now(), onChoose, onExit, onUndo, onRepeatNow }) {
  const heading = useRef(null);
  const current = queue?.sections[queue.sectionIndex];
  const completed = sections.filter(section => queue?.completedKeys?.includes(section.key)).length;
  const pending = queue?.remaining || [];
  const due = pending.length ? Math.min(...pending.map(id => queue.dueById?.[id] || now)) : null;
  const seconds = due > now ? Math.ceil((due - now) / 1000) : 0;
  const countdown = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  useEffect(() => { heading.current?.focus(); }, [current?.key]);
  return <section className="mf804-roadmap" aria-labelledby="mf804-roadmap-title">
    <nav className="mf804-roadmap-nav"><button type="button" onClick={onExit}>← Tilbage til teorikort</button>{onUndo && <button type="button" onClick={onUndo}>Fortryd sidste svar</button>}</nav>
    <header className="mf804-roadmap-header">
      <div><small>TEORI / DIT FORLØB</small><h1 id="mf804-roadmap-title" ref={heading} tabIndex={-1}>{lectureTitle || 'Forelæsningens sektioner'}</h1><p>Vælg, hvor du vil fortsætte.</p></div>
      <div className="mf804-roadmap-progress"><strong>{completed}<span> / {sections.length}</span></strong><p>sektioner gennemgået</p><div role="progressbar" aria-label="Sektioner gennemgået" aria-valuemin={0} aria-valuemax={sections.length} aria-valuenow={completed}><i style={{ width: `${sections.length ? completed / sections.length * 100 : 0}%` }}/></div></div>
    </header>
    {seconds > 0 && <div className="mf804-repeat-status"><span className="mf804-repeat-pulse" aria-hidden="true"/><div><strong>{current?.title}</strong><span>Næste repetition om <b>{countdown}</b> · Du kan arbejde videre i en anden sektion.</span></div>{onRepeatNow && <button type="button" data-repeat-now onClick={onRepeatNow}>Øv kortet nu <span aria-hidden="true">↗</span></button>}</div>}
    <ol className="mf804-roadmap-sections">{sections.map((section, index) => {
      const done = queue?.completedKeys?.includes(section.key);
      const active = current?.key === section.key;
      const ids = active ? pending : queue?.pendingBySection?.[section.key];
      const waiting = (ids || []).filter(id => (queue?.dueById?.[id] || 0) > now).length;
      const remaining = ids?.length ?? section.count;
      const touched = remaining < section.count || waiting > 0;
      const status = done ? 'Gennemgået' : waiting ? `${waiting} kort til repetition` : touched ? 'I gang' : 'Ikke startet';
      return <li key={section.key} data-roadmap-section={section.key} data-state={done ? 'done' : active ? 'current' : touched ? 'started' : 'new'}>
        <span className="mf804-roadmap-node" aria-hidden="true">{done ? '✓' : String(index + 1).padStart(2, '0')}</span>
        <div className="mf804-roadmap-section-copy"><div className="mf804-roadmap-section-meta"><span>{section.count} kort</span><span>{status}</span></div><h2>{section.title}</h2>{section.summary && <p>{section.summary}</p>}<button type="button" aria-label={`${done ? 'Gentag' : touched || active ? 'Fortsæt' : 'Start'} sektionen ${section.title}`} disabled={!section.count} onClick={() => onChoose?.(section.key, Boolean(done))}>{done ? 'Gentag sektion' : touched || active ? 'Fortsæt' : 'Start sektion'} <span aria-hidden="true">↗</span></button></div>
      </li>;
    })}</ol>
    {completed === sections.length && sections.length > 0 && <p className="mf804-roadmap-finished">Alle sektioner er gennemgået. Du kan gentage en sektion eller vende tilbage til teorikort.</p>}
  </section>;
}
