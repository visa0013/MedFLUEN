import React, { useEffect, useRef, useState } from 'react';
import { Mark791 } from './Workspace791';
import './apkgExam792.css';
import './trainingTimer793.css';

export function TrainingIndex791({ tree, selected, onSelect, onStart, onCustomize, onBrowse, onCreate, onCreateDeck, onImport, deckCreationDisabled = false, onMaterials, onNotes, sessionCount = 0, language = 'da', sectionControls }) {
  const en = language === 'en', ar = language === 'ar';
  const tr = (da, eng, arab) => ar ? arab : en ? eng : da;
  const [query, setQuery] = useState('');
  const [closed, setClosed] = useState(() => new Set((tree.children || []).slice(1).map(node => node.id)));
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const draftInput = useRef(null), draftRef = useRef(null), saveLock = useRef(false), createButton = useRef(null);
  const compare = new Intl.Collator(ar ? 'ar' : en ? 'en' : 'da', { numeric: true, sensitivity: 'base' });
  const personal=node=>String(node.id||'').startsWith('personal:');
  const ordered = nodes => [...nodes.filter(node=>!personal(node)),...nodes.filter(personal).sort((a,b)=>compare.compare(a.label||'',b.label||''))];
  const openMaterials = onMaterials || onNotes;

  useEffect(() => {
    function openBranch(node, next) {
      const contains = node.id === selected?.id || (node.children || []).some(child => openBranch(child, next));
      if (contains) next.delete(node.id);
      return contains;
    }
    setClosed(previous => { const next = new Set(previous); openBranch(tree, next); return next; });
  }, [selected?.id, tree]);
  useEffect(() => { if (draft?.id) draftInput.current?.focus(); }, [draft?.id]);

  const match = node => `${node.code || ''} ${node.label}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()) || (node.children || []).some(match);
  function toggle(id) {
    setClosed(previous => { const next = new Set(previous); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }
  function beginDeck() {
    if (draftRef.current) { draftInput.current?.focus(); return; }
    const parent = selected || tree;
    const uid = window.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    const next = { id: `personal:${uid}`, parent: parent.id, name: '' };
    draftRef.current = next; setDraft(next); setError(''); setQuery('');
    setClosed(previous => { const nextClosed = new Set(previous); nextClosed.delete(parent.id); return nextClosed; });
  }
  function cancelDeck() {
    if (saveLock.current) return;
    draftRef.current = null; setDraft(null); setError(''); createButton.current?.focus();
  }
  async function finishDeck(fromBlur = false) {
    const current = draftRef.current;
    if (!current || saveLock.current) return;
    const name = current.name.trim();
    if (!name) {
      if (fromBlur) cancelDeck();
      else setError(tr('Skriv et navn på dækket.', 'Enter a deck name.', 'أدخل اسم المجموعة.'));
      return;
    }
    saveLock.current = true; setSaving(true); setError('');
    try {
      const result = await onCreateDeck({ type: 'create', id: current.id, parent: current.parent, name });
      if (result?.ok === false) throw new Error(result.error || 'save');
      draftRef.current = null; setDraft(null);
    } catch (failure) {
      const messages = {
        name: tr('Vælg et navn, der ikke allerede bruges på dette niveau.', 'Choose a unique name at this level.', 'اختر اسماً غير مستخدم في هذا المستوى.'),
        parent: tr('Det overordnede dæk findes ikke længere.', 'The parent deck no longer exists.', 'المجموعة الأصلية لم تعد موجودة.'),
        save: tr('Kunne ikke gemme dækket. Prøv igen.', 'Could not save the deck. Try again.', 'تعذر حفظ المجموعة. حاول مرة أخرى.'),
      };
      setError(messages[failure.message] || failure.message || messages.save);
    } finally { saveLock.current = false; setSaving(false); }
  }
  function draftRow(depth) {
    return <div className="mf791-deck-row mf791-deck-draft" data-deck-draft="true" data-parent-id={draft.parent} style={{ '--depth': depth }}>
      <div className="mf791-deck-title"><span className="mf791-expand" aria-hidden="true" /><div className="mf791-deck-name-edit">
        <input ref={draftInput} aria-label={tr('Navn på dæk', 'Deck name', 'اسم المجموعة')} aria-invalid={Boolean(error)} aria-describedby={error ? 'mf791-deck-name-error' : undefined} value={draft.name} maxLength={100} autoComplete="off" placeholder={tr('Navn på dæk', 'Deck name', 'اسم المجموعة')} disabled={saving} onChange={event => { const next = { ...draftRef.current, name: event.target.value }; draftRef.current = next; setDraft(next); setError(''); }} onKeyDown={event => {
          if (event.nativeEvent.isComposing) return;
          if (event.key === 'Enter') { event.preventDefault(); finishDeck(); }
          if (event.key === 'Escape') { event.preventDefault(); cancelDeck(); }
        }} onBlur={event => { if (!event.currentTarget.parentElement.contains(event.relatedTarget)) finishDeck(true); }} />
        <button type="button" disabled={saving} aria-label={tr('Annuller nyt dæk', 'Cancel new deck', 'إلغاء المجموعة الجديدة')} onMouseDown={event => event.preventDefault()} onClick={cancelDeck}><Mark791 name="close" size={14} /></button>
        {error && <small id="mf791-deck-name-error" role="alert">{error}</small>}
      </div></div>
      <span className="mf791-count-new">0</span><span className="mf791-count-learning">0</span><span className="mf791-count-review">0</span>
    </div>;
  }
  function row(node, depth = 0) {
    if (query && !match(node)) return null;
    const children = node.children || [], hasDraft = draft?.parent === node.id;
    const hasChildren = children.length > 0 || hasDraft, isClosed = closed.has(node.id) && !query && !hasDraft;
    return <React.Fragment key={node.id}><div className="mf791-deck-row" data-selected={selected?.id === node.id} data-group={hasChildren} style={{ '--depth': depth }}>
      <div className="mf791-deck-title">{hasChildren ? <button className="mf791-expand" onClick={() => toggle(node.id)} aria-label={`${isClosed ? tr('Fold ud', 'Expand', 'توسيع') : tr('Fold sammen', 'Collapse', 'طي')} ${node.label}`} aria-expanded={!isClosed}><span style={{ display: 'flex', transform: isClosed ? 'none' : 'rotate(90deg)' }}><Mark791 name="chevron" size={14} /></span></button> : <span className="mf791-expand" />}<button data-deck-id={node.id} aria-pressed={selected?.id === node.id} onClick={() => onSelect?.(node)}>{node.code && <small>{node.code}</small>}<span>{node.label}</span></button></div>
      <span className="mf791-count-new" aria-label={tr('Nye', 'New', 'جديدة')}>{node.stats?.newCount || 0}</span><span className="mf791-count-learning" aria-label={tr('I gang', 'Learning', 'قيد التعلم')}>{node.stats?.learningCount || 0}</span><span className="mf791-count-review" aria-label={tr('Klar', 'Ready', 'جاهزة')}>{node.stats?.dueCount || 0}</span>
    </div>{!isClosed && <>{ordered(children).map(child => row(child, depth + 1))}{hasDraft && draftRow(depth + 1)}</>}</React.Fragment>;
  }
  const selectedStats = selected?.stats || {};
  const showRoot = !tree.children?.length && tree.type !== 'module';
  return <div className="mf791-training-index">
    <section className="mf791-deck-index" aria-label={tr('Dæk', 'Decks', 'مجموعات')}><div className="mf791-index-tools"><label><Mark791 name="search" size={16} /><input type="search" value={query} onChange={event => setQuery(event.target.value)} aria-label={tr('Søg i dæk', 'Search decks', 'بحث في المجموعات')} placeholder={tr('Find et emne', 'Find a topic', 'ابحث عن موضوع')} /></label>{onImport && <button type="button" className="mf792-upload-action" onClick={onImport}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M12 16V3m-5 5 5-5 5 5M4 15v5h16v-5" /></svg>{tr('Upload flashcards', 'Upload flashcards', 'رفع البطاقات')}</button>}<details className="mf792-create-menu"><summary><Mark791 name="plus" size={16} />{tr('Opret', 'Create', 'إنشاء')}</summary><div><button type="button" onClick={onCreate}><Mark791 name="plus" size={16} />{tr('Nyt kort', 'New card', 'بطاقة جديدة')}</button>{onCreateDeck && <button ref={createButton} type="button" disabled={deckCreationDisabled || saving} onClick={beginDeck}><Mark791 name="plus" size={16} />{selected?.id && selected.id !== tree.id ? tr('Nyt underdæk', 'New subdeck', 'مجموعة فرعية جديدة') : tr('Nyt dæk', 'New deck', 'مجموعة جديدة')}</button>}</div></details></div>
      <div className="mf791-deck-columns"><span>{tr('Emne', 'Topic', 'الموضوع')}</span><span className="mf791-count-new">{tr('Nye', 'New', 'جديدة')}</span><span className="mf791-count-learning">{tr('I gang', 'Learning', 'التعلم')}</span><span className="mf791-count-review">{tr('Klar', 'Ready', 'جاهزة')}</span></div>
      <div className="mf791-deck-rows">{(showRoot ? [tree] : ordered(tree.children || [])).map(node => row(node))}{draft?.parent === tree.id && !showRoot && draftRow(0)}</div>
      {query && !match(tree) && <p className="mf791-empty">{tr('Ingen dæk matcher din søgning.', 'No matching decks.', 'لا توجد مجموعات مطابقة.')}</p>}
    </section>
    <aside className="mf791-deck-detail" aria-label={tr('Valgt dæk', 'Selected deck', 'المجموعة المختارة')}>
      <span className="mf79-kicker">{selected?.code || tr('DIT DÆK', 'YOUR DECK', 'مجموعتك')}</span><h2>{selected?.label}</h2>
      <p className="mf791-deck-meta">{selected?.questions?.length || 0} {tr('kort i dækket', 'cards in this deck', 'بطاقة في المجموعة')}</p>
      {sectionControls}
      <div className="mf791-deck-numbers">{[['new', selectedStats.newCount, tr('Nye', 'New', 'جديدة')], ['learning', selectedStats.learningCount, tr('I gang', 'Learning', 'التعلم')], ['review', selectedStats.dueCount, tr('Klar', 'Ready', 'جاهزة')]].map(([id, count, label]) => <div key={id} className={`mf791-count-${id}`}><strong>{count || 0}</strong><small>{label}</small></div>)}</div>
      <button className="mf791-start" data-start-deck onClick={onStart} disabled={!sessionCount}><Mark791 name="play" size={18} /><span>{sessionCount ? tr('Start træning', 'Start studying', 'ابدأ التدريب') : tr('Ingen kort i denne kø', 'No cards in this queue', 'لا توجد بطاقات في قائمة الانتظار')}</span>{sessionCount > 0 && <small>{sessionCount}</small>}</button>
      <div className="mf791-detail-actions"><button data-training-action="customize" onClick={onCustomize}><Mark791 name="tune" />{tr('Tilpas træning', 'Customize session', 'تخصيص التدريب')}<Mark791 name="chevron" size={15} /></button><button data-training-action="cards" onClick={onBrowse}><Mark791 name="cards" />{tr('Gennemse og redigér kort', 'Browse and edit cards', 'تصفح وتحرير البطاقات')}<Mark791 name="chevron" size={15} /></button>{openMaterials && <button data-training-action="materials" className="mf791-material-action" onClick={openMaterials}><svg className="mf791-material-book" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v15M3 4h5a4 4 0 0 1 4 2 4 4 0 0 1 4-2h5v15h-5a5 5 0 0 0-4 1 5 5 0 0 0-4-1H3Z" /><path className="mf791-book-page" d="M12 6c2-2 4-3 7-3v14c-3 0-5 1-7 3" /><path className="mf791-book-page mf791-book-page-second" d="M12 6c-2-2-4-3-7-3v14c3 0 5 1 7 3" /></svg>{tr('Forelæsningsmaterialer', 'Lecture materials', 'مواد المحاضرة')}<Mark791 name="chevron" size={15} /></button>}</div>
    </aside>
  </div>;
}
