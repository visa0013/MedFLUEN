import React, { useEffect, useRef, useState } from 'react';
import { AuthPanel75 } from './Access75';
import { ProductCinema794 } from './ProductCinema794';
import { ProductStory795 } from './ProductStory795';
import './first-entry79.css';
import './landingMotion793.css';
import './landing794.css';
import './landing795.css';

const landingSections79 = ['mf79-main', 'mf79-overview', 'mf79-byte', 'mf79-start'];

function landingReducedMotion79(element) {
  const systemReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const inherited = element?.parentElement?.closest('[data-motion]')?.getAttribute('data-motion');
  return !!systemReduced || inherited === 'reduce';
}

function useLandingMotion79(landing, cinema, setActiveSection, setReducedMotion) {
  useEffect(() => {
    const element = landing.current;
    if (!element) return undefined;
    const sections = landingSections79.map(id => element.querySelector(`#${id}`));
    const hero = element.querySelector('.mf79-first-hero');
    const story = element.querySelector('.mf794-product-story');
    const reveals = [...element.querySelectorAll('[data-landing-reveal]')];
    const visited = new WeakSet();
    const animations = new Set();
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    let reduced = landingReducedMotion79(element);
    let frame = null;
    let stopped = false;
    let cinemaScrubbed = false;

    const update = () => {
      frame = null;
      if (stopped) return;
      const height = window.innerHeight;
      let current = landingSections79[0];
      sections.forEach((section, index) => {
        if (section && section.getBoundingClientRect().top <= height * 0.44) current = landingSections79[index];
      });
      setActiveSection(current);
      if (reduced) return;
      if (hero) {
        const rectangle = hero.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, -rectangle.top / Math.max(1, rectangle.height - height)));
        element.style.setProperty('--landing-hero-shift', `${(-12 * progress).toFixed(2)}px`);
        hero.style.setProperty('--landing-cinema-progress', progress.toFixed(3));
        hero.querySelector('.mf794-hero-stage')?.style.setProperty('--landing-cinema-progress', progress.toFixed(3));
        if (cinema.current && (progress > .01 || cinemaScrubbed)) {
          cinema.current.pause();
          cinema.current.seekTo(Math.round(progress * 240));
          cinemaScrubbed = true;
        }
      }
      if (story) {
        const rectangle = story.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, -rectangle.top / Math.max(1, rectangle.height - height)));
        story.style.setProperty('--mf794-story-progress', progress.toFixed(3));
      }
      reveals.forEach(item => {
        if (visited.has(item)) return;
        const rectangle = item.getBoundingClientRect();
        if (rectangle.top >= height * 0.92 || rectangle.bottom <= 0) return;
        visited.add(item);
        // Content starts visible. Animation support never gates access to it.
        if (typeof item.animate !== 'function') return;
        try {
          const animation = item.animate([
            { opacity: 0.68, transform: 'translateY(16px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ], { duration: 480, delay: Number(item.dataset.landingReveal) * 65, easing: 'cubic-bezier(.22,.68,.24,1)', fill: 'backwards' });
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        } catch { /* An unsupported animation must leave the section readable. */ }
      });
    };
    const schedule = () => {
      if (frame === null && !stopped) frame = window.requestAnimationFrame(update);
    };
    const preferenceChanged = () => {
      reduced = landingReducedMotion79(element);
      setReducedMotion(reduced);
      element.dataset.landingMotion = reduced ? 'reduce' : 'full';
      if (reduced) {
        animations.forEach(animation => animation.cancel());
        animations.clear();
        element.style.removeProperty('--landing-hero-shift');
        story?.style.removeProperty('--mf794-story-progress');
      }
      schedule();
    };
    const observer = typeof MutationObserver === 'function' ? new MutationObserver(preferenceChanged) : null;
    // Only appearance attributes are watched; animation styles do not trigger work.
    observer?.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['data-motion'] });
    media?.addEventListener?.('change', preferenceChanged);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    preferenceChanged();
    return () => {
      stopped = true;
      if (frame !== null) window.cancelAnimationFrame(frame);
      animations.forEach(animation => animation.cancel());
      observer?.disconnect();
      media?.removeEventListener?.('change', preferenceChanged);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [landing, cinema, setActiveSection, setReducedMotion]);
}

