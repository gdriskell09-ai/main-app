-- CRM tables for Main App admin dashboard
-- Run this in the Supabase SQL editor for project busedivfzapxafpgdoyb

-- Customers
create table if not exists public.customers (
  id            bigint primary key generated always as identity,
  name          text not null,
  email         text,
  phone         text,
  business      text,
  address       text,
  notes         text,
  lead_id       bigint references public.leads(id) on delete set null,
  created_at    timestamptz not null default now()
);
alter table public.customers enable row level security;
create policy "Authenticated users manage customers"
  on public.customers for all
  to authenticated using (true) with check (true);

-- Jobs
create table if not exists public.jobs (
  id              bigint primary key generated always as identity,
  customer_id     bigint not null references public.customers(id) on delete cascade,
  quote_id        bigint,
  title           text not null,
  status          text not null default 'scheduled'
                  check (status in ('scheduled','in_progress','complete','cancelled')),
  scheduled_date  date,
  notes           text,
  created_at      timestamptz not null default now()
);
alter table public.jobs enable row level security;
create policy "Authenticated users manage jobs"
  on public.jobs for all
  to authenticated using (true) with check (true);

-- Quotes
create table if not exists public.quotes (
  id          bigint primary key generated always as identity,
  customer_id bigint not null references public.customers(id) on delete cascade,
  title       text not null,
  line_items  jsonb not null default '[]',
  total       numeric(10,2) not null default 0,
  status      text not null default 'draft'
              check (status in ('draft','sent','accepted','declined')),
  notes       text,
  created_at  timestamptz not null default now()
);
alter table public.quotes enable row level security;
create policy "Authenticated users manage quotes"
  on public.quotes for all
  to authenticated using (true) with check (true);

-- Invoices
create table if not exists public.invoices (
  id              bigint primary key generated always as identity,
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
  created_at      timestamptz not null default now()
);
alter table public.invoices enable row level security;
create policy "Authenticated users manage invoices"
  on public.invoices for all
  to authenticated using (true) with check (true);
