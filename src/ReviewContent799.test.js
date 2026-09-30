import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { ReviewContent799 } from './ReviewContent799';

jest.mock('./Experience72', () => ({ RichContent72: ({ html, text }) => <div dangerouslySetInnerHTML={{ __html: html || text || '' }} /> }));
const image = 'data:image/png;base64,iVBORw0KGgo=';
global.IS_REACT_ACT_ENVIRONMENT = true;
let host, root;
beforeEach(() => { host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host); });
afterEach(() => { act(() => root.unmount()); host.remove(); });
const click = node => act(() => node.click());

test('keeps imported images in their holder and closes enlargement outside the image', () => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  act(() => root.render(<ReviewContent799 html={`<p>Spørgsmål</p><img src="${image}" alt="Figur" />`} />));
  expect(host.querySelector('.mf799-review-text img')).toBeNull();
  click(host.querySelector('[aria-label="Forstør billede 1"]'));
  const dialog = document.querySelector('dialog');
  expect(dialog.querySelector('img').getAttribute('src')).toBe(image);
  click(dialog.querySelector('img'));
  expect(document.querySelector('dialog')).not.toBeNull();
  click(dialog);
  expect(document.querySelector('dialog')).toBeNull();
  expect(document.body.style.overflow).toBe('');
});

test('does not add an empty image holder to text-only cards', () => {
  act(() => root.render(<ReviewContent799 text="Spørgsmål uden billede" />));
  expect(host.textContent).toBe('Spørgsmål uden billede');
  expect(host.querySelector('.mf799-image-holder')).toBeNull();
});
