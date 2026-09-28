import React, { useEffect, useRef, useState } from 'react';
import { parseAnkiPackage792 } from './ankiImport792';
import { RichContent72 } from './Experience72';
import './apkgExam792.css';

export function AnkiUpload792({ onBack, onImport, moduleId, language = 'da', existingIds = [], decks = [], selectedDeck = '', signedIn = false, parsePackage = parseAnkiPackage792 }) {
  const tr = (da, en, ar) => language === 'ar' ? ar : language === 'en' ? en : da;
  const [preview, setPreview] = useState(null), [fileName, setFileName] = useState(''), [status, setStatus] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false), [done, setDone] = useState(false), [target, setTarget] = useState(selectedDeck), [dragging, setDragging] = useState(false);
  const heading = useRef(null), generation = useRef(0), saving = useRef(false);
  useEffect(() => { heading.current?.focus(); return () => { generation.current++; }; }, []);
  async function choose(file) {
    if (!file || busy) return;
    const request = ++generation.current;
    setBusy(true); setPreview(null); setError(''); setDone(false); setFileName(file.name); setStatus(tr('Læser Anki-pakken…', 'Reading your Anki package…', 'جارٍ قراءة حزمة Anki…'));
    try {
      const result = await parsePackage(file, { moduleId, language, existingIds });
      if (request !== generation.current) return;
      setPreview(result); setStatus('');
    } catch (failure) { if (request === generation.current) { setError(failure.message || tr('Pakken kunne ikke læses.', 'The package could not be read.', 'تعذر قراءة الحزمة.')); setStatus(''); } }
    finally { if (request === generation.current) setBusy(false); }
  }
  async function confirm() {
    if (!preview?.cards.length || saving.current || !signedIn) return;
    saving.current = true; setBusy(true); setError('');
    try {
      const result = await onImport(preview.cards, target);
      if (result?.ok === false) throw Error(result.error);
      setDone(true); setStatus(tr(`${result.imported} kort er importeret.`, `${result.imported} cards imported.`, `تم استيراد ${result.imported} بطاقة.`) + (result.duplicates ? tr(` ${result.duplicates} eksisterende kort blev bevaret.`, ` ${result.duplicates} existing cards were preserved.`, '') : '') + (result.placementWarning ? ` ${result.placementWarning}` : ''));
    } catch (failure) { setError(failure.message || tr('Importen kunne ikke gemmes. Prøv igen.', 'The import could not be saved. Try again.', 'تعذر حفظ الاستيراد. حاول مرة أخرى.')); }
    finally { saving.current = false; setBusy(false); }
  }
  const value = (card, field) => card[field]?.[language] || Object.values(card[field] || {})[0] || '';
  return <section className="mf792-anki" dir={language === 'ar' ? 'rtl' : undefined}>
    <button type="button" data-anki-back className="mf792-anki-back" disabled={saving.current} onClick={onBack}>← {tr('Tilbage til Træning', 'Back to Training', 'العودة إلى التدريب')}</button>
    <header><span className="mf79-kicker">ANKI · .APKG</span><h1 ref={heading} tabIndex={-1}>{tr('Upload flashcards', 'Upload flashcards', 'رفع البطاقات')}</h1><p>{tr('Tag dine Anki-kort med ind i din træning.', 'Bring your Anki cards into your study sessions.', 'أضف بطاقات Anki إلى جلسات الدراسة.')}</p></header>
    <label className="mf792-anki-drop" data-dragging={dragging} data-busy={busy} onDragOver={event => { event.preventDefault(); if (!busy) setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); choose(event.dataTransfer.files?.[0]); }}>
      <input type="file" accept=".apkg" disabled={busy} onChange={event => { choose(event.target.files?.[0]); event.target.value = ''; }} aria-label={tr('Vælg Anki-fil', 'Choose Anki file', 'اختر ملف Anki')} />
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M12 16V3m-5 5 5-5 5 5M4 15v5h16v-5" /></svg>
      <strong>{busy ? tr('Læser filen…', 'Reading file…', 'جارٍ قراءة الملف…') : tr('Vælg en Anki-fil', 'Choose an Anki file', 'اختر ملف Anki')}</strong><span>{tr('eller træk din .apkg-fil hertil', 'or drag your .apkg file here', 'أو اسحب ملف .apkg هنا')}</span><small>.apkg · {tr('maks. 20 MB og 2.000 kort', 'up to 20 MB and 2,000 cards', 'حتى 20 ميغابايت و2,000 بطاقة')}</small>
    </label>
    {status && <p className="mf792-anki-status" role="status">{status}</p>}{error && <p className="mf792-anki-error" role="alert">{error}</p>}
    {preview && <section className="mf792-anki-preview" aria-label={tr('Forhåndsvisning af import', 'Import preview', 'معاينة الاستيراد')}>
      <header><div><small>{fileName}</small><h2>{tr('Klar til gennemgang', 'Ready for review', 'جاهز للمراجعة')}</h2></div><div className="mf792-anki-counts"><span><strong>{preview.cards.length}</strong>{tr('klar', 'ready', 'جاهزة')}</span><span><strong>{preview.duplicates}</strong>{tr('dubletter', 'duplicates', 'مكررة')}</span><span><strong>{preview.skipped}</strong>{tr('sprunget over', 'skipped', 'تم تخطيها')}</span></div></header>
      {preview.warnings.length > 0 && <details className="mf792-anki-warnings" open><summary>{tr('Bemærkninger til importen', 'Import notes', 'ملاحظات الاستيراد')} ({preview.warnings.length})</summary><ul>{preview.warnings.map((warning, i) => <li key={i}>{warning}</li>)}</ul></details>}
      <div className="mf792-anki-samples">{preview.cards.slice(0, 5).map(card => <article key={card.cardId}><small>{card.cardType} · {card.sourceDeck}</small><RichContent72 html={card.richContent?.front?.[language]} text={value(card, 'front')} cloze={card.cardType === 'cloze'} /><details><summary>{tr('Vis svar', 'Show answer', 'إظهار الإجابة')}</summary>{card.cardType === 'cloze' && <RichContent72 html={card.richContent?.front?.[language]} text={value(card, 'front')} cloze revealed />}{card.cardType === 'mcq' && <ol>{card.options.map((option, i) => <li key={i}>{option[language]}{i === card.correct ? ' ✓' : ''}</li>)}</ol>}<RichContent72 html={card.richContent?.back?.[language]} text={value(card, 'back')} /></details></article>)}</div>
      {preview.cards.length > 5 && <p className="mf792-anki-more">{tr(`Viser 5 af ${preview.cards.length} kort.`, `Showing 5 of ${preview.cards.length} cards.`, `عرض 5 من ${preview.cards.length} بطاقة.`)}</p>}
      <footer><label>{tr('Gem i dæk', 'Save to deck', 'حفظ في المجموعة')}<select value={target} disabled={busy || done} onChange={event => setTarget(event.target.value)}><option value="">{tr('Alle kort i modulet', 'All cards in this module', 'كل البطاقات في الوحدة')}</option>{decks.map(deck => <option key={deck.id} value={deck.id}>{deck.name}</option>)}</select></label><button type="button" data-confirm-anki disabled={busy || done || !signedIn || !preview.cards.length} onClick={confirm}>{done ? tr('Importeret', 'Imported', 'تم الاستيراد') : busy ? tr('Gemmer…', 'Saving…', 'جارٍ الحفظ…') : tr(`Importér ${preview.cards.length} kort`, `Import ${preview.cards.length} cards`, `استيراد ${preview.cards.length} بطاقة`)}</button></footer>
      {!signedIn && <p role="status">{tr('Log ind for at gemme dine personlige kort.', 'Sign in to save your personal cards.', 'سجّل الدخول لحفظ بطاقاتك الشخصية.')}</p>}
    </section>}
    <details className="mf792-anki-support"><summary>{tr('Hvad understøttes?', 'What is supported?', 'ما الذي يتم دعمه؟')}</summary><p>{tr('Basic, omvendte Basic-kort og cloze bevarer tekst, enkel formatering og PNG/JPG/GIF/WebP-billeder. MCQ kræver Question, OptionA–H eller AnswerA–H og Correct/CorrectAnswer som ét bogstav eller et nummer fra 1. Originale dæknavne bevares som kilde. Lyd, video, image occlusion, specialskabeloner og Ankis repetitionshistorik importeres ikke. Importen opretter nye træningskort.', 'Basic, reversed Basic and cloze retain text, simple formatting and PNG/JPG/GIF/WebP images. MCQ requires Question, OptionA–H or AnswerA–H and Correct/CorrectAnswer as one letter or a number starting at 1. Original deck names are retained as source labels. Audio, video, image occlusion, custom templates and Anki review history are not imported. Imported cards start as new study cards.', 'تُحفظ النصوص والتنسيق البسيط والصور في بطاقات Basic وcloze. يتطلب MCQ حقول خيارات وإجابة صحيحة صريحة. لا يُستورد الصوت والفيديو وحجب الصور والقوالب الخاصة وسجل المراجعة. تبدأ البطاقات كجديدة.')}</p><p>{tr('Pakker i nyere komprimeret format: slå “Understøt ældre Anki-versioner” til ved eksport. Andre filformater kommer senere.', 'For newer compressed packages, enable “Support older Anki versions” when exporting. Other file formats will follow later.', 'للحزم المضغوطة الجديدة، فعّل دعم إصدارات Anki القديمة عند التصدير. ستُدعم تنسيقات أخرى لاحقًا.')}</p></details>
  </section>;
}
