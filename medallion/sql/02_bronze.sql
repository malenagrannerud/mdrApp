/*
  02_bronze.sql
  Author: Malena
  Updated: 2026-09-30

  WHAT:  Read-only checks that prove the bronze layer is healthy.
  WHY:   Bronze is the foundation. If it is wrong, silver and gold are wrong
         too, and you will not notice. Run this after every ingestion.
         Each check maps to a rule (BR1-BR5) in PIPELINE.md.

  This file changes NO data. Every check either returns numbers to read,
  or fails loudly with an error message.
*/


-- ============================================================
-- BR1 - SCHEMA: are the important columns actually filled?
-- ============================================================
-- WHY? If the ingestion script mapped a column wrongly (e.g. the source
-- file changed its header), that column is NULL in EVERY row. The insert
-- still "succeeds", so this is the only way to notice.
-- HOW TO READ: COUNT(column) counts only non-NULL values.
-- A count of 0 means the column is completely missing.
SELECT
    COUNT(*)                 AS total_rows,
    COUNT(report_key)        AS report_key_filled,
    COUNT(device_event_key)  AS device_event_key_filled,
    COUNT(generic_name)      AS generic_name_filled,
    COUNT(product_code_raw)  AS product_code_filled,
    COUNT(manufacturer_raw)  AS manufacturer_filled
FROM bronze_reports;
-- Expected: device_event_key_filled and product_code_filled close to total_rows.
-- A few NULLs in generic_name / manufacturer are normal: silver handles them.


-- ============================================================
-- BR2 - VOLUME: did anything arrive at all?
-- ============================================================
-- WHY? An empty table means the ingestion silently did nothing
-- (wrong file path, empty file). Silver would then "succeed" on zero rows.
-- Fails loudly instead of showing a number you might not look at.
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM bronze_reports) = 0 THEN
    RAISE EXCEPTION 'BR2 FAILED: bronze_reports is empty';
  END IF;
  RAISE NOTICE 'BR2 PASSED: bronze_reports has rows';
END $$;
-- Expected in dev: at most DEV_SAMPLE_LIMIT (20000) rows per ingestion run.


-- ============================================================
-- BR3 - METADATA: can every row be traced to a file and a time?
-- ============================================================
-- WHY? Traceability. When a number looks wrong you must be able to ask
-- "which file did this row come from, and when?".
-- The columns are NOT NULL, so this should always be 0; the check exists
-- to catch someone loosening the table definition later.
SELECT COUNT(*) AS rows_without_metadata
FROM bronze_reports
WHERE source_file IS NULL
   OR inserted_at IS NULL;
-- Expected: 0


-- ============================================================
-- BR4 - IMMUTABILITY: is bronze really append-only?
-- ============================================================
-- WHY test it? A rule that is never tested is only a hope.
-- This tries to break bronze on purpose and expects the database to refuse.
--
-- WHY inside a DO block? Nothing is left behind. The old version inserted
-- a test row ('EVT-TEST') that could never be removed, because bronze
-- refuses deletes. It polluted real data and was counted in every report.
--
-- HOW IT WORKS: each try is wrapped in BEGIN ... EXCEPTION.
--   - If the database refuses (message contains "append-only"): good.
--   - If the action is allowed: we raise "FAILED". That error is caught by
--     the handler, does not match "append-only", and is re-raised to you.
--   - Any change would be rolled back by the failed try anyway.
DO $$
DECLARE
  v_id bigint := (SELECT MIN(id) FROM bronze_reports);
BEGIN
  -- WHY this guard? On an empty table the DELETE touches 0 rows, the
  -- trigger never fires, and the test would report a misleading "FAILED".
  IF v_id IS NULL THEN
    RAISE EXCEPTION 'BR4 cannot run: bronze_reports is empty, load data first';
  END IF;

  BEGIN  -- try DELETE
    DELETE FROM bronze_reports WHERE id = v_id;
    RAISE EXCEPTION 'BR4 FAILED: DELETE was allowed';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%append-only%' THEN RAISE; END IF;
  END;

  BEGIN  -- try UPDATE
    UPDATE bronze_reports SET manufacturer_raw = 'X' WHERE id = v_id;
    RAISE EXCEPTION 'BR4 FAILED: UPDATE was allowed';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%append-only%' THEN RAISE; END IF;
  END;

  -- WHY test TRUNCATE separately? It does not fire the DELETE trigger, so it
  -- needs its own protection (see 01_create_tables.sql). If it were allowed,
  -- the failed try below rolls the truncate back, so this test is safe.
  BEGIN  -- try TRUNCATE
    TRUNCATE TABLE bronze_reports;
    RAISE EXCEPTION 'BR4 FAILED: TRUNCATE was allowed';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%append-only%' THEN RAISE; END IF;
  END;

  RAISE NOTICE 'BR4 PASSED: DELETE, UPDATE and TRUNCATE are all blocked';
END $$;


-- ============================================================
-- BR5 - PRIMARY KEY: is every id present and unique?
-- ============================================================
-- WHY? silver_rejected.bronze_id points to bronze_reports.id. If ids
-- could be missing or repeated, that traceability link would be unreliable.
-- The database already enforces this, so it is a cheap safety net.
SELECT
    COUNT(*)                        AS total_rows,
    COUNT(*) - COUNT(id)            AS null_pks,
    COUNT(id) - COUNT(DISTINCT id)  AS duplicate_pks
FROM bronze_reports;
-- Expected: null_pks = 0 and duplicate_pks = 0


-- ============================================================
-- EXTRA - How much is already known to be bad? (information only)
-- ============================================================
-- WHY? Not a rule, but useful context BEFORE running silver: shows how
-- many rows silver will probably reject. device_event_key is duplicated
-- when the same file was ingested twice. Bronze is append-only, so a second
-- ingestion adds a second copy (silver removes it with rule SR2).
SELECT
    COUNT(*) - COUNT(DISTINCT device_event_key) AS extra_duplicate_rows,
    COUNT(DISTINCT source_file)                 AS source_files
FROM bronze_reports;
