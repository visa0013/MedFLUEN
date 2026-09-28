import React from 'react';
import {createRoot} from 'react-dom/client';
import {act,Simulate} from 'react-dom/test-utils';
import {CurriculumFilters791,LectureStatus791,MaterialEmpty791,useCurriculumNavigation791,CurriculumHeading791,LectureProgress791,CurriculumProgress791,MaterialDetails791} from './Curriculum791';
global.IS_REACT_ACT_ENVIRONMENT=true;
function mount(ui){const el=document.createElement('div');document.body.appendChild(el);const root=createRoot(el);act(()=>root.render(ui));return {el,close(){act(()=>root.unmount());el.remove();}};}
test('lecture progress distinguishes studying from attendance and missing work',()=>{
  const ui=mount(<LectureProgress791 selfStudyStatus="in-progress" attendanceStatus="attended"/>);
  expect(ui.el.textContent).toContain('I gang');expect(ui.el.textContent).toContain('Deltaget');
  expect(ui.el.textContent).not.toContain('Gennemgået');ui.close();
  const pending=mount(<LectureProgress791 selfStudyStatus="not-started" attendanceStatus="unmarked"/>);
  expect(pending.el.textContent).toContain('Mangler');pending.close();
});
test('curriculum summary counts actual study states without treating attended lectures as completed',()=>{
  const ui=mount(<CurriculumProgress791 rows={[{selfStudyStatus:'reviewed'},{selfStudyStatus:'in-progress'},{selfStudyStatus:'not-started',attendanceStatus:'attended'}]}/>);
  expect(ui.el.querySelector('[data-status="reviewed"]').textContent).toContain('1');
  expect(ui.el.querySelector('[data-status="in-progress"]').textContent).toContain('1');
  expect(ui.el.querySelector('[data-status="not-started"]').textContent).toContain('1');
  expect(ui.el.querySelector('progress').value).toBe(1);expect(ui.el.querySelector('progress').max).toBe(3);ui.close();
});
test('curriculum summary follows the chosen lecture, class or TBL category',()=>{
 const rows=[{lecture:{id:'N1',kind:'lecture'},selfStudyStatus:'reviewed'},{lecture:{id:'H1',kind:'class'},selfStudyStatus:'in-progress'},{lecture:{id:'TBL1',kind:'tbl'},selfStudyStatus:'not-started'}];
 const ui=mount(<CurriculumProgress791 rows={rows} kind="class"/>);
 expect(ui.el.querySelector('progress').max).toBe(1);
 expect(ui.el.querySelector('[data-status="in-progress"]').textContent).toContain('1');
 expect(ui.el.querySelector('[data-status="reviewed"]').textContent).toContain('0');ui.close();
});
test('a list status can be changed explicitly without opening the lecture reader',()=>{
 let status='not-started';function Harness(){const [value,set]=React.useState(status);return <LectureProgress791 selfStudyStatus={value} onChange={v=>{status=v;set(v);}} lectureId="N2"/>;}
 const ui=mount(<Harness/>);const trigger=ui.el.querySelector('button');expect(trigger).not.toBeNull();
 act(()=>trigger.click());const choice=[...document.querySelectorAll('[role="dialog"] button')].find(b=>b.textContent.includes('Gennemgået'));
 act(()=>choice.click());expect(status).toBe('reviewed');expect(ui.el.textContent).toContain('Gennemgået');expect(document.querySelector('[role="dialog"]')).toBeNull();ui.close();
});
test('upload details stay secondary while edits preserve file metadata',()=>{
  let last;
  function Harness(){const [draft,set]=React.useState({mode:'upload',name:'Intro.pdf',files:[{name:'Intro.pdf',size:6144}],materialType:'slides',makePrimary:true});last=draft;return <MaterialDetails791 draft={draft} onChange={set} types={[{id:'slides',label:'Slides'}]} labels={{options:'Tilpas materiale',name:'Navn',type:'Type',primary:'Primært materiale'}}/>;}
  const ui=mount(<Harness/>);const options=ui.el.querySelector('details');expect(options.open).toBe(false);
  act(()=>{options.open=true;});act(()=>Simulate.change(ui.el.querySelector('input[type="text"]'),{target:{value:'N1 intro'}}));
  expect(last.name).toBe('N1 intro');expect(last.makePrimary).toBe(true);expect(last.files[0].name).toBe('Intro.pdf');ui.close();
});
test('batch upload does not offer a name that would silently be ignored',()=>{
  const ui=mount(<MaterialDetails791 draft={{mode:'upload',files:[{name:'A.pdf'},{name:'B.pdf'}],name:''}} onChange={()=>{}}/>);
  expect(ui.el.querySelector('input[type="text"]')).toBeNull();ui.close();
});
test('one readable filter selects an existing status while retaining its count',()=>{
  function Harness(){const [filter,set]=React.useState('all');return <CurriculumFilters791 filters={[{id:'all',label:'Alle'},{id:'favorites',label:'Favoritter'}]} counts={{all:46,favorites:3}} filter={filter} onFilter={set} sort="number" onSort={()=>{}} shown={filter==='all'?46:3} total={46}/>;}
  const ui=mount(<Harness/>);
  const select=ui.el.querySelector('select[aria-label="Vis forelæsninger"]');
  expect(select.options[1].textContent).toContain('3');
  act(()=>Simulate.change(select,{target:{value:'favorites'}}));
  expect(select.value).toBe('favorites');
  expect(ui.el.querySelector('[role="status"]').textContent).toContain('3');
  ui.close();
});
test('status menu explicitly selects any saved status rather than hiding a cycle',()=>{
  function Harness(){const [value,set]=React.useState('not-started');return <LectureStatus791 label="Selvstudie" value={value} options={[{id:'not-started',label:'Ikke startet'},{id:'in-progress',label:'I gang'},{id:'reviewed',label:'Gennemgået'}]} onChange={set}/>;}
  const ui=mount(<Harness/>);const select=ui.el.querySelector('select');
  expect(select.getAttribute('aria-label')).toBe('Selvstudie');
  act(()=>Simulate.change(select,{target:{value:'reviewed'}}));expect(select.value).toBe('reviewed');
  act(()=>Simulate.change(select,{target:{value:'not-started'}}));expect(select.value).toBe('not-started');ui.close();
});
test('empty lecture offers material upload only when a lecture is selected',()=>{
  let opened=0;const ui=mount(<MaterialEmpty791 selected title="Neurologisk udfald" onAdd={()=>opened++}/>);
  act(()=>ui.el.querySelector('button').click());expect(opened).toBe(1);ui.close();
  const empty=mount(<MaterialEmpty791 selected={false} onAdd={()=>opened++}/>);
  expect(empty.el.querySelector('button')).toBeNull();empty.close();
});

