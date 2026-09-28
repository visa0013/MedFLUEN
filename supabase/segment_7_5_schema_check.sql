-- MedFLUEN 7.5: READ-ONLY schema audit. No user rows or PDF contents are read.
-- Run FIRST. The JSON report describes missing objects and current policies.
-- An existing admin function must be reviewed before changing global permissions.
begin transaction read only;
with required(name) as (values
  ('lecture_pdf_annotations'), ('lecture_calendar_canonical_matches'),
  ('lecture_materials'), ('exam_set_documents'),
  ('flashcard_personal_cards'), ('flashcard_review_events'),
  ('flashcard_deck_workspaces75'), ('flashcard_deck_receipts75'), ('flashcard_deck_catalog75')
), table_report as (
  select r.name, c.oid is not null as exists, c.relrowsecurity as rls_enabled,
    coalesce((select jsonb_agg(jsonb_build_object(
      'name',a.attname,'type',format_type(a.atttypid,a.atttypmod),'required',a.attnotnull,
      'default',pg_get_expr(d.adbin,d.adrelid)) order by a.attnum)
      from pg_attribute a left join pg_attrdef d on d.adrelid=a.attrelid and d.adnum=a.attnum
      where a.attrelid=c.oid and a.attnum>0 and not a.attisdropped),'[]'::jsonb) as columns,
    coalesce((select jsonb_agg(jsonb_build_object('name',i.relname,'definition',pg_get_indexdef(i.oid)))
      from pg_index x join pg_class i on i.oid=x.indexrelid where x.indrelid=c.oid),'[]'::jsonb) as indexes,
    coalesce((select jsonb_agg(jsonb_build_object('name',p.policyname,'command',p.cmd,
      'roles',p.roles,'permissive',p.permissive,'using',p.qual,'check',p.with_check))
      from pg_policies p where p.schemaname='public' and p.tablename=r.name),'[]'::jsonb) as policies,
    coalesce((select jsonb_agg(jsonb_build_object('role',g.grantee,'privilege',g.privilege_type))
      from information_schema.table_privileges g where g.table_schema='public' and g.table_name=r.name),'[]'::jsonb) as grants
  from required r left join pg_class c on c.oid=to_regclass('public.'||r.name)
), functions_required(name) as (values
  ('current_user_is_admin'), ('upsert_flashcard_personal_card'),
  ('read_flashcard_decks75'), ('save_flashcard_decks75')
), function_report as (
  select f.name, p.oid is not null as exists,
    pg_get_function_identity_arguments(p.oid) as arguments,
    pg_get_function_result(p.oid) as result,
    p.prosecdef as security_definer, pg_get_userbyid(p.proowner) as owner,
    p.proconfig as settings, p.proacl::text as privileges,
    case when f.name='current_user_is_admin' then pg_get_functiondef(p.oid) else null end as admin_definition
  from functions_required f left join pg_proc p on p.proname=f.name and p.pronamespace='public'::regnamespace
)
select jsonb_build_object(
  'tables',(select jsonb_agg(to_jsonb(t) order by t.name) from table_report t),
  'functions',(select jsonb_agg(to_jsonb(f) order by f.name) from function_report f),
  'note','Read-only report. Review admin_definition before sharing if it contains private email addresses. Missing or unfamiliar objects need review, not blind replacement.'
) as report;
commit;
