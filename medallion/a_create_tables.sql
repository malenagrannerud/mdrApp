-- ============================================================
-- a_create_tables.sql (Supabase SQL Editor)
-- Author: Malena 
-- Created: 2026-08-02
-- Description: Creates tables & constraint (schemas) for the medallion architecture 
-- ============================================================


-- ----------------------------------------------------------------------------------
-- BRONZE LAYER
-- Description: Creates bronze_reports 
-- ----------------------------------------------------------------------------------

create table if not exists bronze_reports (
  id bigint generated always as identity primary key, -- choose bigint 
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



-- prevent_bronze_mutation()
-- Makes bronze_reports immutable and append-only at DB level.
-- Any UPDATE or DELETE attempt fails immediately and returns an
-- explicit error to the caller — visible at the point of failure,
-- and captured in Postgres/Supabase's own server logs by default.
CREATE OR REPLACE FUNCTION prevent_bronze_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'bronze_reports is append-only: % operations are not permitted', TG_OP;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_bronze_immutability ON bronze_reports;
CREATE TRIGGER enforce_bronze_immutability
    BEFORE UPDATE OR DELETE ON bronze_reports
    FOR EACH ROW
    EXECUTE FUNCTION prevent_bronze_mutation();


-- TESTA SÅ ATT prevent_bronze_mutation() fungerar som avsett.
-- Detta ska nu ge ett fel istället för att tyst göra ingenting
-- DELETE FROM bronze_reports WHERE id = 1;
-- ERROR: bronze_reports is append-only: DELETE operations are not permitted





-- ----------------------------------------------------------------------------------
-- SILVER LAYER
-- Description: Creates silver_reports and silver_rejected 
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

-- SILVER_REJECTED: rows from Bronze that failed Silver's validation rules.
-- Kept for audit purposes — lets you inspect why rows were dropped
create table if not exists silver_rejected (
  id bigint generated always as identity primary key,
  bronze_id bigint not null,
  report_key text,
  rejection_reason text not null,
  _rejected_at timestamptz not null default now()
);
create index if not exists idx_silver_rejected_reason on silver_rejected (rejection_reason);

-- -----------------------------------------------------------------------------------
-- GOLD LAYER
-- Description: Creates product_stats & manufacturer_stats för aggregerad data som dashboarden läser.
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