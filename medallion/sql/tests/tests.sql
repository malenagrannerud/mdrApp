-- ============================================================
-- validate.sql
-- Körs EFTER 00_create_tables.sql → 01_bronze_ingest.py →
--            02_transform_silver.sql → 03_gold_tables.sql
-- ============================================================

-- 1. Radantal i varje lager
SELECT 'bronze_reports' AS table_name, COUNT(*) AS row_count FROM bronze_reports
UNION ALL
SELECT 'silver_reports', COUNT(*) FROM silver_reports
UNION ALL
SELECT 'product_stats', COUNT(*) FROM product_stats
UNION ALL
SELECT 'manufacturer_stats', COUNT(*) FROM manufacturer_stats;

-- 2. Silver ska inte ha NULL product_code
SELECT COUNT(*) AS invalid_product_codes
FROM silver_reports
WHERE product_code IS NULL;

-- 3. Silver ska ha unika report_key
SELECT report_key, COUNT(*) AS occurrences
FROM silver_reports
GROUP BY report_key
HAVING COUNT(*) > 1;

-- 4. Gold: product_stats ska ha unika product_code
SELECT product_code, COUNT(*) AS occurrences
FROM product_stats
GROUP BY product_code
HAVING COUNT(*) > 1;

-- 5. Gold: manufacturer_stats ska ha unika namn
SELECT name, COUNT(*) AS occurrences
FROM manufacturer_stats
GROUP BY name
HAVING COUNT(*) > 1;

-- 6. total_reports får inte vara 0 eller negativt
SELECT * FROM product_stats WHERE total_reports <= 0;

-- 7. Golds produktantal ska stämma mot Silver
WITH silver_counts AS (
    SELECT product_code, COUNT(*) AS total_reports
    FROM silver_reports
    GROUP BY product_code
)
SELECT p.product_code, p.total_reports AS gold_count, s.total_reports AS silver_count
FROM product_stats p
JOIN silver_counts s ON p.product_code = s.product_code
WHERE p.total_reports <> s.total_reports;

-- 8. Sammanfattning
SELECT
    (SELECT COUNT(*) FROM bronze_reports) AS bronze_rows,
    (SELECT COUNT(*) FROM silver_reports) AS silver_rows,
    (SELECT COUNT(*) FROM product_stats) AS gold_products,
    (SELECT COUNT(*) FROM manufacturer_stats) AS gold_manufacturers;