import React from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';
import {useAccountStorage792,accountStorageKey792,readAccountResume792} from './accountStorage792';
global.IS_REACT_ACT_ENVIRONMENT=true;
test('private session history survives account switches without exposing or overwriting another account',()=>{
 localStorage.clear();localStorage.setItem('history',JSON.stringify([{category:'Unclaimed legacy deck'}]));
 const el=document.createElement('div');document.body.append(el);const root=createRoot(el);let value,setValue;
 function Probe({user}){[value,setValue]=useAccountStorage792('history',user,[]);return <div>{JSON.stringify(value)}</div>;}
 act(()=>root.render(<Probe user="A"/>));expect(value).toEqual([]);
 act(()=>setValue([{category:'Private A'}]));
 act(()=>root.render(<Probe user="B"/>));expect(value).toEqual([]);
 act(()=>setValue([{category:'Private B'}]));
 act(()=>root.render(<Probe user="A"/>));expect(value).toEqual([{category:'Private A'}]);
 expect(JSON.parse(localStorage.getItem('history'))).toEqual([{category:'Unclaimed legacy deck'}]);
 expect(JSON.parse(localStorage.getItem(accountStorageKey792('history','B')))).toEqual([{category:'Private B'}]);
 act(()=>root.render(<Probe user={null}/>));expect(value).toEqual([]);act(()=>setValue([{category:'signed-out'}]));expect(value).toEqual([]);
 act(()=>root.unmount());el.remove();
});
test('resume readers never use unowned legacy answers or a mismatched account identity',()=>{
 const store=new Map([['resume',JSON.stringify({answers:{private:1}})],['resume:A',JSON.stringify({resumeKey:'A::K5::all',answers:{a:1}})],['resume:B',JSON.stringify({resumeKey:'A::K5::all',answers:{a:1}})]]),storage={getItem:key=>store.get(key)||null};
 expect(readAccountResume792(storage,'resume',null)).toBeNull();expect(readAccountResume792(storage,'resume','B')).toBeNull();
 expect(readAccountResume792(storage,'resume','A')).toMatchObject({answers:{a:1}});
});
