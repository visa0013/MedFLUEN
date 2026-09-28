-- MedFLUEN 7.5.1: shared lecture catalog. Run once; safe to rerun.
-- Uses the EXISTING public.current_user_is_admin() helper. No old data is deleted.
BEGIN;
DO $$ BEGIN
  IF to_regprocedure('public.current_user_is_admin()') IS NULL THEN
    RAISE EXCEPTION 'Existing admin helper is required. No changes made.';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.lecture_catalog_751 (
  module_name text PRIMARY KEY CHECK (length(btrim(module_name)) BETWEEN 1 AND 200),
  lectures jsonb NOT NULL DEFAULT '[]'::jsonb,
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  updated_by uuid NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.validate_lecture_catalog_751()
RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE item jsonb; ids text[] := ARRAY[]::text[];
BEGIN
  IF jsonb_typeof(NEW.lectures) IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Invalid lecture list'; END IF;
  IF jsonb_array_length(NEW.lectures) > 2000 THEN RAISE EXCEPTION 'Invalid lecture count'; END IF;
  FOR item IN SELECT value FROM jsonb_array_elements(NEW.lectures) LOOP
    IF jsonb_typeof(item) IS DISTINCT FROM 'object'
      OR jsonb_typeof(item->'id') IS DISTINCT FROM 'string'
      OR (item->>'id') !~ '^[A-Za-z0-9_-]{1,80}$'
      OR (item->>'id') = ANY(ids)
      OR jsonb_typeof(item->'title') IS DISTINCT FROM 'string'
      OR length(btrim(item->>'title')) NOT BETWEEN 1 AND 300
      OR jsonb_typeof(item->'group') IS DISTINCT FROM 'string'
      OR length(btrim(item->>'group')) NOT BETWEEN 1 AND 120
    THEN RAISE EXCEPTION 'Invalid or duplicate lecture'; END IF;
    IF item ? 'parts' AND item->'parts' <> 'null'::jsonb THEN
      IF jsonb_typeof(item->'parts') <> 'number' OR (item->>'parts') !~ '^[0-9]+$' THEN RAISE EXCEPTION 'Invalid parts'; END IF;
      IF (item->>'parts')::numeric NOT BETWEEN 1 AND 50 THEN RAISE EXCEPTION 'Invalid parts'; END IF;
    END IF;
    ids := array_append(ids, item->>'id');
  END LOOP;
  IF TG_OP = 'UPDATE' THEN
    IF NEW.module_name <> OLD.module_name OR NEW.revision <> OLD.revision + 1 THEN RAISE EXCEPTION 'Invalid catalog revision'; END IF;
    IF EXISTS (SELECT 1 FROM jsonb_array_elements(OLD.lectures) r WHERE NOT (r->>'id' = ANY(ids))) THEN
      RAISE EXCEPTION 'Existing lecture IDs cannot be removed';
    END IF;
  ELSIF NEW.revision <> 1 THEN RAISE EXCEPTION 'Invalid initial revision';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.validate_lecture_catalog_751() FROM PUBLIC;
DROP TRIGGER IF EXISTS validate_lecture_catalog_751 ON public.lecture_catalog_751;
CREATE TRIGGER validate_lecture_catalog_751 BEFORE INSERT OR UPDATE ON public.lecture_catalog_751
FOR EACH ROW EXECUTE FUNCTION public.validate_lecture_catalog_751();

ALTER TABLE public.lecture_catalog_751 ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='lecture_catalog_751'
    AND policyname NOT IN ('catalog751_read','catalog751_insert','catalog751_update')) THEN
    RAISE EXCEPTION 'Unknown catalog policies need review. Nothing was replaced.';
  END IF;
END $$;
DROP POLICY IF EXISTS catalog751_read ON public.lecture_catalog_751;
DROP POLICY IF EXISTS catalog751_insert ON public.lecture_catalog_751;
DROP POLICY IF EXISTS catalog751_update ON public.lecture_catalog_751;
CREATE POLICY catalog751_read ON public.lecture_catalog_751 FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY catalog751_insert ON public.lecture_catalog_751 FOR INSERT TO authenticated
  WITH CHECK (public.current_user_is_admin() AND updated_by = auth.uid());
CREATE POLICY catalog751_update ON public.lecture_catalog_751 FOR UPDATE TO authenticated
  USING (public.current_user_is_admin()) WITH CHECK (public.current_user_is_admin() AND updated_by = auth.uid());
REVOKE ALL ON public.lecture_catalog_751 FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.lecture_catalog_751 TO authenticated;
COMMIT;
