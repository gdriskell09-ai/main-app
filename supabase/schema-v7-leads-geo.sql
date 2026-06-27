-- ============================================================
-- Main App — schema v7
-- Adds city, lat, lng columns to the leads table
-- for contact form geographic data
-- Run in: supabase.com/dashboard/project/busedivfzapxafpgdoyb/sql
-- ============================================================

alter table public.leads
  add column if not exists city text,
  add column if not exists lat  double precision,
  add column if not exists lng  double precision;
