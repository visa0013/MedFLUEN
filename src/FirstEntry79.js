import React, { useEffect, useState } from 'react';
import { AuthPanel75 } from './Access75';
import './first-entry79.css';

const copy = {
  da: { login: 'Log ind', signup: 'Opret konto', try: 'Udforsk appen', top: 'Et studierum, der hænger sammen.', titleA: 'Slå pensum', titleB: 'med et smæk.', lead: 'Fra forelæsningssliden til spørgsmålet, du faktisk kan svare på. MedFLUEN samler dine materialer, flashkort og kalender uden at bestemme, hvordan du skal læse.', explore: 'Se hvordan det virker', sample: 'DEMO · INGEN OPLYSNINGER FRA RIGTIGE STUDERENDE', sampleLong: 'Ingen oplysninger fra rigtige studerende', preview: 'Et kig på dit studierum', archive: 'Forelæsninger', train: 'Flashkort', calendar: 'Kalender', question: 'Hvad er aktiv genkaldelse?', answer: 'At forsøge at hente svaret frem fra hukommelsen, før du ser facit.', reveal: 'Vis svar', hide: 'Skjul svar', chapters: 'DET HÆNGER SAMMEN', chapterTitle: 'Ét forløb. Flere måder at forstå det på.', chapterLead: 'Du kan begynde dér, hvor det giver mening for dig. Dine kilder, kort og aftaler bliver ved med at være tæt på.', one: 'Læs i kontekst', oneBody: 'Find forelæsningen, åbn dens PDF, og gem en note til den side, du faktisk læser.', two: 'Øv det, du vil huske', twoBody: 'Arbejd med teoretiske kort eller MCQ fra eksamenssæt. Blå, rød og grøn viser, hvad der er nyt, i gang og klar til repetition.', three: 'Se ugen som den er', threeBody: 'Undervisning og din egen studieplan deler en kalender. En skemaændring flytter ikke automatisk dine personlige valg.', byte: 'Dr. Byte, når du har brug for et ekstra perspektiv', byteBody: 'Spørg til valgte forelæsnings-PDF’er. Når der er læsbar tekst, kan kilden åbnes på den konkrete PDF-side. Du vælger selv, hvad der deles.', last: 'Alt begynder med ét sted.', lastBody: 'Opret din konto, eller log ind og fortsæt, hvor du slap.', faq: 'Spørgsmål, før du begynder', faqRows: [['Bestemmer MedFLUEN min studieplan?', 'Nej. Kalenderen og planen er værktøjer, du styrer selv.'], ['Er alle forelæsninger med?', 'Indholdet afhænger af det modul, der er gjort tilgængeligt. Du kan også tilføje dine egne kort og noter.'], ['Kan Dr. Byte læse scannede PDF’er?', 'Kun PDF’er med et læsbart tekstlag kan bruges som kilder i chatten. OCR er ikke automatisk slået til.']], return: 'Til forsiden' },
  en: { login: 'Sign in', signup: 'Create account', try: 'Explore the app', top: 'A study space that connects.', titleA: 'Bring your studies', titleB: 'together.', lead: 'From lecture slides to the questions you can answer. MedFLUEN brings materials, flashcards and calendar together without telling you how to study.', explore: 'See how it works', sample: 'DEMO · NO REAL STUDENT DATA', sampleLong: 'No real student data', preview: 'A look at your study space', archive: 'Lectures', train: 'Flashcards', calendar: 'Calendar', question: 'What is active recall?', answer: 'Trying to retrieve an answer from memory before looking at it.', reveal: 'Show answer', hide: 'Hide answer', chapters: 'CONNECTED BY DESIGN', chapterTitle: 'One course. Several ways to understand it.', chapterLead: 'Begin where it makes sense to you. Sources, cards and dates stay close together.', one: 'Read in context', oneBody: 'Find a lecture, open its PDF and keep a note beside the exact page.', two: 'Practise what matters', twoBody: 'Use theory cards or exam MCQ. Blue, red and green show new, learning and ready-to-review cards.', three: 'See the actual week', threeBody: 'Teaching and your personal plan share one calendar. Schedule changes never silently move your choices.', byte: 'Dr. Byte, when you need another perspective', byteBody: 'Ask about selected lecture PDFs. When text is available, citations open the exact PDF page. You decide what to share.', last: 'It starts in one place.', lastBody: 'Create an account or sign in to pick up where you left off.', faq: 'Before you begin', faqRows: [['Does MedFLUEN set my study plan?', 'No. The calendar and plan are tools under your control.'], ['Is every lecture included?', 'Availability depends on the module. You can add your own cards and notes.'], ['Can Dr. Byte read scanned PDFs?', 'Only PDFs with extractable text can be used as chat sources. OCR is not automatically enabled.']], return: 'Back to home' },
  ar: { login: 'تسجيل الدخول', signup: 'إنشاء حساب', try: 'استكشف التطبيق', top: 'مساحة دراسة مترابطة.', titleA: 'اجمع دراستك', titleB: 'في مكان واحد.', lead: 'من شريحة المحاضرة إلى السؤال الذي تستطيع الإجابة عنه. تجمع ميدفلوين المواد والبطاقات والتقويم دون أن تفرض عليك طريقة للدراسة.', explore: 'كيف يعمل', sample: 'عرض تجريبي · بلا بيانات حقيقية', sampleLong: 'بلا بيانات حقيقية للطلاب', preview: 'مساحة دراستك', archive: 'المحاضرات', train: 'البطاقات', calendar: 'التقويم', question: 'ما الاستدعاء النشط؟', answer: 'محاولة تذكر الإجابة قبل الاطلاع عليها.', reveal: 'إظهار الإجابة', hide: 'إخفاء الإجابة', chapters: 'تجربة مترابطة', chapterTitle: 'مقرر واحد، طرق متعددة للفهم.', chapterLead: 'ابدأ من حيث يناسبك؛ تبقى المصادر والبطاقات والمواعيد مترابطة.', one: 'اقرأ في سياق', oneBody: 'افتح المحاضرة وملف PDF، وأضف ملاحظة للصفحة نفسها.', two: 'تدرب على ما يهمك', twoBody: 'استخدم بطاقات النظرية أو أسئلة الامتحان. الألوان تبين الجديد والتعلم والمراجعة.', three: 'انظر إلى أسبوعك', threeBody: 'يجمع التقويم التدريس وخطتك الخاصة دون تغيير اختياراتك تلقائياً.', byte: 'د. بايت لمنظور إضافي', byteBody: 'اسأل عن ملفات المحاضرات المختارة، وافتح المصدر في صفحة PDF محددة. أنت تختار ما تشاركه.', last: 'البداية في مكان واحد.', lastBody: 'أنشئ حسابك أو سجل الدخول للمتابعة.', faq: 'قبل أن تبدأ', faqRows: [['هل يحدد التطبيق خطة دراستي؟', 'لا. التقويم والخطة أدوات تتحكم بها أنت.'], ['هل تتوفر كل المحاضرات؟', 'يعتمد ذلك على محتوى المقرر. يمكنك إضافة بطاقاتك وملاحظاتك.'], ['هل يستطيع د. بايت قراءة ملفات ممسوحة ضوئياً؟', 'فقط ملفات PDF ذات النص القابل للاستخراج؛ لا يعمل OCR تلقائياً.']], return: 'العودة إلى البداية' },
};

