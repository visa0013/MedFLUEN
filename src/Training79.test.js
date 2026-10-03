import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Training79Header } from './Training79';

test('theory and exam MCQ are separate explicit source choices', () => {
  const html = renderToStaticMarkup(<Training79Header mode="theory" language="da" onModeChange={() => {}} />);
  expect(html).toContain('Teori');
  expect(html).toContain('Eksamens-MCQ');
  expect(html).toContain('aria-selected="true"');
  expect(html).not.toContain('Gentagelse forvandler');
});

test('the standalone exam heading opens exam papers without a theory mode switch', () => {
  const html = renderToStaticMarkup(<Training79Header mode="exam-mcq" separateWorkspace onOpenExamSets={() => {}} />);
  const host = document.createElement('div'); host.innerHTML = html;
  expect(host.querySelector('h1').textContent).toBe('Eksamenen');
  expect(host.querySelector('[role="tablist"]')).toBeNull();
  expect([...host.querySelectorAll('button')].some(button => button.textContent === 'Eksamenssæt')).toBe(true);
});
