import React from 'react';

const researchUrl = 'https://www.psychologicalscience.org/journals/pspi/1529100612453266/';

const copy = {
  da: {
    eyebrow: 'FRA KILDE TIL EGEN RYTME',
    headline: 'Det hele begynder med noget, du allerede har.',
    intro: 'En kilde er mere værd, når du kan bruge den. Her følger én konkret pointe vejen fra læsning til et spørgsmål og videre til den tid, du selv sætter af.',
    sourceLead: 'Eksemplet bygger på en virkelig forskningsoversigt af Dunlosky m.fl. (2013).',
    sourceLink: 'Læs kilden',
    sourceType: 'FORSKNINGSOVERSIGT',
    authors: 'DUNLOSKY M.FL. · 2013',
    paperTitle: <>Selvtest <span>&amp;</span><br />fordelt øvelse</>,
    finding: 'To af ti undersøgte læringsteknikker fik en høj vurdering af deres anvendelighed.',
    journal: 'Psychological Science in the Public Interest',
    cardLabel: 'ET SPØRGSMÅL FRA KILDEN',
    question: 'Hvilke to metoder fik høj nytteværdi?',
    answer: 'Selvtest og fordelt øvelse.',
    rhythm: 'DIN EGEN RYTME',
    rhythmIntro: 'Vælg selv, hvornår du vender tilbage.',
    rhythmRows: [['01', 'Læs kilden'], ['02', 'Prøv kortet'], ['03', 'Sæt tid af igen']],
    steps: [
      ['01', 'Fra kilden', 'Start med din forelæsnings-PDF eller en anden kilde. En note kan ligge ved netop den side, hvor du fik en idé, så sammenhængen er til at finde igen. Her bruger vi en offentlig forskningsoversigt som et konkret eksempel.'],
      ['02', 'Til kortet', 'Gør én pointe til et spørgsmål, du kan besvare uden at kigge. I eksemplet er spørgsmålet, hvilke to studieteknikker der fik høj vurdering. Først når du har forsøgt, vender du kortet og ser svaret.'],
      ['03', 'Til overblikket', 'Undervisning og dine egne aftaler kan ses i den samme kalender. Du vælger selv, hvornår du vil læse videre eller vende tilbage til spørgsmålet; en ændring i skemaet flytter ikke automatisk dine valg.'],
    ],
  },
  en: {
    eyebrow: 'FROM SOURCE TO YOUR OWN RHYTHM',
    headline: 'It starts with something you already have.',
    intro: 'A source becomes more useful when you can act on it. Follow one concrete idea from reading to a question, then to time you choose to set aside.',
    sourceLead: 'This example is based on a real research review by Dunlosky et al. (2013).',
    sourceLink: 'Read the source',
    sourceType: 'RESEARCH REVIEW',
    authors: 'DUNLOSKY ET AL. · 2013',
    paperTitle: <>Practice testing <span>&amp;</span><br />spaced practice</>,
    finding: 'Two of ten learning techniques received high utility ratings.',
    journal: 'Psychological Science in the Public Interest',
    cardLabel: 'A QUESTION FROM THE SOURCE',
    question: 'Which two techniques rated highly?',
    answer: 'Practice testing and distributed practice.',
    rhythm: 'YOUR OWN RHYTHM',
    rhythmIntro: 'Choose when to return to it.',
    rhythmRows: [['01', 'Read the source'], ['02', 'Try the card'], ['03', 'Make time to return']],
    steps: [
      ['01', 'From the source', 'Start with a lecture PDF or another source. A note can stay beside the very page that sparked an idea, so you can find the context again. Here, we use a public research review as a concrete example.'],
      ['02', 'To the card', 'Turn one point into a question you can answer without looking. In this example, ask which two study techniques earned high ratings. Try to recall them before turning the card to see the answer.'],
      ['03', 'To the bigger picture', 'Teaching and your own appointments can appear in the same calendar. You decide when to read further or revisit the question; a timetable change does not silently move your choices.'],
    ],
  },
  ar: {
    eyebrow: 'من المصدر إلى إيقاعك الخاص',
    headline: 'تبدأ بما لديك بالفعل.',
    intro: 'تصبح المادة أكثر فائدة حين تستخدمها. تتبع فكرة محددة من القراءة إلى سؤال، ثم إلى وقت تختاره بنفسك للمراجعة.',
    sourceLead: 'يستند المثال إلى مراجعة بحثية حقيقية لدنلوسكي وزملائه (2013).',
    sourceLink: 'اقرأ المصدر',
    sourceType: 'مراجعة بحثية',
    authors: 'دنلوسكي وزملاؤه · ٢٠١٣',
    paperTitle: <>الاختبار الذاتي <span>و</span><br />الممارسة المتباعدة</>,
    finding: 'حصلت طريقتان من عشر طرائق للتعلم على تقييم مرتفع للفائدة.',
    journal: 'Psychological Science in the Public Interest',
    cardLabel: 'سؤال من المصدر',
    question: 'ما الطريقتان الأعلى فائدة؟',
    answer: 'الاختبار الذاتي والممارسة المتباعدة.',
    rhythm: 'إيقاعك الخاص',
    rhythmIntro: 'اختر بنفسك موعد العودة إلى المادة.',
    rhythmRows: [['٠١', 'اقرأ المصدر'], ['٠٢', 'جرّب البطاقة'], ['٠٣', 'خصص وقتاً للمراجعة']],
    steps: [
      ['٠١', 'من المصدر', 'ابدأ بملف المحاضرة أو أي مصدر آخر. يمكن حفظ ملاحظة بجانب الصفحة التي ولّدت الفكرة، حتى تعود إلى سياقها بسهولة. نستخدم هنا مراجعة بحثية عامة مثالاً محدداً.'],
      ['٠٢', 'إلى البطاقة', 'حوّل فكرة واحدة إلى سؤال تجيب عنه من ذاكرتك. في هذا المثال، اسأل عن طريقتَي الدراسة اللتين حصلتا على تقييم مرتفع. حاول التذكر أولاً، ثم اقلب البطاقة لترى الإجابة.'],
      ['٠٣', 'إلى الصورة الكاملة', 'يمكن عرض المحاضرات ومواعيدك الخاصة في التقويم نفسه. أنت تختار موعد القراءة والمراجعة، ولا يؤدي تغيير الجدول إلى نقل اختياراتك تلقائياً.'],
    ],
  },
};

