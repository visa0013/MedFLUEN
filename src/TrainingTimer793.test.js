import React from 'react';
import fs from 'fs';
import path from 'path';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { FocusSymbol791 } from './Workspace791';
import { Training79Header } from './Training79';
import { TrainingIndex791 } from './TrainingIndex791';
import { AnkiUpload792 } from './AnkiUpload792';
jest.mock('./pdf791-engine', () => ({ loadPdfEngine791: async () => { throw Error('No PDF worker needed'); } }));
global.IS_REACT_ACT_ENVIRONMENT = true;
const source = fs.readFileSync(path.join(__dirname, 'App.js'), 'utf8');
const scriptPackage = require.resolve('react-scripts/package.json');
const babel = require(require.resolve('@babel/core', { paths: [scriptPackage] }));
const jsx = require.resolve('@babel/plugin-transform-react-jsx', { paths: [scriptPackage] });
const postcss = require(require.resolve('postcss', { paths: [scriptPackage] }));
function compile(text, name, dependencies) {
  const { code } = babel.transformSync(text, { plugins: [jsx], babelrc: false, configFile: false });
  return new Function(...Object.keys(dependencies), `${code}\nreturn ${name};`)(...Object.values(dependencies));
}
let el, root;
beforeEach(() => { el = document.createElement('div'); document.body.appendChild(el); root = createRoot(el); });
afterEach(() => { act(() => root.unmount()); el.remove(); document.querySelectorAll('[data-training-test-style]').forEach(style => style.remove()); });
function render(component) { act(() => root.render(component)); }
function frame(component) { return <div className="mf791-app mf75-app-frame" data-surface="paper" data-area="training">{component}</div>; }

// Run the production button binding without initializing App's remote backend.
const timerStart = source.indexOf('function Timer(');
const buttonStart = source.indexOf('<button\n          ref={triggerRef}', timerStart);
const buttonEnd = source.indexOf('</button>', buttonStart) + '</button>'.length;
const formatStart = source.indexOf('  function formatTime(value)', timerStart);
const formatEnd = source.indexOf('  function formatHours', formatStart);
const TimerButton = compile(`function TimerButton({active,seconds,timer791}) { const [open,setOpen]=React.useState(false); const triggerRef=React.useRef(null); const copy={openTimer:'Åbn Pomodoro',closeTimer:'Luk Pomodoro',focusControl:'Fokus'}; ${source.slice(formatStart, formatEnd)} return (${source.slice(buttonStart, buttonEnd)}); }`, 'TimerButton', { React, FocusSymbol791 });

test('focus shows its flame during a focus session and returns to the clock in breaks while preserving the countdown', () => {
  render(frame(<TimerButton active={false} seconds={1500} timer791={{ running: false, phase: 'idle' }} />));
  const idleIcon = el.querySelector('svg').outerHTML;
  expect(el.querySelector('.topbar-digital-time').textContent).toBe('Fokus');
  for (const [phase, running, seconds, text] of [['focus', true, 1499, '24:59'], ['focus', false, 720, '12:00'], ['break', true, 299, '04:59'], ['long-break', true, 899, '14:59']]) {
    render(frame(<TimerButton active seconds={seconds} timer791={{ running, phase }} />));
    if(phase==='focus'){
      expect(el.querySelector('.mf791-focus-flame')).not.toBeNull();
      expect(el.querySelector('.mf791-focus-ember')).not.toBeNull();
    }else expect(el.querySelector('svg').outerHTML).toBe(idleIcon);
    expect(el.querySelector('.topbar-digital-time').textContent).toBe(text);
    expect(el.querySelector('button').getAttribute('aria-label')).toBe(`Åbn Pomodoro: ${text}`);
  }
  act(() => el.querySelector('button').click());
  expect(el.querySelector('button').getAttribute('aria-expanded')).toBe('true');
});

test('an empty exam MCQ selection keeps source navigation and exam papers without an empty banner', () => {
  const start = source.indexOf('return <div className="flashcard71-shell mf79-training">');
  const end = source.indexOf('    {view !== "editor" && view !== "import"', start);
  const Header = compile(`function Header({onOpenExamSets}) { const view='decks',sourceMode79='exam-mcq',moduleQuestions=[],language='da',examLibrary=false; const setSourceMode79=()=>{},setSelectedId=()=>{},setView=()=>{},persistPreferences=()=>{}; ${source.slice(start, end)}</div>; }`, 'Header', { React, Training79Header, Flashcard71Styles: () => null });
  let opened = 0;
  render(<Header onOpenExamSets={() => { opened += 1; }} />);
  expect(el.querySelector('[role="status"]')).toBeNull();
  expect(el.querySelector('[role="tab"][aria-selected="true"]').textContent).toBe('Eksamens-MCQ');
  act(() => [...el.querySelectorAll('button')].find(button => button.textContent === 'Eksamenssæt').click());
  expect(opened).toBe(1);
});

test('upload has a usable quiet button surface and opens the existing APKG chooser while create stays reachable', () => {
  const style = document.createElement('style'); style.dataset.trainingTestStyle = 'true';
  const dedicated = path.join(__dirname, 'trainingTimer793.css');
  // jsdom's selector engine cannot evaluate unrelated modern workspace selectors.
  for (const name of ['apkgExam792.css', 'workspace791.css']) {
    postcss.parse(fs.readFileSync(path.join(__dirname, name), 'utf8')).walkRules(rule => {
      if (rule.parent.type === 'root' && rule.selector.includes('.mf791-index-tools')) style.textContent += rule.toString();
    });
  }
  style.textContent += fs.readFileSync(dedicated, 'utf8');
  document.head.appendChild(style);
  let cards = 0;
  const tree = { id: 'module:k5', label: 'K5', type: 'module', children: [] };
  function Harness() { const [upload, setUpload] = React.useState(false); return frame(upload ? <AnkiUpload792 signedIn moduleId="K5" onBack={() => setUpload(false)} /> : <TrainingIndex791 tree={tree} selected={tree} onImport={() => setUpload(true)} onCreate={() => { cards += 1; }} onCreateDeck={async () => {}} />); }
  render(<Harness />);
  const upload = [...el.querySelectorAll('button')].find(button => button.textContent === 'Upload flashcards');
  const appearance = getComputedStyle(upload);
  expect(parseFloat(appearance.minHeight)).toBeGreaterThanOrEqual(36);
  expect(parseFloat(appearance.borderRadius)).toBeGreaterThanOrEqual(6);
  expect(appearance.gap).toBe('8px');
  expect(upload.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
  act(() => [...el.querySelectorAll('button')].find(button => button.textContent === 'Nyt kort').click());
  expect(cards).toBe(1);
  act(() => upload.click());
  expect(el.querySelector('input[type="file"]').accept).toBe('.apkg');
  act(() => el.querySelector('[data-anki-back]').click());
  act(() => [...el.querySelectorAll('button')].find(button => button.textContent === 'Nyt dæk').click());
  expect(el.querySelector('[aria-label="Navn på dæk"]')).not.toBeNull();
});
