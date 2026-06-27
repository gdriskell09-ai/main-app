-- ============================================================
-- Main App — schema v4 (run after schema-v3.sql)
-- Adds: invoices table
-- ============================================================

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

alter table public.invoices enable row level security;

create policy "admin_owner_invoices" on public.invoices
  using (is_admin_or_owner());

create trigger set_invoices_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();
