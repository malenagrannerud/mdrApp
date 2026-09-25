-- ============================================================
-- 02_bronze.sql
-- Author: Malena
-- Created: 2026-08-02
-- Updated: 2026-09-25
-- Description: Inspect data and verify BR rules from bronze_reports
--
-- input: raw data
-- output: bronze_data verification
-- ============================================================

-- VERIFY BR1 – Schema: Critical columns must exist
SELECT
    COUNT(*) AS total_rows,
    COUNT(report_key)        AS report_key_filled,
    COUNT(device_event_key)  AS device_event_key_filled,
    COUNT(generic_name)      AS generic_name_filled,   
    COUNT(product_code_raw)  AS product_code_filled,
    COUNT(manufacturer_raw)  AS manufacturer_filled
FROM bronze_reports;

-- Expected: device_event_key and product_code_raw should be filled for all rows. 
-- generic_name and manufacturer_raw may have a few NULLs (handled/filtered in Silver).
-- Note: If a column was missing entirely in the source file, get_field() returns None for every row — so COUNT(column) would be 0. That is how you detect a missing column.


-- VERIFY BR2 – Volume: The source file must contain at least one data row
SELECT COUNT(*) AS total_rows FROM bronze_reports;
-- Expected: Should be greater than 0 (specifically up to your DEV_SAMPLE_LIMIT of 20000 in dev)


-- VERIFY BR3 – Metadata: Every row must have source_file and inserted_at
SELECT COUNT(*) AS rows_without_metadata
FROM bronze_reports
WHERE source_file IS NULL
   OR inserted_at IS NULL;
-- Expected: Should return 0


-- VERIFY BR4 – Immutability: Append-only. No UPDATE or DELETE. Enforced by DB trigger.
DELETE FROM bronze_reports WHERE id = 1; -- Should FAIL with "DELETE operations are not permitted"
UPDATE bronze_reports SET manufacturer_raw = 'HACKED' WHERE id = 1; -- Should FAIL with "UPDATE operations are not permitted"
INSERT INTO bronze_reports (report_key, device_event_key, generic_name, product_code_raw, manufacturer_raw, source_file) -- Should SUCCEED
VALUES ('99999999', 'EVT-TEST', 'TESTING DEVICE', 'KWA', 'Test Manufacturer', 'test/verify_append_only.txt');


-- VERIFY BR5 - Unique/not_null PK - id
SELECT 
    COUNT(*) AS total_rows,
    COUNT(id) AS total_pks,
    COUNT(*) - COUNT(id) AS null_pks,
    COUNT(id) - COUNT(DISTINCT id) AS duplicate_pks
FROM bronze_reports;
-- Expected: null_pks must be 0, duplicate_pks must be 0.




