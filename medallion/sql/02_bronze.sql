/*
  02_bronze.sql
  Author: Malena
  Updated: 2026-10-01

  WHAT:  Read-only checks that prove the bronze layer is healthy.
  WHY:   Bronze is the foundation. If it is wrong, silver and gold are wrong
         too, and you will not notice. Run this after every ingestion.
         Each check maps to a rule (B1–B5) in PIPELINE.md.

  This file changes NO data. Every check either returns numbers to read,
  or fails loudly with an error message.
*/


-- ============================================================
-- B1 - SCHEMA: are the important columns actually filled?
-- ============================================================
-- WHY? If the ingestion script mapped a column wrongly (e.g. the source
-- file changed its header), that column is NULL in EVERY row. The insert
-- still "succeeds", so this is the only way to notice.
-- HOW TO READ: COUNT(column) counts only non-NULL values.
-- A count of 0 means the column is completely missing.

SELECT
    COUNT(*)                 AS total_rows,
    COUNT(report_key)        AS report_key_filled,
    COUNT(device_sequence_no) AS device_sequence_no_filled,
    COUNT(device_event_key)  AS device_event_key_filled,
    COUNT(generic_name)      AS generic_name_filled,
    COUNT(product_code_raw)  AS product_code_filled,
    COUNT(manufacturer_raw)  AS manufacturer_filled
FROM bronze_reports;
-- Expected: report_key, device_sequence_no, product_code_raw near total_rows.
-- device_event_key may be lower: it is often blank in the source.
-- A few NULLs in generic_name / manufacturer are normal: silver handles them.


-- ============================================================
-- B2 - VOLUME: did anything arrive at all?
-- ============================================================
-- WHY? An empty table means the ingestion silently did nothing
-- (wrong file path, empty file). Silver would then "succeed" on zero rows.
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM bronze_reports) = 0 THEN
    RAISE EXCEPTION 'B2 FAILED: bronze_reports is empty';
  END IF;
  RAISE NOTICE 'B2 PASSED: bronze_reports has rows';
END $$;
-- Expected in dev: 20,000 rows (DEV_SAMPLE_LIMIT).


-- ============================================================
-- B3 - METADATA: can every row be traced to a file and a time?
-- ============================================================
-- WHY? Traceability. When a number looks wrong you must be able to ask
-- "which file did this row come from, and when?".
SELECT COUNT(*) AS rows_without_metadata
FROM bronze_reports
WHERE source_file IS NULL
   OR inserted_at IS NULL;
-- Expected: 0


-- ============================================================
-- B4 - IMMUTABILITY: is bronze really append-only?
-- ============================================================
-- WHY test it? A rule that is never tested is only a hope.
-- This tries to break bronze on purpose and expects the database to refuse.
DO $$
DECLARE
  v_id bigint := (SELECT MIN(id) FROM bronze_reports);
BEGIN
  IF v_id IS NULL THEN
    RAISE EXCEPTION 'B4 cannot run: bronze_reports is empty, load data first';
  END IF;

  BEGIN  -- try DELETE
    DELETE FROM bronze_reports WHERE id = v_id;
    RAISE EXCEPTION 'B4 FAILED: DELETE was allowed';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%append-only%' THEN RAISE; END IF;
  END;

  BEGIN  -- try UPDATE
    UPDATE bronze_reports SET manufacturer_raw = 'X' WHERE id = v_id;
    RAISE EXCEPTION 'B4 FAILED: UPDATE was allowed';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%append-only%' THEN RAISE; END IF;
  END;

  BEGIN  -- try TRUNCATE
    TRUNCATE TABLE bronze_reports;
    RAISE EXCEPTION 'B4 FAILED: TRUNCATE was allowed';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%append-only%' THEN RAISE; END IF;
  END;

  RAISE NOTICE 'B4 PASSED: DELETE, UPDATE and TRUNCATE are all blocked';
END $$;


-- ============================================================
-- B5 - PRIMARY KEY: is every id present and unique?
-- ============================================================
-- WHY? silver_rejected.bronze_id points to bronze_reports.id. If ids
-- could be missing or repeated, that traceability link would be unreliable.
SELECT
    COUNT(*)                        AS total_rows,
    COUNT(*) - COUNT(id)            AS null_pks,
    COUNT(id) - COUNT(DISTINCT id)  AS duplicate_pks
FROM bronze_reports;
-- Expected: null_pks = 0 and duplicate_pks = 0


-- ============================================================
-- EXTRA - Which file(s) have been ingested, and how often?
-- ============================================================
-- WHY? Bronze is append-only. A second run of bronze_ingest.py adds a
-- second copy of the same 20,000 rows. This shows whether that has happened.
-- Silver will deduplicate later (rule S1 + S2), but you should know about it.
SELECT
    source_file,
    COUNT(*)                                AS rows,
    COUNT(DISTINCT report_key || '|' || device_sequence_no) AS unique_keys,
    COUNT(*) - COUNT(DISTINCT report_key || '|' || device_sequence_no) AS duplicate_keys
FROM bronze_reports
GROUP BY source_file
ORDER BY source_file;
-- Expected (clean run): 1 row, duplicate_keys = 0
-- Expected (double run): 1 row, duplicate_keys = 20000