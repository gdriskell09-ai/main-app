-- ============================================================
-- Main App — schema v5 (run after schema-v4.sql)
-- Adds: canvass_pins table for door-knocking suite
-- ============================================================

create table if not exists public.canvass_pins (
  id          bigint generated always as identity primary key,
  lat         double precision not null,
  lng         double precision not null,
  address     text,
  status      text not null default 'new'
                check (status in ('new','knocked','no_answer','interested','estimate_sent','booked','completed')),
  notes       text,
  rep_name    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.canvass_pins enable row level security;

create policy "admin_owner_canvass" on public.canvass_pins
  using (is_admin_or_owner());

create trigger set_canvass_pins_updated_at
  before update on public.canvass_pins
  for each row execute function public.set_updated_at();