function Demo79({ words }) {
  const [tab, setTab] = useState('train');
  const [shown, setShown] = useState(false);
  return <div className="mf79-first-demo" aria-label={words.preview}>
    <header><span className="mf79-first-demo-mark" aria-hidden="true">m<span>f</span></span><span>{words.preview}</span><small>{words.sample}</small></header>
    <div className="mf79-first-demo-frame"><nav aria-label={words.preview}>{[['archive', words.archive], ['train', words.train], ['calendar', words.calendar]].map(([id, label]) => <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</button>)}</nav>
      {tab === 'train' && <div className="mf79-first-demo-training"><div><small>NEUROLOGI / N4</small><h3>{words.question}</h3><button type="button" onClick={() => setShown(value => !value)}>{shown ? words.hide : words.reveal}<span aria-hidden="true">↗</span></button></div><div className="mf79-first-demo-answer">{shown ? <p>{words.answer}</p> : <span aria-hidden="true">?</span>}</div><footer><span>12 <i className="mf79-dot-blue" /></span><span>4 <i className="mf79-dot-red" /></span><span>28 <i className="mf79-dot-green" /></span></footer></div>}
      {tab === 'archive' && <div className="mf79-first-demo-list"><small>K5 / NEUROLOGI</small>{[['N1', 'Anamnese og neurologisk undersøgelse'], ['N4', 'Epilepsi'], ['N7', 'Hovedpine']].map(([code, title]) => <div key={code}><em>{code}</em><span>{title}</span><span aria-hidden="true">↗</span></div>)}</div>}
      {tab === 'calendar' && <div className="mf79-first-demo-week"><small>UGE / EKSEMPEL</small>{[['MAN','08:00','Forelæsning'],['TIR','10:00','Selvstudie'],['ONS','13:00','Holdtime'],['TOR','09:00','Flashkort'],['FRE','11:00','Forelæsning']].map(([day,time,title]) => <div key={day}><strong>{day}</strong><span><small>{time}</small>{title}</span></div>)}</div>}
    </div></div>;
}

