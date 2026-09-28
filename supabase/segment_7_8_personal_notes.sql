-- medFLUEN 7.8. Run in Supabase SQL Editor. Private standalone notes only.
-- Existing lecture notes, PDF annotations, and browser notes are not changed.
begin;
create table if not exists public.personal_notes (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '',
  body text not null default '',
  tags text[] not null default '{}',
  collection text not null default '',
  is_pinned boolean not null default false,
  source_lecture_id text,
  source_material_id text,
  source_page integer check (source_page is null or source_page > 0),
  linked_note_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  revision integer not null default 1 check (revision > 0)
);

do $$
declare bad text;
begin
  select string_agg(e.name, ', ') into bad from (values
    ('id', 'uuid'), ('user_id', 'uuid'), ('title', 'text'), ('body', 'text'),
    ('tags', '_text'), ('collection', 'text'), ('is_pinned', 'bool'),
    ('source_lecture_id', 'text'), ('source_material_id', 'text'), ('source_page', 'int4'),
    ('linked_note_ids', '_uuid'), ('created_at', 'timestamptz'),
    ('updated_at', 'timestamptz'), ('revision', 'int4')
  ) e(name, type_name)
  left join pg_attribute a on a.attrelid = 'public.personal_notes'::regclass
    and a.attname = e.name and a.attnum > 0 and not a.attisdropped
  left join pg_type t on t.oid = a.atttypid
  where t.typname is distinct from e.type_name;
  if bad is not null then
    raise exception 'personal_notes schema differs (%). Nothing was replaced; inspect the existing schema.', bad;
  end if;
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'personal_notes'
    and policyname not in ('personal_notes78_select', 'personal_notes78_insert', 'personal_notes78_update', 'personal_notes78_delete')) then
    raise exception 'personal_notes policies need review. Nothing was replaced; inspect existing policies.';
  end if;
end $$;

alter table public.personal_notes enable row level security;
drop policy if exists personal_notes78_select on public.personal_notes;
create policy personal_notes78_select on public.personal_notes for select to authenticated using (user_id = auth.uid());
drop policy if exists personal_notes78_insert on public.personal_notes;
create policy personal_notes78_insert on public.personal_notes for insert to authenticated with check (user_id = auth.uid());
drop policy if exists personal_notes78_update on public.personal_notes;
create policy personal_notes78_update on public.personal_notes for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists personal_notes78_delete on public.personal_notes;
create policy personal_notes78_delete on public.personal_notes for delete to authenticated using (user_id = auth.uid());
revoke all on public.personal_notes from public, anon, authenticated;
grant select, insert, update, delete on public.personal_notes to authenticated;
create index if not exists personal_notes78_owner_updated on public.personal_notes(user_id, updated_at desc);
create index if not exists personal_notes78_owner_source on public.personal_notes(user_id, source_lecture_id);
commit;
