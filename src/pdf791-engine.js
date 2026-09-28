const workerUrl791=new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs',import.meta.url).toString();
let enginePromise791;
export function loadPdfEngine791() {
  if(!enginePromise791)enginePromise791=(async()=>{
    const engine=await import('pdfjs-dist/legacy/build/pdf.mjs');
    engine.GlobalWorkerOptions.workerSrc=workerUrl791;
    return engine;
  })().catch(error=>{enginePromise791=null;throw error;});
  return enginePromise791;
}
