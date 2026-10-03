import React, { useLayoutEffect, useRef } from 'react';
import { LectureRoadmap805 } from './LectureRoadmap805';
import { LectureControls806, LectureProgress806 } from './lectureProgress806';
import './lecture800.css';

export function LectureSections800({ sections = [], queue, onStart, onContinue, onBack, resumeContext, onPrompt, forgottenCount = 0, reviewCount, lectureTitle, progress, onStartToday, onReset, onUndoReset }) {
  const screen = useRef(null);
  useLayoutEffect(() => { screen.current?.closest('main')?.scrollTo?.({ top: 0, behavior: 'instant' }); }, []);
  const count = sections.reduce((sum, section) => sum + section.count, 0);
  const keys = sections.map(section => section.key);
  const start = (chosen = keys, mode = 'guide') => onStart?.({ keys: chosen, mode });
  const resumeKey = resumeContext && !queue?.completedKeys?.includes(resumeContext.sectionKey) ? resumeContext.sectionKey : null;
  return <section ref={screen} className="mf800-story" aria-label="Forelæsningssektioner">
    {onBack && <button type="button" className="mf800-back" onClick={onBack}>← Tilbage til teorikort</button>}
    <header className="mf800-story-header">
      <small>TEORI / DIN GENNEMGANG</small>
      <h1>{lectureTitle || 'Forelæsningens sektioner'}</h1>
      <div className="mf800-story-meta-row"><p className="mf800-story-meta">{sections.length} {sections.length === 1 ? 'sektion' : 'sektioner'}<span aria-hidden="true"> / </span>{count} kort</p>{onPrompt && <button type="button" className="mf800-story-prompt" data-lecture-prompt onClick={onPrompt}>Upload-prompt <span aria-hidden="true">↗</span></button>}</div>
      <LectureControls806 progress={progress} lectureTitle={lectureTitle} onStartToday={onStartToday} onReset={onReset} onUndoReset={onUndoReset} />
      {!progress && <div className="mf800-story-actions"><button type="button" className="mf800-story-start" data-start-lecture disabled={!count} onClick={() => start()}>Start <span aria-hidden="true">↗</span></button></div>}
    </header>
    <LectureRoadmap805 sections={sections} queue={queue} resumeKey={resumeKey} onChoose={key => {
      if (queue?.completedKeys?.includes(key)) return;
      if (onContinue && queue?.sections?.some(section => section.key === key)) onContinue(key);
      else start([key]);
    }} />
    <footer className="mf800-story-footer" aria-label="Andre træningsformer">
      <button type="button" data-mode="review" disabled={!count || reviewCount === 0} onClick={() => start(keys, 'review')}>Repetition {reviewCount != null && <span>({reviewCount} kort)</span>} <span aria-hidden="true">↗</span></button>
      <button type="button" data-mode="forgotten" disabled={!forgottenCount} onClick={() => start(keys, 'forgotten')}>Øv glemte svarpunkter <span>({forgottenCount})</span></button>
    </footer>
    <LectureProgress806 progress={progress} />
  </section>;
}
