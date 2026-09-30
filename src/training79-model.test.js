import { examRows79, trainingCards79 } from './training79-model';

const cards = [
  { id: 'theory', front: 'A' },
  { id: 'exam', examSetId: 'paper-1', cardType: 'mcq' },
  { id: 'shared', sources: ['theory'] },
  { id: 'shared', sources: ['exam-mcq'], cardType: 'mcq' },
];

test('a shared card is counted once and source filters do not mutate input', () => {
  const snapshot = JSON.stringify(cards);
  expect(trainingCards79(cards, 'all').map(card => card.id)).toEqual(['theory', 'exam', 'shared']);
  expect(trainingCards79(cards, 'theory').map(card => card.id)).toEqual(['theory', 'shared']);
  expect(trainingCards79(cards, 'exam-mcq').map(card => card.id)).toEqual(['exam', 'shared']);
  expect(JSON.stringify(cards)).toBe(snapshot);
});

test('exam list states answers explicitly and never invents a key', () => {
  const documents = [
    { id: 'no-key', name: '2025', parseMeta: { answerMode: 'none' } },
    { id: 'key', name: '2026', parseMeta: { answerMode: 'separate' }, answerStoragePath: 'answers.pdf' },
  ];
  expect(examRows79(documents, 'without', '').map(row => [row.id, row.hasAnswer])).toEqual([['no-key', false]]);
  expect(examRows79(documents, 'with', '').map(row => [row.id, row.hasAnswer])).toEqual([['key', true]]);
});

test('imported exam decks are shown only as exams, including non-MCQ cards', () => {
  const imported = [{ id: 'anki-1', cardType: 'basic', richContent: { anki: { deck: "Visar's eksamensforberedende K3-ANKI::Diabetes" } } }];
  expect(trainingCards79(imported, 'theory')).toEqual([]);
  expect(trainingCards79(imported, 'exam-mcq').map(card => card.id)).toEqual(['anki-1']);
});
