# Design review — 7.9

These two generated images are composition studies, not UI data or final copy. No invented lecture, date, count, quotation or slogan may be shipped as real content.

## Home

- Keep: calendar as the main canvas; compact search in the upper utility line; account/profile in the upper-right; a quiet Dr. Byte orb; sparse peripheral context.
- Change after user feedback: remove every ornamental quotation and the bottom explanatory strip. Do not use the mockup's sample March 2025 dates or event titles. Reduce the display type's weight and scale; pair it with a crisp sans-serif for dense calendar content.
- Interaction: existing day/week/month, filters, drag, event popover and planning data remain. The active day and view share the existing calendar preference store. A peek does not replace the calendar. On narrow screens Dr. Byte overlays it.
- Surface: warm paper is default; mist and white are explicit choices under Settings. Dark theme still has accessible contrast.

## Training

- Keep: simple Theory / Exam-MCQ switch; hierarchical lecture/deck rows; selected deck detail to the right when width allows; broad activity heatmap at the bottom.
- Change after user feedback: remove all quotations, the stray Statistics navigation item and the meaningless last-opened ornament. Do not use the mockup's invented card counts.
- Semantics: blue = new, red = learning/in progress, green = ready/review. Never use color alone; every count has a text heading and accessible label.
- Interaction: on a compact viewport the selected deck opens as an Arc-like peek rather than squeezing the table. Heatmap tooltips show real cards and minutes only. Exercise and exam-MCQ use the existing question/review engines.

## Remaining surfaces

- Curriculum reader: editorial lecture index, native PDF as the document canvas, document/source peek, no unrelated cards. Long Danish lecture titles wrap in at most two lines with a full-title accessible label.
- Dr. Byte expanded: workspace-style history rail, conversation centre, cited source peek; no forced split at 1024 px, no invented source claims. The glowing orb remains unchanged.
- Mobile Home: single wide calendar, brief greeting, profile/search utility line; dock retains its form and the chat becomes an overlay. No quotation or inactive blank column.

Readymag governs the intentional type hierarchy and negative space. Arc governs returnable context, peek and split behaviour; visual inspiration does not imply copying their components. Reduced motion removes decorative transitions without hiding content.
