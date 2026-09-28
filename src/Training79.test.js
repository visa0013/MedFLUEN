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
