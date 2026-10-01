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
  const sectionButton = el.querySelector('[data-section="diagnosis"] button');
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
test('continuation identifies the actual section and saved card position before opening it', () => {
  const onContinue = jest.fn();
  const el = mount({ onContinue, resumeContext: { sectionKey: 'd', sectionTitle: 'Diagnostik', position: 4, total: 5, mode: 'guide' } });
  const resume = el.querySelector('[data-resume-lecture]');
  expect(resume.textContent).toContain('Diagnostik');
  expect(resume.textContent).toContain('Kort 4 af 5');
  expect(el.querySelector('[data-section="diagnosis"]').textContent).toContain('Her fortsætter du');
  expect(el.querySelector('[data-section="mechanism"]').textContent).not.toContain('Her fortsætter du');
  act(() => resume.click());
  expect(onContinue).toHaveBeenCalledTimes(1);
});
test('a continuation without a known destination is not offered', () => {
  const el = mount({ onContinue: jest.fn() });
  expect(el.querySelector('[data-resume-lecture]')).toBeNull();
  expect(el.textContent).not.toContain('Fortsæt, hvor du var');
});
test('the lecture entry makes its target-specific upload prompt reachable', () => {
  const onPrompt = jest.fn(); const el = mount({ onPrompt });
  const prompt = el.querySelector('[data-lecture-prompt]');
  expect(prompt.textContent).toContain('Upload-prompt');
  act(() => prompt.click());
  expect(onPrompt).toHaveBeenCalledTimes(1);
});
