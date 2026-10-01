import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Mark791 } from './Workspace791';
import { RichContent72 } from './Experience72';
import { McqCard797 } from './McqCard797';
import { LectureCard800 } from './LectureCard800';
import { plainLecture800, sectionKey800 } from './lecture800-model';
import { Dialog791 } from './StudyTools791';
import './CardBrowser791.css';

const localized = (value, language) => typeof value === 'string' ? value : value?.[language] || value?.da || value?.en || '';
const defaultStatus = card => card?.state || 'new';

function browserSections(questions) {
  const sources = new Map(), sections = new Map(), other = [];
  for (const question of questions) {
    const content = question.lectureContent;
    if (!content) { other.push(question); continue; }
    const source = JSON.stringify([content.target.moduleId, content.target.lectureId, content.packageId]);
    if (!sources.has(source)) sources.set(source, sources.size);
    const key = sectionKey800(content);
    if (!sections.has(key)) sections.set(key, { key, section: content.section, lectureTitle: content.target.title, sourceOrder: sources.get(source), questions: [] });
    sections.get(key).questions.push(question);
  }
  const ordered = [...sections.values()].sort((a, b) => a.sourceOrder - b.sourceOrder || a.section.order - b.section.order || a.key.localeCompare(b.key));
  for (const group of ordered) group.questions.sort((a, b) => a.lectureContent.card.order - b.lectureContent.card.order || String(a.id).localeCompare(String(b.id)));
  if (other.length) ordered.push({ key: 'other', questions: other });
  return ordered;
}

