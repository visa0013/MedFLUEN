-- Read-only check: two tables with RLS, owner policies and message foreign key.
select c.relname as table_name, c.relrowsecurity as rls_enabled,
       array_agg(distinct p.policyname order by p.policyname) filter (where p.policyname is not null) as policies
from pg_class c
join pg_namespace n on n.oid=c.relnamespace
left join pg_policies p on p.schemaname=n.nspname and p.tablename=c.relname
where n.nspname='public' and c.relname in ('dr_byte_conversations_79','dr_byte_messages_79')
group by c.relname,c.relrowsecurity order by c.relname;

select conname, confdeltype, pg_get_constraintdef(oid) as definition
from pg_constraint
where conrelid='public.dr_byte_messages_79'::regclass and contype='f';

select p.proname, pg_get_functiondef(p.oid) like '%SECURITY DEFINER%' as security_definer
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.proname in ('reserve_dr_byte_79','finalize_dr_byte_79');

select singleton, burst_per_minute, per_user_day, global_day
from public.dr_byte_quota_config_79;
