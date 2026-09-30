import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { LectureUpload800 } from './LectureUpload800';
import { buildLecturePrompt800, lectureTemplate800 } from './lecture800-prompt';
import { validateLecture800 } from './lecture800-model';
jest.mock('./pdf791-engine', () => ({ loadPdfEngine791: jest.fn() }));
global.IS_REACT_ACT_ENVIRONMENT = true;
let host, root;
beforeEach(() => { host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host); });
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
