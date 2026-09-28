-- Dr. Byte: counters only. No questions, documents, answers or API keys stored.
begin;
create table if not exists public.dr_byte_quota_76 (
  scope text primary key,
  day date not null,
  requests integer not null default 0 check (requests >= 0),
  minute_at timestamptz not null default now(),
  minute_requests integer not null default 0 check (minute_requests >= 0)
);
alter table public.dr_byte_quota_76 enable row level security;
revoke all on public.dr_byte_quota_76 from public, anon, authenticated;

create or replace function public.consume_dr_byte_76()
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  who uuid := auth.uid();
  utc_day date := (clock_timestamp() at time zone 'UTC')::date;
  stamp timestamptz := clock_timestamp();
  mine public.dr_byte_quota_76%rowtype;
  overall public.dr_byte_quota_76%rowtype;
begin
  if who is null then raise exception 'Authentication required'; end if;
  -- One lock covers both counters across all serverless instances.
  perform pg_advisory_xact_lock(760014);
  delete from public.dr_byte_quota_76 where day < utc_day;
  insert into public.dr_byte_quota_76(scope,day,minute_at)
    values ('global',utc_day,stamp),(who::text,utc_day,stamp)
    on conflict (scope) do nothing;
  select * into mine from public.dr_byte_quota_76 where scope=who::text;
  select * into overall from public.dr_byte_quota_76 where scope='global';
  if stamp >= mine.minute_at + interval '1 minute' then
    update public.dr_byte_quota_76 set minute_at=stamp,minute_requests=0 where scope=who::text;
    mine.minute_requests := 0;
  end if;
  if mine.requests >= 10 or mine.minute_requests >= 2 or overall.requests >= 40 then return false; end if;
  update public.dr_byte_quota_76 set requests=requests+1,minute_requests=minute_requests+1
    where scope in ('global',who::text);
  return true;
end;
$$;
revoke all on function public.consume_dr_byte_76() from public, anon;
grant execute on function public.consume_dr_byte_76() to authenticated;
notify pgrst, 'reload schema';
commit;
