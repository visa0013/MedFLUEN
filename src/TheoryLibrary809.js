import React, { useState } from 'react';
import { Mark791 } from './Workspace791';
import './theoryLibrary809.css';

const searchable = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();

// Keep the curriculum's order and every official lecture, including empty ones.
// Personal and ANKI subdecks remain visible alongside their parent lecture.
function unitsIn(node) {
  const children = node.children || [];
  const own = node.type === 'lecture' || node.type === 'personal' || (!children.length && node.type !== 'module');
  return [...(own ? [node] : []), ...children.flatMap(unitsIn)];
}

export function TheoryLibrary809({ tree, selected, onSelect, onStart, onCustomize, onBrowse, onImport, onCreate, onManage, onMaterials, onNotes, reviewedIds = new Set(), sessionCount = 0, language = 'da' }) {
  const tr = (da, en, ar) => language === 'ar' ? ar : language === 'en' ? en : da;
  const [query, setQuery] = useState(''), [subject, setSubject] = useState(null);
  const groups = (tree.children || []).map(node => ({ id: node.id, label: node.label, units: unitsIn(node) }));
  const needle = searchable(query.trim());
  const visible = groups.filter(group => !subject || group.id === subject).map(group => ({ ...group, units: group.units.filter(node => searchable(`${node.code || ''} ${node.label}`).includes(needle)) })).filter(group => group.units.length);
  const seen = reviewedIds instanceof Set ? reviewedIds : new Set(reviewedIds || []);
  const progress = node => (node.questions || []).filter(card => seen.has(String(card.id)) || seen.has(card.id)).length;
  const total = selected?.questions?.length || 0, studied = progress(selected || {});
  const units = groups.flatMap(group => group.units);
  const openMaterials = onMaterials || onNotes;
  const selectedSectionCount = new Set((selected?.questions || []).filter(card => card.lectureContent).map(card => JSON.stringify([card.lectureContent.packageId, card.lectureContent.section.id]))).size;
  const countText = count => `${count} ${tr('kort', 'cards', 'بطاقة')}`;

  return <section className="mf809-library" aria-label={tr('Teoritræning', 'Theory training', 'تدريب النظريات')}>
    <header className="mf809-heading">
      <div><span className="mf79-kicker">{tr('TRÆNING / TEORI', 'TRAINING / THEORY', 'التدريب / النظرية')}</span><h1>{tr('Teori', 'Theory', 'النظرية')}</h1><p>{units.length} {tr('forelæsninger', 'lectures', 'محاضرات')}<span aria-hidden="true"> / </span>{countText(tree.questions?.length || 0)}</p></div>
      <div className="mf809-heading-actions">
        {onImport && <button type="button" className="mf809-upload" data-theory-upload onClick={onImport}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 16V3m-5 5 5-5 5 5M4 15v5h16v-5" /></svg>{tr('Upload dæk', 'Upload deck', 'رفع مجموعة')}</button>}
        {(onCreate || onManage) && <details className="mf809-manage-menu"><summary><Mark791 name="plus" size={17} />{tr('Opret', 'Create', 'إنشاء')}</summary><div>{onCreate && <button type="button" onClick={onCreate}>{tr('Nyt kort', 'New card', 'بطاقة جديدة')}</button>}{onManage && <button type="button" data-theory-manage onClick={onManage}>{tr('Administrér dæk', 'Manage decks', 'إدارة المجموعات')}</button>}</div></details>}
      </div>
    </header>
    <div className="mf809-workspace">
      <section className="mf809-catalog" aria-label={tr('Forelæsninger', 'Lectures', 'المحاضرات')}>
        <div className="mf809-catalog-tools"><label><Mark791 name="search" size={17} /><input type="search" aria-label={tr('Søg i forelæsninger', 'Search lectures', 'بحث في المحاضرات')} placeholder={tr('Find en forelæsning', 'Find a lecture', 'ابحث عن محاضرة')} value={query} onChange={event => setQuery(event.target.value)} /></label></div>
        <nav className="mf809-subjects" aria-label={tr('Fagområde', 'Subject', 'المجال')}><button type="button" aria-pressed={!subject} onClick={() => setSubject(null)}>{tr('Alle', 'All', 'الكل')}</button>{groups.map(group => <button key={group.id} type="button" data-theory-subject={group.id} aria-pressed={subject === group.id} onClick={() => setSubject(group.id)}>{group.label}</button>)}</nav>
        <div className="mf809-lecture-list">{visible.map(group => <section key={group.id} className="mf809-subject" aria-label={group.label}>
          <header><h2>{group.label}</h2><small>{group.units.length}</small></header>
          {group.units.map(node => { const count = node.questions?.length || 0, read = progress(node); return <button key={node.id} type="button" className="mf809-lecture" data-theory-unit={node.id} aria-pressed={selected?.id === node.id} onClick={() => onSelect?.(node)}>
            <span className="mf809-lecture-code">{node.code || <Mark791 name="cards" size={18} />}</span><span className="mf809-lecture-title">{node.label}{count > 0 && read > 0 && <small>{read} / {count} {tr('gennemgået', 'reviewed', 'تمت مراجعتها')}</small>}</span><span className="mf809-lecture-count" data-empty={!count}>{countText(count)}</span><Mark791 name="arrow" size={17} />
          </button>; })}
        </section>)}{!visible.length && <p className="mf809-empty" role="status">{tr('Ingen forelæsninger matcher din søgning.', 'No lectures match your search.', 'لا توجد محاضرات مطابقة.')}</p>}</div>
      </section>
      <aside className="mf809-preview" aria-label={tr('Valgt forelæsning', 'Selected lecture', 'المحاضرة المختارة')}>
        <span className="mf79-kicker">{selected?.code || tr('DIT DÆK', 'YOUR DECK', 'مجموعتك')}</span><h2>{selected?.label || tree.label}</h2>
        <p className="mf809-preview-meta">{countText(total)}{selectedSectionCount > 0 && <> <span aria-hidden="true">·</span> {selectedSectionCount} {tr('sektioner', 'sections', 'أقسام')}</>}</p>
        <div className="mf809-preview-progress"><div><span>{tr('Gennemgået', 'Reviewed', 'تمت مراجعتها')}</span><strong>{studied} / {total}</strong></div><span className="mf809-progress-track" role="progressbar" aria-label={tr('Kort gennemgået', 'Cards reviewed', 'البطاقات التي تمت مراجعتها')} aria-valuemin={0} aria-valuemax={Math.max(1, total)} aria-valuenow={studied}><i style={{ width: `${total ? studied / total * 100 : 0}%` }} /></span></div>
        <button type="button" className="mf809-open" data-open-theory disabled={!sessionCount} onClick={onStart}>{tr('Åbn forelæsning', 'Open lecture', 'فتح المحاضرة')}<Mark791 name="arrow" size={19} /></button>
        {!total && <p className="mf809-empty-lecture">{tr('Upload et dæk for at tilføje kort til denne forelæsning.', 'Upload a deck to add cards to this lecture.', 'ارفع مجموعة لإضافة بطاقات لهذه المحاضرة.')}</p>}
        <div className="mf791-detail-actions mf809-preview-actions">
          {onBrowse && <button type="button" data-training-action="cards" onClick={onBrowse}><Mark791 name="cards" />{tr('Gennemse og redigér kort', 'Browse and edit cards', 'تصفح البطاقات وتحريرها')}<Mark791 name="chevron" size={15} /></button>}
          {onCustomize && <button type="button" data-training-action="customize" onClick={onCustomize}><Mark791 name="tune" />{tr('Tilpas træning', 'Customize session', 'تخصيص التدريب')}<Mark791 name="chevron" size={15} /></button>}
          {openMaterials && <button type="button" data-training-action="materials" onClick={openMaterials}><Mark791 name="book" />{tr('Forelæsningsmaterialer', 'Lecture materials', 'مواد المحاضرة')}<Mark791 name="chevron" size={15} /></button>}
        </div>
      </aside>
    </div>
  </section>;
}
