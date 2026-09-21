-- ============================================================
-- 04_gold.sql
-- Author: Malena
-- Created: 2026-08-02
-- Updated: 2026-09-21
-- Description: Build the gold layer — aggregated, analytics-ready
--              tables for the dashboard.
--
-- Input:  silver_reports (clean, unique report_key)
-- Output: product_stats      (one row per product_code)
--         manufacturer_stats (one row per manufacturer)
--
-- Idempotent: both target tables are TRUNCATEd before insert.
-- ============================================================


-- ============================================================
-- 1. product_stats — ONE ROW PER PRODUCT CODE
-- ============================================================
--
-- Why this is tricky:
--   A product_code can have many rows in silver_reports
--   (one per incident report). And each report can have a
--   different brand_name, generic_name or manufacturer_name.
--
--   Example: product_code 'QBJ' has two brands:
--     - DEXCOM G6 (1935 reports)
--     - DEXCOM G7 (993 reports)
--
--   product_stats must return ONE row per product_code.
--   So we pick the MOST COMMON value for each descriptive column.
-- ============================================================

TRUNCATE TABLE product_stats;

WITH

-- Step 1: Count total reports per product_code
--         This is the main fact — how many incidents.
product_counts AS (
    SELECT
        product_code,
        COUNT(*) AS total_reports
    FROM silver_reports
    GROUP BY product_code
),

-- Step 2: Rank brand names per product_code.
--         The most common brand (highest count) gets row_number 1.
--         Ties are broken alphabetically so the result is stable.
--
--         ROW_NUMBER() vs RANK():
--           ROW_NUMBER gives 1,2,3 — always unique ranks.
--           RANK would give 1,1,3 on a tie — not what we want.
brand_counts AS (
    SELECT
        product_code,
        brand_name,
        ROW_NUMBER() OVER (
            PARTITION BY product_code
            ORDER BY COUNT(*) DESC, brand_name
        ) AS row_number
    FROM silver_reports
    WHERE brand_name IS NOT NULL          -- NULLs cannot win
    GROUP BY product_code, brand_name
),

-- Step 3: Same ranking for generic_name
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

-- Step 4: Same ranking for manufacturer_name
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

-- Step 5: Join everything together.
--         LEFT JOIN so a product_code without brand/generic/
--         manufacturer still gets a row in product_stats.
INSERT INTO product_stats (
    product_code,
    total_reports,
    brand_name,
    generic_name,
    manufacturer_name
)
SELECT
    pc.product_code,
    pc.total_reports,
    bc.brand_name,
    gc.generic_name,
    mc.manufacturer_name
FROM product_counts pc
LEFT JOIN brand_counts        bc ON pc.product_code = bc.product_code AND bc.row_number = 1
LEFT JOIN generic_counts      gc ON pc.product_code = gc.product_code AND gc.row_number = 1
LEFT JOIN manufacturer_counts mc ON pc.product_code = mc.product_code AND mc.row_number = 1;


-- ============================================================
-- 2. manufacturer_stats — ONE ROW PER MANUFACTURER
-- ============================================================
--
-- Simpler than product_stats:
--   - Group by manufacturer_name
--   - Count how many reports each manufacturer has
--
-- Note: no ORDER BY on the INSERT.
--   SQL tables are unordered by nature. Sorting belongs in the
--   query that READS the table, not the one that WRITES it.
--   The dashboard can do: SELECT * FROM manufacturer_stats ORDER BY total_reports DESC;
-- ============================================================

TRUNCATE TABLE manufacturer_stats;

INSERT INTO manufacturer_stats (name, total_reports)
SELECT
    manufacturer_name AS name,
    COUNT(*) AS total_reports
FROM silver_reports
WHERE manufacturer_name IS NOT NULL
GROUP BY manufacturer_name;