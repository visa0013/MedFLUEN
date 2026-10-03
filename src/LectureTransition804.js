import React, { useEffect, useRef } from 'react';
import { LectureRoadmap805, nextRoadmapSection805 } from './LectureRoadmap805';
import { LectureControls806, LectureProgress806 } from './lectureProgress806';
import './lecture800.css';

export function LectureTransition804({ sections = [], queue, lectureTitle, animateFrom, now = Date.now(), onChoose, onExit, onUndo, todayOnly, progress, onStartToday, onReset, onUndoReset }) {
  const heading = useRef(null);
  const current = queue?.sections[queue.sectionIndex];
  const completed = sections.filter(section => queue?.completedKeys?.includes(section.key)).length;
  const currentDone = Boolean(current && queue?.completedKeys?.includes(current.key));
  const runSections = todayOnly ? sections.filter(section => queue.sections.some(item => item.key === section.key)) : sections;
  const next = currentDone ? nextRoadmapSection805(runSections, current.key, queue.completedKeys) : null;
  useEffect(() => { heading.current?.closest('main')?.scrollTo?.({ top: 0, behavior: 'instant' }); heading.current?.focus({ preventScroll: true }); }, [current?.key]);
  return <section className="mf804-roadmap" aria-labelledby="mf804-roadmap-title">
    <nav className="mf804-roadmap-nav"><button type="button" onClick={onExit}>← Tilbage til teorikort</button>{onUndo && <button type="button" onClick={onUndo}>Fortryd sidste svar</button>}</nav>
    <header className="mf804-roadmap-header">
      <div><small>TEORI / DIT ROADMAP</small><h1 id="mf804-roadmap-title" ref={heading} tabIndex={-1}>{lectureTitle || 'Forelæsningens sektioner'}</h1><p role="status">{currentDone ? `${current.title} er gennemgået.` : 'Vælg en sektion på ruten.'}</p></div>
      <div className="mf804-roadmap-progress"><strong>{completed}<span> / {sections.length}</span></strong><p>sektioner gennemgået</p><div role="progressbar" aria-label="Sektioner gennemgået" aria-valuemin={0} aria-valuemax={sections.length} aria-valuenow={completed}><i style={{ width: `${sections.length ? completed / sections.length * 100 : 0}%` }}/></div></div>
    </header>
    <LectureControls806 progress={progress} lectureTitle={lectureTitle} onStartToday={onStartToday} onReset={onReset} onUndoReset={onUndoReset} />
    {next && <div className="mf805-next"><div><small>NÆSTE PÅ RUTEN</small><strong>{next.title}</strong></div><button type="button" data-next-section onClick={() => onChoose?.(next.key, false)}>Start næste sektion <span aria-hidden="true">→</span></button></div>}
    <LectureRoadmap805 sections={sections} queue={queue} todayOnly={todayOnly} currentKey={current?.key} nextKey={next?.key} animateFrom={currentDone ? animateFrom : null} onChoose={onChoose} now={now} />
    {completed === sections.length && sections.length > 0 && <p className="mf804-roadmap-finished">Alle sektioner er gennemgået. Nye gentagelser følger repetitionsplanen.</p>}
    {todayOnly && !next && currentDone && completed < sections.length && <p className="mf804-roadmap-finished">Dagens kort er gennemgået. Øvrige kort følger repetitionsplanen; du kan også vælge at øve en sektion nu.</p>}
    <LectureProgress806 progress={progress} />
  </section>;
}
