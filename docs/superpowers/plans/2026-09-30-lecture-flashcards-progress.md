# SDD ledger — plan: docs/superpowers/plans/2026-09-30-lecture-flashcards.md

Ruling: User explicitly requests proceeding without text approval gates; implement natively in this session — preserves their requested speed and iterative feedback — cost if wrong: user may request UI revisions.

Ruling: Use feature branch in the existing checkout, not another worktree — keep the active preview and dependencies intact under the user's request to avoid extra setup — cost if wrong: changes share their checkout but not main history.

Ruling: Focused feature/adjacent tests and one production build rather than full repeated suites — follows explicit user testing preference — cost if wrong: unrelated regressions may remain untested.

Pre-flight: Model record properties are preserved by App's normalizer; storage consumes the same record identity; renderer receives the same glossary/assets/source payload in reviewer and preview. Section selectors consume model keys; session scope supplies exact IDs with order preserved. No conflicting interfaces found.

Task 1: complete — 8 model tests pass; contract/schema/parser committed at 2842cef.
Task 2/3: atomic scoped storage and structured renderer implemented; 14 feature/adjacent tests pass. Existing PDF worker boundary mocked in DOM tests because Jest cannot execute import.meta; real card rendering remains tested.
Ruling: Generic legacy editor is hidden for structured cards; content revisions use explicit package update — avoid discarding answer IDs and glossary metadata — cost if wrong: manual per-field editing is not available for these packages in v1.

Task 4/5: upload/preview, downloadable schema/prompt/template, section selection and frozen ordered sessions implemented. 17 feature tests passed; adjacent MCQ browser had two stale h3 selectors already incompatible with the committed baseline renderer. Updated selectors to its existing mf799-question container without changing legacy product behavior.
