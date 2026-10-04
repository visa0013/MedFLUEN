import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { LectureUpload800 } from './LectureUpload800';
import { buildLecturePrompt800, lectureTemplate800 } from './lecture800-prompt';
import { validateLecture800, lectureRecords800, mergeLecture800 } from './lecture800-model';
import { readLectureCards800, persistLecture800 } from './lecture800-storage';
import { useCardTrash803 } from './cardTrash803';
jest.mock('./pdf791-engine', () => ({ loadPdfEngine791: jest.fn() }));
// IndexedDB is the browser boundary; package validation, duplicate detection,
// React controls and account-scoped trash storage run without mocks.
jest.mock('./lecture800-storage', () => ({ readLectureCards800: jest.fn(), persistLecture800: jest.fn(), readLectureMedia800: jest.fn() }));
global.IS_REACT_ACT_ENVIRONMENT = true;
let host, root;
beforeEach(() => { localStorage.clear(); jest.clearAllMocks(); host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host); });
afterEach(() => { act(() => root.unmount()); host.remove(); });
const target = { moduleId: 'K5 Nervesystem og psykiatri', lectureId: 'N2', title: 'Myasteni' };
test('offers the actual lecture target and an offline generation kit without requiring an AI call', async () => {
  await act(async () => root.render(<LectureUpload800 moduleId={target.moduleId} lectures={[{ id: 'N2', title: 'Myasteni' }]} selectedLectureId="N2" onBack={() => {}} />));
  expect(host.querySelector('[aria-label="Forelæsning"]').value).toBe('N2');
  expect(host.textContent).toContain('Hent genereringsprompt');
  expect(host.textContent).toContain('JSON-skabelon');
  expect(host.querySelector('[data-confirm-lecture800]')).toBeNull();
});
test('prompt contains real target, source fidelity, image extraction rules and the actual schema', () => {
  const prompt = buildLecturePrompt800(target);
  expect(prompt).toContain('Myasteni');
  expect(prompt).toContain('K5 Nervesystem og psykiatri');
  expect(prompt).toContain('correctOptionIds');
  expect(prompt).toContain('fysiske PDF-side');
  expect(prompt).toContain('Ingen opdigtede');
  expect(lectureTemplate800(target).lecture.lectureId).toBe('N2');
});
test('practice package is valid and clearly about the import, not invented clinical material', () => {
  const pack = lectureTemplate800(target, true);
  expect(validateLecture800(pack).cards[0].type).toBe('recall-list');
  expect(pack.cards[0].question).toContain('import');
});

async function recoveryHarness({ discarded = true, restoreError = false } = {}) {
  const scope = 'lecture-storage:alice';
  let stored = lectureRecords800(lectureTemplate800(target, true), target);
  const original = stored[0], unrelated = { id: 'unrelated', moduleId: target.moduleId };
  const sourceCards = [...stored.map(card => ({ ...card, id: card.cardId })), unrelated];
  readLectureCards800.mockImplementation(async () => stored);
  persistLecture800.mockImplementation(async (_scope, preview, destination, mode) => {
    const result = mergeLecture800(stored, lectureRecords800(preview.package, destination, preview.mediaHashes), mode);
    stored = result.records;
    return { ok: true, imported: result.added, updated: result.updated, records: stored };
  });
  let trash;
  function Harness() {
    trash = useCardTrash803('alice', sourceCards);
    return <>
      <output data-visible-cards>{trash.questions.map(card => card.id).join(',')}</output>
      <LectureUpload800 moduleId={target.moduleId} lectures={[{ id: 'N2', title: 'Myasteni' }]} selectedLectureId="N2" scope={scope} signedIn
        discardedIds={trash.batches.flatMap(batch => batch.ids)}
        onRestoreDiscarded={ids => restoreError ? { ok: false, error: 'Kortene kunne ikke gendannes.' } : trash.restoreImported({ moduleId: target.moduleId, ids })} />
    </>;
  }
  await act(async () => root.render(<Harness />));
  if (discarded) act(() => trash.change({ scope: 'lecture:N2', moduleId: target.moduleId, ids: [original.cardId, unrelated.id] }));
  await act(async () => [...host.querySelectorAll('button')].find(button => button.textContent.startsWith('Afprøv med et eksempel')).click());
  return { original, readStored: () => stored };
}

