import React from 'react';
import fs from 'fs';
import path from 'path';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { CardBrowser791 } from './CardBrowser791';
import { Dialog791 } from './StudyTools791';
import { CardEditor72 } from './Experience72';
jest.mock('./pdf791-engine', () => ({ loadPdfEngine791: async () => { throw Error('No PDF worker in wrapper tests'); } }));
global.IS_REACT_ACT_ENVIRONMENT = true;

// Run the real scoped wrappers without importing App's live backend/bootstrap.
const source = fs.readFileSync(path.join(__dirname, 'App.js'), 'utf8');
const scriptPackage = require.resolve('react-scripts/package.json');
const babel = require(require.resolve('@babel/core', { paths: [scriptPackage] }));
const jsx = require.resolve('@babel/plugin-transform-react-jsx', { paths: [scriptPackage] });
function bind(name, nextName, dependencies) {
  const begin = source.indexOf(`function ${name}(`), end = source.indexOf(`\nfunction ${nextName}(`, begin);
  if (begin < 0 || end < 0) throw Error(`Missing component boundary: ${name}`);
  const { code } = babel.transformSync(source.slice(begin, end), { plugins: [jsx], babelrc: false, configFile: false });
  return new Function(...Object.keys(dependencies), `${code}\nreturn ${name};`)(...Object.values(dependencies));
}
const common = {
  React, useState: React.useState, useRef: React.useRef, CardBrowser791,
  flashcard71Copy: () => ({}), flashcardCardStatus: card => card?.state || 'new',
  translate: (value, language) => typeof value === 'string' ? value : value?.[language] || value?.da || '',
};
const Browser = bind('FlashcardBrowser71', 'FlashcardActivityHeatmap71', common);
const Lecture = bind('LectureMenuModal', 'AdminPortal', {
  ...common, getFullQuestionBank: questions => Array.isArray(questions) ? questions : [],
  Modal: Dialog791, Flashcard71Styles: () => null, MODULE_LECTURES: {},
  FlashcardEditor71: props => <CardEditor72 {...props} makeDraft={() => ({ cardId: 'personal-test', cardType: 'basic', front: { da: '' }, back: { da: '' }, category: { da: 'Personligt' }, tags: [], options: [], richContent: {}, moduleId: 'K5', lectureId: 'N1' })} validate={() => ({ errors: {} })} />,
});

test('declining dirty-editor close keeps the personal draft on Escape and backdrop clicks', () => {
  const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false);
  try {
    const el = mount(<Lecture c={{}} t={{ questionListTitle: 'Forelæsningskort' }} language="da" lecture={{ id: 'N1', title: 'Nerver' }} moduleId="K5" importedQuestions={[]} spacedData={{}} buriedCards={{}} setSpacedData={() => {}} setBuriedCards={() => {}} onClose={() => {}} onSavePersonalCard={async () => ({ ok: true })} />);
    act(() => el.querySelector('[data-action="create-card"]').click());
    const front = el.querySelector('[role="textbox"]');
    act(() => { front.innerHTML = 'Min ikke gemte kladde'; front.dispatchEvent(new Event('input', { bubbles: true })); });
    act(() => front.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
    expect(el.querySelector('[data-flashcard-editor71]')).not.toBeNull();
    expect(el.querySelector('[role="textbox"]').textContent).toBe('Min ikke gemte kladde');
    act(() => el.querySelector('.mf791-dialog-backdrop').dispatchEvent(new MouseEvent('mousedown', { bubbles: true })));
    expect(el.querySelector('[data-flashcard-editor71]')).not.toBeNull();
    expect(el.querySelector('[role="textbox"]').textContent).toBe('Min ikke gemte kladde');
    expect(confirm).toHaveBeenCalledTimes(2);
  } finally { confirm.mockRestore(); }
});
const mounted = [];
function mount(component) {
  const el = document.createElement('div'); document.body.appendChild(el); const root = createRoot(el);
  mounted.push({ root, el }); act(() => root.render(component)); return el;
}
afterEach(() => mounted.splice(0).forEach(({ root, el }) => { act(() => root.unmount()); el.remove(); }));

test('the deck browser wrapper displays the selected MCQ answer using the shared workspace', () => {
  const question = { id: 'q1', question: 'Nerve?', options: ['Opticus', 'Vagus'], correct: 1, explanation: 'Den tiende kranienerve.' };
  const el = mount(<Browser language="da" questions={[question]} spacedData={{}} lectures={[]} query="" status="all" selectedId="q1" />);
  expect(el.querySelector('.flashcard71-card-detail h3').textContent).toBe('Nerve?');
  expect(el.querySelector('[data-correct="true"]').textContent).toContain('Vagus');
  expect(el.querySelector('.flashcard71-card-detail').textContent).toContain('Den tiende kranienerve.');
});

test('the lecture wrapper preserves card hiding, single reset and lecture reset without touching other progress', () => {
  const questions = [{ id: 'q1', moduleId: 'K5', lectureId: 'N1', question: 'Nerve?', options: ['Opticus', 'Vagus'], correct: 1 }, { id: 'private', private: true, moduleId: 'K5', lectureId: 'N1', cardType: 'basic', question: 'Mit kort', back: 'Min forklaring' }, { id: 'other', moduleId: 'K5', lectureId: 'N2', question: 'Andet' }];
  let progress = { q1: { state: 'due' }, private: { state: 'learning' }, other: { state: 'due' } }, hidden = {};
  const t = { questionListTitle: 'Forelæsningskort', resetThisCard: 'Nulstil kort', buryCard: 'Skjul kort', unburyCard: 'Vis kort', resetProgress: 'Nulstil forelæsning', resetConfirm: 'Bekræft', cancelEdit: 'Annuller', noCardsInLecture: 'Ingen kort' };
  function Harness() {
    const [data, setData] = React.useState(progress), [buried, setBuried] = React.useState(hidden);
    return <Lecture c={{}} t={t} language="da" lecture={{ id: 'N1', title: 'Nerver' }} moduleId="K5" importedQuestions={questions} spacedData={data} setSpacedData={update => setData(previous => { progress = typeof update === 'function' ? update(previous) : update; return progress; })} buriedCards={buried} setBuriedCards={update => setBuried(previous => { hidden = typeof update === 'function' ? update(previous) : update; return hidden; })} onClose={() => {}} />;
  }
  const el = mount(<Harness />);
  expect([...el.querySelectorAll('[data-card-id]')].map(button => button.dataset.cardId)).toEqual(['q1', 'private']);
  act(() => el.querySelector('[data-card-id="private"]').click());
  expect(el.querySelector('.flashcard71-card-detail').textContent).toContain('Min forklaring');
  act(() => el.querySelector('[data-action="toggle-hidden"]').click());
  expect(hidden).toEqual({ private: true });
  act(() => el.querySelector('[data-action="reset-card"]').click());
  expect(progress).toEqual({ q1: { state: 'due' }, other: { state: 'due' } });
  act(() => [...el.querySelectorAll('button')].find(button => button.textContent === 'Nulstil forelæsning').click());
  act(() => [...el.querySelectorAll('button')].find(button => button.textContent === 'Bekræft?').click());
  expect(progress).toEqual({ other: { state: 'due' } });
  expect(hidden).toEqual({ private: true });
});
