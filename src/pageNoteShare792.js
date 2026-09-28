// The share boundary accepts one explicit current-page snapshot, never the
// private lecture draft or other page annotations.
export function pageNoteShare792(note,materialId,language='da'){
 if(!note||note.materialId!==materialId||typeof note.text!=='string'||!note.text.trim()||!Number.isInteger(Number(note.page))||Number(note.page)<1)return null;
 return {freeText:`${note.fileName||'PDF'} · ${language==='en'?'Page':'Side'} ${Number(note.page)}\n\n${note.text}`,keyPoints:'',clinicalPoints:'',openQuestions:'',viewMode:'free',updatedAt:new Date().toISOString()};
}