// Both the deck browser and lecture dialog use this workspace. Persistence and
// permissions remain with each caller; selecting or filtering never edits cards.
export function CardBrowser791({ questions = [], spacedData = {}, buriedCards = {}, lectures = [], language = 'da', title, contextTitle, selectedDate = '', query, onQuery, status, onStatus, selectedId, onSelectedId, onClose, onEdit, onCreate, onDiscard, discardCount = questions.length, onRestore, restoreCount = 0, onResetCard, onToggleHidden, onOpenLecture, getStatus = defaultStatus, textFor = localized, renderImage, renderDetailActions, toolbar, labels = {} }) {
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
    otherCards: tr('Andre kort', 'Other cards', 'بطاقات أخرى'), cards: tr('kort', 'cards', 'بطاقات'),
    recall: tr('Svarpunkter', 'Recall list', 'قائمة إجابات'), previousCard: tr('Forrige kort', 'Previous card', 'البطاقة السابقة'), nextCard: tr('Næste kort', 'Next card', 'البطاقة التالية'),
    ...labels,
  };
  const [localQuery, setLocalQuery] = useState(''), [localStatus, setLocalStatus] = useState('all'), [localSelectedId, setLocalSelectedId] = useState(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false), [trashBusy, setTrashBusy] = useState(false), [trashError, setTrashError] = useState('');
  const trashLock = useRef(false);
  const discardLabel = tr('Kassér alle kort i dette dæk', 'Discard all cards in this deck', 'استبعاد كل بطاقات المجموعة');
  function closeDiscard() { if (!trashLock.current) { setConfirmDiscard(false); setTrashError(''); } }
  async function changeTrash(action) {
    if (trashLock.current) return;
    trashLock.current = true; setTrashBusy(true); setTrashError('');
    try {
      const result = await action();
      if (result?.ok !== true) throw Error(result?.error || tr('Ændringen kunne ikke gemmes.', 'Could not save this change.', 'تعذر حفظ التغيير.'));
      setConfirmDiscard(false);
    } catch (error) { setTrashError(error.message); }
    finally { trashLock.current = false; setTrashBusy(false); }
  }
  const search = query ?? localQuery, filter = status ?? localStatus, activeId = selectedId !== undefined ? selectedId : localSelectedId;
  const sections = useMemo(() => browserSections(questions), [questions]);
  const structured = sections.some(group => group.section);
  const visibleSections = useMemo(() => sections.map(group => ({ ...group, visible: group.questions.filter(question => {
    const lecture = question.lectureContent;
    const lectureText = lecture ? [lecture.target.title, lecture.section.title, lecture.section.summary, lecture.card.question, lecture.card.answer, lecture.card.explanation, ...(lecture.card.answerItems || []).map(item => item.text), ...(lecture.card.options || []).map(option => option.text)].map(value => plainLecture800(value || '')) : [];
    const content = [question.question, question.back, question.explanation, question.category, ...(question.options || [])].map(value => textFor(value, language)).concat(question.tags || [], lectureText).join(' ').toLocaleLowerCase();
    const state = buriedCards[question.id] ? 'hidden' : getStatus(spacedData[question.id]);
    return (!search.trim() || content.includes(search.trim().toLocaleLowerCase())) && (filter === 'all' || filter === state);
  }) })).filter(group => group.visible.length), [sections, spacedData, buriedCards, getStatus, textFor, language, search, filter]);
  const visible = visibleSections.flatMap(group => group.visible);
  const selected = visible.find(question => String(question.id) === String(activeId)) || visible[0] || null;
  const selectedGroup = sections.find(group => group.questions.includes(selected));
  const selectedIndex = visible.indexOf(selected);
  const nextId = selected?.id ?? null;
  useEffect(() => {
    if (activeId === nextId) return;
    setLocalSelectedId(nextId); onSelectedId?.(nextId);
  }, [activeId, nextId, onSelectedId]);
  const type = selected?.lectureContent?.card.type || selected?.cardType || (selected?.imageOcclusion ? 'image-occlusion' : Array.isArray(selected?.options) && selected.options.length >= 2 ? 'mcq' : 'basic');
  const lecture = selected ? lectures.find(item => item.id === selected.lectureId) : null;
  const selectedStatus = selected ? buriedCards[selected.id] ? 'hidden' : getStatus(spacedData[selected.id]) : null;
  const schedulerHidden = selected && getStatus(spacedData[selected.id]) === 'hidden';
  const richFor = field => textFor(selected?.richContent?.[field], language);
  const statusText = value => ({ new: copy.new, learning: copy.learning, due: copy.due, future: copy.planned, hidden: copy.hidden })[value] || value;
  const typeText = value => value === 'mcq' ? copy.mcq : value === 'recall-list' ? copy.recall : value === 'image-occlusion' ? copy.image : copy.basic;
  function selectCard(question) { setLocalSelectedId(question.id); onSelectedId?.(question.id); }
  function cardRow(question, group) {
    const cardState = buriedCards[question.id] ? 'hidden' : getStatus(spacedData[question.id]);
    return <button key={question.id} className="mf791-card-list-row" type="button" data-card-id={question.id} data-active={selected?.id === question.id ? 'true' : 'false'} aria-pressed={selected?.id === question.id} onClick={() => selectCard(question)}>
      {group?.section && <span className="mf791-section-card-number" aria-hidden="true">{group.questions.indexOf(question) + 1}</span>}
      <span className="mf791-card-list-copy"><strong>{textFor(question.question, language) || plainLecture800(question.lectureContent?.card.question || '') || '—'}</strong><small>{question.lectureContent ? typeText(question.lectureContent.card.type) : `${question.lectureId || copy.source} · ${textFor(question.category, language)}`} · {statusText(cardState)}</small></span>
    </button>;
  }
  return <section className="flashcard71-browser" data-flashcard-browser71="true" data-card-browser791="true">
    <header><div><small>{selectedDate || copy.deck}</small><h2>{title || copy.browse}</h2></div><div className="flashcard71-browser-tools" role="toolbar" aria-label={tr('Kortoversigtens værktøjer', 'Card browser tools', 'أدوات البطاقات')}>
      <label className="mf803-browser-search"><Mark791 name="search" size={17} /><input type="search" aria-label={copy.searchCards} value={search} onChange={event => { setLocalQuery(event.target.value); onQuery?.(event.target.value); }} placeholder={copy.searchCards} /></label>
      <span className="mf803-browser-filter"><select aria-label={copy.status} value={filter} onChange={event => { setLocalStatus(event.target.value); onStatus?.(event.target.value); }}>{[['all', copy.allStatuses], ['new', copy.new], ['learning', copy.learning], ['due', copy.due], ['future', copy.planned], ['hidden', copy.hidden]].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><span aria-hidden="true">⌄</span></span>
      {onCreate && <button type="button" data-action="create-card" className="mf803-browser-create" onClick={onCreate}><Mark791 name="plus" size={16} />{copy.create}</button>}
      {onDiscard && <button type="button" data-action="discard-deck" className="mf803-browser-trash" disabled={!discardCount || trashBusy} title={discardLabel} aria-label={discardLabel} onClick={() => { setTrashError(''); setConfirmDiscard(true); }}><Mark791 name="trash" size={19} /></button>}
      {onClose && <button type="button" className="mf803-browser-close" onClick={onClose} aria-label={copy.close} title={copy.close}><Mark791 name="close" size={19} /></button>}
    </div></header>
    {restoreCount > 0 && onRestore && <div className="mf803-trash-recovery"><span>{restoreCount} {tr('kort kasseret i dette dæk', 'cards discarded in this deck', 'بطاقات مستبعدة في المجموعة')}</span><button type="button" data-action="restore-deck" disabled={trashBusy} onClick={() => changeTrash(onRestore)}>{tr('Gendan kort', 'Restore cards', 'استعادة البطاقات')} <span aria-hidden="true">↶</span></button></div>}
    {trashError && !confirmDiscard && <p className="mf803-trash-error" role="alert">{trashError}</p>}
    {confirmDiscard && <Dialog791 title={discardLabel} onClose={closeDiscard} className="mf803-trash-dialog">
      <small>{tr('DET VALGTE DÆK', 'SELECTED DECK', 'المجموعة المختارة')}</small>
      <h2>{tr('Kassér alle kort?', 'Discard all cards?', 'استبعاد كل البطاقات؟')}</h2>
      <p><strong>{contextTitle || copy.deck}</strong> · {discardCount} {copy.cards}</p>
      <p>{tr('Alle kort i dette dæk fjernes fra din træning, også kort uden for det aktuelle filter. Du kan gendanne dem her. Billeder og fremskridt bevares.', 'All cards in this deck are removed from your training, including cards outside the current filter. Restore them here at any time. Images and progress are preserved.', 'تُستبعد جميع بطاقات المجموعة من تدريبك، حتى خارج الفلتر الحالي. يمكنك استعادتها هنا مع الاحتفاظ بالصور والتقدم.')}</p>
      {trashError && <p role="alert" className="mf803-trash-error">{trashError}</p>}
      <div className="mf803-trash-dialog-actions"><button type="button" data-action="cancel-discard" disabled={trashBusy} onClick={closeDiscard}>{tr('Annuller', 'Cancel', 'إلغاء')}</button><button type="button" data-action="confirm-discard" disabled={trashBusy} onClick={() => changeTrash(onDiscard)}><Mark791 name="trash" size={17} />{trashBusy ? tr('Gemmer…', 'Saving…', 'جارٍ الحفظ…') : tr(`Kassér ${discardCount} kort`, `Discard ${discardCount} cards`, `استبعاد ${discardCount} بطاقة`)}</button></div>
    </Dialog791>}
    {toolbar && <div className="mf791-card-browser-toolbar">{toolbar}</div>}
    <div className="flashcard71-browser-grid">
      <div className="flashcard71-card-list" aria-label={tr('Kortliste', 'Card list', 'قائمة البطاقات')}>{visible.length ? structured ? visibleSections.map(group => <section key={group.key} className="mf791-card-section" data-browser-section={group.key} role="group" aria-label={group.section?.title || copy.otherCards}>
        <div className="mf791-card-section-heading"><div><h3>{group.section?.title || copy.otherCards}</h3>{group.lectureTitle && group.lectureTitle !== contextTitle && <small className="mf791-card-section-source">{group.lectureTitle}</small>}</div><span className="mf791-section-card-count">{group.visible.length === group.questions.length ? group.questions.length : `${group.visible.length} / ${group.questions.length}`} {copy.cards}</span></div>
        {group.visible.map(question => cardRow(question, group))}
      </section>) : visible.map(question => cardRow(question)) : <div className="flashcard71-empty" role="status">{copy.emptyDeck}</div>}</div>
      <article className="flashcard71-card-detail" data-structured={selected?.lectureContent ? 'true' : undefined}>{selected ? <>
        {selected.lectureContent && <div className="mf791-reading-context"><div><small>{selected.lectureContent.target.title}</small><span>{tr(`Kort ${selectedGroup.questions.indexOf(selected) + 1} af ${selectedGroup.questions.length}`, `Card ${selectedGroup.questions.indexOf(selected) + 1} of ${selectedGroup.questions.length}`, `البطاقة ${selectedGroup.questions.indexOf(selected) + 1} من ${selectedGroup.questions.length}`)}</span></div><nav aria-label={tr('Læs kort', 'Read cards', 'قراءة البطاقات')}>
          <button type="button" aria-label={copy.previousCard} title={copy.previousCard} disabled={selectedIndex === 0} onClick={() => selectCard(visible[selectedIndex - 1])}><span aria-hidden="true">{language === 'ar' ? '→' : '←'}</span></button>
          <button type="button" aria-label={copy.nextCard} title={copy.nextCard} disabled={selectedIndex === visible.length - 1} onClick={() => selectCard(visible[selectedIndex + 1])}><span aria-hidden="true">{language === 'ar' ? '←' : '→'}</span></button>
        </nav></div>}
        <div className="flashcard71-detail-actions mf791-card-detail-meta"><span>{typeText(type)}</span><span data-card-status={selectedStatus}>{statusText(selectedStatus)}</span>{onEdit && !selected.lectureContent && <button type="button" data-action="edit-card" onClick={() => onEdit(selected)}>{copy.edit}</button>}</div>
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