test('lecture navigation starts with the overview and restores the opening row on return',()=>{
  function Harness(){const nav=useCurriculumNavigation791();const [query,setQuery]=React.useState('');return <><CurriculumHeading791 page={nav.page} headingRef={nav.headingRef} onBack={nav.back} lecture={{id:'N1',title:'Intro til neurologi',group:'Neurologi'}} moduleName="K5"/><section hidden={nav.page!=='overview'}><input aria-label="Søg" value={query} onChange={e=>setQuery(e.target.value)}/><button onClick={e=>nav.open(e.currentTarget)}>N1</button></section><section hidden={nav.page!=='reader'}>PDF læser</section></>;}
  const ui=mount(<Harness/>);const row=[...ui.el.querySelectorAll('button')].find(b=>b.textContent==='N1');
  expect(ui.el.querySelector('h1').textContent).toBe('Forelæsninger');
  act(()=>Simulate.change(ui.el.querySelector('input'),{target:{value:'intro'}}));
  act(()=>row.click());expect(ui.el.querySelector('h1').textContent).toContain('Intro til neurologi');
  expect(ui.el.querySelector('section').hidden).toBe(true);
  expect(document.activeElement).toBe(ui.el.querySelector('h1'));
  act(()=>ui.el.querySelector('.mf791-curriculum-back').click());
  expect(ui.el.querySelector('section').hidden).toBe(false);
  expect(ui.el.querySelector('input').value).toBe('intro');expect(document.activeElement).toBe(row);ui.close();
});

test('a note source can open the reader without a redundant overview visit',()=>{
  function Harness(){const nav=useCurriculumNavigation791(true);return <p>{nav.page}</p>;}
  const ui=mount(<Harness/>);expect(ui.el.textContent).toBe('reader');ui.close();
});

test('simple lecture filters expose three main choices while retaining advanced selections',()=>{
  function Harness(){const [filter,set]=React.useState('all');return <CurriculumFilters791 simple filters={[{id:'all',label:'Alle'},{id:'favorites',label:'Stjernemarkerede'},{id:'notReviewed',label:'Ikke gennemgået'},{id:'missing-material',label:'Mangler materiale'}]} counts={{all:46,favorites:2,'notReviewed':30,'missing-material':7}} filter={filter} onFilter={set} sort="number" onSort={()=>{}} shown={filter==='favorites'?2:7} total={46}/>;}
  const ui=mount(<Harness/>);const main=[...ui.el.querySelectorAll('[role="group"] button')];
  expect(main).toHaveLength(3);
  act(()=>main[1].click());expect(main[1].getAttribute('aria-pressed')).toBe('true');
  const more=ui.el.querySelector('details');expect(more.open).toBe(false);
  const advanced=more.querySelector('select[aria-label="Vis forelæsninger"]');
  act(()=>Simulate.change(advanced,{target:{value:'missing-material'}}));expect(advanced.value).toBe('missing-material');
  expect(main.every(b=>b.getAttribute('aria-pressed')==='false')).toBe(true);ui.close();
});
