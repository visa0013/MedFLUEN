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
test('answer definitions expose safe supplementary source links and keep the panel open while its link has focus', () => {
  jest.useFakeTimers();
  const glossary = [{ id: 'g', term: 'Myelin', definition: 'Myelin isolerer nervefibrene. Det hjælper nervesignaler frem. Skade kan forstyrre signalerne.', sourceRefs: [], sourceLinks: [{ title: 'Lægehåndbogen', url: 'https://www.sundhed.dk/' }, { title: 'Usikker kilde', url: 'javascript:alert(1)' }] }];
  try {
    act(() => root.render(<GlossaryText800 text="[[g|Myelin]]" glossary={glossary} />));
    act(() => host.querySelector('button').focus());
    const panel = document.querySelector('[role="tooltip"]'), links = panel.querySelectorAll('a');
    expect(panel.textContent).toContain('Supplerende definition');
    expect(panel.textContent).toContain('Skade kan forstyrre signalerne.');
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute('href')).toBe('https://www.sundhed.dk/');
    expect(links[0].getAttribute('target')).toBe('_blank');
    expect(links[0].getAttribute('rel')).toContain('noopener');
    act(() => { host.querySelector('button').dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })); jest.runOnlyPendingTimers(); });
    expect(document.activeElement).toBe(links[0]);
    expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
  } finally { jest.useRealTimers(); }
});
test('question terms stay plain even after reveal, while answer definitions become available', () => {
  const withTerms = { ...content, glossary: [{ id: 'g', term: 'Begreb', definition: 'Afslørende definition', sourceRefs: [] }], card: { ...content.card, question: 'Hvad er [[g|begrebet]]?', answerItems: [{ id: 'a', text: 'Det er [[g|begrebet]] i svaret.' }] } };
  const question = { id: 'c', lectureContent: withTerms };
  act(() => root.render(<LectureCard800 question={question} readOnly />));
  expect(host.querySelector('.mf799-question').textContent).toBe('Hvad er begrebet?');
  expect(host.querySelector('.mf800-term')).toBeNull();
  act(() => root.render(<LectureCard800 question={question} revealed readOnly />));
  expect(host.querySelector('.mf799-question .mf800-term')).toBeNull();
  const answerTerm = host.querySelector('.mf800-recall .mf800-term');
  expect(answerTerm).not.toBeNull();
  act(() => answerTerm.focus());
  expect(document.querySelector('[role="tooltip"]').textContent).toContain('Afslørende definition');
});
test('MCQ options stay plain before and after reveal while the answer explanation offers definitions', () => {
  const question = { id: 'mcq', lectureContent: { ...content, glossary: [{ id: 'g', term: 'Begreb', definition: 'Facit', sourceRefs: [] }], card: { ...content.card, type: 'mcq', question: 'Hvilket svar?', options: [{ id: 'a', text: '[[g|Første mulighed]]' }, { id: 'b', text: 'Anden mulighed' }], correctOptionIds: ['a'], explanation: 'Forklaring af [[g|begrebet]].' } } };
  act(() => root.render(<LectureCard800 question={question} readOnly />));
  expect(host.querySelector('.mf797-mcq-options').textContent).toContain('Første mulighed');
  expect(host.querySelector('.mf800-term')).toBeNull();
  act(() => root.render(<LectureCard800 question={question} revealed readOnly />));
  expect(host.querySelector('.mf797-mcq-options .mf800-term')).toBeNull();
  expect(host.querySelector('.mf800-explanation .mf800-term')).not.toBeNull();
});
test('keeps answer figures hidden until reveal and reuses the image holder with enlargement', async () => {
  const originalCreate = URL.createObjectURL, originalRevoke = URL.revokeObjectURL;
  URL.createObjectURL = jest.fn(() => 'blob:lecture-figure'); URL.revokeObjectURL = jest.fn();
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  const withImage = { ...content, assets: [{ id: 'fig', role: 'answer', path: 'images/figure.png', alt: 'Figur fra forelæsningen', caption: 'Billedets kildekontekst' }] };
  const question = { id: 'c', lectureContent: withImage }, media = new Map([['fig', new Blob(['image'])]]);
  try {
    await act(async () => { root.render(<LectureCard800 question={question} previewMedia={media} readOnly />); });
    expect(host.querySelector('.mf799-image-holder')).toBeNull();
    await act(async () => { root.render(<LectureCard800 question={question} previewMedia={media} revealed readOnly />); });
    expect(host.querySelector('.mf799-image-holder img').alt).toBe('Figur fra forelæsningen');
    expect(host.textContent).toContain('Billedets kildekontekst');
    act(() => host.querySelector('[aria-label="Forstør billede 1"]').click());
    expect(document.querySelector('dialog img').getAttribute('src')).toBe('blob:lecture-figure');
    act(() => document.querySelector('dialog').click());
    expect(document.querySelector('dialog')).toBeNull();
    act(() => root.render(<div />));
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:lecture-figure');
  } finally { URL.createObjectURL = originalCreate; URL.revokeObjectURL = originalRevoke; }
});
