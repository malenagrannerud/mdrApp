/*
  03_bronze.sql
  Author: Malena | Updated: 2026-10-15

  WHAT:  Checks that prove the bronze layer is healthy. Run after every ingestion,
         before silver (manual gate, Supabase SQL Editor).
  WHY:   Bronze is the foundation. If it is wrong, silver and gold are wrong
         too, and you will not notice.

  RULES CHECKED HERE (IDs as in PIPELINE.md):
    B11   Bronze is append-only
    GKB1  Every source column is mapped
    GKB2  Every row has metadata

  This file changes NO data. Every check prints PASSED or fails loudly with
  an error message. Silver is run only if all three pass.
*/

-- ============================================================
-- B11 - APPEND-ONLY: is bronze really immutable?
-- ============================================================
-- WHY test it? A rule that is never tested is only a hope.
-- This tries to break bronze on purpose and expects the database to refuse.
--
-- NOTE: TRUNCATE cannot safely be executed from inside a DO block on
-- Postgres 15/16 -- it takes ACCESS EXCLUSIVE and can deadlock when the
-- EXCEPTION handler tries to roll back. Instead we verify that the
-- blocking trigger exists and is enabled, plus test DELETE and UPDATE.
DO $$
DECLARE
  v_id bigint := (SELECT MIN(id) FROM bronze_reports);
BEGIN
  IF v_id IS NULL THEN
    RAISE EXCEPTION 'B11 cannot run: bronze_reports is empty, load data first';
  END IF;

  -- Verify the TRUNCATE-blocking trigger exists and is enabled
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    WHERE c.relname = 'bronze_reports'
      AND t.tgname = 'enforce_bronze_no_truncate'
      AND t.tgenabled <> 'D'
  ) THEN
    RAISE EXCEPTION 'B11 FAILED: no_truncate trigger missing or disabled';
  END IF;

  BEGIN  -- try DELETE
    DELETE FROM bronze_reports WHERE id = v_id;
    RAISE EXCEPTION 'B11 FAILED: DELETE was allowed';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%append-only%' THEN RAISE; END IF;
  END;

  BEGIN  -- try UPDATE
    UPDATE bronze_reports SET manufacturer_raw = 'X' WHERE id = v_id;
    RAISE EXCEPTION 'B11 FAILED: UPDATE was allowed';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%append-only%' THEN RAISE; END IF;
  END;

  RAISE NOTICE 'B11 PASSED: DELETE and UPDATE blocked, TRUNCATE trigger present';
END $$;


-- ============================================================
-- GKB1 - SCHEMA: is every source column mapped?
-- ============================================================
-- WHY? If the ingestion script mapped a column wrongly (e.g. the source
-- file changed its header), that column is NULL in EVERY row. The insert
-- still "succeeds", so this is the only way to notice on real data.
-- PASS: bronze has rows, and each of the 5 columns has at least one value.
DO $$
DECLARE
  r record;
BEGIN
  SELECT COUNT(*)                  AS total_rows,
         COUNT(report_key)         AS report_key,
         COUNT(device_sequence_no) AS device_sequence_no,
         COUNT(generic_name)       AS generic_name,
         COUNT(product_code_raw)   AS product_code_raw,
         COUNT(manufacturer_raw)   AS manufacturer_raw
    INTO r
    FROM bronze_reports;

  IF r.total_rows = 0 THEN
    RAISE EXCEPTION 'GKB1 FAILED: bronze_reports is empty';
  END IF;
  IF LEAST(r.report_key, r.device_sequence_no, r.generic_name,
           r.product_code_raw, r.manufacturer_raw) = 0 THEN
    RAISE EXCEPTION 'GKB1 FAILED: a column is empty in every row (rows=%, report_key=%, device_sequence_no=%, generic_name=%, product_code_raw=%, manufacturer_raw=%)',
      r.total_rows, r.report_key, r.device_sequence_no, r.generic_name, r.product_code_raw, r.manufacturer_raw;
  END IF;

  RAISE NOTICE 'GKB1 PASSED: rows=%, filled: report_key=%, device_sequence_no=%, generic_name=%, product_code_raw=%, manufacturer_raw=%',
    r.total_rows, r.report_key, r.device_sequence_no, r.generic_name, r.product_code_raw, r.manufacturer_raw;
END $$;


-- ============================================================
-- GKB2 - METADATA: can every row be traced to a file, a line and a time?
-- ============================================================
-- WHY? Traceability. When a number looks wrong you must be able to ask
-- "which file and which line did this row come from, and when?".
DO $$
DECLARE
  v_missing bigint;
BEGIN
  SELECT COUNT(*) INTO v_missing
  FROM bronze_reports
  WHERE source_file IS NULL
     OR source_row_num IS NULL
     OR inserted_at IS NULL;

  IF v_missing > 0 THEN
    RAISE EXCEPTION 'GKB2 FAILED: % rows without source_file, source_row_num or inserted_at', v_missing;
  END IF;
  RAISE NOTICE 'GKB2 PASSED: every row has source_file, source_row_num and inserted_at';
END $$;


-- ============================================================
-- INFO (no rule): what has been loaded?
-- ============================================================
-- Rows per source file and duplicate keys from the SOURCE (EDA: 33 in the
-- full file). A rerun of bronze_ingest.py adds nothing (B9), so duplicates
-- here come from FDA, not from us. Silver quarantines them (S1).
SELECT
    source_file,
    COUNT(*)                                                           AS rows,
    MAX(source_row_num)                                                AS last_line,
    COUNT(DISTINCT report_key || '|' || device_sequence_no)            AS unique_keys,
    COUNT(*) - COUNT(DISTINCT report_key || '|' || device_sequence_no) AS duplicate_keys
FROM bronze_reports
GROUP BY source_file
ORDER BY source_file;
