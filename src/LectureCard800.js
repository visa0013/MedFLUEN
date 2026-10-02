import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ReviewContent799 } from './ReviewContent799';
import { glossaryTokens800, plainLecture800, safeGlossaryUrl800 } from './lecture800-model';
import { readForgotten800, readLectureMedia800, writeForgotten800 } from './lecture800-storage';
import './lecture800.css';

function SourceRefs800({ refs = [], sources = [], onOpen }) {
  return <span className="mf800-sources">{refs.map((ref, index) => {
    const source = sources.find(item => item.id === ref.sourceId), label = `${source?.filename || ref.sourceId} · side ${ref.page}${ref.slideLabel ? ` (${ref.slideLabel})` : ''}`;
    return <React.Fragment key={`${ref.sourceId}:${ref.page}:${index}`}>{index > 0 && <span aria-hidden="true"> · </span>}{onOpen ? <button type="button" onClick={() => onOpen(ref, source)}>{label} ↗</button> : <span>{label}</span>}</React.Fragment>;
  })}</span>;
}
function GlossaryWord800({ label, term, sources }) {
  const [open, setOpen] = useState(false), [position, setPosition] = useState({ left: 16, top: 16 });
  const anchor = useRef(null), panel = useRef(null), timeout = useRef(null), id = useId();
  const links = (Array.isArray(term.sourceLinks) ? term.sourceLinks : []).map(link => ({ title: link?.title, url: safeGlossaryUrl800(link?.url) })).filter(link => link.url && typeof link.title === 'string' && link.title.trim());
  const show = () => { clearTimeout(timeout.current); setOpen(true); };
  const hideSoon = () => { timeout.current = setTimeout(() => setOpen(false), 180); };
  const focusSources = event => {
    if (event.key !== 'Tab' || event.shiftKey || !open) return;
    const firstLink = panel.current?.querySelector('a');
    if (firstLink) { event.preventDefault(); firstLink.focus(); }
  };
  useEffect(() => {
    if (!open) return undefined;
    const positionPanel = () => {
      const rect = anchor.current?.getBoundingClientRect(); if (!rect) return;
      const width = Math.min(440, window.innerWidth - 32), height = panel.current?.offsetHeight || 150;
      setPosition({ left: Math.max(16, Math.min(rect.left, window.innerWidth - width - 16)), top: Math.max(16, Math.min(rect.bottom + 10, window.innerHeight - height - 16)) });
    };
    const outside = event => { if (!anchor.current?.contains(event.target) && !panel.current?.contains(event.target)) setOpen(false); };
    const escape = event => { if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); } };
    positionPanel(); document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape); window.addEventListener('resize', positionPanel); window.addEventListener('scroll', positionPanel, true);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); window.removeEventListener('resize', positionPanel); window.removeEventListener('scroll', positionPanel, true); };
  }, [open]);
  useEffect(() => () => clearTimeout(timeout.current), []);
  return <><button type="button" ref={anchor} className="mf800-term" aria-expanded={open} aria-describedby={open ? id : undefined} onMouseEnter={show} onMouseLeave={hideSoon} onFocus={show} onBlur={hideSoon} onKeyDown={focusSources} onClick={show}>{label}</button>{open && createPortal(<span ref={panel} id={id} role="tooltip" className="mf800-definition" style={position} onMouseEnter={show} onMouseLeave={hideSoon} onFocus={show} onBlur={hideSoon}><strong>{term.term}</strong>{links.length > 0 && <small className="mf800-definition-origin">Supplerende definition · eksterne faglige kilder</small>}<span>{term.definition}</span>{term.sourceRefs?.length > 0 && <span className="mf800-definition-slides"><small>Fra forelæsningen</small><SourceRefs800 refs={term.sourceRefs} sources={sources} /></span>}{links.length > 0 && <span className="mf800-definition-links">{links.map((link, index) => <a key={`${link.url}:${index}`} href={link.url} target="_blank" rel="noopener noreferrer" onClick={event => event.stopPropagation()}>{link.title} ↗</a>)}</span>}</span>, document.body)}</>;
}
export function GlossaryText800({ text = '', glossary = [], sources = [] }) {
  const terms = new Map(glossary.map(term => [term.id, term]));
  const parts = []; let cursor = 0;
  for (const match of String(text).matchAll(glossaryTokens800)) {
    parts.push(String(text).slice(cursor, match.index));
    const term = terms.get(match[1]); parts.push(term ? <GlossaryWord800 key={match.index} term={term} label={match[2]} sources={sources} /> : match[2]); cursor = match.index + match[0].length;
  }
  parts.push(String(text).slice(cursor));
  return <span className="mf800-text">{parts}</span>;
}
function useImages800(content, scope, previewMedia) {
  const [state, setState] = useState({ content: null, scope: null, images: [], error: '' });
  useEffect(() => {
    let alive = true; const urls = [];
    setState({ content, scope, images: [], error: '' });
    if (!content.assets?.length) return undefined;
    Promise.all((content.assets || []).map(async asset => {
      const blob = previewMedia?.get(asset.id) || await readLectureMedia800(scope, asset.mediaKey);
      if (!blob) throw Error(`Billedet ${asset.path} er ikke tilgængeligt på denne enhed.`);
      const src = URL.createObjectURL(blob); urls.push(src); return { ...asset, src };
    })).then(images => { if (alive) setState({ content, scope, images, error: '' }); }, error => { if (alive) setState({ content, scope, images: [], error: error.message }); }).finally(() => { if (!alive) urls.forEach(url => URL.revokeObjectURL(url)); });
    return () => { alive = false; urls.forEach(url => URL.revokeObjectURL(url)); };
  }, [content, scope, previewMedia]);
  return state.content === content && state.scope === scope ? state : { images: [], error: '' };
}
export function LectureCard800({ question, revealed = false, scope, previewMedia, readOnly = false, forgottenOnly, forgotten, onForgottenChange, onRecallStateChange, onOpenSource }) {
  const content = question.lectureContent, card = content.card;
  const [saved, setSaved] = useState({ key: null, ids: [], loading: false }), [error, setError] = useState('');
  const pending = useRef(false), generation = useRef(0);
  const key = JSON.stringify([scope, question.id || question.cardId]);
  useEffect(() => {
    const request = ++generation.current; setError('');
    if (!scope || readOnly || forgotten !== undefined) { setSaved({ key, ids: [], loading: false }); return; }
    setSaved({ key, ids: [], loading: true });
    readForgotten800(scope).then(state => { if (request === generation.current) setSaved({ key, ids: state[question.id || question.cardId] || [], loading: false }); }, failure => { if (request === generation.current) { setError(failure.message); setSaved({ key, ids: [], loading: false }); } });
    return () => { generation.current++; };
  }, [key, scope, question.id, question.cardId, readOnly, forgotten]);
  const ids = forgotten !== undefined ? forgotten : saved.key === key ? saved.ids : [];
  const recallIds804 = (card.answerItems || []).filter(item => !forgottenOnly || forgottenOnly.includes(item.id)).map(item => item.id);
  const forgottenCount804 = ids.filter(id => recallIds804.includes(id)).length;
  useEffect(() => { onRecallStateChange?.({ questionId: question.id, forgottenCount: forgottenCount804, loading: saved.loading || Boolean(error) }); }, [question.id, forgottenCount804, saved.loading, error, onRecallStateChange]);
  async function mark(itemId) {
    if (pending.current || readOnly || saved.loading) return;
    const next = ids.includes(itemId) ? ids.filter(id => id !== itemId) : [...ids, itemId];
    if (onForgottenChange) { onForgottenChange(next); return; }
    if (!scope) return;
    const request = generation.current; pending.current = true; setError('');
    setSaved({ key, ids: next, loading: true });
    try { await writeForgotten800(scope, question, next); if (request === generation.current) setSaved({ key, ids: next, loading: false }); }
    catch (failure) { if (request === generation.current) { setSaved({ key, ids, loading: false }); setError(failure.message); } }
    finally { pending.current = false; }
  }
  const images = useImages800(content, scope, previewMedia);
  const text = value => <GlossaryText800 text={value} glossary={content.glossary} sources={content.sources} />;
  const plain = value => <span className="mf800-text">{plainLecture800(value)}</span>;
  const answerItems = (card.answerItems || []).filter(item => !forgottenOnly || forgottenOnly.includes(item.id));
  return <section className="mf800-card" data-revealed={revealed}>
    <div className="mf800-card-context"><span>{content.section.title}</span>{forgottenOnly && <small>Glemte svarpunkter</small>}</div>
    <ReviewContent799 text={card.question} questionContent={plain(card.question)} imageItems={images.images.filter(asset => asset.role === 'question' || revealed)}>
      {card.type === 'mcq' && <ol className="mf797-mcq-options">{card.options.map((option, index) => {
        const correct = revealed && card.correctOptionIds.includes(option.id);
        return <li key={option.id} data-correct={correct ? 'true' : undefined}><span className="mf797-option-key" aria-hidden="true">{index + 1}</span>{correct ? <strong className="mf797-option-body">{plain(option.text)}</strong> : <div className="mf797-option-body">{plain(option.text)}</div>}{correct && <span className="mf797-option-check" aria-label="Korrekt svar">✓</span>}</li>;
      })}</ol>}
      {revealed && card.type === 'recall-list' && <div className="mf800-recall"><p className="mf800-recall-label">{readOnly ? 'Svarpunkter' : 'Markér det, du ikke huskede'}</p><ul>{answerItems.map(item => <li key={item.id} data-forgotten={ids.includes(item.id)}>{readOnly ? <span className="mf800-recall-dot" aria-hidden="true" /> : <input type="checkbox" aria-label={`Glemt: ${item.text.replace(glossaryTokens800, '$2')}`} checked={ids.includes(item.id)} disabled={saved.loading || (!scope && !onForgottenChange)} onChange={() => mark(item.id)} />}<div>{text(item.text)}</div></li>)}</ul></div>}
      {revealed && card.type === 'basic' && <div className="mf800-basic-answer">{text(card.answer)}</div>}
      {revealed && card.explanation && <div className="mf800-explanation"><small>Forklaring</small><p>{text(card.explanation)}</p></div>}
      <footer className="mf800-card-source"><SourceRefs800 refs={card.sourceRefs} sources={content.sources} onOpen={onOpenSource} /></footer>
      {(error || images.error) && <p className="mf800-error" role="alert">{error || images.error}</p>}
    </ReviewContent799>
  </section>;
}
