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

function lectureCard(id, section, order, question, packageId = 'lecture-package') {
  return {
    id, moduleId: 'K5', lectureId: 'N2', cardType: 'basic', sourceType: 'lecture', question, back: `Svar til ${question}`, category: 'Importeret',
    lectureContent: {
      packageId, target: { moduleId: 'K5', lectureId: 'N2', title: 'Muskelsygdomme' }, section,
      card: { id, sectionId: section.id, order, type: 'basic', question, answer: `Svar til ${question}`, sourceRefs: [{ sourceId: 'pdf', page: 4 }] },
      glossary: [], sources: [{ id: 'pdf', filename: 'forelaesning.pdf', pageCount: 20 }], assets: [],
    },
  };
}
const mechanismSection = { id: 'mechanism', title: 'Mekanismer', order: 10, summary: 'Fra muskelcelle til sygdom.' };
const diagnosisSection = { id: 'diagnosis', title: 'Diagnostik', order: 20, summary: 'Undersøgelsens trin.' };
const lectureQuestions = [
  lectureCard('diagnosis-next', diagnosisSection, 2, 'Hvordan undersøges patienten?'),
  lectureCard('mechanism-next', mechanismSection, 2, 'Hvorfor opstår svaghed?'),
  lectureCard('diagnosis-first', diagnosisSection, 1, 'Hvad er det første trin?'),
  lectureCard('mechanism-first', mechanismSection, 1, 'Hvordan fungerer muskelcellen?'),
];

test('imported cards form sections in lecture order and retain personal cards in the browser', () => {
  const el = mount(<CardBrowser791 questions={[...lectureQuestions, questions[1]]} />);
  const groups = [...el.querySelectorAll('[data-browser-section]')];
  expect(groups.map(group => group.querySelector('h3').textContent)).toEqual(['Mekanismer', 'Diagnostik', 'Andre kort']);
  expect(groups.map(group => group.querySelector('.mf791-section-card-count').textContent)).toEqual(['2 kort', '2 kort', '1 kort']);
  expect([...el.querySelectorAll('[data-card-id]')].map(button => button.dataset.cardId)).toEqual(['mechanism-first', 'mechanism-next', 'diagnosis-first', 'diagnosis-next', 'private']);
  expect(el.querySelector('.flashcard71-card-detail .mf799-question').textContent).toBe('Hvordan fungerer muskelcellen?');
  act(() => el.querySelector('[data-card-id="private"]').click());
  expect(el.querySelector('.flashcard71-card-detail').textContent).toContain('Min egen forklaring');
});

test('section filtering keeps full counts and selects the first matching card in lecture order', () => {
  const el = mount(<CardBrowser791 questions={lectureQuestions} spacedData={{ 'diagnosis-next': { state: 'due' }, 'mechanism-next': { state: 'due' } }} />);
  inputValue(el.querySelector('[aria-label="Status"]'), 'due');
  expect([...el.querySelectorAll('[data-card-id]')].map(button => button.dataset.cardId)).toEqual(['mechanism-next', 'diagnosis-next']);
  expect([...el.querySelectorAll('.mf791-section-card-count')].map(count => count.textContent)).toEqual(['1 / 2 kort', '1 / 2 kort']);
  expect(el.querySelector('.flashcard71-card-detail .mf799-question').textContent).toBe('Hvorfor opstår svaghed?');
  inputValue(el.querySelector('[aria-label="Søg i kort"]'), 'Undersøgelsens');
  expect([...el.querySelectorAll('[data-browser-section] h3')].map(title => title.textContent)).toEqual(['Diagnostik']);
  expect(el.querySelector('.flashcard71-card-detail .mf799-question').textContent).toBe('Hvordan undersøges patienten?');
});

test('the reading controls move through matching cards while preserving section context', () => {
  const el = mount(<CardBrowser791 questions={lectureQuestions} />);
  const detail = el.querySelector('.flashcard71-card-detail');
  expect(detail.querySelector('.mf791-reading-context')).not.toBeNull();
  expect(detail.querySelector('.mf791-reading-context').textContent).toContain('Muskelsygdomme');
  expect(detail.querySelector('.mf791-reading-context').textContent).toContain('Kort 1 af 2');
  expect(detail.querySelector('[aria-label="Forrige kort"]').disabled).toBe(true);
  act(() => detail.querySelector('[aria-label="Næste kort"]').click());
  expect(detail.querySelector('.mf799-question').textContent).toBe('Hvorfor opstår svaghed?');
  expect(detail.querySelector('.mf791-reading-context').textContent).toContain('Kort 2 af 2');
  act(() => detail.querySelector('[aria-label="Næste kort"]').click());
  expect(detail.querySelector('.mf800-card-context').textContent).toContain('Diagnostik');
  expect(detail.querySelector('.mf791-reading-context').textContent).toContain('Kort 1 af 2');
  act(() => detail.querySelector('[aria-label="Forrige kort"]').click());
  expect(detail.querySelector('.mf799-question').textContent).toBe('Hvorfor opstår svaghed?');
});

test('the same section id in another imported package remains a separate section', () => {
  const other = lectureCard('other-package', { id: 'mechanism', title: 'En anden forelæsning', order: 0 }, 1, 'Et andet spørgsmål?', 'second-package');
  const el = mount(<CardBrowser791 questions={[lectureQuestions[3], other]} />);
  expect([...el.querySelectorAll('[data-browser-section] h3')].map(title => title.textContent)).toEqual(['Mekanismer', 'En anden forelæsning']);
  expect([...el.querySelectorAll('.mf791-section-card-count')].map(count => count.textContent)).toEqual(['1 kort', '1 kort']);
});

test('discard requires confirmation for the whole deck even when search shows one card', async () => {
  let discarded = false;
  const el = mount(<CardBrowser791 questions={questions} contextTitle="Nerver" discardCount={2} onDiscard={() => { discarded = true; return { ok: true }; }} />);
  inputValue(el.querySelector('[aria-label="Søg i kort"]'), 'Mit eget');
  act(() => el.querySelector('[data-action="discard-deck"]').click());
  expect(discarded).toBe(false);
  expect(el.querySelector('[role="dialog"]').textContent).toContain('2 kort');
  expect(el.querySelector('[role="dialog"]').textContent).toContain('Nerver');
  act(() => el.querySelector('[data-action="cancel-discard"]').click());
  expect(discarded).toBe(false); expect(el.querySelector('[role="dialog"]')).toBeNull();
  act(() => el.querySelector('[data-action="discard-deck"]').click());
  await act(async () => el.querySelector('[data-action="confirm-discard"]').click());
  expect(discarded).toBe(true); expect(el.querySelector('[role="dialog"]')).toBeNull();
});

test('a failed discard retains confirmation and the cards; empty decks can restore', async () => {
  const el = mount(<CardBrowser791 questions={questions} discardCount={2} onDiscard={() => ({ ok: false, error: 'Lager fyldt' })} />);
  act(() => el.querySelector('[data-action="discard-deck"]').click());
  await act(async () => el.querySelector('[data-action="confirm-discard"]').click());
  expect(el.querySelector('[role="alert"]').textContent).toContain('Lager fyldt');
  expect(el.querySelectorAll('[data-card-id]').length).toBe(2);
  act(() => el.querySelector('[data-action="cancel-discard"]').click());
  let restored = false;
  const empty = mount(<CardBrowser791 questions={[]} restoreCount={2} onRestore={() => { restored = true; return { ok: true }; }} />);
  await act(async () => empty.querySelector('[data-action="restore-deck"]').click());
  expect(restored).toBe(true);
});
