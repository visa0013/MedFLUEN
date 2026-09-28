const COPY = {
  da: {
    source: 'FORSKNINGSOVERSIGT',
    document: 'Selvtest & fordelt øvelse',
    documentSubtitle: 'Dunlosky m.fl. · 2013',
    passage: 'I en gennemgang af ti læringsteknikker fik selvtest og fordelt øvelse høj vurdering.',
    flashLabel: 'SPØRGSMÅL FRA KILDEN',
    question: 'Hvilke to metoder fik høj nytteværdi?',
    answer: 'Selvtest og fordelt øvelse.',
    planLabel: 'DIN EGEN PLAN',
    planIntro: 'Du vælger tidspunktet.',
    planRows: ['Læs kilden', 'Prøv kortet', 'Vend tilbage'],
  },
  en: {
    source: 'RESEARCH REVIEW',
    document: 'Practice testing & distributed practice',
    documentSubtitle: 'Dunlosky et al. · 2013',
    passage: 'A review of ten learning techniques rated practice testing and distributed practice highly.',
    flashLabel: 'QUESTION FROM THE SOURCE',
    question: 'Which two techniques rated highly?',
    answer: 'Practice testing and distributed practice.',
    planLabel: 'YOUR OWN PLAN',
    planIntro: 'You choose the timing.',
    planRows: ['Read the source', 'Try the card', 'Come back later'],
  },
  ar: {
    source: 'مراجعة بحثية',
    document: 'الاختبار الذاتي والممارسة المتباعدة',
    documentSubtitle: 'دنلوسكي وزملاؤه · ٢٠١٣',
    passage: 'قيّمت مراجعة لعشر طرائق تعلم الاختبار الذاتي والممارسة المتباعدة بدرجة مرتفعة.',
    flashLabel: 'سؤال من المصدر',
    question: 'ما الطريقتان الأعلى فائدة؟',
    answer: 'الاختبار الذاتي والممارسة المتباعدة.',
    planLabel: 'خطتك الخاصة',
    planIntro: 'أنت تختار الموعد.',
    planRows: ['اقرأ المصدر', 'جرّب البطاقة', 'عُد لاحقاً'],
  },
};

export function getCinemaCopy794(language = 'da') {
  return COPY[language] || COPY.da;
}