export function ProductStory795({ language = 'da' }) {
  const words = copy[language] || copy.da;
  return <section className="mf794-product-story mf795-product-story" aria-label={words.headline}>
    <div className="mf794-story-lead">
      <small>{words.eyebrow}</small>
      <h2>{words.headline}</h2>
      <p>{words.intro}</p>
      <p className="mf795-source-credit">{words.sourceLead} <a href={researchUrl} target="_blank" rel="noopener noreferrer">{words.sourceLink}<span aria-hidden="true"> ↗</span></a></p>
    </div>
    <div className="mf794-story-layout">
      <div className="mf794-story-art" aria-hidden="true">
        <div className="mf794-story-halo" />
        <div className="mf794-story-pdf">
          <header><span className="mf795-document-symbol">◫</span>{words.sourceType}</header>
          <div className="mf794-story-paper"><small>{words.authors}</small><strong>{words.paperTitle}</strong><p>{words.finding}</p></div>
          <footer>{words.journal}</footer>
        </div>
        <div className="mf794-story-card"><small>{words.cardLabel}</small><strong>{words.question}</strong><span>{words.answer}</span></div>
        <div className="mf794-story-week"><small>{words.rhythm}</small><p>{words.rhythmIntro}</p>{words.rhythmRows.map(([index, label]) => <div key={index}><span>{index}</span><b>{label}</b></div>)}</div>
      </div>
      <div className="mf794-story-steps">{words.steps.map(([number, title, description]) => <article key={number}><small>{number} / 03</small><h3>{title}</h3><p>{description}</p></article>)}</div>
    </div>
  </section>;
}
