# Lecture Flashcards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver source-linked lecture packages, recall-list practice, offline definitions and a reusable generation prompt inside MedFLUEN.

**Architecture:** A versioned model validates JSON/ZIP before any write; an account-scoped IndexedDB store imports atomically. Small React components handle import, section selection and structured rendering; adapters connect them to the existing reviewer and personal-card hook.

**Tech Stack:** React 18, CRA, existing AJV and JSZip, native IndexedDB, existing FSRS reviewer.

**Spec:** ../specs/2026-09-30-lecture-flashcards-design.md

## Global Constraints

- `medfluen-lecture`, version `1`; PNG/JPEG/WebP only; no remote assets or executable HTML.
- 128 MiB upload, 256 MiB uncompressed, 12 MiB/image, 10,000 cards.
- Checked recall item means forgotten; marking is not an FSRS rating.
- Existing ANKI/exam/basic behavior stays intact; no large deck import.
- Physical PDF pages are 1-based; missing images/references fail the whole import.
- User explicitly requests implementation without further text-approval gates, self-directed in this session. Preserve existing preview checkout and use a feature branch; no GitHub push.
- User requests focused tests rather than full repeated suites. Run the feature tests, adjacent rendering tests and one production build.

## Review Focus

- User switch during async hydration/import: previous account must not surface or commit to the next account.
- Edited content under stable IDs: preserve schedules, reset changed recall-item flags.
- Malicious ZIP paths and oversized inflated entries: reject before extraction/persistence.
- Empty section selection or missed-item queue: never fall back to all module cards.
- Changing a checkbox during a frozen review session: don't skip or alter its next card.

### Task 1: Package contract and parser

**Files:** Create `src/lecture800-model.js`, `src/lecture800-schema.json`, `src/lecture800-model.test.js`.

**Interfaces:** `validateLecture800(input) -> package`; `parseLectureFile800(file) -> { package, media: Map<assetId,Blob> }`; `lectureRecords800(package,target) -> personalRecords`; `mergeLecture800(existing,incoming,mode) -> {records,added,updated}`; `lectureSections800(questions) -> sections`; `lectureStudyCards800(questions,selectedSections,missed?) -> orderedQuestions`.

- [ ] Write tests for source/asset integrity, unknown versions, structured card adaptation, duplicate merge, order and empty selection.
- [ ] Run tests and observe missing-function failures.
- [ ] Implement schema validation, bounded ZIP reading, media signature checks and safe adapters.
- [ ] Run tests; expect all focused model tests pass.
- [ ] Commit task files once green.

### Task 2: Atomic offline storage

**Files:** Create `src/lecture800-storage.js`; integrate hydration in `src/App.js`.

**Interfaces:** `readLectureCards800(scope) -> records`; `persistLecture800(scope,preview,target,mode) -> result`; `readLectureMedia800(scope,key) -> Blob|null`; `readForgotten800(scope) -> state`; `writeForgotten800(scope,card,itemIds) -> state`. Scope is existing personal-card storage key.

- [ ] Write tests for merge behavior preserving item flags except changed text, and scoped hydration adapter.
- [ ] Observe failure, implement separate account-indexed stores with atomic card/media/package writes.
- [ ] Add asynchronous account/revision guards and include structured metadata in card normalization.
- [ ] Run focused tests; record outcome and commit.

### Task 3: RemNote-inspired renderer

**Files:** Create `src/LectureCard800.js`, `src/lecture800.css`, `src/LectureCard800.test.js`; adapt `src/ReviewContent799.js`, `src/CardBrowser791.js`, reviewer in `src/App.js`.

**Interfaces:** `LectureCard800({question,revealed,scope,previewMedia,readOnly,forgottenOnly,onOpenSource})`; `GlossaryText800({text,glossary,sources})` renders safe annotated text.

- [ ] Write DOM tests for unrevealed list hiding, forgotten toggles, safe glossary focus/tap/Escape, image roles and read-only previews.
- [ ] Observe failures; implement accessible controls, scoped flag persistence, sources and image gallery using existing image dialog.
- [ ] Integrate structured renderer ahead of legacy card-type routing, without modifying legacy displays.
- [ ] Run feature and adjacent rendering tests; commit.

### Task 4: Upload and reusable prompt

**Files:** Create `src/LectureUpload800.js`, `src/lecture800-prompt.js`, `src/LectureUpload800.test.js`, `docs/forelaesningskort-prompt.md`; adapt import view in `src/App.js`.

**Interfaces:** `LectureUpload800({moduleId,lectures,selectedLectureId,scope,onImported,onBack})`; `buildLecturePrompt800(target) -> string`; `lectureTemplate800(target) -> package`.

- [ ] Write tests for real target selection, mismatch confirmation, preview without writes, validation and duplicate choices.
- [ ] Observe failures; implement JSON/ZIP preview and commit flow, live error handling and account-change cancellation.
- [ ] Add downloadable prompt with exact schema, template and working non-clinical practice example; expose ANKI switch without changing its importer.
- [ ] Run tests and commit.

### Task 5: Sections and study modes

**Files:** Create `src/LectureSections800.js`; modify `src/TrainingIndex791.js`, `src/App.js`.

**Interfaces:** section controls produce selected stable section keys and mode (`guide`,`review`,`forgotten`); session scope carries exact ordered IDs and frozen forgotten item IDs.

- [ ] Add tests for section filtering, preserved order, empty choice and frozen missed-item queue.
- [ ] Implement right-panel selection, first ordered walkthrough and normal FSRS repetition; load persisted forgotten state.
- [ ] Preserve exact pool order and use ordinary one-pass next-card navigation for walkthrough/forgotten mode, no automatic requeue.
- [ ] Run feature tests; commit.

### Task 6: Integrated handoff

**Files:** Feature files above and this plan's progress ledger.

- [ ] Review all feature diffs against spec; perform one independent whole-feature review.
- [ ] Address important findings with focused regression tests.
- [ ] Run focused tests and fixture-configured production build.
- [ ] Open existing preview, inspect upload/card views and capture a screenshot; no large import.
- [ ] Deliver actual prompt link and explain local-only storage limitations. No automatic push.
