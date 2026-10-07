/*
  01_create_tables.sql
  Author: Malena | Created: 2026-08-02 | Updated: 2026-10-07
  Creates all tables for the medallion architecture.

  WHY:   Data flows in one direction: bronze -> silver -> gold.
         Each layer has one job --> if a nr on the dashboard looks wrong:
         trace it back layer by layer to find the cause.
  SAFE:  Can be run many times. "IF NOT EXISTS" --> existing tables and
         their data are left.

  RULES IMPLEMENTED IN THIS FILE:
    B5  Add metadata (source_file, inserted_at)
    S1  Primary key (report_key, device_sequence_no)
    S3  Missing values: NULL + flag, never impute
    S4  Flag junk manufacturers
    S5  Normalize manufacturers, deterministic (mapping + parent tables)
    S6  Canonical product name (product_code_dim)
    G1  product_stats table
    G2  manufacturer_stats table
    G7  pipeline_runs table
    G8  Least privilege (RLS + REVOKE + policies)
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

  source_file         text NOT NULL,
  source_row_num      bigint,                      -- B6: idempotent ingest
  inserted_at         timestamptz NOT NULL DEFAULT now(),

  UNIQUE (source_file, source_row_num)             -- B6: idempotent ingest
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


-- ============================================================
-- SILVER LAYER: cleaned data + quarantine
-- ============================================================
CREATE TABLE IF NOT EXISTS silver_reports (
  report_key          text NOT NULL,
  device_sequence_no  text NOT NULL,

  generic_name        text,                        -- RULE S3: NULL tillåtet
  product_code        text,                        -- RULE S3: NULL tillåtet

  manufacturer_name       text,
  manufacturer_normalized text,
  manufacturer_is_junk    boolean NOT NULL DEFAULT false,   -- RULE S4

  has_missing_generic_name boolean NOT NULL DEFAULT false,  -- RULE S3
  has_missing_manufacturer boolean NOT NULL DEFAULT false,  -- RULE S3

  run_id uuid,
  _silver_updated_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (report_key, device_sequence_no)     -- RULE S1
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
-- RULE S6: Canonical product name
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_code_dim (
  product_code           text PRIMARY KEY,
  canonical_generic_name text NOT NULL
);

-- ------------------------------------------------------------
-- RULE S5: Explicit manufacturer mapping
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS manufacturer_mapping (
  raw_name        text PRIMARY KEY,
  normalized_name text NOT NULL
);

-- ------------------------------------------------------------
-- RULE S5: Parent-company keyword table
-- ------------------------------------------------------------
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
ALTER TABLE bronze_reports  ADD COLUMN IF NOT EXISTS source_row_num bigint;

-- RULE S3
ALTER TABLE silver_reports ALTER COLUMN generic_name DROP NOT NULL;
ALTER TABLE silver_reports ALTER COLUMN product_code DROP NOT NULL;


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
-- RULE G7: Pipeline run log
-- ============================================================
CREATE TABLE IF NOT EXISTS pipeline_runs (
  run_id                uuid PRIMARY KEY,
  started_at            timestamptz NOT NULL,
  finished_at           timestamptz NOT NULL DEFAULT now(),
  status                text NOT NULL CHECK (status IN ('success', 'failed')),
  rows_bronze           bigint,
  rows_silver           bigint,
  rows_rejected         bigint,
  products_in_gold      bigint,
  manufacturers_in_gold bigint,
  error_message         text
);

CREATE INDEX IF NOT EXISTS idx_pipeline_runs_started_at
    ON pipeline_runs (started_at DESC);


-- ============================================================
-- RULE G8: Least privilege
-- ============================================================
ALTER TABLE bronze_reports        ENABLE ROW LEVEL SECURITY;
ALTER TABLE silver_reports        ENABLE ROW LEVEL SECURITY;
ALTER TABLE silver_rejected       ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_stats         ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_stats    ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_code_dim      ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_mapping  ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_parent   ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_runs         ENABLE ROW LEVEL SECURITY;


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
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pipeline_runs        TO service_role;

-- anon får bara SELECT på Gold (via policy, eftersom RLS är på)
GRANT SELECT ON public.product_stats        TO anon;
GRANT SELECT ON public.manufacturer_stats   TO anon;
GRANT SELECT ON public.product_code_dim     TO anon;
GRANT SELECT ON public.pipeline_runs        TO anon;

-- RULE G8: anon får INTE läsa Bronze eller Silver
REVOKE ALL ON bronze_reports, silver_reports, silver_rejected,
              manufacturer_mapping, manufacturer_parent
       FROM anon;

-- RULE G8: SELECT-policy för anon på Gold-tabeller
DROP POLICY IF EXISTS anon_read_product_stats      ON product_stats;
DROP POLICY IF EXISTS anon_read_manufacturer_stats ON manufacturer_stats;
DROP POLICY IF EXISTS anon_read_product_code_dim   ON product_code_dim;
DROP POLICY IF EXISTS anon_read_pipeline_runs      ON pipeline_runs;

CREATE POLICY anon_read_product_stats      ON product_stats
    FOR SELECT TO anon USING (TRUE);
CREATE POLICY anon_read_manufacturer_stats ON manufacturer_stats
    FOR SELECT TO anon USING (TRUE);
CREATE POLICY anon_read_product_code_dim   ON product_code_dim
    FOR SELECT TO anon USING (TRUE);
CREATE POLICY anon_read_pipeline_runs      ON pipeline_runs
    FOR SELECT TO anon USING (TRUE);