-- ============================================================
-- 04_gold.sql
-- Author: Malena
-- Created: 2026-08-02
-- Updated: 2026-09-25
-- Description: Build the gold layer — aggregated, analytics-ready tables for the dashboard.
--
-- Input:  silver_reports (clean, one row per device_event_key)
-- Output: product_stats      (one row per product_code)
--         manufacturer_stats (one row per manufacturer_name)
--
-- Idempotent: both target tables are TRUNCATEd before insert.
-- ============================================================


-- ============================================================
-- 1. product_stats — ONE ROW PER PRODUCT CODE
-- ============================================================
-- A product_code can have many rows in silver_reports.
-- We count how many reports each product_code has.
-- product_code is the primary key.
-- ============================================================

TRUNCATE TABLE product_stats;

INSERT INTO product_stats (product_code, total_reports)
SELECT
    product_code,
    COUNT(*) AS total_reports
FROM silver_reports
WHERE product_code IS NOT NULL
GROUP BY product_code;


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