const copy = {
  da: { login: 'Log ind', signup: 'Opret konto', try: 'Udforsk appen', top: 'Et studierum, der hænger sammen.', titleA: 'Slå pensum', titleB: 'med et smæk.', lead: 'Fra forelæsningssliden til spørgsmålet, du faktisk kan svare på. MedFLUEN samler dine materialer, flashkort og kalender uden at bestemme, hvordan du skal læse.', explore: 'Se hvordan det virker', sample: 'DEMO · INGEN OPLYSNINGER FRA RIGTIGE STUDERENDE', sampleLong: 'Ingen oplysninger fra rigtige studerende', preview: 'Et kig på dit studierum', archive: 'Forelæsninger', train: 'Flashkort', calendar: 'Kalender', question: 'Hvad er aktiv genkaldelse?', answer: 'At forsøge at hente svaret frem fra hukommelsen, før du ser facit.', reveal: 'Vis svar', hide: 'Skjul svar', chapters: 'DET HÆNGER SAMMEN', chapterTitle: 'Ét forløb. Flere måder at forstå det på.', chapterLead: 'Du kan begynde dér, hvor det giver mening for dig. Dine kilder, kort og aftaler bliver ved med at være tæt på.', one: 'Læs i kontekst', oneBody: 'Find forelæsningen, åbn dens PDF, og gem en note til den side, du faktisk læser.', two: 'Øv det, du vil huske', twoBody: 'Arbejd med teoretiske kort eller MCQ fra eksamenssæt. Blå, rød og grøn viser, hvad der er nyt, i gang og klar til repetition.', three: 'Se ugen som den er', threeBody: 'Undervisning og din egen studieplan deler en kalender. En skemaændring flytter ikke automatisk dine personlige valg.', byte: 'Dr. Byte, når du har brug for et ekstra perspektiv', byteBody: 'Spørg til valgte forelæsnings-PDF’er. Når der er læsbar tekst, kan kilden åbnes på den konkrete PDF-side. Du vælger selv, hvad der deles.', last: 'Alt begynder med ét sted.', lastBody: 'Opret din konto, eller log ind og fortsæt, hvor du slap.', faq: 'Spørgsmål, før du begynder', faqRows: [['Bestemmer MedFLUEN min studieplan?', 'Nej. Kalenderen og planen er værktøjer, du styrer selv.'], ['Er alle forelæsninger med?', 'Indholdet afhænger af det modul, der er gjort tilgængeligt. Du kan også tilføje dine egne kort og noter.'], ['Kan Dr. Byte læse scannede PDF’er?', 'Kun PDF’er med et læsbart tekstlag kan bruges som kilder i chatten. OCR er ikke automatisk slået til.']], return: 'Til forsiden' },
  en: { login: 'Sign in', signup: 'Create account', try: 'Explore the app', top: 'A study space that connects.', titleA: 'Bring your studies', titleB: 'together.', lead: 'From lecture slides to the questions you can answer. MedFLUEN brings materials, flashcards and calendar together without telling you how to study.', explore: 'See how it works', sample: 'DEMO · NO REAL STUDENT DATA', sampleLong: 'No real student data', preview: 'A look at your study space', archive: 'Lectures', train: 'Flashcards', calendar: 'Calendar', question: 'What is active recall?', answer: 'Trying to retrieve an answer from memory before looking at it.', reveal: 'Show answer', hide: 'Hide answer', chapters: 'CONNECTED BY DESIGN', chapterTitle: 'One course. Several ways to understand it.', chapterLead: 'Begin where it makes sense to you. Sources, cards and dates stay close together.', one: 'Read in context', oneBody: 'Find a lecture, open its PDF and keep a note beside the exact page.', two: 'Practise what matters', twoBody: 'Use theory cards or exam MCQ. Blue, red and green show new, learning and ready-to-review cards.', three: 'See the actual week', threeBody: 'Teaching and your personal plan share one calendar. Schedule changes never silently move your choices.', byte: 'Dr. Byte, when you need another perspective', byteBody: 'Ask about selected lecture PDFs. When text is available, citations open the exact PDF page. You decide what to share.', last: 'It starts in one place.', lastBody: 'Create an account or sign in to pick up where you left off.', faq: 'Before you begin', faqRows: [['Does MedFLUEN set my study plan?', 'No. The calendar and plan are tools under your control.'], ['Is every lecture included?', 'Availability depends on the module. You can add your own cards and notes.'], ['Can Dr. Byte read scanned PDFs?', 'Only PDFs with extractable text can be used as chat sources. OCR is not automatically enabled.']], return: 'Back to home' },
  ar: { login: 'تسجيل الدخول', signup: 'إنشاء حساب', try: 'استكشف التطبيق', top: 'مساحة دراسة مترابطة.', titleA: 'اجمع دراستك', titleB: 'في مكان واحد.', lead: 'من شريحة المحاضرة إلى السؤال الذي تستطيع الإجابة عنه. تجمع ميدفلوين المواد والبطاقات والتقويم دون أن تفرض عليك طريقة للدراسة.', explore: 'كيف يعمل', sample: 'عرض تجريبي · بلا بيانات حقيقية', sampleLong: 'بلا بيانات حقيقية للطلاب', preview: 'مساحة دراستك', archive: 'المحاضرات', train: 'البطاقات', calendar: 'التقويم', question: 'ما الاستدعاء النشط؟', answer: 'محاولة تذكر الإجابة قبل الاطلاع عليها.', reveal: 'إظهار الإجابة', hide: 'إخفاء الإجابة', chapters: 'تجربة مترابطة', chapterTitle: 'مقرر واحد، طرق متعددة للفهم.', chapterLead: 'ابدأ من حيث يناسبك؛ تبقى المصادر والبطاقات والمواعيد مترابطة.', one: 'اقرأ في سياق', oneBody: 'افتح المحاضرة وملف PDF، وأضف ملاحظة للصفحة نفسها.', two: 'تدرب على ما يهمك', twoBody: 'استخدم بطاقات النظرية أو أسئلة الامتحان. الألوان تبين الجديد والتعلم والمراجعة.', three: 'انظر إلى أسبوعك', threeBody: 'يجمع التقويم التدريس وخطتك الخاصة دون تغيير اختياراتك تلقائياً.', byte: 'د. بايت لمنظور إضافي', byteBody: 'اسأل عن ملفات المحاضرات المختارة، وافتح المصدر في صفحة PDF محددة. أنت تختار ما تشاركه.', last: 'البداية في مكان واحد.', lastBody: 'أنشئ حسابك أو سجل الدخول للمتابعة.', faq: 'قبل أن تبدأ', faqRows: [['هل يحدد التطبيق خطة دراستي؟', 'لا. التقويم والخطة أدوات تتحكم بها أنت.'], ['هل تتوفر كل المحاضرات؟', 'يعتمد ذلك على محتوى المقرر. يمكنك إضافة بطاقاتك وملاحظاتك.'], ['هل يستطيع د. بايت قراءة ملفات ممسوحة ضوئياً؟', 'فقط ملفات PDF ذات النص القابل للاستخراج؛ لا يعمل OCR تلقائياً.']], return: 'العودة إلى البداية' },
};

