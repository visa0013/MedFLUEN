import React from 'react';
import {Home79Header} from './Home79';
import {Mark791} from './Workspace791';
export function SduImportButton791({onImport,language='da'}){
  const label=language==='en'?'Import SDU timetable':language==='ar'?'استيراد جدول SDU':'Importér SDU-skema';
  return <button type="button" className="mf791-sdu-import" aria-label={label} title={label} onClick={onImport}><Mark791 name="download" size={17}/></button>;
}
export function HomeLanding791({name,moduleName,language='da',panel='calendar',onPanel,calendar,studyPlan}){
  const labels=language==='en'?['Calendar','Study plan']:language==='ar'?['التقويم','خطة الدراسة']:['Kalender','Studieplan'];
  return <section className="mf791-home-landing" data-panel={panel}>
    <Home79Header name={name} moduleName={moduleName} language={language}/>
    <nav className="mf791-home-panels" aria-label={language==='en'?'Home workspace':'Dit hjem'}>
      {['calendar','plan'].map((id,index)=><button key={id} type="button" data-home-panel={id} aria-current={panel===id?'page':undefined} onClick={()=>onPanel?.(id)}>{labels[index]}</button>)}
    </nav>
    <div data-home-content="calendar" hidden={panel!=='calendar'}>{calendar}</div>
    <div data-home-content="plan" hidden={panel!=='plan'}>{panel==='plan'?studyPlan:null}</div>
  </section>;
}
