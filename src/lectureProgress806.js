import React, { useState } from 'react';
import { Dialog791 } from './StudyTools791';
import './lecture800.css';

const shortDate = at => new Date(at).toLocaleDateString('da-DK', { day: 'numeric', month: 'short' });
const fullDate = at => new Date(at).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' });
const calendarDate = at => new Date(at).toLocaleDateString('da-DK', { weekday: 'short', day: 'numeric', month: 'short' });
const Arrow = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;

export function LectureControls806({ progress, lectureTitle, onStartToday, onReset, onUndoReset }) {
  const [confirm, setConfirm] = useState(false);
  if (!progress) return null;
  return <>
    <div className="mf806-controls" aria-label="Forelæsningens træning">
      <div className="mf806-start-group"><button type="button" className="mf806-start" data-start-today disabled={!progress.todayCount} title={!progress.todayCount ? 'Ingen kort til repetition i dag' : undefined} onClick={onStartToday}>Start<Arrow /></button></div>
      <div className="mf806-reset-group"><button type="button" className="mf806-forget" data-forget-lecture disabled={!progress.total} onClick={() => setConfirm(true)}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" /></svg>Glem</button>
        {onUndoReset && <button type="button" className="mf806-undo" onClick={onUndoReset}>Fortryd nulstilling</button>}
      </div>
    </div>
    {confirm && <Dialog791 title="Glem forelæsningens progression?" className="mf806-confirm" onClose={() => setConfirm(false)}>
      <small>NULSTIL PROGRESSION</small><h2>Begynd forfra?</h2><p>Glem gennemgange og repetitionsplaner for de {progress.total} kort i <strong>{lectureTitle || 'denne forelæsning'}</strong>.</p><p>Kort og billeder bevares. Andre forelæsninger ændres ikke. Du kan fortryde nulstillingen her, indtil du forlader visningen.</p>
      <div><button type="button" data-cancel-forget onClick={() => setConfirm(false)}>Behold progression</button><button type="button" data-confirm-forget onClick={() => { setConfirm(false); onReset?.(); }}>Glem progression</button></div>
    </Dialog791>}
  </>;
}

export function LectureProgress806({ progress }) {
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('upcoming');
  if (!progress) return null;
  const history = view === 'history';
  const days = progress.days.filter(day => history ? day.offset >= -6 && day.offset <= 0 : day.offset >= 0 && day.offset < 14);
  const chosen = days.find(day => day.key === selected);
  const laterCount = (progress.laterCount || 0) + (progress.days.find(day => day.offset === 14)?.scheduled || 0);
  return <section className="mf806-progress" aria-labelledby="mf806-progress-heading">
    <header><h2 id="mf806-progress-heading">Repetition</h2>
      <p className="mf806-history-total"><span data-total-reviews>{progress.totalReviews} {progress.totalReviews === 1 ? 'gennemgang' : 'gennemgange'}</span><span>{progress.studiedCount} af {progress.total} kort gennemgået</span></p>
    </header>
    <div className="mf806-calendar-toolbar"><div role="group" aria-label="Vis repetitionsplan eller historik">
      <button type="button" data-repetition-view="upcoming" aria-pressed={!history} onClick={() => { setView('upcoming'); setSelected(null); }}>Kommende</button>
      <button type="button" data-repetition-view="history" aria-pressed={history} onClick={() => { setView('history'); setSelected(null); }}>Historik</button>
    </div><span>{history ? 'Seneste 7 dage' : 'Næste 14 dage'}</span></div>
    <div className="mf806-calendar" role="group" aria-label={history ? 'Gennemgange de seneste 7 dage' : 'Planlagte kort de næste 14 dage'}>
      {days.map(day => {
        const count = history ? day.reviews : day.scheduled;
        return <button type="button" key={day.key} data-repetition-day={day.key} data-offset={day.offset} data-selected={selected === day.key} data-empty={!count}
        aria-current={day.offset === 0 ? 'date' : undefined} aria-pressed={selected === day.key}
        aria-label={`${fullDate(day.at)}: ${day.reviews} ${day.reviews === 1 ? 'gennemgang' : 'gennemgange'}, ${day.scheduled} kort til repetition`}
        onClick={() => setSelected(day.key === selected ? null : day.key)}>
        <span className="mf806-calendar-date">{day.offset === 0 ? 'I dag' : calendarDate(day.at)}</span>
        <strong>{count || '—'}</strong><small>{count ? (history ? (count === 1 ? 'gennemgang' : 'gennemgange') : 'kort') : '\u00a0'}</small>
      </button>; })}
    </div>
    <div className="mf806-calendar-note" role="status" data-repetition-detail>
      {chosen ? <><span>{fullDate(chosen.at)}</span><span>{chosen.scheduled} kort til repetition · {chosen.reviews} {chosen.reviews === 1 ? 'gennemgang' : 'gennemgange'}</span></>
        : history ? <span>Gennemførte repetitioner, fordelt på dato.</span>
        : <><span>{progress.nextDue ? `Næste gentagelse efter i dag: ${shortDate(progress.nextDue)}` : 'Ingen kort planlagt efter i dag'}</span>{laterCount > 0 && <span>{laterCount} kort planlagt senere</span>}</>}
    </div>
  </section>;
}
