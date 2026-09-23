-- ============================================================
-- 04_gold.sql
-- Author: Malena
-- Created: 2026-08-02
-- Updated: 2026-09-21
-- Description: Build the gold layer — aggregated, analytics-ready
--              tables for the dashboard.
--
-- Input:  silver_reports (clean, unique report_key)
-- Output: product_stats      (one row per product_code, with generic_name)
--         manufacturer_stats (one row per manufacturer)
--
-- Idempotent: both target tables are TRUNCATEd before insert.
-- ============================================================

-- ============================================================
-- 1. product_stats — ONE ROW PER PRODUCT CODE
-- ============================================================
-- A product_code can have many rows in silver_reports, and each report can have a different generic_name. 
-- We pick the MOST COMMON generic_name for each product_code.
-- product_code is kept for uniqueness, but is NOT shown in the dashboard — only generic_name is plotted.
-- ============================================================

TRUNCATE TABLE product_stats;

WITH

product_counts AS (
    SELECT
        product_code,
        COUNT(*) AS total_reports
    FROM silver_reports
    GROUP BY product_code
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
)

INSERT INTO product_stats (product_code, generic_name, total_reports)
SELECT
    pc.product_code,
    gc.generic_name,
    pc.total_reports
FROM product_counts pc
LEFT JOIN generic_counts gc
    ON pc.product_code = gc.product_code AND gc.row_number = 1;


-- ============================================================
-- 2. manufacturer_stats — ONE ROW PER MANUFACTURER
-- ============================================================

TRUNCATE TABLE manufacturer_stats;

INSERT INTO manufacturer_stats (name, total_reports)
SELECT
    manufacturer_name AS name,
    COUNT(*) AS total_reports
FROM silver_reports
WHERE manufacturer_name IS NOT NULL
GROUP BY manufacturer_name;