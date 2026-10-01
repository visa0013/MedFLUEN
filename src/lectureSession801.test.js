import { legacyLectureJourney801, lectureReviewScope801, prepareLectureSession801 } from './lectureSession801';
import { sectionKey800 } from './lecture800-model';
const make = (id, section, order) => ({ id, lectureContent: { packageId: 'test', target: { moduleId: 'K5', lectureId: 'N10' }, section: { id: section, order: section === 'a' ? 1 : 2 }, card: { order } } });
const cards = [make('b1', 'b', 1), make('a2', 'a', 2), make('a1', 'a', 1)];
const keys = [sectionKey800(cards[2].lectureContent), sectionKey800(cards[0].lectureContent)];
test('a chosen lecture section uses the real ordered cards and excludes manually hidden cards', () => {
  const result = prepareLectureSession801({ questions: cards, keys: [keys[0]], mode: 'guide', spacedData: { a2: { hidden: true } }, isHidden: state => state?.hidden });
  expect(result.questions.map(card => card.id)).toEqual(['a1']);
  expect(result.plan.questionIds).toEqual(['a1']);
  expect(result.plan.keys).toEqual([keys[0]]);
});
test('forgotten practice snapshots only the forgotten answers within the chosen sections', () => {
  const forgotten = { a1: ['answer-1'], b1: ['answer-2'] };
  const result = prepareLectureSession801({ questions: cards, keys: [keys[0]], mode: 'forgotten', forgotten });
  expect(result.questions.map(card => card.id)).toEqual(['a1']);
  expect(result.plan.forgottenItems).toEqual({ a1: ['answer-1'] });
  forgotten.a1.push('answer-3');
  expect(result.plan.forgottenItems.a1).toEqual(['answer-1']);
});
test('repetition preserves the real scheduler selection and limit without changing guide order', () => {
  const result = prepareLectureSession801({ questions: cards, keys, mode: 'review', limit: 1, selectReview: (eligible, limit) => [...eligible].reverse().slice(0, limit) });
  expect(result.questions.map(card => card.id)).toEqual(['b1']);
  expect(result.plan.questionIds).toEqual(['b1']);
  const guide = prepareLectureSession801({ questions: cards, keys, mode: 'guide', limit: 1 });
  expect(guide.questions.map(card => card.id)).toEqual(['a1', 'a2', 'b1']);
});

test('a valid legacy guide resume snapshots its original card order and section keys', () => {
  const questions = [...cards];
  const sections = [{ key: 'section-a' }, { key: 'section-b' }];
  const journey = legacyLectureJourney801({ index: 1, answers: {} }, questions, sections, 'guide');
  expect(journey).toEqual({
    keys: ['section-a', 'section-b'],
    mode: 'guide',
    questionIds: ['b1', 'a2', 'a1'],
    forgottenItems: {},
  });
  questions.reverse();
  sections[0].key = 'changed-section';
  expect(journey.questionIds).toEqual(['b1', 'a2', 'a1']);
  expect(journey.keys).toEqual(['section-a', 'section-b']);
});

test.each([0, 2])('a legacy guide resume accepts valid boundary index %s', index => {
  expect(legacyLectureJourney801({ index }, cards, [{ key: 'a' }], 'guide')).not.toBeNull();
});

test.each([
  ['missing resume', null, cards, 'guide'],
  ['missing index', {}, cards, 'guide'],
  ['negative index', { index: -1 }, cards, 'guide'],
  ['end index', { index: 3 }, cards, 'guide'],
  ['fractional index', { index: 1.5 }, cards, 'guide'],
  ['string index', { index: '1' }, cards, 'guide'],
  ['missing pool', { index: 0 }, null, 'guide'],
  ['empty pool', { index: 0 }, [], 'guide'],
  ['existing journey', { index: 1, journey800: { mode: 'guide' } }, cards, 'guide'],
  ['review mode', { index: 1 }, cards, 'review'],
  ['forgotten mode', { index: 1 }, cards, 'forgotten'],
])('legacy journey rejects %s', (_label, savedResume, questions, mode) => {
  expect(legacyLectureJourney801(savedResume, questions, [{ key: 'a' }], mode)).toBeNull();
});

test.each([20, 'all'])('story review normalizes a guide scope while retaining limit %s', limit => {
  const scope = { moduleId: 'K5', lectureFilter: 'N10', pool: 'all', order: 'deck', limit, sessionQuestionIds: ['a1'] };
  const review = lectureReviewScope801(scope);
  expect(review).toEqual({ moduleId: 'K5', lectureFilter: 'N10', pool: 'mixed', order: 'scheduler', limit, sessionQuestionIds: ['a1'] });
  expect(scope.pool).toBe('all');
  expect(scope.order).toBe('deck');
  expect(review).not.toBe(scope);
});
