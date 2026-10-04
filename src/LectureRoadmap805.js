import React, { useEffect, useLayoutEffect, useRef } from 'react';
import './lecture800.css';

export function nextRoadmapSection805(sections, currentKey, completedKeys = []) {
  const index = sections.findIndex(section => section.key === currentKey);
  const ordered = [...sections.slice(index + 1), ...sections.slice(0, index + 1)];
  return ordered.find(section => section.count > 0 && !completedKeys.includes(section.key)) || null;
}

// Each straight road segment follows its row's natural height. Long titles and
// summaries can wrap without moving the road into the text or detaching nodes.
export function LectureRoadmap805({ sections = [], queue, currentKey, nextKey, animateFrom, onChoose, resumeKey, todayOnly, now = Date.now() }) {
  const completed = queue?.completedKeys || [];
  return <div className="mf805-route">
    <ol className="mf805-route-stops" aria-label="Forelæsningens faglige rækkefølge">{sections.map((section, index) => {
      const done = completed.includes(section.key);
      const active = currentKey === section.key;
      const recommended = nextKey === section.key && !done;
      const ids = active && queue ? queue.remaining : queue?.pendingBySection?.[section.key];
      const waiting = (ids || []).filter(id => (queue?.dueById?.[id] || 0) > now).length;
      const remaining = ids?.length ?? section.count;
      const touched = remaining < section.count || waiting > 0;
      const scheduled = todayOnly && !queue?.sections.some(item => item.key === section.key);
      const status = done ? 'Gennemgået' : scheduled ? 'Planlagt til senere' : waiting ? `${waiting} kort til repetition` : recommended ? 'Næste sektion' : active || touched ? 'I gang' : 'Ikke startet';
      const action = done ? 'Færdig' : touched || active ? 'Fortsæt' : 'Start sektion';
      const choose = () => { if (!done && section.count) onChoose?.(section.key, false); };
      return <li key={section.key} data-roadmap-section={section.key} data-section={section.id || section.key}
        data-state={done ? 'done' : scheduled ? 'scheduled' : recommended ? 'next' : active ? 'current' : touched ? 'started' : 'new'}
        data-arriving={recommended && Boolean(animateFrom)} data-celebrating={done && animateFrom === section.key}>
        {sections[index + 1] && <div className="mf805-route-connection" aria-hidden="true" data-route-from={section.key} data-route-to={sections[index + 1].key} data-filled={done} data-drawing={done && animateFrom === section.key}>
          <span className="mf805-route-track" />
          {done && <span className="mf805-route-fill" />}
        </div>}
        {done ? <span className="mf805-route-node" role="img" aria-label={`${section.title} er gennemgået`}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7" /></svg>
        </span> : <button type="button" className="mf805-route-node"
          aria-label={`Åbn sektionen ${section.title}`} aria-current={active ? 'step' : undefined}
          disabled={!section.count} onClick={choose}><span>{String(index + 1).padStart(2, '0')}</span></button>}
        <div className="mf805-route-copy">
          <small className="mf805-route-status">{status}</small>
          <h2 className="mf800-outline-title">{section.title}</h2>
          <small className="mf800-outline-count">{section.count} kort{!done && resumeKey === section.key && <span className="mf800-resume-marker">Her fortsætter du</span>}</small>
          {section.summary ? <p className="mf800-outline-summary">{section.summary}</p> : section.topics?.length > 0 && <ul className="mf800-story-topics">{section.topics.map((topic, i) => <li key={i}>{topic}</li>)}</ul>}
          <button type="button" className="mf805-route-action" aria-label={done ? `${section.title} er gennemgået` : `${touched || active ? 'Fortsæt' : 'Start'} sektionen ${section.title}`} disabled={done || !section.count} onClick={choose}>{action}{!done && <span aria-hidden="true">↗</span>}</button>
        </div>
      </li>;
    })}</ol>
  </div>;
}

export function LectureHandoff805({ section, sections = [], completedKeys = [], animateFrom, onReady, onCancel }) {
  const screen = useRef(null);
  const timer = useRef(null);
  const ready = useRef(onReady);
  ready.current = onReady;
  useLayoutEffect(() => { screen.current?.closest('main')?.scrollTo?.({ top: 0, behavior: 'instant' }); }, [section.key]);
  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    // 1.55s for the route/title, followed by the reader's 0.45s entrance.
    timer.current = window.setTimeout(() => ready.current?.(), reduced ? 0 : 1550);
    return () => window.clearTimeout(timer.current);
  }, [section.key]);
  const index = Math.max(0, sections.findIndex(item => item.key === section.key));
  return <section ref={screen} className="mf805-handoff" aria-label={`Åbner sektion ${index + 1}: ${section.title}`}>
    <button type="button" data-cancel-handoff className="mf800-back" onClick={() => { window.clearTimeout(timer.current); onCancel?.(); }}>← Sektioner</button>
    <div className="mf805-handoff-copy" role="status"><small>SEKTION {String(index + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}</small><h1>{section.title}</h1><p>{section.count} kort</p></div>
    <span className="mf805-handoff-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
    <ol className="mf805-handoff-route" aria-hidden="true">{sections.map((item, i) => <li key={item.key} data-section={item.key} data-drawing={item.key === animateFrom && completedKeys.includes(item.key)} data-state={item.key === section.key ? 'entering' : completedKeys.includes(item.key) ? 'done' : 'new'}><span>{completedKeys.includes(item.key) ? '✓' : String(i + 1).padStart(2, '0')}</span><i /></li>)}</ol>
  </section>;
}