const starts79 = {
  da: {
    eyebrow: 'DIN EGEN INDGANG', title: 'Hvor vil du begynde?', lead: 'Vælg det, der giver mening i dag. Du kan altid skifte spor.', start: 'Opret konto',
    paths: [
      { label: 'Start med pensum', title: 'Fra slide til forståelse', steps: ['Vælg dit modul og en forelæsning.', 'Åbn PDF’en og find den side, du vil arbejde med.', 'Skriv en note ved siden af, eller spørg Dr. Byte med kilden valgt.'] },
      { label: 'Start med træning', title: 'Fra spørgsmål til svar', steps: ['Vælg et dæk i Teori eller Eksamens-MCQ.', 'Se svaret, når du er klar, og vurder kortet selv.', 'Vend tilbage til repetition, når du har lyst.'] },
      { label: 'Start med kalenderen', title: 'Fra uge til overblik', steps: ['Se undervisning og dine egne aftaler samlet.', 'Skift mellem dag, uge og måned efter behov.', 'Lav en studieplan, hvis du vil — intet flyttes uden dit valg.'] },
    ],
  },
  en: {
    eyebrow: 'YOUR WAY IN', title: 'Where would you begin?', lead: 'Choose what fits today. You can always change direction.', start: 'Create account',
    paths: [
      { label: 'Start with lectures', title: 'From slide to understanding', steps: ['Choose a module and a lecture.', 'Open the PDF at the page you want to work with.', 'Keep a note beside it, or ask Dr. Byte with the source selected.'] },
      { label: 'Start with practice', title: 'From question to answer', steps: ['Pick a theory or exam-MCQ deck.', 'Reveal the answer when ready and rate the card yourself.', 'Return to review when you choose.'] },
      { label: 'Start with your week', title: 'From week to overview', steps: ['See teaching and personal events in one calendar.', 'Switch between day, week and month.', 'Create a study plan if you want; nothing moves without your choice.'] },
    ],
  },
  ar: {
    eyebrow: 'بدايتك أنت', title: 'من أين تريد أن تبدأ؟', lead: 'اختر ما يناسبك اليوم. يمكنك تغيير المسار في أي وقت.', start: 'إنشاء حساب',
    paths: [
      { label: 'ابدأ بالمحاضرات', title: 'من الشريحة إلى الفهم', steps: ['اختر المقرر والمحاضرة.', 'افتح ملف PDF في الصفحة التي تريدها.', 'اكتب ملاحظة بجانبه أو اسأل د. بايت مع تحديد المصدر.'] },
      { label: 'ابدأ بالتدريب', title: 'من السؤال إلى الإجابة', steps: ['اختر مجموعة من بطاقات النظرية أو الامتحان.', 'اكشف الإجابة عندما تكون جاهزاً وقيّم البطاقة بنفسك.', 'عد إلى المراجعة عندما تريد.'] },
      { label: 'ابدأ بأسبوعك', title: 'من الأسبوع إلى الصورة الكاملة', steps: ['اعرض التدريس ومواعيدك الخاصة في تقويم واحد.', 'بدّل بين اليوم والأسبوع والشهر.', 'أنشئ خطة إن أردت؛ لن يتغير شيء دون اختيارك.'] },
    ],
  },
};

