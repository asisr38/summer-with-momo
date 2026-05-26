-- Run this in the Supabase SQL Editor after creating your project.
-- Safe to re-run.

create table if not exists public.rooms (
  id text primary key,
  puzzle text not null,
  solution text not null,
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.room_state (
  room_id text primary key references public.rooms(id) on delete cascade,
  board jsonb not null,
  version int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.rooms enable row level security;
alter table public.room_state enable row level security;

-- This app has no auth. Two people who know the room code can read and write.
-- The guard is the unguessable 6-character code, not RLS.
drop policy if exists "rooms readable"   on public.rooms;
drop policy if exists "rooms insertable" on public.rooms;
drop policy if exists "rooms updatable"  on public.rooms;
create policy "rooms readable"   on public.rooms for select using (true);
create policy "rooms insertable" on public.rooms for insert with check (true);
create policy "rooms updatable"  on public.rooms for update using (true);

drop policy if exists "room_state readable"   on public.room_state;
drop policy if exists "room_state insertable" on public.room_state;
drop policy if exists "room_state updatable"  on public.room_state;
create policy "room_state readable"   on public.room_state for select using (true);
create policy "room_state insertable" on public.room_state for insert with check (true);
create policy "room_state updatable"  on public.room_state for update using (true);

-- Realtime broadcasts for postgres_changes.
-- Add tables to the realtime publication if not already present.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'rooms'
  ) then
    alter publication supabase_realtime add table public.rooms;
  end if;
  if not exists (
    select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'room_state'
  ) then
    alter publication supabase_realtime add table public.room_state;
  end if;
end$$;
