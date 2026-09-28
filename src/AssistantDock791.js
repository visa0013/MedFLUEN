import React from 'react';
import {createPortal} from 'react-dom';
// Keep the reader/workspace stacking context from hiding the assistant's exits.
export function AssistantDock791({open,overlay,width,style={},children}) {
 const host=document.querySelector('.mf791-app');
 const panel=<div className="notes-open drbyte-panel-open" style={{...style,position:'fixed',top:'var(--mf791-header,76px)',bottom:'var(--dock-bottom75,0px)',right:'var(--dock-right75,0px)',zIndex:1100,width,height:'auto',opacity:1}}>{children}</div>;
 return <><div data-assistant-space style={{width:open&&!overlay?width:0,flexShrink:0,height:'100%'}}/>{open&&(host?createPortal(panel,host):panel)}</>;
}
