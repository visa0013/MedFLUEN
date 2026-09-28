import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ByteSource79 } from './ByteSource79';
import {createRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';
jest.mock('./pdf791-engine',()=>({loadPdfEngine791:async()=>{throw Error('Test has no PDF worker');}}));
global.IS_REACT_ACT_ENVIRONMENT=true;

test('source peek identifies a verified PDF page without fabricated highlight', () => {
  const html = renderToStaticMarkup(<ByteSource79 title="N4 Epilepsi" page={16} quote="Fokale anfald begynder i et afgrænset netværk." url="blob:example" onClose={() => {}} />);
  expect(html).toContain('PDF-side 16');
  expect(html).toContain('Fokale anfald begynder');
  expect(html).not.toContain('highlight');
  expect(html).not.toContain('aria-modal="true"');
});
test('AI source preview uses the app reader rather than the native PDF iframe',async()=>{
  const el=document.createElement('div');document.body.append(el);const root=createRoot(el);
  await act(async()=>root.render(<ByteSource79 title="Test" page={4} url="blob:example" bytes={new ArrayBuffer(2)} onClose={()=>{}}/>));
  await act(async()=>[...el.querySelectorAll('button')].find(b=>b.textContent==='Vis PDF her').click());
  expect(el.querySelector('iframe')).toBeNull();expect(el.querySelector('[aria-label="PDF-læser"]')).not.toBeNull();
  await act(async()=>root.unmount());el.remove();
});
