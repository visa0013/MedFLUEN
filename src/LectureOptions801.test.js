import React from 'react';
import {createRoot} from 'react-dom/client';
import {act, Simulate} from 'react-dom/test-utils';
import {LectureOptions801} from './LectureOptions801';

global.IS_REACT_ACT_ENVIRONMENT = true;
let root, host;
const sections = [
  {key: 'm', title: 'Sygdomsmekanisme', count: 25},
  {key: 'd', title: 'Diagnostik', count: 20},
];
const counts = {guide: {m: 25, d: 20}, review: {m: 24, d: 6}, forgotten: {m: 2, d: 0}};
const getCount = (keys, mode) => keys.reduce((total, key) => total + counts[mode][key], 0);
function mount(props = {}) {
  host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host);
  // eslint-disable-next-line testing-library/no-unnecessary-act -- React createRoot needs its initial effects flushed.
  act(() => root.render(<LectureOptions801 sections={sections} getCount={getCount} onClose={() => {}} {...props}/>));
  return host;
}
afterEach(() => {act(() => root?.unmount()); host?.remove(); root = null; host = null;});

test('guide selection submits the chosen sections in lecture order without a review limit', () => {
  const started = []; const el = mount({initialSelection: {keys: ['d', 'm'], mode: 'guide', limit: 10}, onStart: choice => started.push(choice)});
  expect(el.querySelector('[role="dialog"]')).not.toBeNull();
  expect([...el.querySelectorAll('[data-section-key] strong')].map(item => item.textContent)).toEqual(['Sygdomsmekanisme', 'Diagnostik']);
  expect(el.querySelector('[data-lecture801-count]').textContent).toBe('45');
  expect(el.querySelector('select')).toBeNull();
  act(() => el.querySelector('[data-lecture801-start]').click());
  expect(started).toEqual([{keys: ['m', 'd'], mode: 'guide', limit: 0}]);
  act(() => Simulate.change(el.querySelector('[data-section-key="m"] input')));
  expect(el.querySelector('[data-lecture801-count]').textContent).toBe('20');
  act(() => el.querySelector('[data-lecture801-start]').click());
  expect(started[1]).toEqual({keys: ['d'], mode: 'guide', limit: 0});
  act(() => Simulate.change(el.querySelector('[data-lecture801-all]')));
  expect(el.querySelector('[data-lecture801-count]').textContent).toBe('45');
});

test('review preview and submitted limit match the selected scheduled queue', () => {
  const started = []; const el = mount({initialSelection: {keys: ['m', 'd'], mode: 'review', limit: 20}, onStart: choice => started.push(choice)});
  expect(el.querySelector('[data-lecture801-count]').textContent).toBe('20');
  act(() => Simulate.change(el.querySelector('select'), {target: {value: '10'}}));
  expect(el.querySelector('[data-lecture801-count]').textContent).toBe('10');
  act(() => el.querySelector('[data-lecture801-start]').click());
  expect(started[0]).toEqual({keys: ['m', 'd'], mode: 'review', limit: 10});
  act(() => Simulate.change(el.querySelector('select'), {target: {value: 'all'}}));
  expect(el.querySelector('[data-lecture801-count]').textContent).toBe('30');
  act(() => el.querySelector('[data-lecture801-start]').click());
  expect(started[1]).toEqual({keys: ['m', 'd'], mode: 'review', limit: 'all'});
  act(() => Simulate.change(el.querySelector('input[value="guide"]')));
  expect(el.querySelector('[data-lecture801-count]').textContent).toBe('45');
  expect(el.querySelector('select')).toBeNull();
});

test('an empty forgotten queue cannot start and section changes update the real candidate count', () => {
  const started = []; const el = mount({initialSelection: {keys: ['d'], mode: 'forgotten'}, onStart: choice => started.push(choice)});
  expect(el.querySelector('[data-lecture801-count]').textContent).toBe('0');
  expect(el.querySelector('[data-lecture801-start]').disabled).toBe(true);
  expect(el.querySelector('[role="status"]')).not.toBeNull();
  act(() => el.querySelector('[data-lecture801-start]').click());
  expect(started).toEqual([]);
  act(() => Simulate.change(el.querySelector('[data-section-key="m"] input')));
  expect(el.querySelector('[data-lecture801-count]').textContent).toBe('2');
  expect(el.querySelector('[data-lecture801-start]').disabled).toBe(false);
  expect(el.querySelector('select')).toBeNull();
  act(() => el.querySelector('[data-lecture801-start]').click());
  expect(started).toEqual([{keys: ['m', 'd'], mode: 'forgotten', limit: 0}]);
});
