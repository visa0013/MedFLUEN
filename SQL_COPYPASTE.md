# MedFLUEN 7.9 — SQL til direkte kopiering

Åbn filerne nedenfor én ad gangen, markér alt, og kopier til **Supabase → SQL Editor → New query → Run**. De komplette SQL-kommandoer ligger i de klikbare filer, så der ikke findes to forskellige kopier af samme migration.

1. Først læsetjek: [segment_7_9_schema_check.sql](supabase/segment_7_9_schema_check.sql).
2. Derefter [segment_7_9_curriculum_kinds.sql](supabase/segment_7_9_curriculum_kinds.sql).
3. Derefter [segment_7_9_dr_byte_conversations.sql](supabase/segment_7_9_dr_byte_conversations.sql).
4. Derefter [segment_7_9_dr_byte_quota.sql](supabase/segment_7_9_dr_byte_quota.sql).
5. Til sidst læsetjek: [segment_7_9_dr_byte_schema_check.sql](supabase/segment_7_9_dr_byte_schema_check.sql).

Kør kun 7.8-migrationen for private noter, hvis den ikke allerede er kørt i din database. Stop ved enhver SQL-fejl; det er sikrere at gennemgå den faktiske tilstand end at overskrive eksisterende policies.
