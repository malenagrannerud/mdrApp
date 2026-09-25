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

-- VERIFY RECORDS
SELECT COUNT(*) AS total_rows
FROM bronze_reports;
-- result
-- | total_rows |
-- | ---------- |
-- | 20000      |


-- VERIFY UPLOAD
SELECT
    inserted_at,
    source_file,
    COUNT(*) AS rows_in_batch
FROM bronze_reports
GROUP BY inserted_at, source_file
ORDER BY inserted_at;

-- result 
--
-- | inserted_at                   | source_file                   | rows_in_batch |
-- | ----------------------------- | ----------------------------- | ------------- |
-- | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt | 1000          |
-- | 2026-09-17 13:14:19.193743+00 | medallion/data/DEVICE2024.txt | 1000          |
-- | 2026-09-17 13:14:19.371838+00 | medallion/data/DEVICE2024.txt | 1000          |
-- | 2026-09-17 13:14:19.584989+00 | medallion/data/DEVICE2024.txt | 1000          |
-- | 2026-09-17 13:14:19.812011+00 | medallion/data/DEVICE2024.txt | 1000          |
-- | 2026-09-17 13:14:20.025503+00 | medallion/data/DEVICE2024.txt | 1000          |
-- | 2026-09-17 13:14:20.235161+00 | medallion/data/DEVICE2024.txt | 1000          |
-- | 2026-09-17 13:14:20.419995+00 | medallion/data/DEVICE2024.txt | 1000          |
-- | 2026-09-17 13:14:20.62001+00  | medallion/data/DEVICE2024.txt | 1000          |
-- | 2026-09-17 13:14:20.796015+00 | medallion/data/DEVICE2024.txt | 1000          |
-- | 2026-09-17 13:14:20.962771+00 | medallion/data/DEVICE2024.txt | 1000          |
-- | 2026-09-17 13:14:21.182729+00 | medallion/data/DEVICE2024.txt | 1000          |
-- | 2026-09-17 13:14:21.495067+00 | medallion/data/DEVICE2024.txt | 1000          |
-- | 2026-09-17 13:14:21.722142+00 | medallion/data/DEVICE2024.txt | 1000          |
-- | 2026-09-17 13:14:21.912173+00 | medallion/data/DEVICE2024.txt | 1000          |
-- | 2026-09-17 13:14:22.132372+00 | medallion/data/DEVICE2024.txt | 1000          |
-- | 2026-09-17 13:14:22.328501+00 | medallion/data/DEVICE2024.txt | 1000          |
-- | 2026-09-17 13:14:22.51213+00  | medallion/data/DEVICE2024.txt | 1000          |
-- | 2026-09-17 13:14:22.697599+00 | medallion/data/DEVICE2024.txt | 1000          |
-- | 2026-09-17 13:14:22.897261+00 | medallion/data/DEVICE2024.txt | 1000          |
--
-- 20 batches of 1,000 rows each = 20,000 rows total
-- All from the same file: medallion/data/DEVICE2024.txt
-- All within ~4 seconds: 13:14:18 → 13:14:22
-- Each batch has a unique timestamp (milliseconds apart)



-- HOW MUCH OF EACH ROW IS FILLED? 
-- Why: shows which columns have missing data without running a separate COUNT for each one.
SELECT
    COUNT(*)                        AS total_rows,
    COUNT(report_key)               AS report_key_filled,
    COUNT(product_code_raw)         AS product_code_filled,
    COUNT(manufacturer_raw)         AS manufacturer_filled,
    COUNT(source_file)              AS source_file_filled
FROM bronze_reports;





