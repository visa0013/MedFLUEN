import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { TrainingIndex791 } from './TrainingIndex791';
import { deckApply75, deckTree75 } from './decks75-model';
global.IS_REACT_ACT_ENVIRONMENT = true;

const mountedRoots = [];
function mount(component) {
  const el = document.createElement('div'); document.body.appendChild(el);
  const root = createRoot(el); mountedRoots.push({ root, el });
  act(() => root.render(component));
  return el;
}
function clickButton(el, label) {
  const button = [...el.querySelectorAll('button')].find(item => item.textContent === label);
  expect(button).toBeDefined();
  act(() => button.click());
}
function nameDeck(el, name) {
  const input = el.querySelector('[aria-label="Navn på dæk"]');
  expect(input).not.toBeNull();
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, name);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  return input;
}
function key(input, value) {
  act(() => input.dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true })));
}
afterEach(() => {
  mountedRoots.splice(0).forEach(({ root, el }) => { act(() => root.unmount()); el.remove(); });
});

test('upload opens the import screen while manual card and deck creation remain reachable', () => {
  const onImport = jest.fn(), onCreate = jest.fn();
  const tree = { id: 'module:k5', label: 'K5', type: 'module', children: [] };
  const el = mount(<TrainingIndex791 tree={tree} selected={tree} onImport={onImport} onCreate={onCreate} onCreateDeck={jest.fn()} />);
  clickButton(el, 'Upload flashcards');
  expect(onImport).toHaveBeenCalledTimes(1);
  clickButton(el, 'Nyt kort');
  expect(onCreate).toHaveBeenCalledTimes(1);
  clickButton(el, 'Nyt dæk');
  expect(el.querySelector('[aria-label="Navn på dæk"]')).not.toBeNull();
});

test('selecting a deck reveals its own counts and starting uses that selection', () => {
  const rootNode={id:'module:k5',label:'K5',type:'module',stats:{newCount:3,learningCount:0,dueCount:2},children:[{id:'n7',label:'Hovedpine',code:'N7',type:'lecture',stats:{newCount:3,learningCount:0,dueCount:2},questions:[{id:1}]}]};
  const el=document.createElement('div');document.body.appendChild(el);const root=createRoot(el);const start=jest.fn();
  function Harness(){const [selected,setSelected]=React.useState(rootNode);return <TrainingIndex791 tree={rootNode} selected={selected} onSelect={setSelected} onStart={()=>start(selected.id)} sessionCount={5} />;}
  act(()=>root.render(<Harness/>));
  act(()=>el.querySelector('[data-deck-id="n7"]').click());
  expect(el.querySelector('aside h2').textContent).toBe('Hovedpine');
  expect(el.querySelector('aside').textContent).toContain('3');
  act(()=>el.querySelector('[data-start-deck]').click());
  expect(start).toHaveBeenCalledWith('n7');
  act(()=>root.unmount());el.remove();
});

test('a draft stays in its selected parent until its finished name is committed and alphabetized', async () => {
  const base = { id: 'module:k5', label: 'K5', type: 'module', questions: [], children: [
    { id: 'group:neuro', label: 'Neurologi', type: 'group', questions: [], children: [
      { id: 'lecture:beta', label: 'Beta', type: 'lecture', questions: [], children: [] },
      { id: 'lecture:zeta', label: 'Zeta', type: 'lecture', questions: [], children: [] },
    ] },
  ] };
  let saved = { owner: 'student', moduleId: 'K5', decks: [], placements: {} };
  function Harness() {
    const [state, setState] = React.useState(saved);
    const tree = deckTree75(base, state, () => ({ newCount: 0, learningCount: 0, dueCount: 0 }));
    return <TrainingIndex791 tree={tree} selected={tree.children[0]} onCreateDeck={async action => {
      saved = deckApply75(saved, { ...action, owner: 'student', moduleId: 'K5' }, ['module:k5', 'group:neuro', 'lecture:beta', 'lecture:zeta']);
      setState(saved);
    }} />;
  }
  const el = mount(<Harness />);
  clickButton(el, 'Nyt underdæk');
  const input = nameDeck(el, 'Zulu');
  expect(el.querySelector('.mf791-deck-rows').lastElementChild.contains(input)).toBe(true);
  expect(saved.decks).toEqual([]);
  nameDeck(el, 'Alpha');
  expect(el.querySelector('.mf791-deck-rows').lastElementChild.contains(input)).toBe(true);
  await act(async () => { input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); });
  expect(saved.decks).toEqual([{ id: expect.stringMatching(/^personal:/), name: 'Alpha', parent: 'group:neuro' }]);
  expect([...el.querySelectorAll('[data-deck-id]')].map(button => button.textContent)).toEqual(['Neurologi', 'Beta', 'Zeta', 'Alpha']);
  expect(el.querySelector('[aria-label="Navn på dæk"]')).toBeNull();
});
test('official curriculum order is preserved while completed personal decks are alphabetized',()=>{
  const tree={id:'module:k5',type:'module',children:[{id:'n1',type:'lecture',code:'N1',label:'Intro'},{id:'n2',type:'lecture',code:'N2',label:'Apopleksi'},{id:'personal:z',type:'personal',label:'Zulu'},{id:'personal:a',type:'personal',label:'Alpha'}]};
  const el=mount(<TrainingIndex791 tree={tree} selected={tree}/>);
  expect([...el.querySelectorAll('[data-deck-id]')].map(button=>button.dataset.deckId)).toEqual(['n1','n2','personal:a','personal:z']);
});

test('Escape removes a draft without creating a deck', () => {
  let changes = 0;
  const tree = { id: 'module:k5', label: 'K5', type: 'module', children: [{ id: 'n7', label: 'Hovedpine' }] };
  const el = mount(<TrainingIndex791 tree={tree} selected={tree} onCreateDeck={() => { changes += 1; }} />);
  clickButton(el, 'Nyt dæk');
  const input = nameDeck(el, 'Mit dæk');
  key(input, 'Escape');
  expect(changes).toBe(0);
  expect(el.querySelector('[aria-label="Navn på dæk"]')).toBeNull();
  expect(el.querySelector('[data-deck-id="n7"]')).not.toBeNull();
});

test('finishing an inline name on blur commits it once and keeps errors editable', async () => {
  let changes = 0;
  const tree = { id: 'module:k5', label: 'K5', type: 'module', children: [{ id: 'n7', label: 'Hovedpine' }] };
  const el = mount(<TrainingIndex791 tree={tree} selected={tree} onCreateDeck={async () => { changes += 1; throw new Error('name'); }} />);
  clickButton(el, 'Nyt dæk');
  const input = nameDeck(el, 'Mit dæk');
  await act(async () => { input.dispatchEvent(new FocusEvent('focusout', { bubbles: true })); });
  expect(changes).toBe(1);
  expect(el.querySelector('[role="alert"]').textContent).toContain('navn');
  expect(el.querySelector('[aria-label="Navn på dæk"]').value).toBe('Mit dæk');
  key(input, 'Escape');
  expect(el.querySelector('[role="alert"]')).toBeNull();
});

test('the material action uses the dedicated material handler without losing card browsing', () => {
  const actions = [];
  const tree = { id: 'n7', label: 'Hovedpine' };
  const el = mount(<TrainingIndex791 tree={tree} selected={tree} onMaterials={() => actions.push('materials')} onNotes={() => actions.push('legacy')} onBrowse={() => actions.push('cards')} />);
  clickButton(el, 'Forelæsningsmaterialer');
  clickButton(el, 'Gennemse og redigér kort');
  expect(actions).toEqual(['materials', 'cards']);
});
