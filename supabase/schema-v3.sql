-- ============================================================
-- Main App — schema v3 (run after schema-v2.sql)
-- Adds: city, lat, lng to leads for map view
-- ============================================================

alter table public.leads
  add column if not exists city text,
  add column if not exists lat  double precision,
  add column if not exists lng  double precision;
