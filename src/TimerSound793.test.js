import React from 'react';
import fs from 'fs';
import path from 'path';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { FocusSymbol791 } from './Workspace791';
import { PomodoroPanel791, usePomodoro791, pomodoroSettings791 } from './Pomodoro791';
import { useTimerSound793 } from './timerSound793';
global.IS_REACT_ACT_ENVIRONMENT = true;
const source = fs.readFileSync(path.join(__dirname, 'App.js'), 'utf8');
const scriptPackage = require.resolve('react-scripts/package.json');
const babel = require(require.resolve('@babel/core', { paths: [scriptPackage] }));
const jsx = require.resolve('@babel/plugin-transform-react-jsx', { paths: [scriptPackage] });
const names = ['Timer', 'loadStorage', 'useStoredState', 'dateKey', 'startOfWeek', 'addDays', 'recordStudyActivity'];
const declarations = names.map(name => { const start = source.indexOf(`function ${name}(`); return source.slice(start, source.indexOf('\nfunction ', start + 1)); }).join('\n');
const { code } = babel.transformSync(declarations, { plugins: [jsx], babelrc: false, configFile: false });
const dependencies = { React, useState: React.useState, useEffect: React.useEffect, useRef: React.useRef, FocusSymbol791, PomodoroPanel791, usePomodoro791, pomodoroSettings791, useTimerSound793, STORAGE: { timer: 'sound-test-timer', pomodoroPlans: 'sound-test-plans', pomodoroLog: 'sound-test-log', pomodoroMinutesLog: 'sound-test-minutes', streak: 'sound-test-streak' } };
const Timer = new Function(...Object.keys(dependencies), `${code}\nreturn Timer;`)(...Object.values(dependencies));
let host, root, contexts, notes;
class AudioContextBoundary {
  constructor() { this.state = 'suspended'; this.currentTime = 10; this.destination = {}; contexts.push(this); }
  resume() { this.state = 'running'; return Promise.resolve(); }
  close() { this.state = 'closed'; return Promise.resolve(); }
  createOscillator() { const note = { frequency: { setValueAtTime(value, time) { note.frequencyValue = value; note.frequencyTime = time; } }, connect() {}, disconnect() {}, start(time) { note.started = time; }, stop(time) { note.stopped = time; } }; notes.push(note); return note; }
  createGain() { return { gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, disconnect() {} }; }
}
beforeEach(() => { jest.useFakeTimers(); localStorage.clear(); localStorage.setItem('sound-test-timer', JSON.stringify({ focus: 1, pause: 1 })); contexts = []; notes = []; window.AudioContext = AudioContextBoundary; host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host); });
afterEach(() => { act(() => root.unmount()); host.remove(); delete window.AudioContext; localStorage.clear(); jest.useRealTimers(); });
function render(sound) { act(() => root.render(<Timer timerSound={sound} c={{}} t={{ home: 'Home' }} language="da" route="home" compact791 />)); }
function start() { act(() => host.querySelector('.topbar-focus-control').click()); act(() => [...host.querySelectorAll('button')].find(button => button.textContent === 'Start fokus').click()); }

test('an enabled timer primes audio on Start and emits one short note only on completed focus', () => {
  render(true); expect(contexts).toHaveLength(0);
  start(); expect(contexts).toHaveLength(1); expect(notes).toHaveLength(0);
  act(() => jest.advanceTimersByTime(60000));
  expect(host.querySelector('.topbar-focus-control').dataset.phase).toBe('break');
  expect(notes).toHaveLength(1);
  expect(notes[0].started).toBe(10);
  expect(notes[0].stopped - notes[0].started).toBeLessThanOrEqual(.5);
  act(() => jest.advanceTimersByTime(60000));
  expect(host.querySelector('.topbar-focus-control').dataset.phase).toBe('idle');
  expect(notes).toHaveLength(1);
});

test('disabled timer sound creates no audio context or note when focus completes', () => {
  render(false); start(); act(() => jest.advanceTimersByTime(60000));
  expect(host.querySelector('.topbar-focus-control').dataset.phase).toBe('break');
  expect(contexts).toHaveLength(0); expect(notes).toHaveLength(0);
});

test('turning sound off during an active focus suppresses its completion note', () => {
  render(true); start(); expect(contexts).toHaveLength(1);
  render(false); act(() => jest.advanceTimersByTime(60000));
  expect(host.querySelector('.topbar-focus-control').dataset.phase).toBe('break');
  expect(notes).toHaveLength(0);
});

test('turning sound on during an active focus enables its completion note without playing immediately', () => {
  render(false); start(); expect(contexts).toHaveLength(0);
  render(true); expect(contexts).toHaveLength(1); expect(notes).toHaveLength(0);
  act(() => jest.advanceTimersByTime(60000));
  expect(host.querySelector('.topbar-focus-control').dataset.phase).toBe('break');
  expect(notes).toHaveLength(1);
});

test('unsupported audio does not prevent starting or completing a focus block', () => {
  window.AudioContext = class { constructor() { throw Error('Audio unavailable'); } };
  render(true); start(); act(() => jest.advanceTimersByTime(60000));
  expect(host.querySelector('.topbar-focus-control').dataset.phase).toBe('break');
  expect(notes).toHaveLength(0);
});
