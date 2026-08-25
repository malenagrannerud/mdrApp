-- ============================================================
-- 04_validate.sql
--
-- Validering av Bronze → Silver → Gold
--
-- Körs EFTER:
--   01_bronze_ingest.py
--   02_bronze_to_silver.sql
--   03_silver_to_gold.sql
-- ============================================================


-- ============================================================
-- 1. Kontrollera antal rader i varje lager
-- ============================================================

SELECT
    'bronze_reports' AS table_name,
    COUNT(*) AS row_count
FROM bronze_reports

UNION ALL

SELECT
    'silver_reports',
    COUNT(*)
FROM silver_reports

UNION ALL

SELECT
    'product_stats',
    COUNT(*)
FROM product_stats

UNION ALL

SELECT
    'manufacturer_stats',
    COUNT(*)
FROM manufacturer_stats;


-- ============================================================
-- 2. Silver ska inte innehålla NULL product_code
-- ============================================================

SELECT COUNT(*) AS invalid_product_codes
FROM silver_reports
WHERE product_code IS NULL;


-- ============================================================
-- 3. Silver ska ha unika report_key
-- ============================================================

SELECT
    report_key,
    COUNT(*) AS occurrences
FROM silver_reports
GROUP BY report_key
HAVING COUNT(*) > 1;


-- ============================================================
-- 4. Silver ska inte innehålla ogiltiga tillverkare
-- ============================================================

SELECT COUNT(*) AS invalid_manufacturers
FROM silver_reports
WHERE manufacturer_name IS NULL;


-- ============================================================
-- 5. Gold: product_stats ska ha unika product_code
-- ============================================================

SELECT
    product_code,
    COUNT(*) AS occurrences
FROM product_stats
GROUP BY product_code
HAVING COUNT(*) > 1;


-- ============================================================
-- 6. Gold: manufacturer_stats ska ha unika manufacturers
-- ============================================================

SELECT
    name,
    COUNT(*) AS occurrences
FROM manufacturer_stats
GROUP BY name
HAVING COUNT(*) > 1;


-- ============================================================
-- 7. Gold: total_reports får inte vara 0 eller negativt
-- ============================================================

SELECT *
FROM product_stats
WHERE total_reports <= 0;


-- ============================================================
-- 8. Kontrollera att Golds produktantal stämmer
--    mot Silver
-- ============================================================

WITH silver_counts AS (

    SELECT
        product_code,
        COUNT(*) AS total_reports
    FROM silver_reports
    GROUP BY product_code

)

SELECT
    p.product_code,
    p.total_reports AS gold_count,
    s.total_reports AS silver_count

FROM product_stats p

JOIN silver_counts s
    ON p.product_code = s.product_code

WHERE p.total_reports <> s.total_reports;


-- ============================================================
-- 9. Kontrollera manufacturer_stats mot Silver
-- ============================================================

WITH silver_manufacturer_counts AS (

    SELECT
        manufacturer_name,
        COUNT(*) AS total_reports
    FROM silver_reports
    WHERE manufacturer_name IS NOT NULL
    GROUP BY manufacturer_name

)

SELECT
    g.name,
    g.count AS gold_count,
    s.total_reports AS silver_count

FROM manufacturer_stats g

JOIN silver_manufacturer_counts s
    ON g.name = s.manufacturer_name

WHERE g.count <> s.total_reports;


-- ============================================================
-- 10. Kontrollera att Gold inte innehåller produkter
--     som saknas i Silver
-- ============================================================

SELECT p.product_code
FROM product_stats p

LEFT JOIN silver_reports s
    ON p.product_code = s.product_code

WHERE s.product_code IS NULL;


-- ============================================================
-- 11. Sammanfattning
-- ============================================================

SELECT
    (SELECT COUNT(*) FROM bronze_reports) AS bronze_rows,
    (SELECT COUNT(*) FROM silver_reports) AS silver_rows,
    (SELECT COUNT(*) FROM product_stats) AS gold_products,
    (SELECT COUNT(*) FROM manufacturer_stats) AS gold_manufacturers;