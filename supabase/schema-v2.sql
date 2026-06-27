-- ============================================================
-- Main App — schema v2 (run after schema.sql)
-- Adds: customers, quotes, jobs
-- ============================================================

-- 1. Customers (converted leads → full customer records)
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

create trigger customers_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

-- 2. Quotes
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

create trigger quotes_updated_at
  before update on public.quotes
  for each row execute function public.set_updated_at();

-- 3. Jobs
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

create trigger jobs_updated_at
  before update on public.jobs
  for each row execute function public.set_updated_at();

-- 4. RLS

alter table public.customers enable row level security;
alter table public.quotes    enable row level security;
alter table public.jobs      enable row level security;

-- Only owner/admin can access customers, quotes, jobs
create policy "customers_owner" on public.customers
  for all to authenticated using (public.is_admin_or_owner());

create policy "quotes_owner" on public.quotes
  for all to authenticated using (public.is_admin_or_owner());

create policy "jobs_owner" on public.jobs
  for all to authenticated using (public.is_admin_or_owner());

-- ============================================================
-- After running: grant yourself access to these tables
-- (the is_admin_or_owner() check will handle it automatically
-- once your user_roles row is set up)
-- ============================================================
