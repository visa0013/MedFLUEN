export async function toggleNativeFullscreen791(doc,element){
  try{
    if(doc.fullscreenElement){await doc.exitFullscreen();return {ok:true};}
    if(!doc.fullscreenEnabled||typeof element?.requestFullscreen!=='function')return {ok:false,reason:'unsupported'};
    await element.requestFullscreen();return {ok:true};
  }catch{return {ok:false,reason:'rejected'};}
}
