-- MedFLUEN 7.5: private hierarchy and placements; never changes flashcard content.
-- Run in Supabase SQL Editor as project owner. No paid service is required.
begin;

-- System parents are seeded from the 7.5 curriculum, not accepted from a browser.
-- Future curriculum releases must extend this list; existing rows are preserved.
create table if not exists public.flashcard_deck_catalog75 (
  module_id text not null,
  deck_id text not null,
  primary key (module_id, deck_id)
);
alter table public.flashcard_deck_catalog75 enable row level security;
revoke all on public.flashcard_deck_catalog75 from public, anon, authenticated;
insert into public.flashcard_deck_catalog75(module_id, deck_id) values
  ('B1 Celler og væv', 'module:B1 Celler og væv'),
  ('B1 Celler og væv', 'group:B1 Celler og væv:unassigned'),
  ('B2 Bevægeapparatet', 'module:B2 Bevægeapparatet'),
  ('B2 Bevægeapparatet', 'group:B2 Bevægeapparatet:unassigned'),
  ('B3 Molekylær medicin', 'module:B3 Molekylær medicin'),
  ('B3 Molekylær medicin', 'group:B3 Molekylær medicin:unassigned'),
  ('B4 Genetik', 'module:B4 Genetik'),
  ('B4 Genetik', 'group:B4 Genetik:unassigned'),
  ('B5 Kredsløb og respiration', 'module:B5 Kredsløb og respiration'),
  ('B5 Kredsløb og respiration', 'group:B5 Kredsløb og respiration:unassigned'),
  ('B6 Ernæring og vækst', 'module:B6 Ernæring og vækst'),
  ('B6 Ernæring og vækst', 'group:B6 Ernæring og vækst:unassigned'),
  ('B7 Reproduktion og farmakodynamik', 'module:B7 Reproduktion og farmakodynamik'),
  ('B7 Reproduktion og farmakodynamik', 'group:B7 Reproduktion og farmakodynamik:unassigned'),
  ('B8 Homeostase', 'module:B8 Homeostase'),
  ('B8 Homeostase', 'group:B8 Homeostase:unassigned'),
  ('B9 Hjerne og sanser', 'module:B9 Hjerne og sanser'),
  ('B9 Hjerne og sanser', 'group:B9 Hjerne og sanser:unassigned'),
  ('B10 Angreb og forsvar', 'module:B10 Angreb og forsvar'),
  ('B10 Angreb og forsvar', 'group:B10 Angreb og forsvar:unassigned'),
  ('B11 Bachelorprojektet', 'module:B11 Bachelorprojektet'),
  ('B11 Bachelorprojektet', 'group:B11 Bachelorprojektet:unassigned'),
  ('B12 Fra rask til syg', 'module:B12 Fra rask til syg'),
  ('B12 Fra rask til syg', 'group:B12 Fra rask til syg:unassigned'),
  ('K1 Hjerte, lunger og nyrer', 'module:K1 Hjerte, lunger og nyrer'),
  ('K1 Hjerte, lunger og nyrer', 'group:K1 Hjerte, lunger og nyrer:unassigned'),
  ('K2 Bevægeapparatet og bloddannende organer', 'module:K2 Bevægeapparatet og bloddannende organer'),
  ('K2 Bevægeapparatet og bloddannende organer', 'group:K2 Bevægeapparatet og bloddannende organer:unassigned'),
  ('K3 Fordøjelseskanalen, ernæring og metabolisme', 'module:K3 Fordøjelseskanalen, ernæring og metabolisme'),
  ('K3 Fordøjelseskanalen, ernæring og metabolisme', 'group:K3 Fordøjelseskanalen, ernæring og metabolisme:unassigned'),
  ('K5 Nervesystem og psykiatri', 'module:K5 Nervesystem og psykiatri'),
  ('K5 Nervesystem og psykiatri', 'group:K5 Nervesystem og psykiatri:unassigned'),
  ('K5 Nervesystem og psykiatri', 'group:K5 Nervesystem og psykiatri:Neurologi'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:N1'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:N2'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:N3'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:N4'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:N5'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:N6'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:N7'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:N8'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:N9'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:N10'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:N11'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:N12'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:N13'),
  ('K5 Nervesystem og psykiatri', 'group:K5 Nervesystem og psykiatri:Neurokirurgi'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:NK1'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:NK2'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:NK3'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:NK4'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:NK5'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:NK6'),
  ('K5 Nervesystem og psykiatri', 'group:K5 Nervesystem og psykiatri:Voksenpsykiatri'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:VP1'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:VP2'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:VP3'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:VP4'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:VP5'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:VP6'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:VP7'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:VP8'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:VP9'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:VP10'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:VP11'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:VP12'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:VP13'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:VP14'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:VP15'),
  ('K5 Nervesystem og psykiatri', 'group:K5 Nervesystem og psykiatri:Ungepsykiatri'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:UP1'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:UP2'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:UP3'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:UP4'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:UP5'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:UP6'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:UP7'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:UP8'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:UP9'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:UP10'),
  ('K5 Nervesystem og psykiatri', 'lecture:K5 Nervesystem og psykiatri:UP11'),
  ('K6 Retsmedicin, nyrer, urinveje og kræft', 'module:K6 Retsmedicin, nyrer, urinveje og kræft'),
  ('K6 Retsmedicin, nyrer, urinveje og kræft', 'group:K6 Retsmedicin, nyrer, urinveje og kræft:unassigned'),
  ('K8 Mor og barn', 'module:K8 Mor og barn'),
  ('K8 Mor og barn', 'group:K8 Mor og barn:unassigned'),
  ('K9 Hud, øjne, farmakologi og ældre', 'module:K9 Hud, øjne, farmakologi og ældre'),
  ('K9 Hud, øjne, farmakologi og ældre', 'group:K9 Hud, øjne, farmakologi og ældre:unassigned'),
  ('K10 Forberedelse til KBU', 'module:K10 Forberedelse til KBU'),
  ('K10 Forberedelse til KBU', 'group:K10 Forberedelse til KBU:unassigned'),
  ('B1 Cells and tissues', 'module:B1 Cells and tissues'),
  ('B1 Cells and tissues', 'group:B1 Cells and tissues:unassigned'),
  ('B2 Musculoskeletal system', 'module:B2 Musculoskeletal system'),
  ('B2 Musculoskeletal system', 'group:B2 Musculoskeletal system:unassigned'),
  ('B3 Molecular medicine', 'module:B3 Molecular medicine'),
  ('B3 Molecular medicine', 'group:B3 Molecular medicine:unassigned'),
  ('B4 Genetics', 'module:B4 Genetics'),
  ('B4 Genetics', 'group:B4 Genetics:unassigned'),
  ('B5 Circulation and respiration', 'module:B5 Circulation and respiration'),
  ('B5 Circulation and respiration', 'group:B5 Circulation and respiration:unassigned'),
  ('B6 Nutrition and growth', 'module:B6 Nutrition and growth'),
  ('B6 Nutrition and growth', 'group:B6 Nutrition and growth:unassigned'),
  ('B7 Reproduction and pharmacodynamics', 'module:B7 Reproduction and pharmacodynamics'),
  ('B7 Reproduction and pharmacodynamics', 'group:B7 Reproduction and pharmacodynamics:unassigned'),
  ('B8 Homeostasis', 'module:B8 Homeostasis'),
  ('B8 Homeostasis', 'group:B8 Homeostasis:unassigned'),
  ('B9 Brain and senses', 'module:B9 Brain and senses'),
  ('B9 Brain and senses', 'group:B9 Brain and senses:unassigned'),
  ('B10 Infection and immunity', 'module:B10 Infection and immunity'),
  ('B10 Infection and immunity', 'group:B10 Infection and immunity:unassigned'),
  ('B11 Bachelor project', 'module:B11 Bachelor project'),
  ('B11 Bachelor project', 'group:B11 Bachelor project:unassigned'),
  ('B12 From healthy to ill', 'module:B12 From healthy to ill'),
  ('B12 From healthy to ill', 'group:B12 From healthy to ill:unassigned'),
  ('K1 Heart, lungs and kidneys', 'module:K1 Heart, lungs and kidneys'),
  ('K1 Heart, lungs and kidneys', 'group:K1 Heart, lungs and kidneys:unassigned'),
  ('K2 Musculoskeletal and hematological systems', 'module:K2 Musculoskeletal and hematological systems'),
  ('K2 Musculoskeletal and hematological systems', 'group:K2 Musculoskeletal and hematological systems:unassigned'),
  ('K3 Gastrointestinal system, nutrition and metabolism', 'module:K3 Gastrointestinal system, nutrition and metabolism'),
  ('K3 Gastrointestinal system, nutrition and metabolism', 'group:K3 Gastrointestinal system, nutrition and metabolism:unassigned'),
  ('K5 Neurology and psychiatry', 'module:K5 Neurology and psychiatry'),
  ('K5 Neurology and psychiatry', 'group:K5 Neurology and psychiatry:unassigned'),
  ('K6 Forensics, kidneys, urinary tract and cancer', 'module:K6 Forensics, kidneys, urinary tract and cancer'),
  ('K6 Forensics, kidneys, urinary tract and cancer', 'group:K6 Forensics, kidneys, urinary tract and cancer:unassigned'),
  ('K8 Mother and child', 'module:K8 Mother and child'),
  ('K8 Mother and child', 'group:K8 Mother and child:unassigned'),
  ('K9 Dermatology, ophthalmology, pharmacology and geriatrics', 'module:K9 Dermatology, ophthalmology, pharmacology and geriatrics'),
  ('K9 Dermatology, ophthalmology, pharmacology and geriatrics', 'group:K9 Dermatology, ophthalmology, pharmacology and geriatrics:unassigned'),
  ('K10 Preparation for internship', 'module:K10 Preparation for internship'),
  ('K10 Preparation for internship', 'group:K10 Preparation for internship:unassigned'),
  ('B1 الخلايا والأنسجة', 'module:B1 الخلايا والأنسجة'),
  ('B1 الخلايا والأنسجة', 'group:B1 الخلايا والأنسجة:unassigned'),
  ('B2 الجهاز العضلي الهيكلي', 'module:B2 الجهاز العضلي الهيكلي'),
  ('B2 الجهاز العضلي الهيكلي', 'group:B2 الجهاز العضلي الهيكلي:unassigned'),
  ('B3 الطب الجزيئي', 'module:B3 الطب الجزيئي'),
  ('B3 الطب الجزيئي', 'group:B3 الطب الجزيئي:unassigned'),
  ('B4 علم الوراثة', 'module:B4 علم الوراثة'),
  ('B4 علم الوراثة', 'group:B4 علم الوراثة:unassigned'),
  ('B5 الدورة الدموية والتنفس', 'module:B5 الدورة الدموية والتنفس'),
  ('B5 الدورة الدموية والتنفس', 'group:B5 الدورة الدموية والتنفس:unassigned'),
  ('B6 التغذية والنمو', 'module:B6 التغذية والنمو'),
  ('B6 التغذية والنمو', 'group:B6 التغذية والنمو:unassigned'),
  ('B7 التكاثر والديناميكا الدوائية', 'module:B7 التكاثر والديناميكا الدوائية'),
  ('B7 التكاثر والديناميكا الدوائية', 'group:B7 التكاثر والديناميكا الدوائية:unassigned'),
  ('B8 الاتزان الداخلي', 'module:B8 الاتزان الداخلي'),
  ('B8 الاتزان الداخلي', 'group:B8 الاتزان الداخلي:unassigned'),
  ('B9 الدماغ والحواس', 'module:B9 الدماغ والحواس'),
  ('B9 الدماغ والحواس', 'group:B9 الدماغ والحواس:unassigned'),
  ('B10 العدوى والمناعة', 'module:B10 العدوى والمناعة'),
  ('B10 العدوى والمناعة', 'group:B10 العدوى والمناعة:unassigned'),
  ('B11 مشروع البكالوريوس', 'module:B11 مشروع البكالوريوس'),
  ('B11 مشروع البكالوريوس', 'group:B11 مشروع البكالوريوس:unassigned'),
  ('B12 من السليم إلى المريض', 'module:B12 من السليم إلى المريض'),
  ('B12 من السليم إلى المريض', 'group:B12 من السليم إلى المريض:unassigned'),
  ('K1 القلب والرئتان والكليتان', 'module:K1 القلب والرئتان والكليتان'),
  ('K1 القلب والرئتان والكليتان', 'group:K1 القلب والرئتان والكليتان:unassigned'),
  ('K2 الجهاز العضلي الهيكلي وأعضاء تكوين الدم', 'module:K2 الجهاز العضلي الهيكلي وأعضاء تكوين الدم'),
  ('K2 الجهاز العضلي الهيكلي وأعضاء تكوين الدم', 'group:K2 الجهاز العضلي الهيكلي وأعضاء تكوين الدم:unassigned'),
  ('K3 الجهاز الهضمي والتغذية والاستقلاب', 'module:K3 الجهاز الهضمي والتغذية والاستقلاب'),
  ('K3 الجهاز الهضمي والتغذية والاستقلاب', 'group:K3 الجهاز الهضمي والتغذية والاستقلاب:unassigned'),
  ('K5 الجهاز العصبي والطب النفسي', 'module:K5 الجهاز العصبي والطب النفسي'),
  ('K5 الجهاز العصبي والطب النفسي', 'group:K5 الجهاز العصبي والطب النفسي:unassigned'),
  ('K6 الطب الشرعي والكلى والمسالك البولية والسرطان', 'module:K6 الطب الشرعي والكلى والمسالك البولية والسرطان'),
  ('K6 الطب الشرعي والكلى والمسالك البولية والسرطان', 'group:K6 الطب الشرعي والكلى والمسالك البولية والسرطان:unassigned'),
  ('K8 الأم والطفل', 'module:K8 الأم والطفل'),
  ('K8 الأم والطفل', 'group:K8 الأم والطفل:unassigned'),
  ('K9 الجلد والعيون وعلم الأدوية وطب الشيخوخة', 'module:K9 الجلد والعيون وعلم الأدوية وطب الشيخوخة'),
  ('K9 الجلد والعيون وعلم الأدوية وطب الشيخوخة', 'group:K9 الجلد والعيون وعلم الأدوية وطب الشيخوخة:unassigned'),
  ('K10 التحضير للتدريب السريري', 'module:K10 التحضير للتدريب السريري'),
  ('K10 التحضير للتدريب السريري', 'group:K10 التحضير للتدريب السريري:unassigned')
on conflict (module_id, deck_id) do nothing;


create table if not exists public.flashcard_deck_workspaces75 (
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null,
  data jsonb not null,
  revision bigint not null default 0 check (revision >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, module_id)
);
create table if not exists public.flashcard_deck_receipts75 (
  user_id uuid not null,
  module_id text not null,
  operation_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (user_id, module_id, operation_id),
  foreign key (user_id, module_id) references public.flashcard_deck_workspaces75(user_id, module_id) on delete cascade
);
alter table public.flashcard_deck_workspaces75 enable row level security;
alter table public.flashcard_deck_receipts75 enable row level security;
drop policy if exists deck_workspace75_read_own on public.flashcard_deck_workspaces75;
create policy deck_workspace75_read_own on public.flashcard_deck_workspaces75 for select to authenticated using (user_id = auth.uid());
drop policy if exists deck_receipts75_read_own on public.flashcard_deck_receipts75;
create policy deck_receipts75_read_own on public.flashcard_deck_receipts75 for select to authenticated using (user_id = auth.uid());
revoke all on public.flashcard_deck_workspaces75, public.flashcard_deck_receipts75 from anon, authenticated;
grant select on public.flashcard_deck_workspaces75, public.flashcard_deck_receipts75 to authenticated;

-- STABLE + one SELECT keeps state and receipts in the same MVCC snapshot.
-- Separate HTTP queries can otherwise acknowledge a change absent from the state.
create or replace function public.read_flashcard_decks75(p_module_id text, p_operation_ids uuid[] default '{}')
returns jsonb language sql stable security invoker set search_path = pg_catalog, public
as $$
  select jsonb_build_object(
    'state', coalesce(w.data, jsonb_build_object('owner', auth.uid()::text, 'moduleId', p_module_id, 'decks', '[]'::jsonb, 'placements', '{}'::jsonb)),
    'revision', coalesce(w.revision, 0),
    'acknowledged', coalesce((select jsonb_agg(r.operation_id) from public.flashcard_deck_receipts75 r
      where r.user_id = auth.uid() and r.module_id = p_module_id and r.operation_id = any(p_operation_ids)), '[]'::jsonb)
  ) from (select 1) seed left join public.flashcard_deck_workspaces75 w
      on w.user_id = auth.uid() and w.module_id = p_module_id
  where auth.uid() is not null;
$$;
revoke all on function public.read_flashcard_decks75(text,uuid[]) from public, anon;
grant execute on function public.read_flashcard_decks75(text,uuid[]) to authenticated;

create or replace function public.save_flashcard_decks75(
  p_module_id text, p_expected_revision bigint, p_operation_id uuid, p_data jsonb
) returns jsonb
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare
  actor uuid := auth.uid();
  current_row public.flashcard_deck_workspaces75%rowtype;
  item jsonb;
  parent_id text;
  ancestor jsonb;
  visited text[];
begin
  if actor is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if p_module_id is null or length(p_module_id) not between 1 and 200 or p_operation_id is null then
    raise exception 'Invalid scope';
  end if;
  if p_data is null or jsonb_typeof(p_data) <> 'object' or octet_length(p_data::text) > 4000000
     or p_data->>'owner' is distinct from actor::text or p_data->>'moduleId' is distinct from p_module_id
     or jsonb_typeof(p_data->'decks') is distinct from 'array'
     or jsonb_typeof(p_data->'placements') is distinct from 'object' then
    raise exception 'Invalid deck data or account scope';
  end if;
  if jsonb_array_length(p_data->'decks') > 2000 then raise exception 'Too many decks'; end if;
  if exists (select 1 from jsonb_array_elements(p_data->'decks') d
    where jsonb_typeof(d) <> 'object' or coalesce(d->>'id','') !~ '^personal:[A-Za-z0-9-]+$'
      or length(coalesce(btrim(d->>'name'),'')) not between 1 and 100
      or jsonb_typeof(d->'parent') is distinct from 'string') then raise exception 'Invalid deck'; end if;
  if exists (select d->>'id' from jsonb_array_elements(p_data->'decks') d group by d->>'id' having count(*) > 1)
    or exists (select d->>'parent', lower(btrim(d->>'name')) from jsonb_array_elements(p_data->'decks') d
      group by d->>'parent', lower(btrim(d->>'name')) having count(*) > 1) then raise exception 'Duplicate deck ID or sibling name'; end if;

  for item in select value from jsonb_array_elements(p_data->'decks') loop
    visited := array[item->>'id'];
    parent_id := item->>'parent';
    loop
      if parent_id = any(visited) then raise exception 'Deck cycle'; end if;
      select value into ancestor from jsonb_array_elements(p_data->'decks') where value->>'id' = parent_id;
      exit when not found;
      visited := array_append(visited, parent_id);
      parent_id := ancestor->>'parent';
    end loop;
    -- An encoded module prefix alone cannot prove that a lecture exists.
    if not exists (select 1 from public.flashcard_deck_catalog75 c
      where c.module_id = p_module_id and c.deck_id = parent_id) then
      raise exception 'Unknown parent or cross-module move';
    end if;
  end loop;
  if exists (select 1 from jsonb_each(p_data->'placements') p
    where length(p.key) not between 1 and 300 or p.key in ('__proto__','constructor','prototype')
      or jsonb_typeof(p.value) <> 'string'
      or not exists (select 1 from jsonb_array_elements(p_data->'decks') d where d->>'id' = p.value #>> '{}')) then
    raise exception 'Invalid card placement';
  end if;

  insert into public.flashcard_deck_workspaces75(user_id,module_id,data)
    values(actor,p_module_id,jsonb_build_object('owner',actor::text,'moduleId',p_module_id,'decks','[]'::jsonb,'placements','{}'::jsonb))
    on conflict (user_id,module_id) do nothing;
  select * into current_row from public.flashcard_deck_workspaces75
    where user_id = actor and module_id = p_module_id for update;
  if exists (select 1 from public.flashcard_deck_receipts75 where user_id=actor and module_id=p_module_id and operation_id=p_operation_id) then
    return jsonb_build_object('state',current_row.data,'revision',current_row.revision);
  end if;
  if p_expected_revision is distinct from current_row.revision then
    raise exception 'Deck revision changed; reload and retry' using errcode='40001';
  end if;
  update public.flashcard_deck_workspaces75 set data=p_data, revision=revision+1, updated_at=now()
    where user_id=actor and module_id=p_module_id returning * into current_row;
  insert into public.flashcard_deck_receipts75(user_id,module_id,operation_id) values(actor,p_module_id,p_operation_id);
  return jsonb_build_object('state',current_row.data,'revision',current_row.revision);
end;
$$;
revoke all on function public.save_flashcard_decks75(text,bigint,uuid,jsonb) from public, anon;
grant execute on function public.save_flashcard_decks75(text,bigint,uuid,jsonb) to authenticated;
commit;
