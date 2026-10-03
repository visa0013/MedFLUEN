# Lecture practice and repetition overview Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. The user has requested direct implementation without another approval gate.

**Goal:** Keep practising delayed cards within a section and give lecture roadmaps a today-start, scoped reset and factual repetition timeline.

**Architecture:** Keep short-term section queues separate from saved FSRS due dates. Pure helpers select today's ordered cards, aggregate scheduling/review data and reset only selected card IDs. Reuse one controls component and one timeline component in the lecture entry and transition views.

**Tech Stack:** Existing React, CSS, Jest and local/account scheduler storage; no additional dependencies.

**Spec:** Current user requests in this chat: immediate delayed-card fallback, first available card excluding tomorrow, confirmed progress reset, and a bottom schedule/review-frequency overview.

## Global Constraints

- Preserve unrelated dirty roadmap805 changes and other lectures' schedules.
- No forced waiting, automatic section exit, deletion of card content or invented chart data.
- Today uses local midnight; tomorrow and later are excluded from the dedicated today-start.
- Keep explicit whole-lecture practice and manual section selection available.
- No commit, push or deployment requested this turn. Verification is focused, as requested by the user.

## Review Focus

- A single delayed card must repeat immediately without completing its section.
- Today's session must still exclude tomorrow's cards after a reload.
- Cancelled reset and reset undo must preserve data and unrelated card changes.
- Empty, suspended and legacy schedules must have honest labels/counts.
- Graph and controls must work on narrow screens and with keyboard navigation.

### Task 1: Section retry selection

**Files:** `src/lectureJourney804.js`, its test, `src/LectureTransition804.js`, its test, `src/App.js`.

- [x] Write and observe failing tests for FIFO fallback, a single card, refresh and no premature transition.
- [x] Prefer due cards, otherwise the first pending card; remove the countdown gate without changing stored deadlines.
- [x] Run the two focused suites and verify they pass.

### Task 2: Today-start and safe reset

**Files:** Create `src/lectureRepetition806-model.js`, `src/lectureRepetition806-model.test.js`, `src/lectureProgress806.js`, `src/lectureProgress806.test.js`; modify the two roadmap screens and `src/App.js`.

**Interfaces:** `lectureTodayCards806(cards, schedules, {now, buried})` returns cards in section order; `resetLectureProgress806(schedules, cards)` returns scoped schedules; `restoreLectureProgress806(current, snapshot, cards)` restores only selected IDs. UI callbacks `onStartToday`, `onReset`, `onUndoReset` do not mutate content.

- [x] Test midnight boundaries, section order, hidden cards and scoped reset/undo.
- [x] Add confirmed Glem and today's count/start at the top, retain the whole-forløb action.
- [x] Persist a todayOnly plan; resume must not expand it to all cards.
- [x] Run helper and UI suites.

### Task 3: Factual repetition timeline

**Files:** `src/lectureRepetition806-model.js`, `src/lectureProgress806.js`, their tests and `src/lecture800.css`.

**Interfaces:** `lectureProgress806(cards, schedules, {now, buried})` exposes per-card due/review counts, past-day reviews and future-day next-due counts. No fabricated subsequent repetitions or mastery percentages.

- [x] Test FSRS/legacy review counts, reversal handling, never-reviewed cards and future dates.
- [x] Add an interactive daily timeline and a section-grouped card schedule at the bottom.
- [x] Run focused regression suites, build, and inspect the existing tiny preview fixture without resetting user data.

## Completion evidence

- 61 tests passed across 8 focused suites; production build exited 0 with existing project warnings. `git diff --check` passed.
- One independent code review found three scope issues, fixed with regression tests: use the complete lecture catalog for reset/timeline, preserve other lectures' resume records, and let an explicit section restart practise all its cards rather than inherit the today-only subset.
- Browser: today's start opened the first academic card; rating the disposable import test card Svær repeated it immediately, then undo restored its schedule. Glem confirmation was cancelled without resetting user data. Per-card counts and the actual-date graph were visible, with no page overflow at 540px.
- Local preview rebuilt and reloaded after review fixes. Screenshot: `../medfluen-repetition806.png` in the workspace outputs directory.
- No commit, push, deployment or real lecture reset performed.