const preview795 = {
  da: { category: 'STUDIETEKNIK / FORSKNINGSKILDE', question: 'Hvilke to læringsteknikker fik høj vurdering?', answer: 'Selvtest og fordelt øvelse.', beforeAnswer: 'Prøv at svare, før du ser facit.', source: 'Dunlosky m.fl. · 2013', calendarLabel: 'TO TYPER AFTALER', calendarItems: [['Skema', 'Undervisning, når den er tilgængelig'], ['Din plan', 'Aftaler og læsetid, du selv vælger']], calendarFoot: 'Skift mellem dag, uge og måned.' },
  en: { category: 'STUDY METHODS / RESEARCH', question: 'Which two learning techniques rated highly?', answer: 'Practice testing and distributed practice.', beforeAnswer: 'Try to answer before revealing it.', source: 'Dunlosky et al. · 2013', calendarLabel: 'TWO KINDS OF EVENTS', calendarItems: [['Timetable', 'Teaching when available'], ['Your plan', 'Appointments and study time you choose']], calendarFoot: 'Switch between day, week and month.' },
  ar: { category: 'أساليب الدراسة / بحث', question: 'ما طريقتا التعلم الأعلى تقييماً؟', answer: 'الاختبار الذاتي والممارسة المتباعدة.', beforeAnswer: 'حاول الإجابة قبل كشفها.', source: 'دنلوسكي وزملاؤه · ٢٠١٣', calendarLabel: 'نوعان من المواعيد', calendarItems: [['الجدول', 'المحاضرات عند توفرها'], ['خطتك', 'مواعيد الدراسة التي تختارها']], calendarFoot: 'بدّل بين اليوم والأسبوع والشهر.' },
};

