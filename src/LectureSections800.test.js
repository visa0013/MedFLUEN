import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { LectureSections800 } from './LectureSections800';
global.IS_REACT_ACT_ENVIRONMENT = true;
let root, host;
const sections = [
  { id: 'mechanism', key: 'm', title: 'Sygdomsmekanisme', summary: 'Sammenhængen mellem myelin og nerveledning.', count: 3 },
  { id: 'diagnosis', key: 'd', title: 'Diagnostik', summary: 'Fra kliniske symptomer til udredning.', count: 2 },
];
function mount(props = {}) {
  host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host);
  act(() => root.render(<LectureSections800 lectureTitle="Multipel sklerose" sections={sections} {...props} />));
  return host;
}
afterEach(() => { act(() => root.unmount()); host.remove(); });
test('the story entry shows the real ordered sections, summaries and card counts without selection checkboxes', () => {
  const el = mount();
  expect(el.querySelector('h1').textContent).toBe('Multipel sklerose');
  expect([...el.querySelectorAll('.mf800-outline-title')].map(item => item.textContent)).toEqual(['Sygdomsmekanisme', 'Diagnostik']);
  expect(el.textContent).toContain('5 kort');
  expect(el.textContent).toContain('3 kort');
  expect(el.textContent).toContain('2 kort');
  expect(el.textContent).toContain(sections[0].summary);
  expect(el.querySelector('input')).toBeNull();
});
test('Start opens the complete ordered walkthrough while a section Start opens only that section', () => {
  const onStart = jest.fn(); const el = mount({ onStart });
  act(() => el.querySelector('[data-start-lecture]').click());
  expect(onStart).toHaveBeenLastCalledWith({ keys: ['m', 'd'], mode: 'guide' });
  const sectionButton = el.querySelector('[data-section="diagnosis"] .mf805-route-action');
  expect(sectionButton.getAttribute('aria-label')).toBe('Start sektionen Diagnostik');
  act(() => sectionButton.click());
  expect(onStart).toHaveBeenLastCalledWith({ keys: ['d'], mode: 'guide' });
});
test('legacy packages use question topics rather than invented section summaries', () => {
  const el = mount({ sections: [{ id: 'x', key: 'x', title: 'Undersøgelser', count: 1, topics: ['Hvilken rolle har MR?'] }] });
  expect(el.textContent).toContain('Hvilken rolle har MR?');
  expect(el.querySelector('.mf800-outline-summary')).toBeNull();
});
test('repetition and forgotten-item practice remain reachable after opening a lecture', () => {
  const onStart = jest.fn(); const el = mount({ onStart, forgottenCount: 2, onBack: jest.fn() });
  act(() => el.querySelector('[data-mode="review"]').click());
  expect(onStart).toHaveBeenLastCalledWith({ keys: ['m', 'd'], mode: 'review' });
  act(() => el.querySelector('[data-mode="forgotten"]').click());
  expect(onStart).toHaveBeenLastCalledWith({ keys: ['m', 'd'], mode: 'forgotten' });
});
test('forgotten practice cannot start without forgotten answers and an empty lecture cannot start', () => {
  const el = mount({ sections: [], onStart: jest.fn(), forgottenCount: 0 });
  expect(el.querySelector('[data-mode="forgotten"]').disabled).toBe(true);
  expect(el.querySelector('[data-start-lecture]').disabled).toBe(true);
});
test('no due repetition cards disables that action without blocking a full walkthrough', () => {
  const el = mount({ reviewCount: 0 });
  expect(el.querySelector('[data-mode="review"]').disabled).toBe(true);
  expect(el.querySelector('[data-start-lecture]').disabled).toBe(false);
});
test('saved progress is marked on the roadmap without a second resume action in the header', () => {
  const el = mount({ onContinue: jest.fn(), resumeContext: { sectionKey: 'd', sectionTitle: 'Diagnostik', position: 4, total: 5, mode: 'guide' } });
  expect(el.querySelector('[data-resume-lecture]')).toBeNull();
  expect(el.querySelectorAll('header button')).toHaveLength(1);
  expect(el.querySelector('[data-section="diagnosis"]').textContent).toContain('Her fortsætter du');
  expect(el.querySelector('[data-section="mechanism"]').textContent).not.toContain('Her fortsætter du');
  expect(el.querySelectorAll('header p')).toHaveLength(1);
});
test('a continuation without a known destination is not offered', () => {
  const el = mount({ onContinue: jest.fn() });
  expect(el.querySelector('[data-resume-lecture]')).toBeNull();
  expect(el.textContent).not.toContain('Fortsæt, hvor du var');
});
test('a saved continuation into a completed section is not offered or marked on the roadmap', () => {
  const el = mount({ queue: { completedKeys: ['d'] }, onContinue: jest.fn(), resumeContext: { sectionKey: 'd', sectionTitle: 'Diagnostik', position: 2, total: 2, mode: 'guide' } });
  expect(el.querySelector('[data-resume-lecture]')).toBeNull();
  expect(el.querySelector('[data-section="diagnosis"]').textContent).not.toContain('Her fortsætter du');
  expect(el.querySelector('[data-section="diagnosis"] .mf805-route-action').disabled).toBe(true);
});
test('Fortsæt uses the saved pending section instead of starting a fresh walkthrough', () => {
  const onContinue = jest.fn(), onStart = jest.fn();
  const queue = { sections: [{ key: 'm', ids: ['m1', 'm2', 'm3'] }, { key: 'd', ids: ['d1', 'd2'] }], sectionIndex: 1, remaining: ['d2'], pendingBySection: { m: [], d: ['d2'] }, completedKeys: ['m'] };
  const el = mount({ queue, onStart, onContinue, resumeContext: { sectionKey: 'd', mode: 'guide' } });
  const action = el.querySelector('[data-section="diagnosis"] .mf805-route-action');
  expect(action.textContent).toContain('Fortsæt');
  act(() => action.click());
  expect(onContinue).toHaveBeenCalledWith('d');
  expect(onStart).not.toHaveBeenCalled();
  expect(el.querySelector('[data-section="mechanism"] .mf805-route-action').disabled).toBe(true);
});
test('a saved section boundary does not pretend there is a next unanswered card', () => {
  const el = mount({ onContinue: jest.fn(), resumeContext: { sectionKey: 'm', sectionTitle: 'Sygdomsmekanisme', pendingTransition: true, position: 3, total: 3, mode: 'guide' } });
  expect(el.querySelector('[data-resume-lecture]')).toBeNull();
  expect(el.querySelector('[data-start-lecture]')).not.toBeNull();
});
test('the lecture entry makes its target-specific upload prompt reachable', () => {
  const onPrompt = jest.fn(); const el = mount({ onPrompt });
  const prompt = el.querySelector('[data-lecture-prompt]');
  expect(prompt.textContent).toContain('Upload-prompt');
  act(() => prompt.click());
  expect(onPrompt).toHaveBeenCalledTimes(1);
});
test('today-start and scoped reset are available above the roadmap, with repetition history below', () => {
  const progress = { total: 5, todayCount: 2, studiedCount: 3, totalReviews: 7, todayKey: '2026-10-03', rows: [], days: [], now: 0 };
  const onStartToday = jest.fn();
  const el = mount({ progress, onStartToday, onReset: jest.fn() });
  expect(el.querySelector('[data-start-today]')).not.toBeNull();
  expect(el.querySelector('[data-start-lecture]')).toBeNull();
  expect(el.querySelector('[data-forget-lecture]')).not.toBeNull();
  expect(el.querySelector('.mf806-controls').compareDocumentPosition(el.querySelector('.mf805-route')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(el.querySelector('.mf805-route').compareDocumentPosition(el.querySelector('.mf806-progress')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  act(() => el.querySelector('[data-start-today]').click());
  expect(onStartToday).toHaveBeenCalledTimes(1);
});
test('waiting for a repeat is not presented as a completed section or a new card position', () => {
  const el = mount({ onContinue: jest.fn(), resumeContext: { sectionKey: 'm', sectionTitle: 'Sygdomsmekanisme', waiting: true, position: 3, total: 3, mode: 'guide' } });
  expect(el.querySelector('[data-resume-lecture]')).toBeNull();
  expect(el.querySelector('[data-section="mechanism"]').getAttribute('data-state')).not.toBe('done');
});
