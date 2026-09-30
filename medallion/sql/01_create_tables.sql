/*
  01_create_tables.sql
  Author: Malena
  Created: 2026-08-02
  Updated: 2026-09-30
  Creates all tables for the medallion architecture.

  WHY:   Data flows in one direction: bronze -> silver -> gold.
         Each layer has one job --> if a nr on the dashboard looks wrong: trace it back layer by layer to find the cause.
  SAFE:  Can be run many times. "IF NOT EXISTS" --> existing tables and their data are left
*/


-- ============================================================
-- BRONZE LAYER: raw data, exactly as it arrived
-- ============================================================
-- WHY a bronze layer?
--   If we clean data while loading it and later find a bug in the cleaning --> raw data is gone and we cannot redo it. 
--   By keeping a raw copy, a mistake in silver or gold can be fixed by re-running them.

CREATE TABLE IF NOT EXISTS bronze_reports (
  -- WHY a generated id? The source data has no reliable unique key
  -- (device_event_key can be missing or duplicated), so we need our own.
  -- It is also how silver_rejected points back to the exact raw row.
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  -- WHY are all source columns nullable text with no rules?
  -- Bronze must accept everything, even bad rows. Rejecting a row here
  -- would mean losing it silently. Validation happens in silver, where
  -- bad rows are saved with a reason instead of disappearing.
  report_key text,
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
-- Rule: bronze rows = silver rows + rejected rows.
-- If those numbers don't match, data was lost, and the pipeline stops.

CREATE TABLE IF NOT EXISTS silver_reports (
  -- WHY device_event_key as primary key? Silver has exactly one row per
  -- device event (rule SR2). The database now refuses duplicates even if
  -- the cleaning SQL has a bug.
  device_event_key text PRIMARY KEY,

  -- Not a primary key: several devices can belong to the same report.
  report_key text,

  -- WHY NOT NULL here but not in bronze? Silver is the "trusted" layer.
  -- Anything missing was either fixed (e.g. defaulted to 'UNKNOWN PRODUCT')
  -- or rejected, so gold never has to handle gaps.
  generic_name text NOT NULL,
  product_code text NOT NULL,

  -- Nullable on purpose: rows without a valid manufacturer never get here
  -- (they are rejected), so this is a safety net only.
  manufacturer_name text,

  -- WHY run_id? Links each row to the pipeline run that created it,
  -- so you can answer "which run produced this number?" (traceability).
  run_id uuid,

  _silver_updated_at timestamptz NOT NULL DEFAULT now()
);

-- WHY these indexes? Gold groups by product_code, generic_name and
-- manufacturer_name; report_key is used to join to other MAUDE files later.
CREATE INDEX IF NOT EXISTS idx_silver_report_key   ON silver_reports (report_key);
CREATE INDEX IF NOT EXISTS idx_silver_product_code ON silver_reports (product_code);
CREATE INDEX IF NOT EXISTS idx_silver_manufacturer ON silver_reports (manufacturer_name);
CREATE INDEX IF NOT EXISTS idx_silver_generic_name ON silver_reports (generic_name);

-- WHY keep rejected rows instead of deleting them?
--   1. Audit: you can prove why each row was excluded.
--   2. Debugging: if 30% of rows are rejected, you can see the reason.
--   3. Replay: fix the rule, re-run, and see what changes.
-- This table is never truncated: history accumulates, and run_id tells
-- you which rows belong to which run.
CREATE TABLE IF NOT EXISTS silver_rejected (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  run_id uuid,                     -- which run rejected this row

  -- WHY NOT NULL? Every rejected row must point back to its raw row
  -- in bronze_reports. This is the traceability chain.
  bronze_id bigint NOT NULL,

  -- Nullable copies of the values as they looked when rejected. A row may
  -- be rejected precisely because one of these was NULL.
  device_event_key text,
  report_key text,
  generic_name text,
  product_code text,
  manufacturer_name text,

  -- WHY NOT NULL? A rejection without a reason is useless.
  rejection_reason text NOT NULL,
  _rejected_at timestamptz NOT NULL DEFAULT now()
);

-- WHY? Two common questions: "why do we reject rows?" (group by reason)
-- and "what did the latest run reject?" (filter by run_id).
CREATE INDEX IF NOT EXISTS idx_silver_rejected_reason ON silver_rejected (rejection_reason);
CREATE INDEX IF NOT EXISTS idx_silver_rejected_run_id ON silver_rejected (run_id);

-- WHY these ALTERs? "CREATE TABLE IF NOT EXISTS" does nothing if the table
-- already exists, so a column added to the definition above would never
-- appear in an existing database. These lines add it when it is missing.
ALTER TABLE silver_reports  ADD COLUMN IF NOT EXISTS run_id uuid;
ALTER TABLE silver_rejected ADD COLUMN IF NOT EXISTS run_id uuid;


-- ============================================================
-- GOLD LAYER: pre-calculated answers for the dashboard
-- ============================================================
-- WHY pre-aggregate? The dashboard should read ~10 rows instead of
-- counting millions on every page load. It is fast, and cheap on the
-- free Supabase tier. All numbers can be recomputed from silver (GR1).

-- Question 1: which products are reported most?
-- WHY product_code as primary key? One row per product code (GR4).
-- generic_name is only a label for the chart. Codes can have several
-- names in the data, so the gold SQL picks the most common one.
CREATE TABLE IF NOT EXISTS product_stats (
  product_code text PRIMARY KEY,
  generic_name text NOT NULL,
  total_reports integer NOT NULL
);

-- Question 2: which manufacturers are reported most?
-- WHY name as primary key? One row per (normalized) manufacturer (GR4).
CREATE TABLE IF NOT EXISTS manufacturer_stats (
  name text PRIMARY KEY,
  total_reports integer NOT NULL
);
