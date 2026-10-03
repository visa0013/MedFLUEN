import React from 'react';
import { createRoot } from 'react-dom/client';
import { act, Simulate } from 'react-dom/test-utils';
import { TrainingIndex791 } from './TrainingIndex791';
import fs from 'fs';
import path from 'path';

global.IS_REACT_ACT_ENVIRONMENT = true;
let host, root;
const epilepsy = { id: 'lecture:n4', code: 'N4', label: 'Epilepsi', type: 'lecture', lectureFilter: 'N4', questions: [{ id: 'e1' }, { id: 'e2' }], stats: { newCount: 1, learningCount: 1, dueCount: 0 } };
const ms = { id: 'lecture:n10', code: 'N10', label: 'Multipel sklerose', type: 'lecture', lectureFilter: 'N10', questions: [{ id: 'm1' }], stats: { newCount: 1 } };
const psych = { id: 'lecture:p1', code: 'P1', label: 'Depression', type: 'lecture', questions: [] };
const tree = { id: 'module:k5', label: 'Nervesystem og psykiatri', type: 'module', questions: [...epilepsy.questions, ...ms.questions], children: [
  { id: 'group:neuro', label: 'Neurologi', type: 'group', children: [epilepsy, ms] },
  { id: 'group:psych', label: 'Psykiatri', type: 'group', children: [psych] },
] };
beforeEach(() => { host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host); });
afterEach(() => { act(() => root.unmount()); host.remove(); });

test('theory previews a lecture and its progress without the exam count table', () => {
  act(() => root.render(<TrainingIndex791 variant="theory" tree={tree} selected={epilepsy} reviewedIds={new Set(['e1'])} sessionCount={2} />));
  expect(host.querySelector('[aria-label="Valgt forelæsning"]')).not.toBeNull();
  expect(host.querySelector('[role="progressbar"]').getAttribute('aria-valuenow')).toBe('1');
  expect(host.querySelector('.mf791-deck-columns')).toBeNull();
  expect(host.querySelectorAll('[data-theory-unit]').length).toBe(3);
});

test('selecting a theory lecture changes the preview before opening its own walkthrough', () => {
  let opened;
  function Harness() {
    const [selected, select] = React.useState(epilepsy);
    return <TrainingIndex791 variant="theory" tree={tree} selected={selected} onSelect={select} onStart={() => { opened = selected.id; }} sessionCount={2} />;
  }
  act(() => root.render(<Harness />));
  const target = host.querySelector('[data-theory-unit="lecture:n10"]');
  expect(target).not.toBeNull();
  act(() => target.click());
  expect(host.querySelector('[aria-label="Valgt forelæsning"] h2').textContent).toBe('Multipel sklerose');
  expect(opened).toBeUndefined();
  act(() => host.querySelector('[data-open-theory]').click());
  expect(opened).toBe('lecture:n10');
});

test('theory search and subject filters retain empty lectures for later uploads', () => {
  act(() => root.render(<TrainingIndex791 variant="theory" tree={tree} selected={epilepsy} />));
  const input = host.querySelector('[aria-label="Søg i forelæsninger"]');
  expect(input).not.toBeNull();
  act(() => Simulate.change(input, { target: { value: 'N10' } }));
  expect([...host.querySelectorAll('[data-theory-unit]')].map(button => button.dataset.theoryUnit)).toEqual(['lecture:n10']);
  act(() => Simulate.change(input, { target: { value: '' } }));
  act(() => host.querySelector('[data-theory-subject="group:psych"]').click());
  expect([...host.querySelectorAll('[data-theory-unit]')].map(button => button.dataset.theoryUnit)).toEqual(['lecture:p1']);
});

test('theory keeps upload and manual deck management reachable without starting empty queues', () => {
  let uploaded = false, managed = false, started = false;
  act(() => root.render(<TrainingIndex791 variant="theory" tree={tree} selected={psych} onImport={() => { uploaded = true; }} onManage={() => { managed = true; }} onStart={() => { started = true; }} />));
  const upload = host.querySelector('[data-theory-upload]'), manage = host.querySelector('[data-theory-manage]');
  expect(upload).not.toBeNull(); expect(manage).not.toBeNull();
  act(() => { upload.click(); manage.click(); host.querySelector('[data-open-theory]').click(); });
  expect(uploaded).toBe(true); expect(managed).toBe(true); expect(started).toBe(false);
});

test('exam keeps the existing subject/count layout and selected-deck actions', () => {
  let started = false;
  act(() => root.render(<TrainingIndex791 variant="exam" tree={tree} selected={epilepsy} sessionCount={2} onStart={() => { started = true; }} />));
  expect(host.querySelector('.mf791-deck-columns').textContent).toBe('EmneNyeI gangKlar');
  expect(host.querySelector('aside h2').textContent).toBe('Epilepsi');
  act(() => host.querySelector('[data-start-deck]').click());
  expect(started).toBe(true);
});

test('theory actions activate the existing icon motions on keyboard focus', () => {
  const stylesheet = document.createElement('style');
  stylesheet.textContent = ['workspace791.css', 'editorTraining792.css'].map(file => fs.readFileSync(path.join(__dirname, file), 'utf8')).join('\n');
  document.head.appendChild(stylesheet);
  try {
    host.className = 'mf791-app';
    act(() => root.render(<TrainingIndex791 variant="theory" tree={tree} selected={epilepsy} onBrowse={() => {}} onCustomize={() => {}} onMaterials={() => {}} />));
    const buttons = [...host.querySelectorAll('.mf809-preview-actions button')];
    expect(buttons).toHaveLength(3);
    act(() => buttons[0].focus());
    expect(getComputedStyle(buttons[0].querySelector('.mf791-card-front')).transform).toBe('translate(-1px,1px) rotate(-3deg)');
    act(() => buttons[1].focus());
    expect(getComputedStyle(buttons[1].querySelector('.mf791-tune-knob')).transform).toBe('translateX(9px)');
    act(() => buttons[2].focus());
    expect(getComputedStyle(buttons[2].querySelector('.mf791-book-page')).transform).toBe('scaleX(.62)');
    expect(getComputedStyle(buttons[2].querySelector('.mf791-book-page')).transition).toContain('transform 480ms');
  } finally {
    stylesheet.remove();
  }
});
