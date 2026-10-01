import pack from '../docs/examples/multipel-sklerose-test/lecture.json';
import { validateLecture800, lectureRecords800, lectureSections800 } from './lecture800-model';

test('the eight real MS test cards import in four ordered sections with answer-only glossary help', () => {
  const rows = lectureRecords800(validateLecture800(pack), pack.lecture);
  expect(rows).toHaveLength(8);
  expect(pack.lecture.lectureId).toBe('N10');
  expect(lectureSections800(rows).map(section => section.count)).toEqual([2, 2, 2, 2]);
  expect(pack.sections.every(section => section.summary?.length > 20)).toBe(true);
  expect(new Set(pack.cards.map(card => card.type))).toEqual(new Set(['basic', 'recall-list', 'mcq']));
  pack.cards.forEach(card => {
    expect(card.question).not.toContain('[[');
    (card.options || []).forEach(option => expect(option.text).not.toContain('[['));
  });
});
