-- MedFLUEN 7.9 preflight (read-only). Run before the migration and share this output if anything is missing.
SELECT
  to_regclass('public.lecture_catalog_751') AS catalog_table,
  to_regprocedure('public.current_user_is_admin()') AS admin_helper,
  (SELECT c.relrowsecurity FROM pg_catalog.pg_class c WHERE c.oid = to_regclass('public.lecture_catalog_751')) AS rls_enabled;

SELECT policyname, roles, cmd, qual, with_check
FROM pg_catalog.pg_policies
WHERE schemaname = 'public' AND tablename = 'lecture_catalog_751'
ORDER BY policyname;

SELECT tgname, pg_catalog.pg_get_triggerdef(t.oid) AS definition
FROM pg_catalog.pg_trigger t
WHERE t.tgrelid = to_regclass('public.lecture_catalog_751') AND NOT t.tgisinternal
ORDER BY tgname;
