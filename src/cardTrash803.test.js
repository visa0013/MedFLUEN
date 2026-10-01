import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { useCardTrash803, filterCardTree803 } from './cardTrash803';
global.IS_REACT_ACT_ENVIRONMENT = true;
const cards = [{ id: 'a', moduleId: 'K5', back: 'Svar', image: 'media.png' }, { id: 'b', moduleId: 'K5' }, { id: 'other', moduleId: 'K3' }];
let root, el, api;
beforeEach(() => { localStorage.clear(); el = document.createElement('div'); document.body.appendChild(el); root = createRoot(el); });
afterEach(() => { act(() => root.unmount()); el.remove(); });
function render(userId = 'alice') { act(() => root.render(<Harness userId={userId} />)); }
function Harness({ userId }) { api = useCardTrash803(userId, cards); return <div>{api.questions.map(card => card.id).join(',')}</div>; }

test('discard and restore persist only scoped IDs while keeping source content intact', () => {
  render();
  act(() => api.change({ scope: 'lecture:N10', moduleId: 'K5', ids: ['a', 'a', 'b', 'other', 'unknown'] }));
  expect(el.textContent).toBe('other');
  expect(cards[0]).toEqual({ id: 'a', moduleId: 'K5', back: 'Svar', image: 'media.png' });
  render('bob'); expect(el.textContent).toBe('a,b,other');
  render('alice'); expect(el.textContent).toBe('other');
  act(() => api.change({ scope: 'lecture:N10', restore: true }));
  expect(el.textContent).toBe('a,b,other');
  render('bob'); render('alice'); expect(el.textContent).toBe('a,b,other');
});

test('restoring one deck does not restore a card still discarded in another deck', () => {
  render();
  act(() => api.change({ scope: 'deck:1', moduleId: 'K5', ids: ['a'] }));
  act(() => api.change({ scope: 'deck:2', moduleId: 'K5', ids: ['a', 'b'] }));
  act(() => api.change({ scope: 'deck:2', restore: true }));
  expect(el.textContent).toBe('b,other');
});

test('storage failure and signed-out users cannot discard cards', () => {
  render(); let result;
  const write = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw Error('Lager fyldt'); });
  act(() => { result = api.change({ scope: 'deck:1', moduleId: 'K5', ids: ['a'] }); });
  expect(result.ok).toBe(false); expect(el.textContent).toBe('a,b,other');
  write.mockRestore(); render(null);
  act(() => { result = api.change({ scope: 'deck:1', moduleId: 'K5', ids: ['a'] }); });
  expect(result.ok).toBe(false); expect(el.textContent).toBe('a,b,other');
});

test('empty deck nodes remain available for restoration and counts exclude discarded cards', () => {
  const tree = { id: 'root', questions: cards, children: [{ id: 'lecture', questions: [cards[0]], children: [] }] };
  const result = filterCardTree803(tree, new Set(['b', 'other']), questions => ({ total: questions.length }));
  expect(result.questions.map(card => card.id)).toEqual(['b', 'other']);
  expect(result.stats.total).toBe(2);
  expect(result.children[0]).toEqual({ id: 'lecture', questions: [], children: [], stats: { total: 0 } });
  expect(tree.children[0].questions.length).toBe(1);
});
