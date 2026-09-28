import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Planning79 } from './Planning79';

test('planning frames the same working calendar without a second calendar state', () => {
  const html = renderToStaticMarkup(<Planning79 language="da" moduleName="K5" date="2026-09-25" onOpenStudyPlan={() => {}}><div data-testid="existing-calendar">Skema</div></Planning79>);
  expect(html).toContain('Planlægning');
  expect(html).toContain('Studieplan');
  expect(html).toContain('data-testid="existing-calendar"');
  expect(html).not.toContain('Opret ny kalender');
});