function StartPaths79({ language, onAccess }) {
  const words = starts79[language] || starts79.da;
  const [selected, setSelected] = useState(0);
  const path = words.paths[selected];
  return <section className="mf79-first-paths" id="mf79-start" aria-label={words.title}>
    <div className="mf79-first-path-intro"><small>{words.eyebrow}</small><h2>{words.title}</h2><p>{words.lead}</p></div>
    <div className="mf79-first-path-stage"><nav aria-label={words.title}>{words.paths.map((item, index) => <button key={item.label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><span>0{index + 1}</span>{item.label}<span aria-hidden="true">↗</span></button>)}</nav>
      <div className="mf79-first-path-detail"><small>0{selected + 1} / 03</small><h3>{path.title}</h3><ol>{path.steps.map(step => <li key={step}>{step}</li>)}</ol><button type="button" onClick={() => onAccess('signup')}>{words.start}<span aria-hidden="true">↗</span></button></div>
    </div>
  </section>;
}

export function Landing79({ onAccess, language = 'da' }) {
  const w = copy[language] || copy.da;
  const [activeSection, setActiveSection] = useState('mf79-main');
  useEffect(() => {
    const ids = ['mf79-main', 'mf79-overview', 'mf79-byte', 'mf79-start'];
    const update = () => {
      const marker = window.innerHeight * 0.44;
      const current = ids.reduce((found, id) => document.getElementById(id)?.getBoundingClientRect().top <= marker ? id : found, ids[0]);
      setActiveSection(current);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);
  return <div className="mf79-first" dir={language === 'ar' ? 'rtl' : undefined}>
    <a className="mf79-first-skip" href="#mf79-main">{w.try}</a>
    <nav className="mf79-first-progress" aria-label={language === 'da' ? 'Følg siden' : language === 'ar' ? 'أقسام الصفحة' : 'Page progress'}>{[['mf79-main','01'],['mf79-overview','02'],['mf79-byte','03'],['mf79-start','04']].map(([id, number]) => <a key={id} href={`#${id}`} aria-label={`${number} / 04`} aria-current={activeSection === id ? 'location' : undefined} onClick={() => setActiveSection(id)}><span aria-hidden="true" /></a>)}</nav>
    <header className="mf79-first-nav"><a href="#mf79-main" className="mf79-first-brand">Med<span>FLUEN</span></a><span className="mf79-first-nav-strap">{w.top}</span><nav aria-label="Konto"><a href="#mf79-overview">{w.try}</a><button type="button" onClick={() => onAccess('login')}>{w.login}</button></nav></header>
    <main id="mf79-main"><section className="mf79-first-hero"><div className="mf79-first-hero-text"><small>MEDFLUEN / STUDIERUMMET</small><h1>{w.titleA}<em>{w.titleB}</em></h1><p>{w.lead}</p><div className="mf79-first-hero-actions"><button type="button" onClick={() => onAccess('signup')}>{w.signup}<span aria-hidden="true">↗</span></button><a href="#mf79-overview">{w.explore}<span aria-hidden="true">↓</span></a></div></div><div className="mf79-first-hero-index" aria-hidden="true"><span>01 / 04</span><span>FORELÆSNINGER<br/>FLASHKORT<br/>KALENDER</span></div></section>
      <section className="mf79-first-overview" id="mf79-overview"><div className="mf79-first-overview-lead"><span>01—04</span><h2>{w.chapterTitle}</h2><p>{w.chapterLead}</p></div><Demo79 words={w}/></section>
      <section className="mf79-first-chapters" aria-label={w.chapters}>{[[w.one,w.oneBody,'01'],[w.two,w.twoBody,'02'],[w.three,w.threeBody,'03']].map(([title, body, number]) => <article key={number}><small>{number} / 03</small><h3>{title}</h3><p>{body}</p></article>)}</section>
      <section className="mf79-first-byte" id="mf79-byte"><div className="mf79-first-orb" aria-hidden="true"/><div><small>DR. BYTE / KILDER</small><h2>{w.byte}</h2><p>{w.byteBody}</p></div></section>
      <StartPaths79 language={language} onAccess={onAccess}/>
      <section className="mf79-first-finale"><span>MEDFLUEN / 01</span><h2>{w.last}</h2><p>{w.lastBody}</p><div><button type="button" onClick={() => onAccess('signup')}>{w.signup}<span aria-hidden="true">↗</span></button><button type="button" onClick={() => onAccess('login')}>{w.login}</button></div></section>
    </main><footer className="mf79-first-footer"><strong>MedFLUEN</strong><span>Lavet af Visar Krasniqi</span><a href="#mf79-main">↑</a></footer>
  </div>;
}

export function FirstEntry79({ auth, language = 'da', recovery = false, onRecovered, initialMode = null }) {
  const [mode, setMode] = useState(initialMode);
  const w = copy[language] || copy.da;
  if (!mode && !recovery) return <Landing79 onAccess={setMode} language={language}/>;
  return <div className="mf79-first mf79-first-auth" dir={language === 'ar' ? 'rtl' : undefined}>
    <header className="mf79-first-nav"><button className="mf79-first-brand" type="button" disabled={recovery} onClick={() => setMode(null)}>Med<span>FLUEN</span></button><span className="mf79-first-nav-strap">{w.top}</span><button type="button" className="mf79-first-auth-back" disabled={recovery} onClick={() => setMode(null)}>← {w.return}</button></header>
    <main className="mf79-first-auth-grid"><aside><small>MEDFLUEN / 01</small><h1>{w.titleA}<em>{w.titleB}</em></h1><p>{w.lead}</p><div className="mf79-first-auth-lines" aria-hidden="true"><span>{w.archive}</span><span>{w.train}</span><span>{w.calendar}</span></div></aside><AuthPanel75 key={recovery ? 'reset' : mode} auth={auth} language={language} initialMode={recovery ? 'reset' : mode} onComplete={recovery ? onRecovered : undefined} /></main>
    <footer className="mf79-first-footer"><strong>MedFLUEN</strong><span>Lavet af Visar Krasniqi</span></footer>
  </div>;
}
