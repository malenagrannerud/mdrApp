/*
  01_create_tables.sql
  Author: Malena
  Created: 2026-08-02 | Updated: 2026-09-30
  Creates all tables for the medallion architecture.

  WHY:   Data flows in one direction: bronze -> silver -> gold.
         Each layer has one job --> if a nr on the dashboard looks wrong: trace it back layer by layer to find the cause.
  SAFE:  Can be run many times. "IF NOT EXISTS" --> existing tables and their data are left





  RULES IMPLEMENTED IN THIS FILE:
  Bronze: B2 (nullable text), B3 (no constraints), B5 (metadata)
  Silver: S2 (composite PK), S3 (missing-value flags), S4 (junk flag),
          S5 (normalized manufacturer), S6 (canonical product code dim),
          S7 (manufacturer mapping table)
  Gold:   G1 (product_stats), G2 (manufacturer_stats),
          GR4 (unique PKs on both)

*/


-- ============================================================
-- BRONZE LAYER: raw data, exactly as it arrived
-- ============================================================

CREATE TABLE IF NOT EXISTS bronze_reports (
  -- Generated id: source data has no reliable unique key -- > need a new. 
  -- It is also how silver_rejected points back to the exact raw row.
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  -- WHY are all source columns nullable text with no rules?
  -- Bronze must accept everything, even bad rows. Rejecting a row here
  -- would mean losing it silently. Validation happens in silver, where
  -- bad rows are saved with a reason instead of disappearing.
  report_key text,
  device_sequence_no  text,  
  device_event_key text,
  generic_name text,
  product_code_raw text,           -- "_raw" = not cleaned yet
  manufacturer_raw text,

  -- WHY these two NOT NULL columns? Traceability. For every row we must be
  -- able to answer "when did this arrive, and from which file?" (rule BR3).
  inserted_at timestamptz NOT NULL DEFAULT now(),
  source_file text NOT NULL
);

-- WHY indexes? Silver groups and looks up rows by these columns.
-- Without an index, each lookup scans the whole table (millions of rows).
CREATE INDEX IF NOT EXISTS idx_bronze_report_key       ON bronze_reports (report_key);
CREATE INDEX IF NOT EXISTS idx_bronze_device_seq_no    ON bronze_reports (device_sequence_no);
CREATE INDEX IF NOT EXISTS idx_bronze_device_event_key ON bronze_reports (device_event_key);
CREATE INDEX IF NOT EXISTS idx_bronze_source_file      ON bronze_reports (source_file);

-- WHY a trigger that blocks changes (rule BR4)?
-- Bronze is the "source of truth". If anyone (or any buggy script) can edit
-- or delete rows, we can no longer prove what data we originally received.
-- Enforcing this in the database is stronger than "we promise not to":
-- it holds even if the application code has a bug.
CREATE OR REPLACE FUNCTION prevent_bronze_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'bronze_reports is append-only: % operations are not permitted', TG_OP;
END;
$$ LANGUAGE plpgsql;

-- Blocks UPDATE and DELETE, row by row.
-- DROP first, because CREATE TRIGGER has no IF NOT EXISTS; this makes the
-- file safe to re-run.
DROP TRIGGER IF EXISTS enforce_bronze_immutability ON bronze_reports;
CREATE TRIGGER enforce_bronze_immutability
    BEFORE UPDATE OR DELETE ON bronze_reports
    FOR EACH ROW
    EXECUTE FUNCTION prevent_bronze_mutation();



-- WHY a second trigger? TRUNCATE empties the whole table WITHOUT firing
-- row-level DELETE triggers, so the trigger above does not stop it.
-- This one closes that gap.
-- If bronze must be emptied during development
-- Step 1 - run: DROP TRIGGER enforce_bronze_no_truncate ON bronze_reports;
-- Step 2 - run: TRUNCATE TABLE bronze_reports;   
-- Step 3 - run 01_create_tables.sql 

DROP TRIGGER IF EXISTS enforce_bronze_no_truncate ON bronze_reports;
CREATE TRIGGER enforce_bronze_no_truncate
    BEFORE TRUNCATE ON bronze_reports
    FOR EACH STATEMENT
    EXECUTE FUNCTION prevent_bronze_mutation();


-- ============================================================
-- SILVER LAYER: cleaned data + quarantine
-- ============================================================
-- WHY two tables? Every bronze row must end up in exactly one of them:
--   valid   -> silver_reports
--   invalid -> silver_rejected (with a reason)
-- Rule (GR3): bronze rows = silver rows + rejected rows.
-- If those numbers don't match, data was lost, and the pipeline stops.

CREATE TABLE IF NOT EXISTS silver_reports (
  -- S2: Primary key is (report_key, device_sequence_no).
  -- EDA showed this pair is unique in 99.999 % of rows (33 duplicates of 2.6M).
  -- The database refuses duplicates even if the cleaning SQL has a bug.
  report_key          text NOT NULL,
  device_sequence_no  text NOT NULL,

  -- S3: NOT NULL here (Silver is the trusted layer). Anything missing was
  -- either defaulted to 'UNKNOWN PRODUCT' / 'UNKNOWN MANUFACTURER' or
  -- rejected. Gold never has to handle gaps.
  generic_name        text NOT NULL,
  product_code        text NOT NULL,

  -- S5: Parent-company name (Medtronic, Abbott, ...). Nullable because
  -- junk rows never reach Silver without a flag.
  manufacturer_name          text,       -- cleaned / display name
  manufacturer_normalized    text,       -- S5: parent company (grouping key in Gold)
  manufacturer_is_junk       boolean NOT NULL DEFAULT false,  -- S4: flag, do not delete

  -- S3: Missing-value flags (do not impute).
  has_missing_generic_name    boolean NOT NULL DEFAULT false,
  has_missing_manufacturer    boolean NOT NULL DEFAULT false,

  -- Traceability: which pipeline run produced this row.
  run_id uuid,
  _silver_updated_at timestamptz NOT NULL DEFAULT now(),

  -- S2: composite primary key.
  PRIMARY KEY (report_key, device_sequence_no)
);

