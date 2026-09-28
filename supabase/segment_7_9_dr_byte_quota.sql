-- MedFLUEN 7.9: separate attempts from successful Gemini answers.
-- Run in Supabase SQL Editor before uploading the 7.9 API file.
-- Existing 7.6 counters are left untouched. These are app safety ceilings,
-- NOT Google's free-tier limits; check the actual project limits in AI Studio.
begin;

create table if not exists public.dr_byte_quota_config_79 (
  singleton boolean primary key default true check (singleton),
  burst_per_minute integer not null check (burst_per_minute between 1 and 60),
  per_user_day integer not null check (per_user_day between 1 and 1000),
  global_day integer not null check (global_day between 1 and 10000)
);
insert into public.dr_byte_quota_config_79(singleton, burst_per_minute, per_user_day, global_day)
values (true, 5, 100, 500) on conflict (singleton) do nothing;

create table if not exists public.dr_byte_requests_79 (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'reserved' check (status in ('reserved','success','failed'))
);
create index if not exists dr_byte_requests_79_owner_created_idx on public.dr_byte_requests_79(owner_id, created_at desc);
create index if not exists dr_byte_requests_79_created_status_idx on public.dr_byte_requests_79(created_at desc, status);

alter table public.dr_byte_quota_config_79 enable row level security;
alter table public.dr_byte_requests_79 enable row level security;
revoke all on public.dr_byte_quota_config_79, public.dr_byte_requests_79 from public, anon, authenticated;

create or replace function public.reserve_dr_byte_79()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  who uuid := auth.uid();
  now_at timestamptz := clock_timestamp();
  day_at timestamptz := date_trunc('day', clock_timestamp() at time zone 'UTC') at time zone 'UTC';
  config public.dr_byte_quota_config_79%rowtype;
  minute_used integer;
  user_used integer;
  global_used integer;
  new_id uuid;
  wait_seconds integer;
begin
  if who is null then raise exception 'Authentication required'; end if;
  perform pg_catalog.pg_advisory_xact_lock(790014);
  select * into config from public.dr_byte_quota_config_79 where singleton = true;
  if not found then raise exception 'Dr. Byte quota configuration missing'; end if;
  delete from public.dr_byte_requests_79 where created_at < now_at - interval '2 days';

  select count(*) into minute_used from public.dr_byte_requests_79
    where owner_id=who and created_at >= now_at - interval '1 minute';
  select count(*) into user_used from public.dr_byte_requests_79
    where owner_id=who and created_at >= day_at
      and (status='success' or (status='reserved' and created_at >= now_at - interval '2 minutes'));
  select count(*) into global_used from public.dr_byte_requests_79
    where created_at >= day_at
      and (status='success' or (status='reserved' and created_at >= now_at - interval '2 minutes'));

  wait_seconds := greatest(1, ceiling(extract(epoch from day_at + interval '1 day' - now_at))::integer);
  if minute_used >= config.burst_per_minute then
    return pg_catalog.jsonb_build_object('allowed',false,'reason','burst','retry_after_seconds',60);
  end if;
  if user_used >= config.per_user_day then
    return pg_catalog.jsonb_build_object('allowed',false,'reason','user_day','retry_after_seconds',wait_seconds);
  end if;
  if global_used >= config.global_day then
    return pg_catalog.jsonb_build_object('allowed',false,'reason','global_day','retry_after_seconds',wait_seconds);
  end if;

  insert into public.dr_byte_requests_79(owner_id) values (who) returning id into new_id;
  return pg_catalog.jsonb_build_object('allowed',true,'reservation_id',new_id::text);
end $$;

create or replace function public.finalize_dr_byte_79(p_reservation_id uuid, p_success boolean)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  who uuid := auth.uid();
  current_status text;
  target_status text := case when p_success then 'success' else 'failed' end;
begin
  if who is null or p_reservation_id is null or p_success is null then raise exception 'Invalid finalization'; end if;
  select status into current_status from public.dr_byte_requests_79
    where id=p_reservation_id and owner_id=who for update;
  if not found then return false; end if;
  if current_status='reserved' then
    update public.dr_byte_requests_79 set status=target_status, completed_at=clock_timestamp()
      where id=p_reservation_id and owner_id=who;
    return true;
  end if;
  return current_status=target_status;
end $$;

revoke all on function public.reserve_dr_byte_79() from public, anon;
revoke all on function public.finalize_dr_byte_79(uuid,boolean) from public, anon;
grant execute on function public.reserve_dr_byte_79() to authenticated;
grant execute on function public.finalize_dr_byte_79(uuid,boolean) to authenticated;
notify pgrst, 'reload schema';
commit;
