import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { ExamTopics798 } from './ExamTopics798';
global.IS_REACT_ACT_ENVIRONMENT = true;
test('an emptied exam selection can reopen the browser to restore its cards', () => {
  const el = document.createElement('div'); document.body.appendChild(el); const root = createRoot(el);
  function Harness() {
    const [browse, setBrowse] = React.useState(false);
    return browse ? <p>Gendan kort</p> : <ExamTopics798 tree={{ children: [], questions: [] }} selected={{ questions: [], label: 'Neurologi' }} restoreCount={3} onBrowse={() => setBrowse(true)} />;
  }
  try {
    act(() => root.render(<Harness />));
    act(() => [...el.querySelectorAll('button')].find(button => button.textContent === 'Gennemse kort').click());
    expect(el.textContent).toBe('Gendan kort');
  } finally { act(() => root.unmount()); el.remove(); }
});
