import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { LectureCard800, GlossaryText800 } from './LectureCard800';
jest.mock('./pdf791-engine', () => ({ loadPdfEngine791: jest.fn() }));

global.IS_REACT_ACT_ENVIRONMENT = true;
let host, root;
beforeEach(() => { host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host); });
afterEach(() => { act(() => root.unmount()); host.remove(); });
const content = { packageId: 'test', target: { title: 'Forelæsning', moduleId: 'K5', lectureId: 'N2' }, section: { id: 'one', title: 'Klinik', order: 1 }, card: { id: 'c', type: 'recall-list', question: 'Hvilke punkter?', answerItems: [{ id: 'a', text: 'Første svar' }, { id: 'b', text: 'Andet svar' }], sourceRefs: [{ sourceId: 'pdf', page: 3 }] }, sources: [{ id: 'pdf', filename: 'kilde.pdf' }], glossary: [], assets: [] };
test('hides answers until reveal and marks forgotten items without treating them as MCQ choices', () => {
  const question = { id: 'c', lectureContent: content }; let marked = [];
  act(() => root.render(<LectureCard800 question={question} forgotten={[]} onForgottenChange={ids => { marked = ids; }} />));
  expect(host.textContent).not.toContain('Første svar');
  act(() => root.render(<LectureCard800 question={question} revealed forgotten={[]} onForgottenChange={ids => { marked = ids; }} />));
  expect(host.querySelectorAll('input[type="checkbox"]')).toHaveLength(2);
  act(() => host.querySelector('input').click());
  expect(marked).toEqual(['a']);
  expect(host.textContent).toContain('Markér det, du ikke huskede');
});
test('missed-item drill shows only its frozen subset and preview cannot change learning state', () => {
  act(() => root.render(<LectureCard800 question={{ id: 'c', lectureContent: content }} revealed readOnly forgottenOnly={['b']} />));
  expect(host.textContent).not.toContain('Første svar');
  expect(host.textContent).toContain('Andet svar');
  expect(host.querySelector('input')).toBeNull();
  expect(host.textContent).toContain('kilde.pdf');
});
test('definition opens by keyboard focus and tap, and dismisses with Escape', () => {
  const glossary = [{ id: 'g', term: 'Begreb', definition: 'Kort definition', sourceRefs: [{ sourceId: 's', page: 1 }] }];
  act(() => root.render(<GlossaryText800 text="Hvad betyder [[g|begreb]]?" glossary={glossary} sources={[{ id: 's', filename: 'forelaesning.pdf' }]} />));
  const word = host.querySelector('button');
  act(() => word.focus());
  expect(document.querySelector('[role="tooltip"]').textContent).toContain('Kort definition');
  act(() => word.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
  expect(document.querySelector('[role="tooltip"]')).toBeNull();
  act(() => word.click());
  expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
});
test('renders imported markup as plain text, never executable HTML', () => {
  act(() => root.render(<GlossaryText800 text={'<img src=x onerror="alert(1)">'} />));
  expect(host.querySelector('img')).toBeNull();
  expect(host.textContent).toContain('<img');
});
