import React from 'react';
import './lecture800.css';

export function LectureSections800({ sections = [], onStart, onBack, onContinue, resumeContext, onPrompt, forgottenCount = 0, reviewCount, lectureTitle }) {
  const count = sections.reduce((sum, section) => sum + section.count, 0);
  const keys = sections.map(section => section.key);
  const start = (chosen = keys, mode = 'guide') => onStart?.({ keys: chosen, mode });
  const resumeTitle = resumeContext?.waiting ? 'Åbn dit roadmap' : resumeContext?.pendingTransition ? 'Vælg næste sektion' : `Fortsæt i ${resumeContext?.sectionTitle}`;
  const resumeDetail = resumeContext?.waiting ? `${resumeContext.sectionTitle} · venter på repetition` : resumeContext?.pendingTransition ? `${resumeContext.sectionTitle} er gennemgået` : `Kort ${resumeContext?.position} af ${resumeContext?.total}`;
  return <section className="mf800-story" aria-label="Forelæsningssektioner">
    {onBack && <button type="button" className="mf800-back" onClick={onBack}>← Tilbage til teorikort</button>}
    <header className="mf800-story-header">
      <small>TEORI / DIN GENNEMGANG</small>
      <h1>{lectureTitle || 'Forelæsningens sektioner'}</h1>
      <div className="mf800-story-meta-row"><p className="mf800-story-meta">{sections.length} {sections.length === 1 ? 'sektion' : 'sektioner'}<span aria-hidden="true"> / </span>{count} kort</p>{onPrompt && <button type="button" className="mf800-story-prompt" data-lecture-prompt onClick={onPrompt}>Upload-prompt <span aria-hidden="true">↗</span></button>}</div>
      <p className="mf800-story-intro">{sections.length > 1 ? 'Følg den faglige rækkefølge fra første til sidste sektion — eller begynd dér, hvor du vil arbejde videre.' : 'Se, hvad du skal igennem, og begynd med kortene nedenfor.'}</p>
      <div className="mf800-story-actions"><button type="button" className="mf800-story-start" data-start-lecture disabled={!count} onClick={() => start()}>Start hele forløbet <span aria-hidden="true">↗</span></button>{onContinue && resumeContext && <button type="button" className="mf800-story-continue" data-resume-lecture onClick={onContinue}><small>{resumeContext.mode === 'review' ? 'DIN REPETITION' : resumeContext.mode === 'forgotten' ? 'DINE GLEMTE SVARPUNKTER' : 'DIT SENESTE FORLØB'}</small><strong>{resumeTitle} <span aria-hidden="true">→</span></strong><span>{resumeDetail}</span></button>}</div>
    </header>
    <ol className="mf800-story-sections">{sections.map((section, index) => <li key={section.key} data-section={section.id || section.key}>
      <span className="mf800-story-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <div className="mf800-story-section-content">
        <header><h2 className="mf800-outline-title">{section.title}</h2><button type="button" className="mf800-section-start" aria-label={`Start sektionen ${section.title}`} disabled={!section.count} onClick={() => start([section.key])}>Start <span aria-hidden="true">↗</span></button></header>
        <small className="mf800-outline-count">{section.count} kort{onContinue && resumeContext?.sectionKey === section.key && <span className="mf800-resume-marker">Her fortsætter du</span>}</small>
        {section.summary ? <p className="mf800-outline-summary">{section.summary}</p> : section.topics?.length > 0 && <ul className="mf800-story-topics">{section.topics.map((topic, i) => <li key={i}>{topic}</li>)}</ul>}
      </div>
    </li>)}</ol>
    <footer className="mf800-story-footer" aria-label="Andre træningsformer">
      <button type="button" data-mode="review" disabled={!count || reviewCount === 0} onClick={() => start(keys, 'review')}>Repetition {reviewCount != null && <span>({reviewCount} kort)</span>} <span aria-hidden="true">↗</span></button>
      <button type="button" data-mode="forgotten" disabled={!forgottenCount} onClick={() => start(keys, 'forgotten')}>Øv glemte svarpunkter <span>({forgottenCount})</span></button>
    </footer>
  </section>;
}
