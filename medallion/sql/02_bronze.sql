-- ============================================================
-- 02_bronze.sql
-- Author: Malena
-- Created: 2026-08-02
-- Updated: 2026-09-21
-- Description: Inspect data from bronze_reports
--
-- End goal:
--      1 - Which are the most reported products to FDA 2024?
--      2 - Which are the most reported manufacturers to FDA 2024? 
-- 
-- input: bronze_report raw data
--
-- ============================================================

-- HOW MANY ROWS DO WE HAVE?
SELECT COUNT(*) AS total_rows
FROM bronze_reports;
-- result: one batch, 2000 rows



-- HOW MUCH OF EACH ROW IS FILLED? 
-- Why: shows which columns have missing data without running a separate COUNT for each one.
SELECT
    COUNT(*)                        AS total_rows,
    COUNT(report_key)               AS report_key_filled,
    COUNT(product_code_raw)         AS product_code_filled,
    COUNT(brand_name_raw)           AS brand_name_filled,
    COUNT(generic_name_raw)         AS generic_name_filled,
    COUNT(manufacturer_raw)         AS manufacturer_filled,
    COUNT(source_file)              AS source_file_filled
FROM bronze_reports;





