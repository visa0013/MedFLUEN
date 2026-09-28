import fs from 'fs';
import path from 'path';
import {contentKind79} from './curriculum79-model';

// Execute the actual legacy planner without mounting the entire signed-in app.
const source = fs.readFileSync(path.join(__dirname, 'App.js'), 'utf8');
const names = ['studyPlanDate', 'studyPlanDateKey', 'dateKey', 'addDays', 'startOfWeek',
  'studyPlanNormalizeLoadLevel', 'studyPlanLectureMinutes', 'studyPlanPhaseTone',
  'studyPlanActivityKind', 'studyPlanCanFitMinutes', 'studyPlanContentCounts', 'studyPlanPreserveExamEvent', 'buildStudyPlanStrategy'];
const declarations = names.map(name => source.match(new RegExp(`^function ${name}\\([^]*?^}`, 'm'))[0]);
declarations.push(source.match(/^const STUDY_PLAN_ACTIVITY_KINDS = Object.freeze\([^]*?^\}\);/m)[0]);
const build = new Function('contentKind79', declarations.join('\n') + '\nreturn buildStudyPlanStrategy;')(contentKind79);

const base = {
  planningMode: 'capacity-period', examDate: '2026-10-10', lectureDeadline: '2026-09-30',
  examSetStartDate: '2026-10-01', examSetEndDate: '2026-10-03', bufferDays: 2,
  weekdayHours: {0:0, 1:6, 2:0, 3:0, 4:1, 5:2, 6:0},
  maxLecturesPerDay: 3, examSetCount: 30, examSetMinutes: 120,
};
const run = (plan, lectures = [], reservedEvents = []) => build({moduleName:'K5', plan, lectures, reservedEvents, fromDate:new Date(2026,8,28)});

test('new plans fit six one-hour lectures into six available hours without the old count cap', () => {
  const result = run(base, Array.from({length:6}, (_,i)=>({id:`N${i+1}`, title:`Lecture ${i+1}`})));
  expect(result.assignments.filter(a=>a.phase==='lecture')).toHaveLength(6);
  expect(result.unassigned).toHaveLength(0);
  expect(result.assignments.filter(a=>a.phase==='lecture').map(a=>a.date)).toEqual(Array(6).fill('2026-09-28'));
});

test('the plan counts actual lectures, classes and TBL separately from exam-focus days', () => {
  const result = run(base, [{id:'N1',title:'Lecture'}, {id:'H1',title:'Class',kind:'class'}, {id:'T1',title:'TBL',kind:'tbl'}]);
  expect(result.contentCounts).toEqual({lecture:1, class:1, tbl:1, examFocus:2});
});

test('exam focus uses only the selected period and daily hours, not a set quota or a 120-minute minimum', () => {
  const plan = {...base, excludedDates:['2026-10-02']};
  const before = JSON.stringify(plan);
  const result = run(plan);
  expect(result.assignments.filter(a=>a.phase==='exam').map(a=>({date:a.date, minutes:a.loadMinutes, set:a.examSetIndex})))
    .toEqual([{date:'2026-10-01', minutes:60, set:undefined}]);
  expect(result.examRequired).toBe(60);
  expect(JSON.stringify(plan)).toBe(before);
});

test('existing review and simulation reservations reduce exam-focus time', () => {
  const result = run(base, [], [{id:'review', date:'2026-10-02', planModuleId:'K5', activityKind:'exam-review-task', loadMinutes:45}]);
  expect(result.assignments.filter(a=>a.phase==='exam').map(a=>a.loadMinutes)).toEqual([60,75]);
});

test('manually timed exam practice also reserves capacity in the selected period', () => {
  const result = run(base, [], [{id:'studyplan-K5-examset-1', date:'2026-10-02', time:'10:00', planModuleId:'K5', activityKind:'exam-practice', loadMinutes:45}]);
  expect(result.assignments.filter(a=>a.phase==='exam').map(a=>a.loadMinutes)).toEqual([60,75]);
});

test('a completed focus day is not generated again when the plan is updated', () => {
  const result = run(base, [], [{id:'studyplan-K5-examfocus-2026-10-01', date:'2026-10-01', completedAt:123, planModuleId:'K5', activityKind:'exam-practice', loadMinutes:60}]);
  expect(result.assignments.filter(a=>a.phase==='exam').map(a=>a.date)).toEqual(['2026-10-02']);
});

test('new planning reports an invalid exam-focus period rather than creating out-of-period blocks', () => {
  expect(run({...base, examSetEndDate:'2026-09-30'}).valid).toBe(false);
  expect(run({...base, examSetEndDate:'2026-10-09'}).valid).toBe(false);
});

test('saved legacy plans keep their old count-based generation until explicitly updated', () => {
  const result = run({...base, planningMode:undefined, examSetCount:1}, Array.from({length:6},(_,i)=>({id:`N${i+1}`,title:'Lecture'})));
  expect(result.assignments.filter(a=>a.phase==='lecture')).toHaveLength(3);
  expect(result.assignments.filter(a=>a.phase==='exam')).toHaveLength(1);
  expect(result.examRequired).toBe(120);
});

test('capacity planning leaves an oversized lecture in the queue and never exceeds daily minutes', () => {
  const result = run({...base, weekdayHours:{1:1,4:1}}, [{id:'N1',title:'Long lecture',parts:3}]);
  expect(result.assignments.filter(a=>a.phase==='lecture')).toHaveLength(0);
  expect(result.unassigned.map(i=>i.lecture.id)).toEqual(['N1']);
});
