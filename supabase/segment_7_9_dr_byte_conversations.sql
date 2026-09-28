-- MedFLUEN 7.9: private Dr. Byte conversation history.
-- Run once in Supabase SQL Editor. Safe to rerun. No existing tables or policies are removed.
-- Only message text, quiz text, and short citation metadata belong in body.
begin;

create table if not exists public.dr_byte_conversations_79 (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Ny samtale' check (char_length(title) between 1 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dr_byte_messages_79 (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.dr_byte_conversations_79(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  body jsonb not null check (jsonb_typeof(body) = 'object' and pg_column_size(body) <= 100000),
  created_at timestamptz not null default now()
);

create index if not exists dr_byte_conversations_79_owner_recent_idx on public.dr_byte_conversations_79(owner_id, updated_at desc, id desc);
create index if not exists dr_byte_messages_79_conversation_recent_idx on public.dr_byte_messages_79(conversation_id, created_at, id);

alter table public.dr_byte_conversations_79 enable row level security;
alter table public.dr_byte_messages_79 enable row level security;
revoke all on public.dr_byte_conversations_79, public.dr_byte_messages_79 from public, anon;
grant select, insert, update, delete on public.dr_byte_conversations_79, public.dr_byte_messages_79 to authenticated;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='dr_byte_conversations_79' and policyname='dr_byte_79_select_own') then
    create policy dr_byte_79_select_own on public.dr_byte_conversations_79 for select to authenticated using (owner_id = (select auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='dr_byte_conversations_79' and policyname='dr_byte_79_insert_own') then
    create policy dr_byte_79_insert_own on public.dr_byte_conversations_79 for insert to authenticated with check (owner_id = (select auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='dr_byte_conversations_79' and policyname='dr_byte_79_update_own') then
    create policy dr_byte_79_update_own on public.dr_byte_conversations_79 for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='dr_byte_conversations_79' and policyname='dr_byte_79_delete_own') then
    create policy dr_byte_79_delete_own on public.dr_byte_conversations_79 for delete to authenticated using (owner_id = (select auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='dr_byte_messages_79' and policyname='dr_byte_79_messages_select_own') then
    create policy dr_byte_79_messages_select_own on public.dr_byte_messages_79 for select to authenticated using
      (exists (select 1 from public.dr_byte_conversations_79 c where c.id = conversation_id and c.owner_id = (select auth.uid())));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='dr_byte_messages_79' and policyname='dr_byte_79_messages_insert_own') then
    create policy dr_byte_79_messages_insert_own on public.dr_byte_messages_79 for insert to authenticated with check
      (exists (select 1 from public.dr_byte_conversations_79 c where c.id = conversation_id and c.owner_id = (select auth.uid())));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='dr_byte_messages_79' and policyname='dr_byte_79_messages_delete_own') then
    create policy dr_byte_79_messages_delete_own on public.dr_byte_messages_79 for delete to authenticated using
      (exists (select 1 from public.dr_byte_conversations_79 c where c.id = conversation_id and c.owner_id = (select auth.uid())));
  end if;
end $$;

create or replace function public.dr_byte_touch_79()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.dr_byte_conversations_79 set updated_at = now() where id = new.conversation_id;
  return new;
end $$;
revoke all on function public.dr_byte_touch_79() from public, anon, authenticated;
drop trigger if exists dr_byte_touch_79 on public.dr_byte_messages_79;
create trigger dr_byte_touch_79 after insert on public.dr_byte_messages_79
for each row execute function public.dr_byte_touch_79();

notify pgrst, 'reload schema';
commit;