function Demo79({ words, language }) {
  const preview = preview795[language] || preview795.da;
  const [tab, setTab] = useState('train');
  const [shown, setShown] = useState(false);
  return <div className="mf79-first-demo" aria-label={words.preview}>
    <header><span className="mf79-first-demo-mark" aria-hidden="true">m<span>f</span></span><span>{words.preview}</span></header>
    <div className="mf79-first-demo-frame"><nav aria-label={words.preview}>{[['archive', words.archive], ['train', words.train], ['calendar', words.calendar]].map(([id, label]) => <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</button>)}</nav>
      {tab === 'train' && <div className="mf79-first-demo-training"><div><small>{preview.category}</small><h3>{preview.question}</h3><button type="button" onClick={() => setShown(value => !value)}>{shown ? words.hide : words.reveal}<span aria-hidden="true">↗</span></button></div><div className="mf79-first-demo-answer">{shown ? <p>{preview.answer}</p> : <p>{preview.beforeAnswer}</p>}</div><footer><span>{preview.source}</span></footer></div>}
      {tab === 'archive' && <div className="mf79-first-demo-list"><small>K5 / NEUROLOGI</small>{[['N1', 'Intro til neurologi. Neurologisk udfald'], ['N4', 'Epilepsi'], ['N7', 'Neurofysiologi ENG og EMG']].map(([code, title]) => <div key={code}><em>{code}</em><span>{title}</span><span aria-hidden="true">↗</span></div>)}</div>}
      {tab === 'calendar' && <div className="mf79-first-demo-week"><small>{preview.calendarLabel}</small>{preview.calendarItems.map(([category, description]) => <div key={category}><strong>{category}</strong><span>{description}</span></div>)}<p>{preview.calendarFoot}</p></div>}
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
  return <section className="mf79-first-paths" id="mf79-start" tabIndex={-1} aria-label={words.title}>
    <div className="mf79-first-path-intro" data-landing-reveal="0"><small>{words.eyebrow}</small><h2>{words.title}</h2><p>{words.lead}</p></div>
    <div className="mf79-first-path-stage" data-landing-reveal="1"><nav aria-label={words.title}>{words.paths.map((item, index) => <button key={item.label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><span>0{index + 1}</span>{item.label}<span aria-hidden="true">↗</span></button>)}</nav>
      <div className="mf79-first-path-detail"><small>0{selected + 1} / 03</small><h3>{path.title}</h3><ol>{path.steps.map(step => <li key={step}>{step}</li>)}</ol><button type="button" onClick={() => onAccess('signup')}>{words.start}<span aria-hidden="true">↗</span></button></div>
    </div>
  </section>;
}

export function Landing79({ onAccess, language = 'da' }) {
  const w = copy[language] || copy.da;
  const landing = useRef(null);
  const cinema = useRef(null);
  const [activeSection, setActiveSection] = useState('mf79-main');
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  useLandingMotion79(landing, cinema, setActiveSection, setReducedMotion);
  const labels = [w.top, w.chapterTitle, w.byte, (starts79[language] || starts79.da).title];
  const navigate = event => {
    const anchor = event.target.closest?.('a[href^="#mf79-"]');
    if (!anchor || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const id = anchor.getAttribute('href').slice(1);
    const destination = landing.current?.querySelector(`#${id}`);
    if (!destination) return;
    setActiveSection(id);
    if (typeof destination.scrollIntoView !== 'function') return;
    event.preventDefault();
    destination.scrollIntoView({ behavior: landingReducedMotion79(landing.current) ? 'auto' : 'smooth', block: 'start' });
    destination.focus({ preventScroll: true });
    window.history.replaceState(window.history.state, '', `#${id}`);
  };
  return <div className="mf79-first mf793-landing mf794-landing mf795-landing" ref={landing} onClick={navigate} dir={language === 'ar' ? 'rtl' : undefined}>
    <a className="mf79-first-skip" href="#mf79-main">{w.try}</a>
    <nav className="mf79-first-progress" style={{ '--progress-index': landingSections79.indexOf(activeSection) }} aria-label={language === 'da' ? 'Følg siden' : language === 'ar' ? 'أقسام الصفحة' : 'Page progress'}><span className="mf793-progress-indicator" aria-hidden="true" />{landingSections79.map((id, index) => <a key={id} href={`#${id}`} aria-label={`0${index + 1} / 04 — ${labels[index]}`} title={labels[index]} aria-current={activeSection === id ? 'location' : undefined}><span aria-hidden="true" /></a>)}</nav>
    <header className="mf79-first-nav"><a href="#mf79-main" className="mf79-first-brand">Med<span>FLUEN</span></a><span className="mf79-first-nav-strap">{w.top}</span><nav aria-label="Konto"><a href="#mf79-overview">{w.try}</a><button type="button" onClick={() => onAccess('login')}>{w.login}</button></nav></header>
    <main id="mf79-main" tabIndex={-1}>
      <section className="mf79-first-hero mf794-hero">
        <div className="mf794-hero-sticky">
          <div className="mf79-first-hero-text"><small>MEDFLUEN / STUDIERUMMET</small><h1>{w.titleA}<em>{w.titleB}</em></h1><p>{w.lead}</p><div className="mf79-first-hero-actions"><button type="button" onClick={() => onAccess('signup')}>{w.signup}<span aria-hidden="true">↗</span></button><a href="#mf79-overview">{w.explore}<span aria-hidden="true">↓</span></a></div></div>
          <div className="mf794-hero-stage" aria-hidden="true"><ProductCinema794 playerRef={cinema} className="mf794-hero-motion" language={language} reducedMotion={reducedMotion}/></div>
          <div className="mf795-hero-progress" aria-hidden="true"><span /></div>
        </div>
      </section>
      <ProductStory795 language={language} />
      <section className="mf79-first-overview" id="mf79-overview" tabIndex={-1}><div className="mf79-first-overview-lead" data-landing-reveal="0"><span>01—04</span><h2>{w.chapterTitle}</h2><p>{w.chapterLead}</p></div><div data-landing-reveal="1"><Demo79 words={w} language={language}/></div></section>
      <section className="mf79-first-chapters" aria-label={w.chapters}>{[[w.one,w.oneBody,'01'],[w.two,w.twoBody,'02'],[w.three,w.threeBody,'03']].map(([title, body, number], index) => <article key={number} data-landing-reveal={index}><small>{number} / 03</small><h3>{title}</h3><p>{body}</p></article>)}</section>
      <section className="mf79-first-byte" id="mf79-byte" tabIndex={-1}><div className="mf79-first-orb" data-landing-reveal="0" aria-hidden="true"/><div data-landing-reveal="1"><small>DR. BYTE / KILDER</small><h2>{w.byte}</h2><p>{w.byteBody}</p></div></section>
      <StartPaths79 language={language} onAccess={onAccess}/>
      <section className="mf79-first-finale"><div className="mf793-finale-copy" data-landing-reveal="0"><span>MEDFLUEN / 01</span><h2>{w.last}</h2><p>{w.lastBody}</p></div><div data-landing-reveal="1"><button type="button" onClick={() => onAccess('signup')}>{w.signup}<span aria-hidden="true">↗</span></button><button type="button" onClick={() => onAccess('login')}>{w.login}</button></div></section>
    </main><footer className="mf79-first-footer" data-landing-reveal="0"><strong>MedFLUEN</strong><span>Lavet af Visar Krasniqi</span><a href="#mf79-main" aria-label={w.return}>↑</a></footer>
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
