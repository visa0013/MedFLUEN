# SDD ledger — plan: docs/superpowers/plans/2026-09-30-lecture-flashcards.md

Ruling: User explicitly requests proceeding without text approval gates; implement natively in this session — preserves their requested speed and iterative feedback — cost if wrong: user may request UI revisions.

Ruling: Use feature branch in the existing checkout, not another worktree — keep the active preview and dependencies intact under the user's request to avoid extra setup — cost if wrong: changes share their checkout but not main history.

Ruling: Focused feature/adjacent tests and one production build rather than full repeated suites — follows explicit user testing preference — cost if wrong: unrelated regressions may remain untested.

Pre-flight: Model record properties are preserved by App's normalizer; storage consumes the same record identity; renderer receives the same glossary/assets/source payload in reviewer and preview. Section selectors consume model keys; session scope supplies exact IDs with order preserved. No conflicting interfaces found.