test('an unchanged deleted package can be reimported with explicit restoration, without duplicates or lost review data', async () => {
  const { original, readStored } = await recoveryHarness();
  const reviewKey = 'medfluen-reviews:alice';
  const reviews = JSON.stringify({ [original.cardId]: { due: '2026-10-05', reps: 12 } });
  localStorage.setItem(reviewKey, reviews);
  const save = host.querySelector('[data-confirm-lecture800]');
  expect(save.disabled).toBe(true);
  const restore = host.querySelector('input[aria-label="Gendan kasserede kort fra pakken"]');
  expect(restore).not.toBeNull();
  expect(restore.checked).toBe(false);
  expect(host.textContent).toContain('1 kort fra pakken er kasseret');
  await act(async () => restore.click());
  expect(save.disabled).toBe(false);
  await act(async () => save.click());
  expect(host.querySelector('[data-visible-cards]').textContent).toBe(original.cardId);
  expect(readStored()).toEqual([original]);
  expect(localStorage.getItem(reviewKey)).toBe(reviews);
  expect(host.textContent).toContain('1 kort gendannet');
});

test('an unchanged active package remains a duplicate, with a clear explanation', async () => {
  await recoveryHarness({ discarded: false });
  expect(host.querySelector('[data-confirm-lecture800]').disabled).toBe(true);
  expect(host.querySelector('input[aria-label="Gendan kasserede kort fra pakken"]')).toBeNull();
  expect(host.textContent).toContain('Alle kort i pakken findes allerede');
});

test('restoration failure is shown and can be retried rather than reporting success', async () => {
  await recoveryHarness({ restoreError: true });
  await act(async () => host.querySelector('input[aria-label="Gendan kasserede kort fra pakken"]').click());
  await act(async () => host.querySelector('[data-confirm-lecture800]').click());
  expect(host.querySelector('[role="alert"]').textContent).toContain('Kortene kunne ikke gendannes.');
  expect(host.querySelector('[data-visible-cards]').textContent).toBe('');
  expect(host.querySelector('[data-confirm-lecture800]').disabled).toBe(false);
  expect(host.textContent).not.toContain('kort gendannet.');
});

test('a failed package save never restores discarded cards or reports a successful import', async () => {
  const { original, readStored } = await recoveryHarness();
  persistLecture800.mockRejectedValueOnce(Error('Kunne ikke gemme på denne enhed.'));
  await act(async () => host.querySelector('input[aria-label="Gendan kasserede kort fra pakken"]').click());
  await act(async () => host.querySelector('[data-confirm-lecture800]').click());
  expect(host.querySelector('[role="alert"]').textContent).toContain('Kunne ikke gemme på denne enhed.');
  expect(host.querySelector('[data-visible-cards]').textContent).toBe('');
  expect(readStored()).toEqual([original]);
  expect(host.querySelector('[data-confirm-lecture800]').disabled).toBe(false);
  expect(host.textContent).not.toContain('opdateringer gemt.');
});

test('changing the lecture target requires a fresh restoration choice', async () => {
  await recoveryHarness();
  await act(async () => host.querySelector('input[aria-label="Gendan kasserede kort fra pakken"]').click());
  const lecture = host.querySelector('select[aria-label="Forelæsning"]');
  await act(async () => { lecture.value = ''; lecture.dispatchEvent(new Event('change', { bubbles: true })); });
  await act(async () => { lecture.value = target.lectureId; lecture.dispatchEvent(new Event('change', { bubbles: true })); });
  expect(host.querySelector('input[aria-label="Gendan kasserede kort fra pakken"]').checked).toBe(false);
  expect(host.querySelector('[data-confirm-lecture800]').disabled).toBe(true);
});
