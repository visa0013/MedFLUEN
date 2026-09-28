-- MedFLUEN 7.9: optional content type per existing catalog row.
-- Old rows without kind remain lectures. No table or row is removed; existing RLS is untouched.
BEGIN;
DO $$ BEGIN
  IF to_regclass('public.lecture_catalog_751') IS NULL THEN
    RAISE EXCEPTION 'Run segment_7_5_1_lecture_catalog.sql first; no changes made.';
  END IF;
  IF to_regprocedure('public.current_user_is_admin()') IS NULL THEN
    RAISE EXCEPTION 'The existing admin helper is required; no changes made.';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.validate_lecture_kind_79()
RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE item jsonb;
BEGIN
  IF pg_catalog.jsonb_typeof(NEW.lectures) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'Invalid catalog';
  END IF;
  FOR item IN SELECT value FROM pg_catalog.jsonb_array_elements(NEW.lectures) LOOP
    IF item ? 'kind' AND item->'kind' <> 'null'::jsonb
       AND (pg_catalog.jsonb_typeof(item->'kind') IS DISTINCT FROM 'string'
            OR item->>'kind' NOT IN ('lecture', 'class', 'tbl')) THEN
      RAISE EXCEPTION 'Invalid curriculum content type';
    END IF;
  END LOOP;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.validate_lecture_kind_79() FROM PUBLIC;
DROP TRIGGER IF EXISTS validate_lecture_kind_79 ON public.lecture_catalog_751;
CREATE TRIGGER validate_lecture_kind_79
BEFORE INSERT OR UPDATE ON public.lecture_catalog_751
FOR EACH ROW EXECUTE FUNCTION public.validate_lecture_kind_79();
COMMIT;
