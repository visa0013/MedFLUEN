import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Curriculum79Tabs } from './Curriculum79';

test('Bachelor sees lecture and class, graduate sees TBL', () => {
  const bachelor = renderToStaticMarkup(<Curriculum79Tabs kind="lecture" level="Bachelor" language="da" onChange={() => {}} />);
  const graduate = renderToStaticMarkup(<Curriculum79Tabs kind="lecture" level="Kandidat" language="da" onChange={() => {}} />);
  expect(bachelor).toContain('Holdtimer');
  expect(bachelor).not.toContain('TBL');
  expect(graduate).toContain('TBL');
});
