import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { DrByteTone79 } from './DrByteTone79';

test('tone settings offer previews and a bounded personal style without making a request', () => {
  const html = renderToStaticMarkup(<DrByteTone79 settings={{ tone: 'teaching', custom: '' }} onChange={() => {}} onClose={() => {}} />);
  expect(html).toContain('Kort og præcist');
  expect(html).toContain('Pædagogisk');
  expect(html).toContain('Spørgende');
  expect(html).toContain('Hvad er et fokalt epileptisk anfald?');
  expect(html).toContain('maxLength="500"');
  expect(html).toContain('Del ikke patientoplysninger');
});