-- WHY these indexes? Gold groups by product_code, manufacturer_normalized
-- and filters on manufacturer_is_junk; report_key joins to other MAUDE files.
CREATE INDEX IF NOT EXISTS idx_silver_product_code     ON silver_reports (product_code);
CREATE INDEX IF NOT EXISTS idx_silver_manufacturer     ON silver_reports (manufacturer_normalized);
CREATE INDEX IF NOT EXISTS idx_silver_manufacturer_junk ON silver_reports (manufacturer_is_junk);
CREATE INDEX IF NOT EXISTS idx_silver_generic_name     ON silver_reports (generic_name);

-- WHY keep rejected rows instead of deleting them?
--   1. Audit: you can prove why each row was excluded.
--   2. Debugging: if 30% of rows are rejected, you can see the reason.
--   3. Replay: fix the rule, re-run, and see what changes.
CREATE TABLE IF NOT EXISTS silver_rejected (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  run_id uuid,                       -- which run rejected this row

  -- Every rejected row must point back to its raw row in bronze_reports.
  bronze_id bigint NOT NULL,

  -- Same key columns as silver_reports (S2). Nullable because a row may be
  -- rejected precisely because one of these was NULL.
  report_key          text,
  device_sequence_no  text,
  generic_name        text,
  product_code        text,
  manufacturer_name   text,

  -- A rejection without a reason is useless.
  rejection_reason text NOT NULL,
  _rejected_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_silver_rejected_reason ON silver_rejected (rejection_reason);
CREATE INDEX IF NOT EXISTS idx_silver_rejected_run_id ON silver_rejected (run_id);


-- ------------------------------------------------------------
-- S6: Canonical product name
-- ------------------------------------------------------------
-- WHY a separate table? A product code can have several generic names
-- (1,402 of 2,206 codes in DEVICE2024). Gold needs exactly one label
-- per code. The table holds the most common name per code.
CREATE TABLE IF NOT EXISTS product_code_dim (
  product_code            text PRIMARY KEY,
  canonical_generic_name  text NOT NULL
);

-- ------------------------------------------------------------
-- S5: Explicit manufacturer mapping
-- ------------------------------------------------------------
-- WHY a mapping table and not regex?
--   Regex gives false positives ("ABBOTT MEDICAL OPTICS" is not
--   the same company as "ABBOTT LABORATORIES" for regulatory use).
--   A mapping table is auditable: every rename is a visible row.
CREATE TABLE IF NOT EXISTS manufacturer_mapping (
  raw_name        text PRIMARY KEY,
  normalized_name text NOT NULL
);


-- ------------------------------------------------------------
-- ALTERs for existing databases
-- ------------------------------------------------------------
-- WHY these ALTERs? "CREATE TABLE IF NOT EXISTS" does nothing if the table
-- already exists, so a column added to the definition above would never
-- appear in an existing database. These lines add it when it is missing.
ALTER TABLE silver_reports  ADD COLUMN IF NOT EXISTS run_id uuid;
ALTER TABLE silver_rejected ADD COLUMN IF NOT EXISTS run_id uuid;
ALTER TABLE silver_reports  ADD COLUMN IF NOT EXISTS manufacturer_normalized text;
ALTER TABLE silver_reports  ADD COLUMN IF NOT EXISTS manufacturer_is_junk boolean NOT NULL DEFAULT false;
ALTER TABLE silver_reports  ADD COLUMN IF NOT EXISTS has_missing_generic_name boolean NOT NULL DEFAULT false;
ALTER TABLE silver_reports  ADD COLUMN IF NOT EXISTS has_missing_manufacturer boolean NOT NULL DEFAULT false;


-- ============================================================
-- GOLD LAYER: pre-calculated answers for the dashboard
-- ============================================================
-- WHY pre-aggregate? The dashboard should read ~10 rows instead of
-- counting millions on every page load. It is fast, and cheap on the
-- free Supabase tier. All numbers can be recomputed from silver (GR1).

-- G1: Question 1 — which products are reported most?
-- WHY product_code as primary key? One row per product code (GR4).
-- generic_name is the canonical label from product_code_dim (S6).
CREATE TABLE IF NOT EXISTS product_stats (
  product_code text PRIMARY KEY,
  generic_name text NOT NULL,
  total_reports integer NOT NULL
);

-- G2: Question 2 — which manufacturers are reported most?
-- WHY name as primary key? One row per normalized manufacturer (GR4).
-- Only manufacturers with manufacturer_is_junk = FALSE reach this table (G6).
CREATE TABLE IF NOT EXISTS manufacturer_stats (
  name text PRIMARY KEY,
  total_reports integer NOT NULL
);


-- Grant service_role full access to all tables.
-- WHY: service_role bypasses RLS but still needs table-level grants.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bronze_reports       TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.silver_reports       TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.silver_rejected      TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_stats        TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.manufacturer_stats   TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_code_dim     TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.manufacturer_mapping TO service_role;