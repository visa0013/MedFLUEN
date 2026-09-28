import React,{forwardRef,useEffect,useImperativeHandle,useRef} from 'react';
const escapeText=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
export function noteHTML792(value){
 const template=document.createElement('template');template.innerHTML=String(value||'');
 function clean(node){
  if(node.nodeType===3)return escapeText(node.textContent);
  if(node.nodeType!==1)return '';
  const tag=node.tagName.toLowerCase();if(['script','style','iframe','object','img','svg','math','input'].includes(tag))return '';
  let body=[...node.childNodes].map(clean).join('');
  if(tag==='span'){if(node.style.fontWeight==='bold'||Number(node.style.fontWeight)>=600)body=`<strong>${body}</strong>`;if(node.style.fontStyle==='italic')body=`<em>${body}</em>`;if(node.style.textDecoration.includes('underline'))body=`<u>${body}</u>`;return body;}
  const safe=({b:'strong',i:'em'})[tag]||tag;
  if(safe==='br')return '<br>';
  return ['p','div','strong','em','u','ul','ol','li'].includes(safe)?`<${safe}>${body}</${safe}>`:body;
 }
 return [...template.content.childNodes].map(clean).join('');
}
export function notePlain792(html){
 const template=document.createElement('template');template.innerHTML=noteHTML792(html);
 const read=node=>node.nodeType===3?node.textContent:node.nodeType!==1?'':node.tagName==='BR'?'\n':[...node.childNodes].map(read).join('')+(['P','DIV','LI'].includes(node.tagName)?'\n':'');
 return [...template.content.childNodes].map(read).join('').replace(/\n$/,'');
}
export function plainNoteHTML792(text){
 // Only the small vocabulary previously used by page notes; no raw HTML.
 return escapeText(text).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>').replace(/\n/g,'<br>');
}
export const NoteEditor792=forwardRef(function NoteEditor792({text='',html,onChange,disabled=false,language='da'},ref){
 const node=useRef(null),range=useRef(null),emitted=useRef(null),value=html?noteHTML792(html):plainNoteHTML792(text);
 // Browser formatting may emit <b> while storage normalizes it to <strong>.
 // Do not rebuild the user's current DOM for our own input feedback: that
 // destroys its selection, caret and native undo stack. External changes
 // still pass through the sanitizer and replace the displayed value.
 useEffect(()=>{if(node.current&&emitted.current!==value){emitted.current=null;if(node.current.innerHTML!==value){node.current.innerHTML=value;range.current=null;}}},[value]);
 const remember=()=>{const selection=window.getSelection();if(selection?.rangeCount&&node.current?.contains(selection.anchorNode)&&node.current?.contains(selection.focusNode))range.current=selection.getRangeAt(0).cloneRange();};
 const save=()=>{const clean=noteHTML792(node.current.innerHTML);emitted.current=clean;onChange?.({text:notePlain792(clean),html:clean});};
 function format(command){if(disabled)return;node.current.focus();const selection=window.getSelection();if(range.current&&node.current.contains(range.current.commonAncestorContainer)){selection.removeAllRanges();selection.addRange(range.current);}document.execCommand?.(command,false);remember();save();}
 useImperativeHandle(ref,()=>({format,focus:()=>node.current?.focus()}));
 return <div ref={node} role="textbox" aria-label={language==='en'?'Page note':'Sidenote'} aria-multiline="true" aria-disabled={disabled} contentEditable={!disabled} suppressContentEditableWarning spellCheck className="pdf792-note-editor" data-placeholder={language==='en'?'Click to add notes…':'Klik for at tilføje noter…'} onInput={save} onMouseUp={remember} onKeyUp={remember} onBlur={remember} onKeyDown={event=>{if((event.ctrlKey||event.metaKey)&&['b','i','u'].includes(event.key.toLowerCase())){event.preventDefault();format({b:'bold',i:'italic',u:'underline'}[event.key.toLowerCase()]);}}} onPaste={event=>{event.preventDefault();if(disabled)return;document.execCommand?.('insertText',false,event.clipboardData.getData('text/plain'));save();}} onDrop={event=>{event.preventDefault();if(disabled)return;node.current.focus();document.execCommand?.('insertText',false,event.dataTransfer.getData('text/plain'));save();}}/>;
});
