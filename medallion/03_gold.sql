-- ============================================================
-- 03_gold.sql
-- SILVER → GOLD
--
-- Fyller product_stats och manufacturer_stats från silver_reports.
-- Vanliga tabeller (inte views) — TRUNCATE + INSERT vid varje körning.
-- ============================================================

-- ------------------------------------------------------------
-- 1. product_stats — en rad per produkt
-- ------------------------------------------------------------

TRUNCATE TABLE product_stats;

WITH product_counts AS (
    SELECT
        product_code,
        COUNT(*) AS total_reports
    FROM silver_reports
    GROUP BY product_code
),

brand_counts AS (
    SELECT
        product_code,
        brand_name,
        ROW_NUMBER() OVER (
            PARTITION BY product_code
            ORDER BY COUNT(*) DESC, brand_name
        ) AS row_number
    FROM silver_reports
    WHERE brand_name IS NOT NULL
    GROUP BY product_code, brand_name
),

generic_counts AS (
    SELECT
        product_code,
        generic_name,
        ROW_NUMBER() OVER (
            PARTITION BY product_code
            ORDER BY COUNT(*) DESC, generic_name
        ) AS row_number
    FROM silver_reports
    WHERE generic_name IS NOT NULL
    GROUP BY product_code, generic_name
),

manufacturer_counts AS (
    SELECT
        product_code,
        manufacturer_name,
        ROW_NUMBER() OVER (
            PARTITION BY product_code
            ORDER BY COUNT(*) DESC, manufacturer_name
        ) AS row_number
    FROM silver_reports
    WHERE manufacturer_name IS NOT NULL
    GROUP BY product_code, manufacturer_name
)

INSERT INTO product_stats (
    product_code, total_reports, brand_name, generic_name, manufacturer_name
)
SELECT
    p.product_code,
    p.total_reports,
    b.brand_name,
    g.generic_name,
    m.manufacturer_name
FROM product_counts p
LEFT JOIN brand_counts b ON p.product_code = b.product_code AND b.row_number = 1
LEFT JOIN generic_counts g ON p.product_code = g.product_code AND g.row_number = 1
LEFT JOIN manufacturer_counts m ON p.product_code = m.product_code AND m.row_number = 1;


-- ------------------------------------------------------------
-- 2. manufacturer_stats — en rad per tillverkare
-- ------------------------------------------------------------
TRUNCATE TABLE manufacturer_stats;

INSERT INTO manufacturer_stats (name, count)
SELECT
    manufacturer_name AS name,
    COUNT(*) AS count
FROM silver_reports
WHERE manufacturer_name IS NOT NULL
GROUP BY manufacturer_name
ORDER BY count DESC;