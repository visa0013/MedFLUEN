-- MedFLUEN 7.5: Dato til forelæsning.
-- Uses your existing public.current_user_is_admin() -> private.is_admin().
-- Does NOT create or change administrator membership or either function.
-- Run segment_7_5_schema_check.sql first. Unknown schema/policies stop safely.
begin;
do $$
begin
  if not exists (select 1 from pg_proc
    where oid=to_regprocedure('public.current_user_is_admin()')
      and prorettype='boolean'::regtype) then
    raise exception 'The existing public.current_user_is_admin() boolean function is required. No administrator authority was created.';
  end if;
  if not has_function_privilege('authenticated','public.current_user_is_admin()','EXECUTE') then
    raise exception 'Authenticated users cannot call the existing admin check. Review function permissions before migrating.';
  end if;
end $$;
create table if not exists public.lecture_calendar_canonical_matches (
  module_name text not null,
  event_id text not null,
  lecture_ids text[] not null default '{}',
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (module_name,event_id)
);
do $$
declare bad text;
begin
  select string_agg(e.name,', ') into bad from (values
    ('module_name','text'),('event_id','text'),('lecture_ids','_text'),
    ('updated_by','uuid'),('updated_at','timestamptz')
  ) e(name,type) left join pg_attribute a
    on a.attrelid='public.lecture_calendar_canonical_matches'::regclass
      and a.attname=e.name and a.attnum>0 and not a.attisdropped
    left join pg_type t on t.oid=a.atttypid
    where t.typname is distinct from e.type;
  if bad is not null then
    raise exception 'Date-mapping schema differs (%). Nothing was replaced; share the schema-check report.',bad;
  end if;
  if not exists (select 1 from pg_index i
    join pg_attribute m on m.attrelid=i.indrelid and m.attname='module_name'
    join pg_attribute e on e.attrelid=i.indrelid and e.attname='event_id'
    where i.indrelid='public.lecture_calendar_canonical_matches'::regclass
      and i.indisunique and i.indisvalid and i.indimmediate
      and i.indpred is null and i.indexprs is null and i.indnkeyatts=2
      and ((i.indkey[0]=m.attnum and i.indkey[1]=e.attnum)
        or (i.indkey[0]=e.attnum and i.indkey[1]=m.attnum))) then
    raise exception 'Date mappings require a unique (module_name,event_id) key. Review schema before changing it.';
  end if;
  if exists (select 1 from pg_policies where schemaname='public'
    and tablename='lecture_calendar_canonical_matches'
    and policyname not in ('dates75_read','dates75_insert_admin','dates75_update_admin','dates75_delete_admin')) then
    raise exception 'Existing date-mapping policies need review. Nothing was replaced; share the schema-check report.';
  end if;
end $$;
alter table public.lecture_calendar_canonical_matches enable row level security;
drop policy if exists dates75_read on public.lecture_calendar_canonical_matches;
create policy dates75_read on public.lecture_calendar_canonical_matches
  for select to authenticated using (auth.uid() is not null);
drop policy if exists dates75_insert_admin on public.lecture_calendar_canonical_matches;
create policy dates75_insert_admin on public.lecture_calendar_canonical_matches
  for insert to authenticated
  with check (public.current_user_is_admin() and updated_by=auth.uid());
drop policy if exists dates75_update_admin on public.lecture_calendar_canonical_matches;
create policy dates75_update_admin on public.lecture_calendar_canonical_matches
  for update to authenticated using (public.current_user_is_admin())
  with check (public.current_user_is_admin() and updated_by=auth.uid());
drop policy if exists dates75_delete_admin on public.lecture_calendar_canonical_matches;
create policy dates75_delete_admin on public.lecture_calendar_canonical_matches
  for delete to authenticated using (public.current_user_is_admin());
revoke all on public.lecture_calendar_canonical_matches from public,anon,authenticated;
grant select,insert,update,delete on public.lecture_calendar_canonical_matches to authenticated;
commit;
