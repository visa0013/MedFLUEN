import {pageNoteShare792} from './pageNoteShare792';
test('only the current page text is published, without legacy private sections',()=>{
 const result=pageNoteShare792({materialId:'m1',page:2,fileName:'N1.pdf',text:'Current page',html:'<strong>Current page</strong>',keyPoints:'private'},'m1');
 expect(result).toMatchObject({freeText:'N1.pdf · Side 2\n\nCurrent page',keyPoints:'',clinicalPoints:'',openQuestions:'',viewMode:'free'});
 expect(result.freeText).not.toContain('<strong>');
});
test('a stale material or empty page cannot accidentally publish a different note',()=>{
 expect(pageNoteShare792({materialId:'old',page:2,text:'old'},'new')).toBeNull();
 expect(pageNoteShare792({materialId:'m1',page:1,text:'  '},'m1')).toBeNull();
});
