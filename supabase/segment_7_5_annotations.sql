-- MedFLUEN 7.5: private PDF annotations and per-slide notes.
-- Run the read-only schema check first. Never replaces an incompatible table.
begin;
create table if not exists public.lecture_pdf_annotations (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  module_name text not null,
  lecture_id text,
  -- Text accepts existing material identifiers without guessing another table's PK type.
  material_id text not null,
  page_number integer not null check (page_number >= 1),
  annotation_type text not null,
  color text not null default '#f7d85c',
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload)='object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
do $$
declare bad text;
begin
  select string_agg(e.name,', ') into bad from (values
    ('id',array['uuid','text']),('user_id',array['uuid']),
    ('module_name',array['text']),('lecture_id',array['text']),('material_id',array['uuid','text']),
    ('page_number',array['int4','int8']),('annotation_type',array['text']),('color',array['text']),
    ('payload',array['jsonb']),('created_at',array['timestamptz']),('updated_at',array['timestamptz'])
  ) e(name,types) left join pg_attribute a on a.attrelid='public.lecture_pdf_annotations'::regclass
    and a.attname=e.name and a.attnum>0 and not a.attisdropped
    left join pg_type t on t.oid=a.atttypid
    where t.typname is null or not (t.typname=any(e.types));
  if bad is not null then raise exception 'Annotation schema differs (%). No changes applied. Share schema-check report before migration.',bad; end if;
  if not exists (select 1 from pg_index i join pg_attribute a on a.attrelid=i.indrelid and a.attname='id'
    where i.indrelid='public.lecture_pdf_annotations'::regclass and i.indisunique and i.indisvalid
      and i.indpred is null and i.indnkeyatts=1 and i.indkey[0]=a.attnum) then
    raise exception 'Annotations need a unique id for the existing upsert contract. Review schema before changing it.';
  end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='lecture_pdf_annotations'
    and policyname not in ('annotations75_read_own','annotations75_insert_own','annotations75_update_own','annotations75_delete_own')) then
    raise exception 'Existing annotation policies need review. Nothing was replaced; share the schema-check report.';
  end if;
end $$;
alter table public.lecture_pdf_annotations enable row level security;
drop policy if exists annotations75_read_own on public.lecture_pdf_annotations;
create policy annotations75_read_own on public.lecture_pdf_annotations for select to authenticated using (user_id=auth.uid());
drop policy if exists annotations75_insert_own on public.lecture_pdf_annotations;
create policy annotations75_insert_own on public.lecture_pdf_annotations for insert to authenticated with check (user_id=auth.uid());
drop policy if exists annotations75_update_own on public.lecture_pdf_annotations;
create policy annotations75_update_own on public.lecture_pdf_annotations for update to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
drop policy if exists annotations75_delete_own on public.lecture_pdf_annotations;
create policy annotations75_delete_own on public.lecture_pdf_annotations for delete to authenticated using (user_id=auth.uid());
revoke all on public.lecture_pdf_annotations from public, anon, authenticated;
grant select, insert, update, delete on public.lecture_pdf_annotations to authenticated;
create index if not exists lecture_pdf_annotations_owner_material75 on public.lecture_pdf_annotations(user_id,material_id,created_at);
commit;
