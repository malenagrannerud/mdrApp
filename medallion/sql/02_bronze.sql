-- ============================================================
-- 02_bronze.sql
-- Author: Malena
-- Created: 2026-08-02
-- Updated: 2026-09-21
-- Description: Inspect data from bronze_reports
--
-- input: raw data
-- output: bronze_data
-- ============================================================

-- VERIFY RULE 1 
SELECT
    COUNT(*) AS total_rows,
    COUNT(report_key)        AS report_key_filled,
    COUNT(device_event_key)  AS device_event_key_filled,
    COUNT(product_code_raw)  AS product_code_filled,
    COUNT(manufacturer_raw)  AS manufacturer_filled
FROM bronze_reports;

-- Expected: device_event_key and product_code_raw should be filled for all rows. manufacturer_raw may have a few NULLs (those are filtered in Silver).
-- Note: If a column was missing entirely in the source file, get_field() returns None for every row — so COUNT(column) would be 0. That is how you detect a missing column.

-- VERIFY RULE 2 
SELECT COUNT(*) AS total_rows FROM bronze_reports;

-- VERIFY RULE 3

SELECT COUNT(*) AS rows_without_metadata
FROM bronze_reports
WHERE source_file IS NULL
   OR inserted_at IS NULL;
-- Should return 0


-- VERIFY RULE 4
DELETE FROM bronze_reports WHERE id = 1; -- Should FAIL with "DELETE operations are not permitted"
UPDATE bronze_reports SET manufacturer_raw = 'HACKED' WHERE id = 1; -- Should FAIL with "UPDATE operations are not permitted"
INSERT INTO bronze_reports (report_key, device_event_key, product_code_raw, manufacturer_raw, source_file) -- Should SUCCEED
VALUES ('99999999', 'EVT-TEST', 'KWA', 'Test Manufacturer', 'test/verify_append_only.txt');



-- VERIFY RULE 5
SELECT COUNT(*) AS null_pks
FROM bronze_reports
WHERE device_event_key IS NULL;
-- Should return 0





