import {rememberLecture791} from './lecture-entry791';
test('explicit lecture entry supersedes resume while preserving PDF positions and other modules',()=>{
 const state={selectedLectureId:'N1',lectureViewerHistory:{K5:{lectureId:'N1',materialId:'m1'},K6:{lectureId:'N9'}},documentViewer:{m1:{page:3}},lectureMaterialSelection:{'K5:N1':'m1'}};
 const next=rememberLecture791(state,'K5','N2',100);
 expect(next.selectedLectureId).toBe('N2');expect(next.lectureViewerHistory.K5.lectureId).toBe('N2');
 expect(next.lectureViewerHistory.K6).toBe(state.lectureViewerHistory.K6);expect(next.documentViewer).toBe(state.documentViewer);expect(next.lectureMaterialSelection).toBe(state.lectureMaterialSelection);
 expect(state.lectureViewerHistory.K5.lectureId).toBe('N1');
});
