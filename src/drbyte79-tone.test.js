import { tonePreview79, toneSettings79 } from './drbyte79-tone';

test('each tone previews the same example in a distinct teaching style', () => {
  const brief = tonePreview79('brief');
  const teaching = tonePreview79('teaching');
  const socratic = tonePreview79('socratic');
  expect(brief.question).toBe(teaching.question);
  expect(teaching.question).toBe(socratic.question);
  expect(new Set([brief.answer, teaching.answer, socratic.answer]).size).toBe(3);
});

test('stored style is bounded and never changes fixed source rules', () => {
  expect(toneSettings79({ tone: 'teaching', custom: 'Brug korte afsnit.' })).toEqual({ tone: 'teaching', custom: 'Brug korte afsnit.' });
  expect(toneSettings79({ tone: 'unsafe', custom: 'a'.repeat(900) })).toEqual({ tone: 'brief', custom: 'a'.repeat(500) });
});
