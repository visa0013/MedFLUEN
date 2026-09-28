import React from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';
import {PageNote78} from './Notes78';
global.IS_REACT_ACT_ENVIRONMENT=true;
test('a PDF quote is appended to the current page note without overwriting it',async()=>{
  const el=document.createElement('div');document.body.append(el);const root=createRoot(el);let saved;
  const journal={rows:[{id:'note1',type:'sticky',page:3,payload:{kind:'slide-note',text:'Min eksisterende note'}}],status:'ready',put:row=>{saved=row;}};
  await act(async()=>root.render(<PageNote78 materialId="m1" page={3} numPages={4} journal={journal} selectionRequest={{materialId:'m1',page:3,text:'Et valgt uddrag',requestId:8}}/>));
  expect(saved.payload.text).toContain('Min eksisterende note');expect(saved.payload.text).toContain('Et valgt uddrag');
  expect(el.textContent).not.toContain('browserens PDF-viser');
  await act(async()=>root.unmount());el.remove();
});
