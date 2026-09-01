-- =================================================================================
-- 00_create_tables.sql (Supabase SQL Editor). 
--
-- MÅL: Skapa tabeller för arkitekturen. 
-- Output: bronze_reports, silver_reports, product_stats, manufacturer_stats. 
-- =================================================================================

-- ----------------------------------------------------------------------------------
-- Skapar bronze_reports för rå, ofiltrerad, oföränderlig, append-only data i sekventiell ordning
-- ----------------------------------------------------------------------------------
create table if not exists bronze_reports (
  id bigint generated always as identity primary key, -- välj bigint 
  report_key text,
  product_code_raw text,
  brand_name_raw text,
  generic_name_raw text,
  manufacturer_raw text,
  _inserted_at timestamptz not null default now(),
  _source_file text not null
);
create index if not exists idx_bronze_report_key on bronze_reports (report_key);
create index if not exists idx_bronze_source_file on bronze_reports (_source_file);

-- Gör bronze_reports oföränderlig och append-only på DB-nivå.
-- OR REPLACE gör att detta går att köra om utan att krascha.
CREATE OR REPLACE RULE protect_bronze_updates AS ON UPDATE TO bronze_reports DO INSTEAD NOTHING;
CREATE OR REPLACE RULE protect_bronze_deletes AS ON DELETE TO bronze_reports DO INSTEAD NOTHING;


-- ---------------------------------------------------------------------------------
-- Skapar silver_reports för rensad, typad, deduplicerad, normaliserad.
-- En rad per unikt report_key. Tillverkarnamn normaliserade
-- och sammanslagna. Ogiltiga/skräpvärden omvandlade till NULL.
-- ---------------------------------------------------------------------------------
create table if not exists silver_reports (
  report_key text primary key,
  product_code text not null,
  brand_name text,
  generic_name text,
  manufacturer_name text,
  _silver_updated_at timestamptz not null default now()
);
create index if not exists idx_silver_product_code on silver_reports (product_code);
create index if not exists idx_silver_manufacturer on silver_reports (manufacturer_name);


-- -----------------------------------------------------------------------------------
-- Skapar product_stats & manufacturer_stats för aggregerad data som dashboarden läser.
-- Fylls av 03_gold_tables.sql (TRUNCATE + INSERT vid varje körning).
-- -----------------------------------------------------------------------------------
create table if not exists product_stats (
  product_code text primary key,
  total_reports integer not null,
  brand_name text,
  generic_name text,
  manufacturer_name text
);
create table if not exists manufacturer_stats (
  name text primary key,
  count integer not null
);