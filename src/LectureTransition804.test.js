import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { LectureTransition804 } from './LectureTransition804';
global.IS_REACT_ACT_ENVIRONMENT = true;
let host, root;
const sections = [{ key: 'a', title: 'Grundlag', count: 2, summary: 'Definitioner og ætiologi.' }, { key: 'b', title: 'Diagnostik', count: 2, summary: 'Klinik og EEG.' }, { key: 'c', title: 'Behandling', count: 1 }];
const queue = { sections: sections.map(s => ({ key: s.key, title: s.title, ids: s.key === 'c' ? ['c1'] : [`${s.key}1`, `${s.key}2`] })), sectionIndex: 0, remaining: [], completedKeys: ['a'], pendingBySection: { a: [], b: ['b1', 'b2'], c: ['c1'] }, dueById: {} };
beforeEach(() => { host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host); });
afterEach(() => { act(() => root.unmount()); host.remove(); });
test('roadmap shows real progress and allows any next section, not only a single next button', () => {
  const onChoose = jest.fn();
  act(() => root.render(<LectureTransition804 sections={sections} queue={queue} lectureTitle="Epilepsi" onChoose={onChoose} onExit={() => {}} now={1000} />));
  expect(document.activeElement).toBe(host.querySelector('h1'));
  expect(host.querySelector('[role="progressbar"]').getAttribute('aria-valuenow')).toBe('1');
  expect(host.querySelectorAll('[data-roadmap-section]')).toHaveLength(3);
  expect(host.querySelector('[data-roadmap-section="a"]').textContent).toContain('Gennemgået');
  expect(host.querySelector('[data-roadmap-section="b"]').textContent).toContain('2 kort');
  act(() => host.querySelector('[data-roadmap-section="c"] button').click());
  expect(onChoose).toHaveBeenLastCalledWith('c', false);
  act(() => host.querySelector('[data-roadmap-section="a"] button').click());
  expect(onChoose).toHaveBeenLastCalledWith('a', true);
});
test('waiting for a short repeat is not called completed and exposes a deliberate early practice action', () => {
  const onRepeatNow = jest.fn();
  act(() => root.render(<LectureTransition804 sections={sections} queue={{ ...queue, remaining: ['a1'], pendingBySection: { ...queue.pendingBySection, a: ['a1'] }, completedKeys: [], dueById: { a1: 601000 } }} now={1000} onChoose={() => {}} onRepeatNow={onRepeatNow} onExit={() => {}} />));
  expect(host.querySelector('[role="progressbar"]').getAttribute('aria-valuenow')).toBe('0');
  expect(host.textContent).toContain('10:00');
  expect(host.querySelector('[data-roadmap-section="a"]').textContent).toContain('1 kort til repetition');
  act(() => host.querySelector('[data-repeat-now]').click());
  expect(onRepeatNow).toHaveBeenCalledTimes(1);
});
test('finishing a single selected section still offers the other lecture sections', () => {
  act(() => root.render(<LectureTransition804 sections={sections} queue={queue} now={1000} onChoose={() => {}} onExit={() => {}} />));
  expect(host.textContent).not.toContain('Gennemgangen er færdig');
  expect(host.textContent).not.toContain('Session afsluttet');
  expect(host.querySelector('[data-roadmap-section="b"] button').disabled).toBe(false);
});
