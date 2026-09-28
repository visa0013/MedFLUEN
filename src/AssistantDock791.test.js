import React from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';
import {AssistantDock791} from './AssistantDock791';
import fs from 'fs';
import path from 'path';
global.IS_REACT_ACT_ENVIRONMENT=true;
test('assistant escapes the page stacking context while reserving regular layout space',()=>{
 const frame=document.createElement('div');frame.className='mf791-app';const content=document.createElement('div');content.className='app-surface';frame.append(content);document.body.append(frame);const root=createRoot(content);
 try{act(()=>root.render(<AssistantDock791 open width={400} overlay={false}><button>Close</button></AssistantDock791>));const dock=frame.querySelector('.drbyte-panel-open');expect(dock.parentElement).toBe(frame);expect(content.querySelector('button')).toBeNull();expect(content.querySelector('[data-assistant-space]').style.width).toBe('400px');act(()=>root.render(<AssistantDock791 open={false} width={400}><button>Close</button></AssistantDock791>));expect(frame.querySelector('.drbyte-panel-open')).toBeNull();}finally{act(()=>root.unmount());frame.remove();}
});
test('desktop focus reserves assistant width instead of covering PDF and note tools',()=>{
 const app=fs.readFileSync(path.join(__dirname,'App.js'),'utf8');
 const css=fs.readFileSync(path.join(__dirname,'workspace791.css'),'utf8');
 expect(app.includes('"--mf791-byte-width": `${effectiveDrByteWidth}px`')).toBe(true);
 expect(css.includes('[data-byte-open="true"]')).toBe(true);
 expect(css.includes('width:calc(100vw - var(--mf791-byte-width,410px))!important')).toBe(true);
});
