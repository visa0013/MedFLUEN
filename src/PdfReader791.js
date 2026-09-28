import React,{useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {loadPdfEngine791} from './pdf791-engine';
import {pdfPage791,pdfScale791,pdfSearch791,openPdfDocument791,extractPdfIndex791,publishPdfDocument791,pdfAnnotations791} from './pdf791-model';
import './pdf791.css';

function ReaderIcon791({name}) {
  const paths={pages:<><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v18"/></>,search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,left:<path d="m14 6-6 6 6 6"/>,right:<path d="m10 6 6 6-6 6"/>,mark:<><path d="m6 14 8-8 4 4-8 8H6zM5 21h14"/></>,edit:<path d="m4 16 12-12 4 4L8 20H4zm10-10 4 4"/>,rotate:<><path d="M4 9a8 8 0 1 1 1 10M4 4v5h5"/></>,select:<path d="m5 3 14 10-7 1-3 7z"/>,underline:<><path d="M6 4v7a6 6 0 0 0 12 0V4M4 21h16"/></>,strike:<><path d="M17 5c-2-2-9-2-10 2-1 3 3 4 5 5 3 1 6 2 5 5-1 4-8 4-11 1M3 12h18"/></>,pen:<><path d="m4 16 12-12 4 4L8 20H4zM3 22h18"/></>,sticky:<><path d="M4 4h16v10l-6 6H4zM14 20v-6h6"/></>,eraser:<><path d="m4 13 10-10 7 7-10 10H7zM10 7l7 7M11 20h10"/></>,note:<><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>,ai:<><path d="M4 4h16v12H9l-5 4z"/><path d="M8 9h8M8 12h5"/></>};
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
function PdfPage791({source,number,scale,rotation,dimensions,active,query,onSelection,renderInk,inkProps,onDimensions}) {
  const canvas=useRef(null),text=useRef(null);const [state,setState]=useState('idle'),[retry,setRetry]=useState(0);
  const rotated=rotation%180!==0,width=(rotated?dimensions.height:dimensions.width)*scale,height=(rotated?dimensions.width:dimensions.height)*scale;
  useEffect(()=>{
    if(!active){if(canvas.current){canvas.current.width=0;canvas.current.height=0;}return;}
    let cancelled=false,renderTask,textLayer;const controller=new AbortController();setState('loading');
    (async()=>{
      const page=await source.pdf.getPage(number);if(cancelled)return;
      const base=page.getViewport({scale:1});onDimensions(number,{width:base.width,height:base.height});
      const viewport=page.getViewport({scale,rotation:(base.rotation||0)+rotation});
      const ratio=Math.min(2,window.devicePixelRatio||1,Math.sqrt(16000000/(viewport.width*viewport.height)));
      const el=canvas.current;el.width=Math.max(1,Math.round(viewport.width*ratio));el.height=Math.max(1,Math.round(viewport.height*ratio));
      await source.renderQueue.run(async()=>{if(cancelled)return;renderTask=page.render({canvasContext:el.getContext('2d',{alpha:false}),viewport,transform:ratio===1?null:[ratio,0,0,ratio,0,0]});await renderTask.promise;},{signal:controller.signal,priority:100});
      if(cancelled)return;setState('ready');
      const content=await page.getTextContent();if(cancelled)return;text.current.replaceChildren();
      textLayer=new source.engine.TextLayer({container:text.current,textContentSource:content,viewport});await textLayer.render();
      if(cancelled)return;
      if(query.trim())text.current.querySelectorAll('span').forEach(span=>{if(span.textContent.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))span.dataset.match='true';});
    })().catch(e=>{if(!cancelled&&e.name!=='RenderingCancelledException'&&e.name!=='AbortException')setState('error');});
    return ()=>{cancelled=true;controller.abort();renderTask?.cancel();textLayer?.cancel();};
  },[source,number,scale,rotation,active,retry,query,onDimensions]);
  function selectText(){
    const selected=window.getSelection();if(!selected?.rangeCount||!selected.toString().trim()||!text.current.contains(selected.anchorNode)||!text.current.contains(selected.focusNode))return;
    const range=selected.getRangeAt(0),box=text.current.getBoundingClientRect();
    const rects=[...range.getClientRects()].filter(r=>r.width>0&&r.height>0).map(r=>({x:Math.max(0,(r.left-box.left)/box.width),y:Math.max(0,(r.top-box.top)/box.height),w:Math.min(1,r.width/box.width),h:Math.min(1,r.height/box.height)}));
    onSelection({page:number,text:selected.toString().trim().slice(0,5000),rects});
  }
  return <article className="pdf791-page" data-pdf-page={number} aria-label={`PDF-side ${number}`} style={{width,height,'--scale-factor':scale}}>
    <canvas ref={canvas} aria-label={`PDF-side ${number}`} style={{width,height}}/>
    {active&&<div ref={text} className="pdf791-text textLayer" onMouseUp={selectText} onTouchEnd={selectText}/>}
    {active&&renderInk?.({pageNumber:number,...inkProps,annotations:pdfAnnotations791(inkProps.annotations||[],source.version).visible,showAnnotations:true})}
    {(!active||state==='loading')&&<div className="pdf791-page-loading" aria-hidden="true"><span/>Side {number}</div>}
    {state==='error'&&active&&<div className="pdf791-page-error" role="alert"><strong>Siden kunne ikke vises</strong><button type="button" onClick={()=>setRetry(n=>n+1)}>Prøv siden igen</button></div>}
    <small className="pdf791-page-number" aria-hidden="true">{number}</small>
  </article>;
}
function PdfThumbnail791({source,page,onClick,current}) {
  const canvas=useRef(null);useEffect(()=>{let gone=false,task;const controller=new AbortController();source.renderQueue.run(async()=>{const item=await source.pdf.getPage(page);if(gone)return;const original=item.getViewport({scale:1}),vp=item.getViewport({scale:140/original.width});const el=canvas.current;el.width=vp.width;el.height=vp.height;task=item.render({canvasContext:el.getContext('2d'),viewport:vp});await task.promise;},{signal:controller.signal}).catch(()=>{});return ()=>{gone=true;controller.abort();task?.cancel();};},[source,page]);
  return <button type="button" className="pdf791-thumbnail" aria-label={`Åbn PDF-side ${page}`} aria-current={current?'page':undefined} onClick={onClick}><canvas ref={canvas} aria-hidden="true"/><span>Side {page}</span></button>;
}
export function PdfReader791({url,bytes,materialId,fileName='PDF',userId,moduleName,lectureId,savedState={},pageRequest,onStateChange,onDocumentPosition,onRetryAccess,loadPdfJs=loadPdfEngine791,annotations=[],annotationStatus,onRetryAnnotations,onCreateAnnotation,onUpdateAnnotation,onDeleteAnnotation,renderInk,onAskAI,onOpenNotes,notesOpen=false,language='da',emptyMessage,onChooseFile,chooseFileLabel}) {
  const [source,setSource]=useState(null),[error,setError]=useState(null),[retry,setRetry]=useState(0),[password,setPassword]=useState(null),[passwordValue,setPasswordValue]=useState('');
  const [page,setPage]=useState(Math.max(1,Number(savedState.page)||1)),[pageInput,setPageInput]=useState(String(savedState.page||1));
  const [zoom,setZoom]=useState({mode:savedState.zoomMode==='fit-width'?'width':savedState.zoomMode==='manual'?'manual':'page',scale:Number(savedState.scale)||1}),[rotation,setRotation]=useState(0);
  const [panel,setPanel]=useState(null),[query,setQuery]=useState(''),[tool,setTool]=useState('select'),[selection,setSelection]=useState(null),[editOpen,setEditOpen]=useState(false);
  const [index,setIndex]=useState({pages:[],processed:0}),[dimensions,setDimensions]=useState({}),[area,setArea]=useState({width:1000,height:620});
  const [showText,setShowText]=useState(false),[notice,setNotice]=useState('');
  const [navigationRevision,setNavigationRevision]=useState(0),[positionRevision,setPositionRevision]=useState(0),[visibleRange,setVisibleRange]=useState({first:1,last:2});
  const pageOffset=useRef(Number(savedState.pageOffset)||0),pendingOffset=useRef(Number(savedState.pageOffset)||0);
  const currentPage=useRef(page);currentPage.current=page;
  const currentArea=useRef(area);currentArea.current=area;
  const viewport=useRef(null),reader=useRef(null),anchor=useRef(null),manual=useRef(false),pendingPage=useRef(null),opener=useRef(null),callback=useRef({});
  callback.current={onStateChange,onDocumentPosition,onAskAI,onOpenNotes};
  const onDimensions=React.useCallback((n,value)=>setDimensions(current=>current[n]?.width===value.width&&current[n]?.height===value.height?current:{...current,[n]:value}),[]);
  useEffect(()=>{
    const controller=new AbortController();let opened,timeout;manual.current=false;pendingPage.current=savedState.page||1;
    setSource(null);setError(null);setPassword(null);setIndex({pages:[],processed:0});setDimensions({});setSelection(null);setEditOpen(false);setTool('select');setPage(Math.max(1,Number(savedState.page)||1));setPageInput(String(savedState.page||1));
    pageOffset.current=Number(savedState.pageOffset)||0;pendingOffset.current=pageOffset.current;
    setZoom({mode:savedState.zoomMode==='fit-width'?'width':savedState.zoomMode==='manual'?'manual':'page',scale:Number(savedState.scale)||1});setRotation(0);
    timeout=setTimeout(()=>{controller.abort();setError({message:'PDF-indlæsningen tog for lang tid. Prøv igen.'});},45000);
    (async()=>{
      opened=await openPdfDocument791({url,bytes,loadPdfJs,signal:controller.signal,onPassword:(update,reason)=>{clearTimeout(timeout);setPassword({update,incorrect:reason===2});setPasswordValue('');}});
      clearTimeout(timeout);if(controller.signal.aborted)return;
      const first=await opened.pdf.getPage(1),base=first.getViewport({scale:1});if(controller.signal.aborted)return;
      setDimensions({1:{width:base.width,height:base.height}});setPage(p=>pdfPage791(p,opened.pdf.numPages));setSource(opened);
      const metadata={userId,documentId:lectureId?`lecture-${materialId}`:materialId,title:fileName,version:opened.version,signal:controller.signal,onProgress:value=>{if(!controller.signal.aborted)setIndex(value);}};
      const result=await extractPdfIndex791(opened.pdf,metadata);if(controller.signal.aborted)return;setIndex({...result,processed:opened.pdf.numPages});
      publishPdfDocument791({...metadata,...result,bytes:opened.bytes,materialId,moduleName,lectureId,signal:undefined,onProgress:undefined});
    })().catch(e=>{clearTimeout(timeout);if(!controller.signal.aborted)setError(e);});
    return ()=>{clearTimeout(timeout);controller.abort();opened?.destroy().catch(()=>{});};
    // Saved state is restored separately; a parent position update must not reopen the file.
  },[url,bytes,materialId,userId,moduleName,lectureId,fileName,loadPdfJs,retry]); // eslint-disable-line react-hooks/exhaustive-deps
  function rememberAnchor(){const number=currentPage.current,node=viewport.current?.querySelector(`[data-pdf-page="${number}"]`);if(node)anchor.current={page:number,offset:(viewport.current.scrollTop-node.offsetTop)/Math.max(1,node.offsetHeight)};}
  useEffect(()=>{
    const el=viewport.current;if(!el)return;
    const resize=()=>{const width=el.clientWidth||1000,height=el.clientHeight||620;setArea(current=>{if(width===current.width&&height===current.height)return current;if(!anchor.current)anchor.current={page:currentPage.current,offset:pageOffset.current};return {width,height};});};resize();
    if(typeof ResizeObserver==='undefined')return;const ro=new ResizeObserver(resize);ro.observe(el);return ()=>ro.disconnect();
  },[source,panel]); // eslint-disable-line react-hooks/exhaustive-deps
  const base=dimensions[page]||dimensions[1]||{width:842,height:595};
  const rotated=rotation%180!==0?{width:base.height,height:base.width}:base;
  const scale=pdfScale791(zoom.mode,zoom.scale,rotated,area);
  const matches=useMemo(()=>pdfSearch791(index.pages,query),[index.pages,query]);
  const currentText=index.pages.find(p=>p.page===page)?.text||'';
  function jump(value){const next=pdfPage791(value,source?.pdf.numPages);manual.current=true;pendingPage.current=next;pendingOffset.current=0;anchor.current=null;setPage(next);setPageInput(String(next));setSelection(null);setNavigationRevision(n=>n+1);}
  useLayoutEffect(()=>{
    if(!source||!viewport.current)return;
    const requested=pendingPage.current;const saved=anchor.current;const target=pdfPage791(requested||saved?.page||page,source.pdf.numPages);
    const el=viewport.current.querySelector(`[data-pdf-page="${target}"]`);
    if(el&&(requested||saved)){pageOffset.current=requested?pendingOffset.current:saved.offset;viewport.current.scrollTop=el.offsetTop+pageOffset.current*el.offsetHeight;pendingPage.current=null;anchor.current=null;}
    updateVisibleRange();
  },[source,page,scale,area,rotation,panel,dimensions,navigationRevision]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(()=>{setPageInput(String(page));callback.current.onDocumentPosition?.({materialId,page,numPages:source?.pdf.numPages||0});
    if(!source)return;const timer=setTimeout(()=>callback.current.onStateChange?.({page,pageOffset:pageOffset.current,zoomMode:zoom.mode==='width'?'fit-width':zoom.mode==='page'?'fit-page':'manual',scale:zoom.scale}),400);return ()=>clearTimeout(timer);
  },[page,source,materialId,zoom,positionRevision]);
  useEffect(()=>{
    if(!source||!pageRequest?.page||(pageRequest.materialId&&pageRequest.materialId!==materialId))return;
    if(pageRequest.version&&pageRequest.version!==source.version){setNotice('PDF-filen er ændret. Kildehenvisningen gælder en tidligere version.');return;}
    jump(pageRequest.page);
    if(pageRequest.quote){setQuery(pageRequest.quote);setShowText(true);setNotice('Kildesiden er åbnet. Kontrollér uddraget i originalteksten.');}
  },[source,materialId,pageRequest?.page,pageRequest?.requestId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(()=>{if(source&&!manual.current&&savedState.page){jump(savedState.page);pendingOffset.current=Math.max(0,Math.min(1,Number(savedState.pageOffset)||0));}},[savedState.remoteRevision]); // eslint-disable-line react-hooks/exhaustive-deps
  function updateVisibleRange(){const el=viewport.current;if(!el)return;const nodes=[...el.querySelectorAll('[data-pdf-page]')],shown=nodes.filter(n=>n.offsetTop+n.offsetHeight>=el.scrollTop&&n.offsetTop<=el.scrollTop+el.clientHeight);const range=shown.length?{first:Number(shown[0].dataset.pdfPage),last:Number(shown[shown.length-1].dataset.pdfPage)}:{first:page,last:page};setVisibleRange(old=>old.first===range.first&&old.last===range.last?old:range);}
  function scroll(){if(!source||pendingPage.current)return;const el=viewport.current;if((el.clientWidth&&el.clientWidth!==currentArea.current.width)||(el.clientHeight&&el.clientHeight!==currentArea.current.height))return;const point=el.scrollTop+Math.min(el.clientHeight*.35,180);let visible=1;el.querySelectorAll('[data-pdf-page]').forEach(node=>{if(node.offsetTop<=point)visible=Number(node.dataset.pdfPage);});if(el.scrollHeight>el.clientHeight&&el.scrollTop>=el.scrollHeight-el.clientHeight-2)visible=source.pdf.numPages;const node=el.querySelector(`[data-pdf-page="${visible}"]`);pageOffset.current=Math.max(0,Math.min(1,(el.scrollTop-(node?.offsetTop||0))/Math.max(1,node?.offsetHeight||1)));setPositionRevision(n=>n+1);updateVisibleRange();if(visible!==page){manual.current=true;setPage(visible);setSelection(null);}}
  function togglePanel(value,event){rememberAnchor();opener.current=event?.currentTarget;setPanel(current=>current===value?null:value);}
  function changeZoom(value){rememberAnchor();setZoom(current=>value==='width'||value==='page'?{...current,mode:value}:{mode:'manual',scale:Number(value)});}
  function askAI(value){if(!index.status||!index.readablePages){setNotice('Vent på tekstudtrækket. Scannede sider kræver tekstgenkendelse.');return;}callback.current.onAskAI?.({materialId,lectureId,title:fileName,version:source?.version,page:value?.page||page,text:value?.text||currentText,requestId:Date.now()});setSelection(null);}
  function markSelected(){if(!selection?.rects?.length||!onCreateAnnotation)return;onCreateAnnotation({id:crypto.randomUUID(),page:selection.page,type:tool==='underline'||tool==='strike'?tool:'highlight',color:'#efce70',payload:{rects:selection.rects,text:selection.text,normalized:true,version:source.version}});setSelection(null);window.getSelection()?.removeAllRanges();}
  function chooseSelection(value){if(rotation!==0){setNotice('Rotér siden tilbage, før du tilføjer markeringer.');return;}if(tool==='highlight'||tool==='underline'||tool==='strike'){if(value.rects.length)onCreateAnnotation?.({id:crypto.randomUUID(),page:value.page,type:tool,color:'#efce70',payload:{rects:value.rects,text:value.text,normalized:true,version:source.version}});window.getSelection()?.removeAllRanges();}else setSelection(value);}
  function rotatePage(){rememberAnchor();const next=(rotation+90)%360;setRotation(next);setSelection(null);setTool('select');setEditOpen(false);setNotice(next&&annotations.length?'Markeringer vises igen, når siden er tilbage i sin oprindelige retning.':'');}
  const editTools=[['select','Vælg tekst','select'],['highlight','Markér tekst','mark'],['underline','Understreg','underline'],['strike','Overstreg','strike'],...(renderInk?[['pen','Tegn med pen','pen'],['sticky','Sæt en note','sticky'],...(onDeleteAnnotation?[['eraser','Fjern en markering','eraser']]:[])]:[])];
  const compatibleAnnotations=useMemo(()=>pdfAnnotations791(annotations,source?.version),[annotations,source?.version]);
  const inkProps={activeTool:tool,activeColor:'#efce70',onCreate:value=>onCreateAnnotation?.({...value,payload:{...value.payload,version:source?.version}}),onUpdate:onUpdateAnnotation,onDelete:onDeleteAnnotation};
  return <section ref={reader} className="pdf791-reader" aria-label={language==='en'?'PDF reader':'PDF-læser'} onPointerDownCapture={event=>{if(editOpen&&!event.target.closest('.pdf792-edit-control'))setEditOpen(false);}} onKeyDown={event=>{if(event.key==='Escape'){setSelection(null);setPanel(null);setEditOpen(false);opener.current?.focus();}if(!event.target.matches('input,textarea,select,[contenteditable="true"]')&&(event.ctrlKey||event.metaKey)&&event.key==='f'){event.preventDefault();setPanel('search');}}}>
    <div className="pdf791-toolbar" role="toolbar" aria-label="PDF-værktøjer">
      <div className="pdf791-toolbar-start"><button type="button" disabled={Boolean(emptyMessage&&!url&&!bytes)} aria-label="Vis PDF-sider" title="Sider" aria-pressed={panel==='pages'} onClick={event=>togglePanel('pages',event)}><ReaderIcon791 name="pages"/><span>Sider</span></button><button type="button" disabled={Boolean(emptyMessage&&!url&&!bytes)} aria-label="Søg i PDF" title="Søg i PDF" aria-pressed={panel==='search'} onClick={event=>togglePanel('search',event)}><ReaderIcon791 name="search"/><span>Søg</span></button></div>
      <div className="pdf791-navigation"><button type="button" aria-label="Forrige PDF-side" disabled={!source||page<=1} onClick={()=>jump(page-1)}><ReaderIcon791 name="left"/></button><label><input aria-label="PDF-side" inputMode="numeric" value={pageInput} disabled={!source} onChange={event=>setPageInput(event.target.value)} onBlur={()=>source&&jump(pageInput)} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();jump(pageInput);}}}/><span>/ {source?.pdf.numPages||'—'}</span></label><button type="button" aria-label="Næste PDF-side" disabled={!source||page>=source.pdf.numPages} onClick={()=>jump(page+1)}><ReaderIcon791 name="right"/></button><span className="pdf791-toolbar-divider"/><select aria-label="PDF-zoom" value={zoom.mode==='manual'?String(zoom.scale):zoom.mode} onChange={event=>changeZoom(event.target.value)}><option value="page">Hele siden</option><option value="width">Tilpas bredden</option>{[.5,.75,1,1.25,1.5,2,3].map(z=><option key={z} value={z}>{z*100}%</option>)}</select></div>
      <div className="pdf791-toolbar-end">{onCreateAnnotation&&<div className="pdf792-edit-control"><button type="button" disabled={!source||rotation!==0} title="Redigér PDF" aria-label="Redigér PDF" aria-expanded={editOpen} aria-controls="pdf792-edit-tools" aria-pressed={tool!=='select'} onClick={event=>{opener.current=event.currentTarget;setEditOpen(value=>!value);}}><ReaderIcon791 name="edit"/></button>{editOpen&&<div id="pdf792-edit-tools" className="pdf792-edit-tools" role="toolbar" aria-label="PDF-redigering">{editTools.map(([value,label,icon])=><button key={value} type="button" aria-label={label} aria-pressed={tool===value} onClick={()=>{setTool(value);setSelection(null);setEditOpen(false);opener.current?.focus();}}><ReaderIcon791 name={icon}/><span>{label}</span></button>)}</div>}</div>}<button type="button" disabled={!source} title="Rotér siden" aria-label="Rotér PDF-side" onClick={rotatePage}><ReaderIcon791 name="rotate"/></button>{onOpenNotes&&<button type="button" aria-pressed={notesOpen} onClick={()=>{setShowText(false);onOpenNotes();}}><ReaderIcon791 name="note"/><span>Noter</span></button>}{onAskAI&&<button type="button" className="pdf791-ask" disabled={!source||!index.status||!index.readablePages} onClick={()=>askAI()}><ReaderIcon791 name="ai"/><span>Spørg Dr. Byte</span></button>}</div>
    </div>
    <div className="pdf791-context"><span className="pdf791-file">{fileName}</span><span role="status" className="pdf791-ai-status" data-state={index.status||'loading'}>{source?(index.status==='ready'?'Tekst klar til AI':index.status==='partial'?`${index.readablePages}/${source.pdf.numPages} sider med tekst`:index.status==='no-text'?'Ingen læsbar tekst · kræver tekstgenkendelse':`Læser tekst · ${index.processed||0}/${source.pdf.numPages}`):emptyMessage&&!url&&!bytes?'':'Åbner PDF…'}</span>{tool!=='select'&&<button type="button" className="pdf791-tool-status" onClick={()=>setTool('select')}>{({highlight:'Markér tekst',pen:'Pen',sticky:'Note',eraser:'Fjern',underline:'Understreg',strike:'Overstreg'})[tool]} · afslut ×</button>}</div>
    <div className="pdf791-body">
      {panel&&<aside className="pdf791-sidebar" aria-label={panel==='search'?'Søgning i PDF':'PDF-sider'}><header><strong>{panel==='search'?'Find i dokumentet':'Sider'}</strong><button type="button" aria-label="Luk PDF-panel" onClick={()=>{rememberAnchor();setPanel(null);opener.current?.focus();}}>×</button></header>{panel==='search'?<><input autoFocus type="search" placeholder="Søg i PDF…" aria-label="Søg i dokumentet" value={query} onChange={e=>setQuery(e.target.value)}/><p className="pdf791-result-count" role="status">{query.trim()?`${matches.length} sider med træffere${!index.status?' · læser stadig':''}`:'Søg efter et ord eller en sætning'}</p>{matches.map(match=><button type="button" key={match.page} className="pdf791-search-result" aria-current={page===match.page?'page':undefined} onClick={()=>jump(match.page)}><strong>Side {match.page}</strong><span>{match.text.slice(Math.max(0,match.text.toLowerCase().indexOf(query.toLowerCase())-40),Math.max(0,match.text.toLowerCase().indexOf(query.toLowerCase())-40)+160)}</span></button>)}</>:source&&<div className="pdf791-thumbnails">{Array.from({length:source.pdf.numPages},(_,i)=>i+1).map(n=>Math.abs(n-page)<=5?<PdfThumbnail791 key={n} source={source} page={n} current={n===page} onClick={()=>jump(n)}/>:<button type="button" key={n} className="pdf791-thumbnail-placeholder" onClick={()=>jump(n)}>Side {n}</button>)}</div>}</aside>}
      <div ref={viewport} className="pdf791-viewport" tabIndex={0} aria-label="PDF-dokument" onScroll={scroll}>
        {emptyMessage&&!url&&!bytes?<div className="pdf792-empty"><ReaderIcon791 name="pages"/><h3>{emptyMessage}</h3>{onChooseFile&&<button type="button" onClick={onChooseFile}>{chooseFileLabel||(language==='en'?'Add PDF':'Tilføj PDF')}</button>}</div>:error?<div className="pdf791-error" role="alert"><span>PDF</span><h3>Dokumentet kunne ikke åbnes</h3><p>{error.name==='PasswordException'?'PDF’en kræver en adgangskode.':error.status===401||error.status===403?'Adgangen til filen er udløbet. Hent den igen.':error.message||'Kontrollér filen og prøv igen.'}</p><button type="button" onClick={()=>{if(error.status===401||error.status===403)onRetryAccess?.();setRetry(n=>n+1);}}>Prøv igen</button></div>:password?<form className="pdf791-error" onSubmit={event=>{event.preventDefault();password.update(passwordValue);setPasswordValue('');setPassword(null);}}><h3>Lås PDF’en op</h3><p>{password.incorrect?'Adgangskoden var forkert. Prøv igen.':'Filen kræver en adgangskode. Den gemmes ikke.'}</p><input autoFocus type="password" aria-label="PDF-adgangskode" value={passwordValue} onChange={event=>setPasswordValue(event.target.value)}/><button type="submit">Åbn PDF</button></form>:source?<div className="pdf791-pages">{Array.from({length:source.pdf.numPages},(_,i)=>i+1).map(n=><PdfPage791 key={n} source={source} number={n} dimensions={dimensions[n]||dimensions[1]||base} scale={scale} rotation={rotation} active={n>=Math.min(page,visibleRange.first)-1&&n<=Math.max(page,visibleRange.last)+1} query={query} onSelection={chooseSelection} onDimensions={onDimensions} renderInk={rotation===0?renderInk:null} inkProps={{...inkProps,annotations:compatibleAnnotations.visible.filter(a=>Number(a.page)===n)}}/> )}</div>:<div className="pdf791-loading"><span className="pdf791-loading-ring"/><strong>Åbner dit dokument</strong><p>Gør siderne klar til læsning</p></div>}
      </div>
      {showText&&<aside className="pdf791-readable-text"><header><strong>Tekst · side {page}</strong><button type="button" onClick={()=>setShowText(false)} aria-label="Luk sidetekst">×</button></header><p>{currentText||'Denne side har ingen læsbar tekst. Billeder og figurer indgår ikke i tekstudtrækket.'}</p></aside>}
    </div>
    {selection&&<div className="pdf791-selection pdf792-selection" role="group" aria-label="Valgt PDF-tekst" title={selection.text.slice(0,120)}>{onCreateAnnotation&&<button type="button" aria-label="Markér tekst" onClick={markSelected}><ReaderIcon791 name="mark"/>Markér</button>}{onOpenNotes&&<button type="button" aria-label="Opret note" onClick={()=>{onOpenNotes(selection);setSelection(null);}}>Note</button>}{onAskAI&&<button type="button" onClick={()=>askAI(selection)}>Spørg Dr. Byte</button>}<button type="button" aria-label="Luk tekstvalg" onClick={()=>setSelection(null)}>×</button></div>}
    {annotationStatus&&annotationStatus!=='ready'&&<div className="pdf791-journal" role="status">{annotationStatus==='saving'?'Gemmer markeringer…':'Markeringerne er bevaret lokalt; synkronisering afventer.'}{onRetryAnnotations&&<button type="button" onClick={onRetryAnnotations}>Synkronisér igen</button>}</div>}
    {source&&compatibleAnnotations.held.length>0&&<div className="pdf791-journal" role="status">{compatibleAnnotations.held.length} tidligere markeringer er bevaret, men vises ikke på denne dokumentversion.</div>}
    {notice&&<div className="pdf791-notice" role="status" onClick={()=>setNotice('')}>{notice}</div>}
  </section>;
}
