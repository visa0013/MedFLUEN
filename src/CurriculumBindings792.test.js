import React from 'react';
import fs from 'fs';
import path from 'path';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { LectureProgress791 } from './Curriculum791';
import { contentKind79 } from './curriculum79-model';
global.IS_REACT_ACT_ENVIRONMENT = true;
const source = fs.readFileSync(path.join(__dirname, 'App.js'), 'utf8');
test('lecture list filter counts describe only the selected content kind', () => {
  const start = source.indexOf('  const lectureKindRows =') >= 0 ? source.indexOf('  const lectureKindRows =') : source.indexOf('  const lectureFilterCounts =');
  const end = source.indexOf('  const lectureModuleOverviewItems =', start);
  const run = new Function('lectureRows', 'contentKindFilter79', 'contentKind79', `${source.slice(start, end)}return lectureFilterCounts;`);
  const rows = [
    { lecture: { id: 'N1', kind: 'lecture' }, selfStudyStatus: 'reviewed', scheduleView: { key: 'held' }, hasPdf: true, followUp: { active: false } },
    { lecture: { id: 'H1', kind: 'class' }, selfStudyStatus: 'in-progress', scheduleView: { key: 'upcoming' }, hasPdf: false, followUp: { active: true } },
    { lecture: { id: 'TBL1', kind: 'tbl' }, selfStudyStatus: 'not-started', scheduleView: { key: 'upcoming' }, hasPdf: false, followUp: { active: false } },
  ];
  expect(run(rows, 'class', contentKind79)).toMatchObject({ all: 1, held: 0, upcoming: 1, reviewed: 0, notReviewed: 1, missingMaterial: 1, followUp: 1 });
});

test('lecture row progress sends an explicit status together with its lecture id', () => {
  // Exercise the real App row binding without bootstrapping its remote backend.
  const start = source.indexOf('<LectureProgress791 '), end = source.indexOf('/>', start) + 2;
  const scriptPackage = require.resolve('react-scripts/package.json');
  const babel = require(require.resolve('@babel/core', { paths: [scriptPackage] }));
  const jsx = require.resolve('@babel/plugin-transform-react-jsx', { paths: [scriptPackage] });
  const { code } = babel.transformSync(`const Row = () => (${source.slice(start, end)});`, { plugins: [jsx], babelrc: false, configFile: false });
  let saved;
  const Row = new Function('React', 'LectureProgress791', 'lecture', 'selfStudyStatus', 'attendanceStatus', 'language', 'cycleLectureSelfStudy', `${code} return Row;`)(React, LectureProgress791, { id: 'H1' }, 'not-started', 'unmarked', 'da', (id, value) => { saved = [id, value]; });
  const el = document.createElement('div'); document.body.appendChild(el); const root = createRoot(el);
  try {
    act(() => root.render(<Row/>));
    expect(el.querySelector('button')).not.toBeNull();
    act(() => el.querySelector('button').click());
    act(() => document.querySelector('.curriculum792-status-picker button[data-status="reviewed"]').click());
    expect(saved).toEqual(['H1', 'reviewed']);
  } finally { act(() => root.unmount()); el.remove(); }
});

test('the portalled status picker keeps the active workspace colors', () => {
  const el=document.createElement('div');document.body.appendChild(el);const root=createRoot(el);
  try {
    act(()=>root.render(<div className="mf791-app" style={{'--mf79-surface':'#202c29','--mf79-ink':'#ecf0eb','--mf79-line':'#53665d'}}><LectureProgress791 lectureId="N1" selfStudyStatus="not-started" onChange={()=>{}}/></div>));
    act(()=>el.querySelector('button').click());
    const menu=document.querySelector('.curriculum792-status-picker');
    expect(menu.style.getPropertyValue('--mf79-surface')).toBe('#202c29');
    expect(menu.style.getPropertyValue('--mf79-ink')).toBe('#ecf0eb');
    expect(menu.style.getPropertyValue('--mf79-line')).toBe('#53665d');
  } finally {act(()=>root.unmount());el.remove();}
});
