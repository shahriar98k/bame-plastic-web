-- Run this ONCE in Supabase: SQL Editor -> New query -> paste -> Run.
create table if not exists public.scores(
  id bigint generated always as identity primary key,
  device_id text not null,
  name text not null,
  score bigint not null check (score >= 0),
  earned bigint not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists scores_created_idx on public.scores(created_at desc);
create index if not exists scores_device_idx on public.scores(device_id, created_at desc);

alter table public.scores enable row level security;   -- no direct table access for the public
revoke all on public.scores from anon, authenticated;

-- A player sends a finished run. Rules: name 1-24 chars, score 0..100,000,000, one submit per 20 s per device.
create or replace function public.submit_score(p_device text, p_name text, p_score bigint, p_earned bigint default 0)
returns void language plpgsql security definer set search_path = public as $$
declare v_name text := left(btrim(regexp_replace(coalesce(p_name,''), '[[:cntrl:]]', '', 'g')), 24);
begin
  if p_device is null or length(p_device) < 8 or length(p_device) > 64 then raise exception 'bad device'; end if;
  if v_name = '' then raise exception 'bad name'; end if;
  if p_score is null or p_score < 0 or p_score > 100000000 then raise exception 'bad score'; end if;
  if exists (select 1 from scores where device_id = p_device and created_at > now() - interval '20 seconds') then
    raise exception 'too fast';
  end if;
  insert into scores(device_id, name, score, earned) values (p_device, v_name, p_score, greatest(coalesce(p_earned,0),0));
end $$;

-- Top players for a period: 'd' = today, 'w' = this week (starts Saturday), 'm' = this month (Bangladesh time).
-- One row per player (their best score in that period), highest first.
create or replace function public.get_top(p_period text, p_device text default null, p_limit int default 20)
returns table(name text, score bigint, mine boolean) language plpgsql security definer set search_path = public as $$
declare v_now timestamp := now() at time zone 'Asia/Dhaka'; v_from timestamp;
begin
  v_from := case p_period
    when 'd' then date_trunc('day', v_now)
    when 'w' then date_trunc('day', v_now) - ((extract(dow from v_now)::int + 1) % 7) * interval '1 day'
    else date_trunc('month', v_now) end;
  return query
  select t.name, t.score, (t.device_id = p_device) as mine
  from (
    select distinct on (s.device_id) s.device_id, s.name, s.score
    from scores s
    where (s.created_at at time zone 'Asia/Dhaka') >= v_from
    order by s.device_id, s.score desc, s.created_at desc
  ) t
  order by t.score desc, t.name
  limit least(greatest(coalesce(p_limit,20),1),50);
end $$;

grant execute on function public.submit_score(text,text,bigint,bigint) to anon, authenticated;
grant execute on function public.get_top(text,text,int) to anon, authenticated;
