/*
  01_create_tables.sql
  Author: Malena
  Created: 2026-08-02 | Updated: 2026-10-01
  Creates all tables for the medallion architecture.

  WHY:   Data flows in one direction: bronze -> silver -> gold.
         Each layer has one job --> if a nr on the dashboard looks wrong:
         trace it back layer by layer to find the cause.
  SAFE:  Can be run many times. "IF NOT EXISTS" --> existing tables and
         their data are left.

  RULES IMPLEMENTED IN THIS FILE:
  Bronze: B2 (nullable text), B3 (append-only triggers), B5 (metadata)
  Silver: S2 (composite PK), S3 (missing-value flags), S4 (junk flag),
          S5 (normalized manufacturer + mapping table + parent table),
          S6 (canonical product code dim)
  Gold:   tables for G1 (product_stats), G2 (manufacturer_stats),
          GR4 (unique PKs on both)
*/


-- ============================================================
-- BRONZE LAYER: raw data, exactly as it arrived
-- ============================================================
CREATE TABLE IF NOT EXISTS bronze_reports (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  report_key          text,
  device_sequence_no  text,
  generic_name        text,
  product_code_raw    text,
  manufacturer_raw    text,

  inserted_at timestamptz NOT NULL DEFAULT now(),
  source_file text NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bronze_report_key    ON bronze_reports (report_key);
CREATE INDEX IF NOT EXISTS idx_bronze_device_seq_no ON bronze_reports (device_sequence_no);
CREATE INDEX IF NOT EXISTS idx_bronze_source_file   ON bronze_reports (source_file);

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

DROP TRIGGER IF EXISTS enforce_bronze_no_truncate ON bronze_reports;
CREATE TRIGGER enforce_bronze_no_truncate
    BEFORE TRUNCATE ON bronze_reports
    FOR EACH STATEMENT
    EXECUTE FUNCTION prevent_bronze_mutation();

-- Drop obsolete column from earlier schema versions
ALTER TABLE bronze_reports DROP COLUMN IF EXISTS device_event_key;
DROP INDEX IF EXISTS idx_bronze_device_event_key;


-- ============================================================
-- SILVER LAYER: cleaned data + quarantine
-- ============================================================
CREATE TABLE IF NOT EXISTS silver_reports (
  report_key          text NOT NULL,
  device_sequence_no  text NOT NULL,

  generic_name        text NOT NULL,
  product_code        text NOT NULL,

  manufacturer_name       text,
  manufacturer_normalized text,
  manufacturer_is_junk    boolean NOT NULL DEFAULT false,

  has_missing_generic_name boolean NOT NULL DEFAULT false,
  has_missing_manufacturer boolean NOT NULL DEFAULT false,

  run_id uuid,
  _silver_updated_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (report_key, device_sequence_no)
);

CREATE INDEX IF NOT EXISTS idx_silver_product_code      ON silver_reports (product_code);
CREATE INDEX IF NOT EXISTS idx_silver_manufacturer      ON silver_reports (manufacturer_normalized);
CREATE INDEX IF NOT EXISTS idx_silver_manufacturer_junk ON silver_reports (manufacturer_is_junk);
CREATE INDEX IF NOT EXISTS idx_silver_generic_name      ON silver_reports (generic_name);

CREATE TABLE IF NOT EXISTS silver_rejected (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  run_id uuid,

  bronze_id bigint NOT NULL,

  report_key          text,
  device_sequence_no  text,
  generic_name        text,
  product_code        text,
  manufacturer_name   text,

  rejection_reason text NOT NULL,
  _rejected_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_silver_rejected_reason ON silver_rejected (rejection_reason);
CREATE INDEX IF NOT EXISTS idx_silver_rejected_run_id ON silver_rejected (run_id);


-- ------------------------------------------------------------
-- S6: Canonical product name
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_code_dim (
  product_code           text PRIMARY KEY,
  canonical_generic_name text NOT NULL
);

-- ------------------------------------------------------------
-- S5: Explicit manufacturer mapping (raw_name -> normalized_name)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS manufacturer_mapping (
  raw_name        text PRIMARY KEY,
  normalized_name text NOT NULL
);

-- ------------------------------------------------------------
-- S5: Parent-company keyword table (drives auto-generation of mapping)
-- ------------------------------------------------------------
-- WHY a second table? manufacturer_mapping holds the final, one-to-one
-- rename (raw -> normalized). manufacturer_parent holds the *rules* used
-- to auto-build that mapping, so the mapping can be regenerated whenever
-- new raw names appear in bronze. Rules survive; results are disposable.
CREATE TABLE IF NOT EXISTS manufacturer_parent (
  parent_name text PRIMARY KEY,
  keywords    text[]
);


-- ------------------------------------------------------------
-- ALTERs for existing databases
-- ------------------------------------------------------------
ALTER TABLE silver_reports  ADD COLUMN IF NOT EXISTS run_id uuid;
ALTER TABLE silver_rejected ADD COLUMN IF NOT EXISTS run_id uuid;
ALTER TABLE silver_reports  ADD COLUMN IF NOT EXISTS manufacturer_normalized text;
ALTER TABLE silver_reports  ADD COLUMN IF NOT EXISTS manufacturer_is_junk boolean NOT NULL DEFAULT false;
ALTER TABLE silver_reports  ADD COLUMN IF NOT EXISTS has_missing_generic_name boolean NOT NULL DEFAULT false;
ALTER TABLE silver_reports  ADD COLUMN IF NOT EXISTS has_missing_manufacturer boolean NOT NULL DEFAULT false;


-- ============================================================
-- GOLD LAYER: pre-calculated answers for the dashboard
-- ============================================================
CREATE TABLE IF NOT EXISTS product_stats (
  product_code text PRIMARY KEY,
  generic_name text NOT NULL,
  total_reports integer NOT NULL
);

CREATE TABLE IF NOT EXISTS manufacturer_stats (
  name text PRIMARY KEY,
  total_reports integer NOT NULL
);


-- ============================================================
-- Grants
-- ============================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bronze_reports       TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.silver_reports       TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.silver_rejected      TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_stats        TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.manufacturer_stats   TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_code_dim     TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.manufacturer_mapping TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.manufacturer_parent  TO service_role;

-- anon reads only what the dashboard needs
GRANT SELECT ON public.product_stats        TO anon;
GRANT SELECT ON public.manufacturer_stats   TO anon;
GRANT SELECT ON public.product_code_dim     TO anon;