import { lectureStudyCards800 } from './lecture800-model';

export function legacyLectureJourney801(savedResume, questions, sections, mode) {
  if (mode !== 'guide' || savedResume?.journey800 || !Number.isInteger(savedResume?.index) || !Array.isArray(questions) || savedResume.index < 0 || savedResume.index >= questions.length) return null;
  return { keys: sections.map(section => section.key), mode: 'guide', questionIds: questions.map(question => question.id), forgottenItems: {} };
}

export function lectureReviewScope801(scope) {
  return { ...scope, pool: 'mixed', order: 'scheduler' };
}

export function prepareLectureSession801({ questions, keys, mode = 'guide', limit = 'all', forgotten = {}, spacedData = {}, isHidden = () => false, selectReview = eligible => eligible }) {
  const eligible = lectureStudyCards800(questions, keys, mode === 'forgotten' ? forgotten : undefined).filter(card => !isHidden(spacedData[card.id]));
  const selected = mode === 'review' ? selectReview(eligible, limit) : eligible;
  const forgottenItems = mode === 'forgotten' ? Object.fromEntries(selected.map(card => [card.id, [...(forgotten[card.id] || [])]])) : {};
  return { questions: selected, plan: { keys: [...keys], mode, questionIds: selected.map(card => card.id), forgottenItems } };
}
