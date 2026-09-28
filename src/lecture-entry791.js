export function rememberLecture791(state,moduleName,lectureId,now=Date.now()) {
  const key=moduleName||'module',history=state.lectureViewerHistory||{};
  const previous=history[key]?.lectureId===lectureId?history[key]:{};
  return {...state,selectedLectureId:lectureId,lectureViewerHistory:{...history,[key]:{...previous,lectureId,updatedAt:now}}};
}
