-- ============================================================
-- Main App — database schema
-- Run this in your Supabase SQL Editor once before first use.
-- ============================================================

-- 1. Leads (contact form submissions)
create table if not exists public.leads (
  id         bigint generated always as identity primary key,
  name       text not null,
  business   text,
  type       text,
  need       text,
  email      text not null,
  phone      text,
  message    text,
  status     text not null default 'new'
               check (status in ('new','contacted','qualified','converted','not_interested')),
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. User roles — controls who is admin/owner on the platform
create table if not exists public.user_roles (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null check (role in ('admin','owner','viewer')),
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

-- 3. Helper: is current user admin or owner?
create or replace function public.is_admin_or_owner()
returns boolean
language sql security definer stable
set search_path = public as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
      and role in ('admin','owner')
  );
$$;

revoke all on function public.is_admin_or_owner() from public;
grant execute on function public.is_admin_or_owner() to anon, authenticated;

-- 4. updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- 5. RLS — leads
alter table public.leads enable row level security;

-- Anon/public can insert (the contact form)
create policy "leads_public_insert" on public.leads
  for insert to anon, authenticated
  with check (true);

-- Only admin/owner can read, update, delete
create policy "leads_owner_select" on public.leads
  for select to authenticated
  using (public.is_admin_or_owner());

create policy "leads_owner_update" on public.leads
  for update to authenticated
  using (public.is_admin_or_owner());

create policy "leads_owner_delete" on public.leads
  for delete to authenticated
  using (public.is_admin_or_owner());

-- 6. RLS — user_roles
alter table public.user_roles enable row level security;

create policy "user_roles_owner_select" on public.user_roles
  for select to authenticated
  using (public.is_admin_or_owner());

grant select on public.user_roles to authenticated;

-- ============================================================
-- After running this schema:
-- 1. Create your owner account via Supabase Auth (or /admin/login).
-- 2. In the SQL Editor, grant yourself owner access:
--    insert into public.user_roles (user_id, role)
--    values ('<your-auth-uid-here>', 'owner');
-- ============================================================
