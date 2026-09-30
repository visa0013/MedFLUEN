import React, { useEffect, useRef, useState } from 'react';
import { parseAnkiPackage792 } from './ankiImport792';
import { RichContent72 } from './Experience72';
import './apkgExam792.css';

export function AnkiUpload792({ onBack, onImport, moduleId, sourceKind, language = 'da', existingIds = [], decks = [], selectedDeck = '', signedIn = false, parsePackage = parseAnkiPackage792 }) {
  const tr = (da, en, ar) => language === 'ar' ? ar : language === 'en' ? en : da;
  const [preview, setPreview] = useState(null), [fileName, setFileName] = useState(''), [status, setStatus] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false), [done, setDone] = useState(false), [target, setTarget] = useState(selectedDeck), [dragging, setDragging] = useState(false);
  const heading = useRef(null), generation = useRef(0), saving = useRef(false);
  const stagedPreview = useRef(null);
  useEffect(() => { heading.current?.focus(); return () => { generation.current++; stagedPreview.current?.releaseMedia?.(); }; }, []);
  async function choose(file) {
    if (!file || busy) return;
    const request = ++generation.current;
    stagedPreview.current?.releaseMedia?.(); stagedPreview.current = null;
    setBusy(true); setPreview(null); setError(''); setDone(false); setFileName(file.name); setStatus(tr('Læser Anki-pakken…', 'Reading your Anki package…', 'جارٍ قراءة حزمة Anki…'));
    try {
      const result = await parsePackage(file, { moduleId, language, sourceKind, existingIds, onProgress: progress => { if (request === generation.current) setStatus(tr(`Læser medier… ${progress.media} af ${progress.totalMedia}`, `Reading media… ${progress.media} of ${progress.totalMedia}`, `قراءة الوسائط… ${progress.media} / ${progress.totalMedia}`)); } });
      if (request !== generation.current) { result.releaseMedia?.(); return; }
      stagedPreview.current = result;
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
      <strong>{busy ? tr('Behandler filen…', 'Processing file…', 'جارٍ معالجة الملف…') : tr('Vælg en Anki-fil', 'Choose an Anki file', 'اختر ملف Anki')}</strong><span>{tr('eller træk din .apkg-fil hertil', 'or drag your .apkg file here', 'أو اسحب ملف .apkg هنا')}</span><small>.apkg · {tr('maks. 128 MB og 10.000 kort', 'up to 128 MB and 10,000 cards', 'حتى 128 ميغابايت و10,000 بطاقة')}</small>
    </label>
    {status && <p className="mf792-anki-status" role="status">{status}</p>}{error && <p className="mf792-anki-error" role="alert">{error}</p>}
    {preview && <section className="mf792-anki-preview" aria-label={tr('Forhåndsvisning af import', 'Import preview', 'معاينة الاستيراد')}>
      <header><div><small>{fileName}</small><h2>{tr('Klar til gennemgang', 'Ready for review', 'جاهز للمراجعة')}</h2></div><div className="mf792-anki-counts"><span><strong>{preview.cards.length}</strong>{tr('klar', 'ready', 'جاهزة')}</span><span><strong>{preview.duplicates}</strong>{tr('dubletter', 'duplicates', 'مكررة')}</span><span><strong>{preview.skipped}</strong>{tr('sprunget over', 'skipped', 'تم تخطيها')}</span></div></header>
      {preview.warnings.length > 0 && <details className="mf792-anki-warnings" open><summary>{tr('Bemærkninger til importen', 'Import notes', 'ملاحظات الاستيراد')} ({preview.warnings.length})</summary><ul>{preview.warnings.map((warning, i) => <li key={i}>{warning}</li>)}</ul></details>}
      {preview.mediaCount > 0 && <p>{tr(`${preview.mediaCount} billeder og medier medfølger.`, `${preview.mediaCount} images and media included.`, `${preview.mediaCount} صورة ووسائط مرفقة.`)}</p>}
      <div className="mf792-anki-samples">{preview.cards.slice(0, 5).map(card => <article key={card.cardId}><small>{card.cardType} · {card.sourceDeck}</small><RichContent72 html={card.richContent?.front?.[language]} text={value(card, 'front')} cloze={card.cardType === 'cloze'} />{card.cardType === 'mcq' && <ol type="A">{card.options.map((option, i) => <li key={i}><RichContent72 html={card.richContent?.options?.[i]?.[language]} text={option[language]} /></li>)}</ol>}<details><summary>{tr('Vis svar', 'Show answer', 'إظهار الإجابة')}</summary>{card.cardType === 'cloze' && <RichContent72 html={card.richContent?.front?.[language]} text={value(card, 'front')} cloze revealed />}{card.cardType === 'mcq' && <RichContent72 html={card.richContent?.options?.[card.correct]?.[language]} text={card.options[card.correct]?.[language]} />}<RichContent72 html={card.richContent?.back?.[language]} text={value(card, 'back')} /></details></article>)}</div>
      {preview.cards.length > 5 && <p className="mf792-anki-more">{tr(`Viser 5 af ${preview.cards.length} kort.`, `Showing 5 of ${preview.cards.length} cards.`, `عرض 5 من ${preview.cards.length} بطاقة.`)}</p>}
      <footer><label>{tr('Gem i dæk', 'Save to deck', 'حفظ في المجموعة')}<select value={target} disabled={busy || done} onChange={event => setTarget(event.target.value)}><option value="">{tr('Alle kort i modulet', 'All cards in this module', 'كل البطاقات في الوحدة')}</option>{decks.map(deck => <option key={deck.id} value={deck.id}>{deck.name}</option>)}</select></label><button type="button" data-confirm-anki disabled={busy || done || !signedIn || !preview.cards.length} onClick={confirm}>{done ? tr('Importeret', 'Imported', 'تم الاستيراد') : busy ? tr('Gemmer…', 'Saving…', 'جارٍ الحفظ…') : tr(`Importér ${preview.cards.length} kort`, `Import ${preview.cards.length} cards`, `استيراد ${preview.cards.length} بطاقة`)}</button></footer>
      {!signedIn && <p role="status">{tr('Log ind for at gemme dine personlige kort.', 'Sign in to save your personal cards.', 'سجّل الدخول لحفظ بطاقاتك الشخصية.')}</p>}
    </section>}
    <details className="mf792-anki-support"><summary>{tr('Hvad understøttes?', 'What is supported?', 'ما الذي يتم دعمه؟')}</summary><p>{tr('Ældre og moderne Anki-pakker, Basic, omvendte kort, cloze og MCQ, herunder MCQ format og AllInOne. Spørgsmål, facit, tags og billeder bevares i MedFLUENs kortlayout. Billeder understøtter PNG, JPG, GIF, WebP, AVIF, BMP og SVG. Lyd og video får afspilningsknapper; afspilning afhænger af browserens understøttelse af formatet. Uklare eller flere korrekte svar bevares som vendekort med det oprindelige facit.', 'Legacy and modern Anki packages, Basic, reversed cards, cloze and MCQ, including MCQ format and AllInOne. Questions, answers, tags and images use MedFLUEN’s card layout. Images include PNG, JPG, GIF, WebP, AVIF, BMP and SVG. Audio and video have playback controls; playback depends on browser codec support. Ambiguous or multiple answers are preserved as front/back cards with the original answer.', 'تُدعم حزم Anki القديمة والحديثة وBasic وcloze وMCQ مع الصور والصوت والفيديو في تخطيط MedFLUEN. تُحفظ الإجابات المتعددة كبطاقات أمامية وخلفية.')}</p><p>{tr('Kort og medier gemmes på denne enhed under din konto. Ankis repetitionshistorik og skabelonscripts overføres ikke. Kort med billedmasker eller ukendte skabeloner angives i importens bemærkninger.', 'Cards and media are saved on this device under your account. Anki review history and template scripts are not transferred. Image occlusion or unknown templates are listed in the import notes.', 'تُحفظ البطاقات والوسائط على هذا الجهاز ضمن حسابك. لا يُنقل سجل مراجعة Anki أو سكربتات القوالب.')}</p></details>
  </section>;
}
