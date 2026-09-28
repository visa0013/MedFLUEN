import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { FirstEntry79, Landing79 } from './FirstEntry79';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

test('public first entry explains actual study flows and has explicit login actions', () => {
  const html = renderToStaticMarkup(<Landing79 onAccess={() => {}} />);
  expect(html).toContain('Slå pensum');
  expect(html).toContain('Opret konto');
  expect(html).toContain('Log ind');
  expect(html).toContain('Forelæsninger');
  expect(html).toContain('Flashkort');
  expect(html).toContain('Dunlosky');
});

test('landing tells a visible three-part product story before asking for signup', () => {
  const html = renderToStaticMarkup(<Landing79 onAccess={() => {}} />);
  expect(html).toContain('mf794-product-story');
  expect(html).toContain('Fra kilden');
  expect(html).toContain('Til kortet');
  expect(html).toContain('Til overblikket');
  expect(html).toContain('Opret konto');
});

test('public illustration names its actual research source instead of inventing PDF pages or lecture content', () => {
  const html = renderToStaticMarkup(<Landing79 onAccess={() => {}} />);
  expect(html).toContain('Dunlosky');
  expect(html).toContain('Selvtest');
  expect(html).toContain('https://www.psychologicalscience.org/journals/pspi/1529100612453266/');
  expect(html).not.toContain('DEMO / PDF');
  expect(html).not.toContain('12 / 46');
  expect(html).not.toContain('NEUROLOGI / N4');
});

test.each([['en', 'Practice testing', 'YOUR OWN RHYTHM'], ['ar', 'الاختبار الذاتي', 'إيقاعك الخاص']])('product illustration uses %s copy throughout', (language, title, rhythm) => {
  const html = renderToStaticMarkup(<Landing79 onAccess={() => {}} language={language} />);
  expect(html).toContain(title);
  expect(html).toContain(rhythm);
  expect(html).not.toContain('Hvad kan du huske?');
});

test('auth state retains the existing OTP form', () => {
  const html = renderToStaticMarkup(<FirstEntry79 auth={{}} initialMode="login" />);
  expect(html).toContain('mf75-auth-panel');
  expect(html).toContain('E-mail');
  expect(html).toContain('Adgangskode');
});

test('public footer credits the creator and the illustrated source is attributed', () => {
  const html = renderToStaticMarkup(<Landing79 onAccess={() => {}} />);
  expect(html).toContain('Lavet af Visar Krasniqi');
  expect(html).toContain('Dunlosky m.fl.');
});

test('first-visit paths explain a chosen action and lead to account creation', () => {
  const target = document.createElement('div');
  document.body.appendChild(target);
  const root = createRoot(target);
  const calls = [];
  act(() => root.render(<Landing79 onAccess={mode => calls.push(mode)} />));
  const training = [...target.querySelectorAll('button')].find(button => button.textContent.includes('Start med træning'));
  expect(training).toBeTruthy();
  act(() => training.click());
  expect(target.textContent).toContain('Vælg et dæk');
  const create = [...target.querySelectorAll('button')].find(button => button.textContent.includes('Opret konto') && button.closest('.mf79-first-path-detail'));
  expect(create).toBeTruthy();
  act(() => create.click());
  expect(calls).toEqual(['signup']);
  act(() => root.unmount());
  target.remove();
});

test('progress dots link to real sections and expose the current chapter', () => {
  const target = document.createElement('div');
  document.body.appendChild(target);
  const root = createRoot(target);
  act(() => root.render(<Landing79 onAccess={() => {}} />));
  const nav = target.querySelector('nav[aria-label="Følg siden"]');
  expect(nav).toBeTruthy();
  const dots = [...nav.querySelectorAll('a')];
  expect(dots).toHaveLength(4);
  dots.forEach(dot => expect(target.querySelector(dot.getAttribute('href'))).toBeTruthy());
  act(() => dots[2].click());
  expect(dots[2].getAttribute('aria-current')).toBe('location');
  act(() => root.unmount());
  target.remove();
});

