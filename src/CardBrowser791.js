import React, { useEffect, useMemo, useState } from 'react';
import { Mark791 } from './Workspace791';
import { RichContent72 } from './Experience72';
import { McqCard797 } from './McqCard797';
import { LectureCard800 } from './LectureCard800';

const localized = (value, language) => typeof value === 'string' ? value : value?.[language] || value?.da || value?.en || '';
const defaultStatus = card => card?.state || 'new';

// Both the deck browser and lecture dialog use this workspace. Persistence and
// permissions remain with each caller; selecting or filtering never edits cards.
export function CardBrowser791({ questions = [], spacedData = {}, buriedCards = {}, lectures = [], language = 'da', title, contextTitle, selectedDate = '', query, onQuery, status, onStatus, selectedId, onSelectedId, onClose, onEdit, onCreate, onResetCard, onToggleHidden, onOpenLecture, getStatus = defaultStatus, textFor = localized, renderImage, renderDetailActions, toolbar, labels = {} }) {
  const tr = (da, en, ar) => language === 'ar' ? ar : language === 'en' ? en : da;
  const copy = {
    browse: tr('Gennemse kort', 'Browse cards', 'تصفح البطاقات'), deck: tr('Dæk', 'Deck', 'المجموعة'),
    searchCards: tr('Søg i kort', 'Search cards', 'البحث في البطاقات'), status: tr('Status', 'Status', 'الحالة'),
    allStatuses: tr('Alle statusser', 'All statuses', 'كل الحالات'), new: tr('Nye', 'New', 'جديدة'),
    learning: tr('I gang', 'Learning', 'قيد التعلم'), due: tr('Klar', 'Ready', 'جاهزة'),
    planned: tr('Planlagt', 'Scheduled', 'مجدولة'), hidden: tr('Skjult', 'Hidden', 'مخفية'),
    create: tr('Nyt kort', 'New card', 'بطاقة جديدة'), edit: tr('Redigér kort', 'Edit card', 'تعديل البطاقة'),
    close: tr('Luk', 'Close', 'إغلاق'), source: tr('Personligt kort', 'Personal card', 'بطاقة شخصية'),
    emptyDeck: tr('Ingen kort matcher dine valg.', 'No cards match your choices.', 'لا توجد بطاقات تطابق اختياراتك.'),
    selectCard: tr('Vælg et kort fra listen.', 'Select a card from the list.', 'اختر بطاقة من القائمة.'),
    image: tr('Billedkort', 'Image card', 'بطاقة صورة'), mcq: 'MCQ', basic: tr('Flashkort', 'Flashcard', 'بطاقة'),
    hide: tr('Skjul kort', 'Hide card', 'إخفاء البطاقة'), unhide: tr('Vis kort igen', 'Show card again', 'إظهار البطاقة'),
    resetCard: tr('Nulstil dette kort', 'Reset this card', 'إعادة تعيين البطاقة'),
    ...labels,
  };
  const [localQuery, setLocalQuery] = useState(''), [localStatus, setLocalStatus] = useState('all'), [localSelectedId, setLocalSelectedId] = useState(null);
  const search = query ?? localQuery, filter = status ?? localStatus, activeId = selectedId !== undefined ? selectedId : localSelectedId;
  const visible = useMemo(() => questions.filter(question => {
    const content = [question.question, question.back, question.explanation, question.category, ...(question.options || [])].map(value => textFor(value, language)).concat(question.tags || []).join(' ').toLocaleLowerCase();
    const state = buriedCards[question.id] ? 'hidden' : getStatus(spacedData[question.id]);
    return (!search.trim() || content.includes(search.trim().toLocaleLowerCase())) && (filter === 'all' || filter === state);
  }), [questions, spacedData, buriedCards, getStatus, textFor, language, search, filter]);
  const selected = visible.find(question => String(question.id) === String(activeId)) || visible[0] || null;
  const nextId = selected?.id ?? null;
  useEffect(() => {
    if (activeId === nextId) return;
    setLocalSelectedId(nextId); onSelectedId?.(nextId);
  }, [activeId, nextId, onSelectedId]);
  const type = selected?.cardType || (selected?.imageOcclusion ? 'image-occlusion' : Array.isArray(selected?.options) && selected.options.length >= 2 ? 'mcq' : 'basic');
  const lecture = selected ? lectures.find(item => item.id === selected.lectureId) : null;
  const selectedStatus = selected ? buriedCards[selected.id] ? 'hidden' : getStatus(spacedData[selected.id]) : null;
  const schedulerHidden = selected && getStatus(spacedData[selected.id]) === 'hidden';
  const richFor = field => textFor(selected?.richContent?.[field], language);
  const statusText = value => ({ new: copy.new, learning: copy.learning, due: copy.due, future: copy.planned, hidden: copy.hidden })[value] || value;
  function selectCard(question) { setLocalSelectedId(question.id); onSelectedId?.(question.id); }
  return <section className="flashcard71-browser" data-flashcard-browser71="true" data-card-browser791="true">
    <header><div><small>{selectedDate || contextTitle || copy.deck}</small><h2>{title || copy.browse}</h2></div><div className="flashcard71-browser-tools">
      <label><Mark791 name="search" size={14} /><input aria-label={copy.searchCards} value={search} onChange={event => { setLocalQuery(event.target.value); onQuery?.(event.target.value); }} placeholder={copy.searchCards} /></label>
      <select aria-label={copy.status} value={filter} onChange={event => { setLocalStatus(event.target.value); onStatus?.(event.target.value); }}>{[['all', copy.allStatuses], ['new', copy.new], ['learning', copy.learning], ['due', copy.due], ['future', copy.planned], ['hidden', copy.hidden]].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
      {onCreate && <button type="button" data-action="create-card" className="flashcard71-primary" onClick={onCreate}>+ {copy.create}</button>}
      {onClose && <button type="button" className="flashcard71-icon" onClick={onClose} aria-label={copy.close}><Mark791 name="close" size={17} /></button>}
    </div></header>
    {toolbar && <div className="mf791-card-browser-toolbar">{toolbar}</div>}
    <div className="flashcard71-browser-grid">
      <div className="flashcard71-card-list" aria-label={tr('Kortliste', 'Card list', 'قائمة البطاقات')}>{visible.length ? visible.map(question => {
        const cardState = buriedCards[question.id] ? 'hidden' : getStatus(spacedData[question.id]);
        return <button key={question.id} type="button" data-card-id={question.id} data-active={selected?.id === question.id ? 'true' : 'false'} aria-pressed={selected?.id === question.id} onClick={() => selectCard(question)}><strong>{textFor(question.question, language) || '—'}</strong><small>{question.lectureId || copy.source} · {textFor(question.category, language)} · {statusText(cardState)}</small></button>;
      }) : <div className="flashcard71-empty" role="status">{copy.emptyDeck}</div>}</div>
      <article className="flashcard71-card-detail">{selected ? <>
        <div className="flashcard71-detail-actions"><span>{type === 'mcq' ? copy.mcq : type === 'image-occlusion' ? copy.image : copy.basic}</span><span data-card-status={selectedStatus}>{statusText(selectedStatus)}</span>{onEdit && !selected.lectureContent && <button type="button" data-action="edit-card" onClick={() => onEdit(selected)}>{copy.edit}</button>}</div>
        {selected.imageOcclusion && renderImage?.(selected)}
        {selected.lectureContent ? <LectureCard800 key={selected.id} question={selected} revealed readOnly scope={selected.lectureScope800} /> : type === 'mcq' ? <McqCard797 question={selected} language={language} revealed /> : <>
          {richFor('front') ? <div className="mf791-card-heading" role="heading" aria-level="3"><RichContent72 html={richFor('front')} text={textFor(selected.question, language)} cloze={type === 'cloze'} revealed /></div> : <h3>{textFor(selected.question, language)}</h3>}<div className="flashcard71-answer-line" />
          <RichContent72 html={richFor('back') || richFor('explanation')} text={textFor(selected.back || selected.explanation, language)} />
        </>}
        {schedulerHidden && <small className="mf791-scheduler-hidden">{tr('Kortet er skjult i repetitionsplanen.', 'This card is hidden in the review schedule.', 'هذه البطاقة مخفية في جدول المراجعة.')}</small>}
        <div className="flashcard71-detail-actions">{onToggleHidden && (!schedulerHidden || buriedCards[selected.id]) && <button type="button" data-action="toggle-hidden" onClick={() => onToggleHidden(selected)}>{schedulerHidden ? tr('Fjern manuel skjulning', 'Clear manual hiding', 'إلغاء الإخفاء اليدوي') : buriedCards[selected.id] ? copy.unhide : copy.hide}</button>}{onResetCard && spacedData[selected.id] && <button type="button" data-action="reset-card" onClick={() => onResetCard(selected)}>{copy.resetCard}</button>}{renderDetailActions?.(selected)}</div>
        {lecture && onOpenLecture && <button type="button" className="flashcard71-text-action" onClick={() => onOpenLecture(lecture, selected.moduleId)}>{tr('Åbn', 'Open', 'فتح')} {lecture.id}</button>}
      </> : <div className="flashcard71-empty">{copy.selectCard}</div>}</article>
    </div>
  </section>;
}
