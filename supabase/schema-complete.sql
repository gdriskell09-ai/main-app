-- ============================================================
-- Main App — complete schema (single idempotent script)
-- Safe to run on a fresh database or one with partial setup.
-- Project: busedivfzapxafpgdoyb
-- ============================================================


-- ── Helper functions ─────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin_or_owner()
returns boolean
language sql security definer stable
set search_path = public as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
      and role in ('admin', 'owner')
  );
$$;
revoke all on function public.is_admin_or_owner() from public;
grant execute on function public.is_admin_or_owner() to anon, authenticated;


-- ── user_roles ───────────────────────────────────────────────

create table if not exists public.user_roles (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null check (role in ('admin', 'owner', 'viewer')),
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

drop policy if exists "user_roles_owner_select" on public.user_roles;
create policy "user_roles_owner_select" on public.user_roles
  for select to authenticated
  using (public.is_admin_or_owner());

grant select on public.user_roles to authenticated;


-- ── leads ────────────────────────────────────────────────────

create table if not exists public.leads (
  id         bigint generated always as identity primary key,
  name       text not null,
  business   text,
  type       text,
  need       text,
  email      text not null,
  phone      text,
  city       text,
  lat        double precision,
  lng        double precision,
  message    text,
  status     text not null default 'new'
               check (status in ('new','contacted','qualified','converted','not_interested')),
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add columns that may be missing on existing installs
alter table public.leads add column if not exists city    text;
alter table public.leads add column if not exists lat     double precision;
alter table public.leads add column if not exists lng     double precision;
alter table public.leads add column if not exists message text;
alter table public.leads add column if not exists notes   text;

drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

alter table public.leads enable row level security;

drop policy if exists "leads_public_insert"  on public.leads;
drop policy if exists "leads_owner_select"   on public.leads;
drop policy if exists "leads_owner_update"   on public.leads;
drop policy if exists "leads_owner_delete"   on public.leads;

create policy "leads_public_insert" on public.leads
  for insert to anon, authenticated with check (true);

create policy "leads_owner_select" on public.leads
  for select to authenticated using (public.is_admin_or_owner());

create policy "leads_owner_update" on public.leads
  for update to authenticated using (public.is_admin_or_owner());

create policy "leads_owner_delete" on public.leads
  for delete to authenticated using (public.is_admin_or_owner());


-- ── customers ────────────────────────────────────────────────

create table if not exists public.customers (
  id         bigint generated always as identity primary key,
  name       text not null,
  email      text,
  phone      text,
  business   text,
  address    text,
  notes      text,
  lead_id    bigint references public.leads(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.customers add column if not exists address    text;
alter table public.customers add column if not exists notes      text;
alter table public.customers add column if not exists lead_id    bigint references public.leads(id) on delete set null;
alter table public.customers add column if not exists updated_at timestamptz not null default now();

drop trigger if exists customers_updated_at on public.customers;
create trigger customers_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

alter table public.customers enable row level security;

drop policy if exists "customers_owner"                       on public.customers;
drop policy if exists "Authenticated users manage customers"  on public.customers;

create policy "customers_owner" on public.customers
  for all to authenticated using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());


-- ── quotes ───────────────────────────────────────────────────

create table if not exists public.quotes (
  id          bigint generated always as identity primary key,
  customer_id bigint not null references public.customers(id) on delete cascade,
  title       text not null,
  line_items  jsonb not null default '[]',
  total       numeric(10,2) not null default 0,
  status      text not null default 'draft'
                check (status in ('draft','sent','accepted','declined')),
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.quotes add column if not exists notes      text;
alter table public.quotes add column if not exists updated_at timestamptz not null default now();

drop trigger if exists quotes_updated_at on public.quotes;
create trigger quotes_updated_at
  before update on public.quotes
  for each row execute function public.set_updated_at();

alter table public.quotes enable row level security;

drop policy if exists "quotes_owner"                      on public.quotes;
drop policy if exists "Authenticated users manage quotes" on public.quotes;

create policy "quotes_owner" on public.quotes
  for all to authenticated using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());


-- ── jobs ─────────────────────────────────────────────────────

create table if not exists public.jobs (
  id             bigint generated always as identity primary key,
  customer_id    bigint not null references public.customers(id) on delete cascade,
  quote_id       bigint references public.quotes(id) on delete set null,
  title          text not null,
  status         text not null default 'scheduled'
                   check (status in ('scheduled','in_progress','complete','cancelled')),
  scheduled_date date,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.jobs add column if not exists quote_id       bigint references public.quotes(id) on delete set null;
alter table public.jobs add column if not exists notes          text;
alter table public.jobs add column if not exists updated_at     timestamptz not null default now();

drop trigger if exists jobs_updated_at on public.jobs;
create trigger jobs_updated_at
  before update on public.jobs
  for each row execute function public.set_updated_at();

alter table public.jobs enable row level security;

drop policy if exists "jobs_owner"                      on public.jobs;
drop policy if exists "Authenticated users manage jobs" on public.jobs;

create policy "jobs_owner" on public.jobs
  for all to authenticated using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());


-- ── invoices ─────────────────────────────────────────────────

create table if not exists public.invoices (
  id              bigint generated always as identity primary key,
  customer_id     bigint not null references public.customers(id) on delete cascade,
  quote_id        bigint references public.quotes(id) on delete set null,
  invoice_number  text not null,
  title           text not null,
  line_items      jsonb not null default '[]',
  total           numeric(10,2) not null default 0,
  status          text not null default 'draft'
                    check (status in ('draft','sent','paid','overdue')),
  due_date        date,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.invoices add column if not exists notes      text;
alter table public.invoices add column if not exists updated_at timestamptz not null default now();

drop trigger if exists set_invoices_updated_at on public.invoices;
drop trigger if exists invoices_updated_at     on public.invoices;
create trigger invoices_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();

alter table public.invoices enable row level security;

drop policy if exists "admin_owner_invoices"               on public.invoices;
drop policy if exists "Authenticated users manage invoices" on public.invoices;

create policy "invoices_owner" on public.invoices
  for all to authenticated using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());


-- ── canvass_pins ─────────────────────────────────────────────

create table if not exists public.canvass_pins (
  id         bigint generated always as identity primary key,
  lat        double precision not null,
  lng        double precision not null,
  address    text,
  status     text not null default 'new'
               check (status in ('new','knocked','no_answer','interested','estimate_sent','booked','completed')),
  notes      text,
  rep_name   text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_canvass_pins_updated_at on public.canvass_pins;
create trigger canvass_pins_updated_at
  before update on public.canvass_pins
  for each row execute function public.set_updated_at();

alter table public.canvass_pins enable row level security;

drop policy if exists "admin_owner_canvass" on public.canvass_pins;

create policy "canvass_pins_owner" on public.canvass_pins
  for all to authenticated using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());


-- ── business_profiles ───────────────────────────────────────

create table if not exists public.business_profiles (
  id                     text primary key,
  owner_id               text,
  customer_id            text,
  business_name          text not null default '',
  industry               text not null default '',
  phone                  text not null default '',
  email                  text not null default '',
  service_area           text not null default '',
  city                   text not null default '',
  brand_color            text not null default '#0ea5e9',
  logo_url               text not null default '',
  services               text[] not null default '{}',
  business_description   text not null default '',
  preferred_style_pack   text not null default 'bold-contractor',
  desired_custom_modules text[] not null default '{}',
  website_goals          text not null default '',
  quote_form_needs       text not null default '',
  generated_content      jsonb,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

drop trigger if exists business_profiles_updated_at on public.business_profiles;
create trigger business_profiles_updated_at
  before update on public.business_profiles
  for each row execute function public.set_updated_at();


-- ── Grant yourself owner access ──────────────────────────────
-- After running this script, paste your auth UID below and run it once:
--
-- insert into public.user_roles (user_id, role)
-- values ('<your-auth-uid>', 'owner')
-- on conflict (user_id, role) do nothing;
--
-- Find your UID: Supabase dashboard → Authentication → Users → click your account
-- ============================================================