describe('landing navigation and restrained scroll motion', () => {
  let target;
  let root;
  let scrollIntoView;
  let media;
  let frames;
  let rectangles;
  let originalMatchMedia;

  beforeEach(() => {
    target = document.createElement('div');
    document.body.appendChild(target);
    root = createRoot(target);
    scrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    media = { matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() };
    originalMatchMedia = window.matchMedia;
    window.matchMedia = () => media;
    frames = [];
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => { frames.push(callback); return frames.length; });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    rectangles = { 'mf79-main': 0, 'mf79-overview': 1200, 'mf79-byte': 2200, 'mf79-start': 3200 };
    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function () {
      const top = rectangles[this.id] ?? 1200;
      return { top, bottom: top + 600, left: 0, right: 800, width: 800, height: 600 };
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    target.remove();
    document.documentElement.removeAttribute('data-motion');
    window.matchMedia = originalMatchMedia;
    delete Element.prototype.scrollIntoView;
    delete Element.prototype.animate;
    jest.restoreAllMocks();
  });

  const mount = () => act(() => root.render(<Landing79 onAccess={() => {}} language="en" />));
  const flush = () => act(() => { const queued = frames.splice(0); queued.forEach(callback => callback(0)); });

  test('dot labels identify their destination and links request native smooth scrolling', () => {
    mount();
    const dot = target.querySelector('a[href="#mf79-byte"][aria-label]');
    expect(dot.getAttribute('aria-label')).toContain('Dr. Byte');
    act(() => dot.click());
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(dot.getAttribute('aria-current')).toBe('location');
  });

  test.each(['system', 'root'])('anchor movement respects the %s reduced-motion preference', preference => {
    if (preference === 'system') media.matches = true;
    if (preference === 'root') document.documentElement.setAttribute('data-motion', 'reduce');
    mount();
    act(() => target.querySelector('a[href="#mf79-overview"][aria-label]').click());
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
  });

  test('scroll updates the current section on the next frame and resize recalculates it', () => {
    mount();
    flush();
    rectangles['mf79-overview'] = 0;
    act(() => { window.dispatchEvent(new Event('scroll')); window.dispatchEvent(new Event('scroll')); });
    expect(target.querySelector('[aria-current="location"]').getAttribute('href')).toBe('#mf79-main');
    expect(frames.length).toBeGreaterThan(0);
    flush();
    expect(target.querySelector('[aria-current="location"]').getAttribute('href')).toBe('#mf79-overview');
    rectangles['mf79-byte'] = 0;
    act(() => window.dispatchEvent(new Event('resize')));
    flush();
    expect(target.querySelector('[aria-current="location"]').getAttribute('href')).toBe('#mf79-byte');
  });

  test('hero stays pinned while its full product scene advances over the available scroll distance', () => {
    const viewport = window.innerHeight;
    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function () {
      if (this.classList.contains('mf79-first-hero')) return { top: -viewport / 2, bottom: viewport * 1.5, height: viewport * 2 };
      const top = rectangles[this.id] ?? 1200;
      return { top, bottom: top + 600, height: 600 };
    });
    mount();
    flush();
    expect(target.querySelector('.mf794-hero-sticky')).toBeTruthy();
    expect(target.querySelector('.mf794-hero-stage').style.getPropertyValue('--landing-cinema-progress')).toBe('0.500');
  });

  test('lower sections reveal once and remain available if browser animation is unavailable', () => {
    const animations = [];
    Element.prototype.animate = function (keyframes, options) { animations.push({ element: this, keyframes, options }); return { cancel: jest.fn() }; };
    mount();
    flush();
    expect(animations).toHaveLength(0);
    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function () {
      const top = this.classList.contains('mf79-first-overview-lead') ? 100 : rectangles[this.id] ?? 1200;
      return { top, bottom: top + 600, height: 600 };
    });
    act(() => window.dispatchEvent(new Event('scroll')));
    flush();
    expect(animations.some(item => item.element.classList.contains('mf79-first-overview-lead'))).toBe(true);
    const count = animations.length;
    act(() => window.dispatchEvent(new Event('scroll')));
    flush();
    expect(animations).toHaveLength(count);
    delete Element.prototype.animate;
    expect(target.querySelector('.mf79-first-chapters').textContent).toContain('Read in context');
    expect(target.querySelector('.mf79-first-overview-lead').style.opacity).toBe('');
  });

  test('enabling reduced motion cancels an in-flight reveal and stops future motion', async () => {
    const animations = [];
    Element.prototype.animate = function () { const animation = { cancel: jest.fn() }; animations.push(animation); return animation; };
    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function () {
      const top = this.classList.contains('mf79-first-overview-lead') ? 100 : rectangles[this.id] ?? 1200;
      return { top, bottom: top + 600, height: 600 };
    });
    mount();
    flush();
    expect(animations).toHaveLength(1);
    await act(async () => document.documentElement.setAttribute('data-motion', 'reduce'));
    flush();
    expect(animations[0].cancel).toHaveBeenCalledTimes(1);
    expect(target.querySelector('.mf793-landing').getAttribute('data-landing-motion')).toBe('reduce');
    act(() => window.dispatchEvent(new Event('scroll')));
    flush();
    expect(animations).toHaveLength(1);
    act(() => target.querySelector('a[href="#mf79-byte"][aria-label]').click());
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
  });

  test('an unsupported reveal leaves the content readable and section tracking responsive', () => {
    Element.prototype.animate = () => { throw new Error('Animation unavailable'); };
    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function () {
      const top = this.classList.contains('mf79-first-overview-lead') ? 100 : rectangles[this.id] ?? 1200;
      return { top, bottom: top + 600, height: 600 };
    });
    mount();
    expect(flush).not.toThrow();
    expect(target.querySelector('.mf79-first-overview-lead').textContent).toContain('One course.');
    rectangles['mf79-byte'] = 100;
    act(() => window.dispatchEvent(new Event('scroll')));
    flush();
    expect(target.querySelector('[aria-current="location"]').getAttribute('href')).toBe('#mf79-byte');
  });
});
