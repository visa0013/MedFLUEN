import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Home79Header } from './Home79';

test('Home starts with the real module, greeting and no decorative quote', () => {
  const html = renderToStaticMarkup(<Home79Header name="Visar" moduleName="K5 Nervesystem og psykiatri" language="da" />);
  expect(html).toContain('Visar');
  expect(html).toContain('K5 Nervesystem og psykiatri');
  expect(html).not.toContain('Fokus skaber');
  expect(html).not.toContain('— MedFLUEN');
});
