import React from 'react';
import {createRoot} from 'react-dom/client';
import {act,Simulate} from 'react-dom/test-utils';
import {NoteEditor792,noteHTML792,notePlain792} from './NoteEditor792';
global.IS_REACT_ACT_ENVIRONMENT=true;
test('note formatting safely preserves bold italic and underline but never active HTML',()=>{
 const html=noteHTML792('<p><strong>Fed</strong> <em>Skrå</em> <u>Under</u><img src=x onerror=alert(1)><script>bad()</script></p>');
 expect(html).toBe('<p><strong>Fed</strong> <em>Skrå</em> <u>Under</u></p>');
 expect(notePlain792(html)).toBe('Fed Skrå Under');
});
test('a rich sidenote saves both readable text and formatting on input and restores it',()=>{
 const el=document.createElement('div');document.body.append(el);const root=createRoot(el);let saved;
 act(()=>root.render(<NoteEditor792 text="Gammel note" onChange={v=>{saved=v;}}/>));
 const editor=el.querySelector('[role="textbox"]');
 act(()=>{editor.innerHTML='<p><b>Ny</b> <u>note</u></p>';Simulate.input(editor);});
 expect(saved).toEqual({text:'Ny note',html:'<p><strong>Ny</strong> <u>note</u></p>'});
 act(()=>root.render(<NoteEditor792 text={saved.text} html={saved.html} onChange={()=>{}}/>));
 expect(editor.querySelector('u').textContent).toBe('note');act(()=>root.unmount());el.remove();
});
test('native formatting feedback preserves the same DOM selection and caret',()=>{
 const el=document.createElement('div');document.body.append(el);const root=createRoot(el);let saved;
 const render=(text,html)=>root.render(<NoteEditor792 text={text} html={html} onChange={v=>{saved=v;}}/>);
 act(()=>render('A note'));const editor=el.querySelector('[role="textbox"]');
 editor.innerHTML='<b>A note</b>';const original=editor.querySelector('b').firstChild,range=document.createRange();range.setStart(original,2);range.setEnd(original,6);window.getSelection().removeAllRanges();window.getSelection().addRange(range);
 act(()=>Simulate.input(editor));act(()=>render(saved.text,saved.html));
 expect(window.getSelection().anchorNode).toBe(original);expect(window.getSelection().toString()).toBe('note');
 act(()=>render('External update','<u>External update</u>'));expect(editor.querySelector('u').textContent).toBe('External update');
 act(()=>root.unmount());el.remove();
});
