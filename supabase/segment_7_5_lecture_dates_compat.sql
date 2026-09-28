-- Only for the eight legacy policies reported on 13 September 2026.
-- Run this ONCE, then run segment_7_5_lecture_dates.sql again.
-- No table rows or administrator functions are changed.
begin;
lock table public.lecture_calendar_canonical_matches in access exclusive mode;
do $$
declare
  p record;
  expected_cmd text;
  u text;
  c text;
  names text[] := array[
    'lecture_calendar_canonical_matches_select_authenticated',
    'lecture_calendar_canonical_matches_insert_admin',
    'lecture_calendar_canonical_matches_update_admin',
    'lecture_calendar_canonical_matches_delete_admin',
    'lecture_calendar_matches_read_75',
    'lecture_calendar_matches_insert_admin_75',
    'lecture_calendar_matches_update_admin_75',
    'lecture_calendar_matches_delete_admin_75'
  ];
begin
  if (select count(*) from pg_policies where schemaname='public'
      and tablename='lecture_calendar_canonical_matches') <> 8 then
    raise exception 'Policies changed: review before proceeding.';
  end if;
  for p in select * from pg_policies where schemaname='public'
    and tablename='lecture_calendar_canonical_matches' loop
    expected_cmd := case
      when p.policyname like '%insert_admin%' then 'INSERT'
      when p.policyname like '%update_admin%' then 'UPDATE'
      when p.policyname like '%delete_admin%' then 'DELETE'
      else 'SELECT' end;
    u := replace(regexp_replace(lower(coalesce(p.qual,'')), '[[:space:]()]', '', 'g'),'public.','');
    c := replace(regexp_replace(lower(coalesce(p.with_check,'')), '[[:space:]()]', '', 'g'),'public.','');
    if not (p.policyname = any(names))
      or p.permissive <> 'PERMISSIVE'
      or p.roles::text[] <> array['authenticated']::text[]
      or p.cmd <> expected_cmd
      or not (case p.cmd
        when 'SELECT' then u in ('true','auth.uidisnotnull') and c=''
        when 'INSERT' then u='' and c='current_user_is_admin'
        when 'UPDATE' then u='current_user_is_admin' and c='current_user_is_admin'
        when 'DELETE' then u='current_user_is_admin' and c=''
        else false end) then
      raise exception 'Policy % changed: review before proceeding.',p.policyname;
    end if;
  end loop;
end $$;
drop policy lecture_calendar_matches_read_75 on public.lecture_calendar_canonical_matches;
drop policy lecture_calendar_matches_insert_admin_75 on public.lecture_calendar_canonical_matches;
drop policy lecture_calendar_matches_update_admin_75 on public.lecture_calendar_canonical_matches;
drop policy lecture_calendar_matches_delete_admin_75 on public.lecture_calendar_canonical_matches;
alter policy lecture_calendar_canonical_matches_select_authenticated on public.lecture_calendar_canonical_matches rename to dates75_read;
alter policy lecture_calendar_canonical_matches_insert_admin on public.lecture_calendar_canonical_matches rename to dates75_insert_admin;
alter policy lecture_calendar_canonical_matches_update_admin on public.lecture_calendar_canonical_matches rename to dates75_update_admin;
alter policy lecture_calendar_canonical_matches_delete_admin on public.lecture_calendar_canonical_matches rename to dates75_delete_admin;
commit;
