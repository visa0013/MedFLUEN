# SDD ledger — plan: docs/superpowers/plans/2026-09-30-lecture-flashcards.md

Ruling: User explicitly requests proceeding without text approval gates; implement natively in this session — preserves their requested speed and iterative feedback — cost if wrong: user may request UI revisions.

Ruling: Use feature branch in the existing checkout, not another worktree — keep the active preview and dependencies intact under the user's request to avoid extra setup — cost if wrong: changes share their checkout but not main history.

Ruling: Focused feature/adjacent tests and one production build rather than full repeated suites — follows explicit user testing preference — cost if wrong: unrelated regressions may remain untested.

Pre-flight: Model record properties are preserved by App's normalizer; storage consumes the same record identity; renderer receives the same glossary/assets/source payload in reviewer and preview. Section selectors consume model keys; session scope supplies exact IDs with order preserved. No conflicting interfaces found.

Task 1: complete — 8 model tests pass; contract/schema/parser committed at 2842cef.
Task 2/3: atomic scoped storage and structured renderer implemented; 14 feature/adjacent tests pass. Existing PDF worker boundary mocked in DOM tests because Jest cannot execute import.meta; real card rendering remains tested.
Ruling: Generic legacy editor is hidden for structured cards; content revisions use explicit package update — avoid discarding answer IDs and glossary metadata — cost if wrong: manual per-field editing is not available for these packages in v1.

Task 4/5: upload/preview, downloadable schema/prompt/template, section selection and frozen ordered sessions implemented. 17 feature tests passed; adjacent MCQ browser had two stale h3 selectors already incompatible with the committed baseline renderer. Updated selectors to its existing mf799-question container without changing legacy product behavior.

Task 6: independent final review completed (02fb7c7 against 2a73ed9). Three important findings addressed: immutable SHA-256 media revisions prevent add-only imports changing existing images; image-only revisions now count as updates; original central and local ZIP headers are validated before JSZip can discard path collisions. ZIP structure reference: PKWARE APPNOTE 6.3.10, sections 4.3.7/4.3.12/4.3.16 (https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT). Regression tests were observed failing before these repairs and passing afterwards.

Verification: final focused feature and adjacent run passed 37 tests in 7 suites, including structured images (answer figures remain hidden before reveal, appear in the existing image holder, enlarge/close, release object URLs). Production build succeeded with lint/bundle warnings. No full historical suite run, per user's speed preference.

Live preview verified: one explicitly labelled import-practice recall card saved under K5/N2, shown in the lecture's section selector, revealed and marked forgotten, persisted through reload, and opened in a frozen one-item forgotten drill. Local term definition opened and dismissed. No medical lecture content or large ANKI package uploaded. Screenshot: work/lecture800-review.jpg (outside repository).

Ruling: Preserve the feature branch locally without another integration-choice gate — user explicitly asked to implement and correct visually rather than approve text; no current authorization to push or create a PR — cost if wrong: GitHub does not receive these new changes until requested.

Delivery boundaries: original JSON/ZIP is the portable backup; cards and media are account-scoped on this browser, not cloud-synced. Generation is external using the supplied prompt, with no app AI call. Source page references are truthful labels, not pretend links to PDFs that are not linked in the catalogue. Structured edits use explicit package update rather than the legacy editor. Full offline sign-in/app-shell installation is not included.
