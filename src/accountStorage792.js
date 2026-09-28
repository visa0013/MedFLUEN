import {useCallback,useEffect,useRef,useState} from 'react';
export const accountStorageKey792=(base,userId)=>`${base}:${String(userId||'signed-out')}`;
export function readAccountResume792(storage,base,userId){
 if(!userId)return null;
 try{const saved=JSON.parse(storage.getItem(accountStorageKey792(base,userId))||'null');return typeof saved?.resumeKey==='string'&&saved.resumeKey.startsWith(`${userId}::`)?saved:null;}catch{return null;}
}
// Legacy unowned data stays untouched. It cannot safely be attributed to the
// next person who logs into a shared browser.
export function useAccountStorage792(base,userId,fallback){
 const key=accountStorageKey792(base,userId),initial=useRef(fallback);
 const read=useCallback(()=>{if(!userId)return initial.current;try{const raw=localStorage.getItem(key);return raw==null?initial.current:JSON.parse(raw);}catch{return initial.current;}},[key,userId]);
 const [snapshot,setSnapshot]=useState(()=>({key,value:read()}));
 const value=snapshot.key===key&&userId?snapshot.value:initial.current,latest=useRef({key,value});latest.current={key,value};
 const setValue=useCallback(next=>{if(!userId)return;const previous=latest.current.key===key?latest.current.value:read(),resolved=typeof next==='function'?next(previous):next;localStorage.setItem(key,JSON.stringify(resolved));latest.current={key,value:resolved};setSnapshot({key,value:resolved});window.dispatchEvent(new CustomEvent('medlearn-storage-update',{detail:{key}}));},[key,userId,read]);
 useEffect(()=>{const hydrate=()=>setSnapshot({key,value:read()}),onUpdate=e=>{if(e.detail?.key===key||e.key===key)hydrate();};hydrate();window.addEventListener('medlearn-storage-update',onUpdate);window.addEventListener('storage',onUpdate);return()=>{window.removeEventListener('medlearn-storage-update',onUpdate);window.removeEventListener('storage',onUpdate);};},[key,read]);
 return [value,setValue,key];
}
