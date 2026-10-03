import { calendarHeading791, selectedDeck791, primaryArea791 } from './workspace791-model';

test('open workspace owns navigation selection over a background training route',()=>{
  expect(primaryArea791('mcq','lectures')).toBe('curriculum');
  expect(primaryArea791('mcq','notes')).toBe('notes');
  expect(primaryArea791('mcq','examSets')).toBe('exams');
  expect(primaryArea791('home',null)).toBe('home');
  expect(primaryArea791('mcq',null)).toBe('training');
  expect(primaryArea791('exams',null)).toBe('exams');
  expect(primaryArea791('study-plan',null)).toBe('home');
});

test('week heading includes both dates across month and year boundaries', () => {
  const value=calendarHeading791(new Date(2026,11,31,12),'week','en-GB');
  expect(value).toContain('28'); expect(value).toContain('Dec'); expect(value).toContain('3'); expect(value).toContain('Jan'); expect(value).toContain('2027');
});
test('month heading does not pretend to be a single day', () => {
  expect(calendarHeading791(new Date(2026,8,24,12),'month','en-GB')).toBe('September 2026');
});
test('selection uses a valid remembered deck, otherwise first populated lecture', () => {
  const leaf={id:'lecture:n7',questions:[{id:'q'}]},empty={id:'lecture:n1',questions:[]};
  const tree={id:'root',children:[{id:'group',children:[empty,leaf]}]};
  expect(selectedDeck791(tree,'lecture:n1')).toBe(empty);
  expect(selectedDeck791(tree,'gone')).toBe(leaf);
  expect(selectedDeck791({id:'empty',children:[]},null).id).toBe('empty');
});
