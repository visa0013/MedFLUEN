import React from 'react';
import fs from 'fs';
import path from 'path';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { CardEditor72, RichContent72 } from './Experience72';
jest.mock('./pdf791-engine', () => ({ loadPdfEngine791: async () => { throw Error('No worker in editor tests'); } }));
global.IS_REACT_ACT_ENVIRONMENT = true;
const mounted = [];
function mount(component) {
  const el = document.createElement('div'); document.body.appendChild(el); const root = createRoot(el);
  mounted.push({ root, el }); act(() => root.render(component)); return el;
}
afterEach(() => mounted.splice(0).forEach(({ root, el }) => { act(() => root.unmount()); el.remove(); }));
const record = { id: 'personal-1', cardType: 'basic', lectureId: 'N7', moduleId: 'K5', front: { da: 'Nerve?' }, back: { da: 'Vagus' }, category: { da: 'Kranienerver' }, tags: ['anatomi'], options: [], richContent: { front: { da: '<b>Nerve?</b>' }, back: { da: 'Vagus' } } };
const makeDraft = (question, context) => ({ ...record, ...(question || {}), lectureId: question?.lectureId || context.lectureId || null });

test('editing within a known lecture preserves placement and hidden metadata when saved', async () => {
  let saved;
  const el = mount(<CardEditor72 question={record} context={{ moduleId: 'K5', lectureId: 'N7' }} lectures={[{ id: 'N7', title: 'Nerver' }]} makeDraft={makeDraft} validate={() => ({ errors: {} })} onSave={async value => { saved = value; return { ok: true }; }} />);
  expect([...el.querySelectorAll('select')].some(select => select.parentElement.textContent.includes('Forelæsning'))).toBe(false);
  expect(el.querySelector('input[aria-label="Emne"]')).toBeNull();
  expect(el.querySelector('input[aria-label="Tags"]')).toBeNull();
  await act(async () => [...el.querySelectorAll('button')].find(button => button.textContent === 'Gem kort').click());
  expect(saved.lectureId).toBe('N7');
  expect(saved.category).toEqual({ da: 'Kranienerver' });
  expect(saved.tags).toEqual(['anatomi']);
  expect(saved.richContent.front.da).toBe('<b>Nerve?</b>');
});

test('secondary field tools retain HTML editing and preserve rich markup', () => {
  const el = mount(<CardEditor72 question={record} makeDraft={makeDraft} validate={() => ({ errors: {} })} />);
  const field = el.querySelector('.mf72-field');
  const more = field.querySelector('button[aria-label="Flere værktøjer til Forside"]');
  expect(more).not.toBeNull();
  act(() => more.click());
  act(() => field.querySelector('button[aria-label="Vis HTML-kilde"]').click());
  expect(field.querySelector('textarea').value).toBe('<b>Nerve?</b>');
  act(() => field.querySelector('button[aria-label="Vis redigering"]').click());
  expect(field.querySelector('[role="textbox"]').innerHTML).toBe('<b>Nerve?</b>');
});

// Execute the actual reviewer without App's backend initialization.
const source = fs.readFileSync(path.join(__dirname, 'App.js'), 'utf8');
const scriptPackage = require.resolve('react-scripts/package.json');
const babel = require(require.resolve('@babel/core', { paths: [scriptPackage] }));
const jsx = require.resolve('@babel/plugin-transform-react-jsx', { paths: [scriptPackage] });
const begin = source.indexOf('function FlashcardReviewer71('), end = source.indexOf('\nfunction MCQ(', begin);
const { code } = babel.transformSync(source.slice(begin, end), { plugins: [jsx], babelrc: false, configFile: false });
const dependencies = { React, useState: React.useState, useEffect: React.useEffect, RichContent72, Flashcard71Styles: () => null, Icon: () => null, translate: value => typeof value === 'string' ? value : value?.da || '', flashcardClozeDisplay71: value => value };
const Reviewer = new Function(...Object.keys(dependencies), `${code}\nreturn FlashcardReviewer71;`)(...Object.values(dependencies));
test('review tools operate beneath progress and card information exposes real card metadata', () => {
  let edits = 0, undos = 0, reveals = 0;
  const el = mount(<Reviewer language="da" question={record} position={1} total={8} spacedData={{}} undoAvailable onEditCard={() => { edits += 1; }} onUndo={() => { undos += 1; }} onReveal={() => { reveals += 1; }} />);
  const toolbar = el.querySelector('[aria-label="Kortværktøjer"]');
  expect(toolbar).not.toBeNull();
  expect(el.querySelector('.flashcard71-review-head').textContent).toContain('N7');
  act(() => toolbar.querySelector('[data-action="edit-card"]').click());
  act(() => toolbar.querySelector('[data-action="undo-review"]').click());
  expect(edits).toBe(1); expect(undos).toBe(1);
  act(() => toolbar.querySelector('[data-action="card-info"]').click());
  expect(el.querySelector('.flashcard71-card-info').textContent).toContain('personal-1');
  expect(el.querySelector('.flashcard71-card-info').textContent).toContain('anatomi');
  act(() => el.querySelector('[data-action="reveal-answer"]').click());
  expect(reveals).toBe(1);
});
