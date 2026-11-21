-- Run this ONCE in Supabase: SQL Editor -> New query -> paste -> Run.  (halal income scoreboards: best rider / best delivery man)
create table if not exists public.halal(
  id bigint generated always as identity primary key,
  device_id text not null,
  name text not null,
  kind text not null check (kind in ('ride','delivery')),
  amount bigint not null check (amount >= 0),
  cnt int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists halal_kind_created_idx on public.halal(kind, created_at desc);
alter table public.halal enable row level security;
revoke all on public.halal from anon, authenticated;

create or replace function public.submit_halal(p_device text, p_name text, p_kind text, p_amount bigint, p_count int default 0)
returns void language plpgsql security definer set search_path = public as $$
declare v_name text := left(btrim(regexp_replace(coalesce(p_name,''), '[[:cntrl:]]', '', 'g')), 24);
begin
  if p_device is null or length(p_device) < 8 or length(p_device) > 64 then raise exception 'bad device'; end if;
  if v_name = '' then raise exception 'bad name'; end if;
  if p_kind not in ('ride','delivery') then raise exception 'bad kind'; end if;
  if p_amount is null or p_amount < 1 or p_amount > 50000000 then raise exception 'bad amount'; end if;
  if exists (select 1 from halal where device_id = p_device and kind = p_kind and created_at > now() - interval '20 seconds') then
    raise exception 'too fast';
  end if;
  insert into halal(device_id, name, kind, amount, cnt) values (p_device, v_name, p_kind, p_amount, greatest(coalesce(p_count,0),0));
end $$;

-- Period total of halal income per player. 'd' = today, 'w' = this week (starts Saturday), 'm' = this month (Bangladesh time).
create or replace function public.get_halal_top(p_kind text, p_period text, p_device text default null, p_limit int default 20)
returns table(name text, score bigint, mine boolean) language plpgsql security definer set search_path = public as $$
declare v_now timestamp := now() at time zone 'Asia/Dhaka'; v_from timestamp;
begin
  v_from := case p_period
    when 'd' then date_trunc('day', v_now)
    when 'w' then date_trunc('day', v_now) - ((extract(dow from v_now)::int + 1) % 7) * interval '1 day'
    else date_trunc('month', v_now) end;
  return query
  select (array_agg(h.name order by h.created_at desc))[1], sum(h.amount)::bigint as total, bool_or(h.device_id = p_device)
  from halal h
  where h.kind = p_kind and (h.created_at at time zone 'Asia/Dhaka') >= v_from
  group by h.device_id
  order by total desc
  limit least(greatest(coalesce(p_limit,20),1),50);
end $$;

grant execute on function public.submit_halal(text,text,text,bigint,int) to anon, authenticated;
grant execute on function public.get_halal_top(text,text,text,int) to anon, authenticated;
