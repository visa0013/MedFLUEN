import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { CardBrowser791 } from './CardBrowser791';
jest.mock('./pdf791-engine', () => ({ loadPdfEngine791: async () => { throw Error('No PDF worker in card tests'); } }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const mounted = [];
function mount(component) {
  const el = document.createElement('div'); document.body.appendChild(el);
  const root = createRoot(el); mounted.push({ root, el }); act(() => root.render(component)); return el;
}
function inputValue(input, value) {
  act(() => {
    Object.getOwnPropertyDescriptor(input instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype, 'value').set.call(input, value);
    input.dispatchEvent(new Event(input instanceof HTMLSelectElement ? 'change' : 'input', { bubbles: true }));
  });
}
afterEach(() => mounted.splice(0).forEach(({ root, el }) => { act(() => root.unmount()); el.remove(); }));

const questions = [
  { id: 'mcq', question: { da: 'Hvilken nerve?', en: 'Which nerve?' }, options: [{ da: 'Opticus' }, { da: 'Vagus' }], correct: 1, explanation: { da: 'Den tiende kranienerve.' }, category: { da: 'Neurologi' }, lectureId: 'N1' },
  { id: 'private', private: true, personalCardId: 'private', cardType: 'basic', question: { da: 'Mit eget kort' }, back: { da: 'Min egen forklaring' }, category: { da: 'Personligt' }, tags: ['husk'] },
];

test('selecting cards uses the same reading workspace for legacy MCQ and personal flashcards', () => {
  const el = mount(<CardBrowser791 questions={questions} />);
  const detail = el.querySelector('.flashcard71-card-detail');
  expect(detail.querySelector('.mf799-question').textContent).toBe('Hvilken nerve?');
  expect(detail.querySelector('[data-correct="true"]').textContent).toContain('Vagus');
  expect(detail.textContent).toContain('Den tiende kranienerve.');
  act(() => el.querySelector('[data-card-id="private"]').click());
  expect(detail.querySelector('h3').textContent).toBe('Mit eget kort');
  expect(detail.textContent).toContain('Min egen forklaring');
  expect(detail.querySelector('[data-correct]')).toBeNull();
});

test('search and progress filtering select a matching card and keep its answer visible', () => {
  const progress = { mcq: { state: 'due' }, private: { state: 'new' } };
  const el = mount(<CardBrowser791 questions={questions} spacedData={progress} getStatus={card => card?.state || 'new'} />);
  inputValue(el.querySelector('[aria-label="Søg i kort"]'), 'husk');
  expect([...el.querySelectorAll('[data-card-id]')].map(item => item.dataset.cardId)).toEqual(['private']);
  expect(el.querySelector('.flashcard71-card-detail').textContent).toContain('Min egen forklaring');
  inputValue(el.querySelector('[aria-label="Søg i kort"]'), '');
  inputValue(el.querySelector('[aria-label="Status"]'), 'due');
  expect([...el.querySelectorAll('[data-card-id]')].map(item => item.dataset.cardId)).toEqual(['mcq']);
  expect(el.querySelector('.flashcard71-card-detail .mf799-question').textContent).toBe('Hvilken nerve?');
  inputValue(el.querySelector('[aria-label="Søg i kort"]'), 'ingen match');
  expect(el.querySelector('.flashcard71-empty').textContent).toContain('Ingen');
});

test('card reset and hide actions affect only the selected card and retain the original content', () => {
  let progress = { mcq: { state: 'due' }, private: { state: 'learning' } }, hidden = {};
  function Harness() {
    const [spacedData, setData] = React.useState(progress), [buriedCards, setBuried] = React.useState(hidden);
    return <CardBrowser791 questions={questions} spacedData={spacedData} buriedCards={buriedCards} getStatus={card => card?.state || 'new'} onResetCard={question => {
      progress = { ...progress }; delete progress[question.id]; setData(progress);
    }} onToggleHidden={question => {
      hidden = { ...hidden, [question.id]: !hidden[question.id] }; setBuried(hidden);
    }} />;
  }
  const el = mount(<Harness />);
  act(() => el.querySelector('[data-card-id="private"]').click());
  act(() => el.querySelector('[data-action="reset-card"]').click());
  expect(progress).toEqual({ mcq: { state: 'due' } });
  expect(el.querySelector('[data-action="reset-card"]')).toBeNull();
  act(() => el.querySelector('[data-action="toggle-hidden"]').click());
  expect(hidden).toEqual({ private: true });
  expect(el.querySelector('[data-action="toggle-hidden"]').textContent).toContain('Vis');
  expect(el.querySelector('.flashcard71-card-detail h3').textContent).toBe('Mit eget kort');
  expect(el.querySelector('.flashcard71-card-detail').textContent).toContain('Min egen forklaring');
});

test('editing uses the selected original record and image cards keep their visual preview', () => {
  const image = { id: 'image', cardType: 'image-occlusion', question: 'Markér nerven', imageOcclusion: { imageDataUrl: 'data:image/png;base64,x', masks: [], hiddenMaskIds: [] } };
  let edited = null;
  const el = mount(<CardBrowser791 questions={[...questions, image]} onEdit={question => { edited = question; }} renderImage={question => <img src={question.imageOcclusion.imageDataUrl} alt="Anatomisk kort" />} />);
  act(() => el.querySelector('[data-card-id="image"]').click());
  expect(el.querySelector('.flashcard71-card-detail img').alt).toBe('Anatomisk kort');
  act(() => el.querySelector('[data-action="edit-card"]').click());
  expect(edited).toBe(image);
  expect(image.imageOcclusion.masks).toEqual([]);
});

test('a scheduler-hidden card does not promise that the manual hide action can restore it', () => {
  const el = mount(<CardBrowser791 questions={[questions[0]]} spacedData={{ mcq: { state: 'suspended' } }} getStatus={() => 'hidden'} onToggleHidden={() => {}} />);
  expect(el.querySelector('[data-action="toggle-hidden"]')).toBeNull();
  expect(el.querySelector('.flashcard71-card-detail').textContent).toContain('skjult i repetitionsplanen');
});

test('rich card content keeps its formatting and images while unsafe markup is removed', () => {
  const rich = { ...questions[1], richContent: { front: { da: '<p><strong>Mit formaterede kort</strong></p>' }, back: { da: '<p><em>Min forklaring</em></p><img src="data:image/png;base64,eA==" alt="Diagram" onerror="bad()"><script>bad()</script>' } } };
  const el = mount(<CardBrowser791 questions={[rich]} />);
  const detail = el.querySelector('.flashcard71-card-detail');
  expect(detail.querySelector('strong').textContent).toBe('Mit formaterede kort');
  expect(detail.querySelector('em').textContent).toBe('Min forklaring');
  expect(detail.querySelector('img').alt).toBe('Diagram');
  expect(detail.querySelector('script')).toBeNull();
  expect(detail.querySelector('img').hasAttribute('onerror')).toBe(false);
});
