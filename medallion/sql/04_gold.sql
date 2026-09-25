-- ============================================================
-- 04_gold.sql
-- Author: Malena
-- Created: 2026-08-02
-- Updated: 2026-09-25
-- Description: Build the gold layer — aggregated, analytics-ready tables for the dashboard.
--              Answers Question 1 (Products) and Question 2 (Manufacturers).
--
-- Input:  silver_reports (clean, one row per device_event_key)
-- Output: product_stats      (one row per product_code, includes generic_name)
--         manufacturer_stats (one row per manufacturer_name)
--
-- Idempotent: both target tables are TRUNCATEd before insert.
--
-- RULES APPLIED (FROM PIPELINE.md):
--   GR1 – Reproducibility: All metrics can be recomputed from Silver.
--   GR2 – Sanity: total_reports > 0 in both tables (enforced via HAVING clause).
--   GR3 – Consistency: Sum of total_reports matches total rows in Silver.
--   GR4 – Constraints: unique/not_null on PKs product_stats.product_code and manufacturer_stats.name.
-- ============================================================

-- ============================================================
-- 1. product_stats — SVAR PÅ FRÅGA 1 (Mest rapporterade produkter)
-- ============================================================
-- A product_code maps to a conformed generic_name from Silver.
-- We count reports per product_code and include generic_name for BI mapping.
-- product_code remains the unique Primary Key (GR4).
-- ============================================================

TRUNCATE TABLE product_stats; -- Idempotency step

INSERT INTO product_stats (product_code, generic_name, total_reports)
SELECT
    product_code,
    generic_name,                                           -- Inkluderad i loopen för dashboarden
    COUNT(*) AS total_reports
FROM silver_reports
WHERE product_code IS NOT NULL                              -- Säkrar GR4 (Not Null)
GROUP BY product_code, generic_name
HAVING COUNT(*) > 0;                                        -- Enforcar GR2 (Sanity check)


-- ============================================================
-- 2. manufacturer_stats — SVAR PÅ FRÅGA 2 (Mest rapporterade tillverkare)
-- ============================================================
-- Groups clean, normalized manufacturer names from Silver.
-- name is the unique Primary Key (GR4).
-- ============================================================

TRUNCATE TABLE manufacturer_stats; -- Idempotency step

INSERT INTO manufacturer_stats (name, total_reports)
SELECT
    manufacturer_name AS name,
    COUNT(*) AS total_reports
FROM silver_reports
WHERE manufacturer_name IS NOT NULL                         -- Säkrar GR4 (Not Null)
GROUP BY manufacturer_name
HAVING COUNT(*) > 0;                                        -- Enforcar GR2 (Sanity check)


-- ============================================================
-- 3. QA VERIFICATION LOGS — VERIFYING GR3 (Consistency)
-- ============================================================
SELECT 
    (SELECT COUNT(*) FROM silver_reports) AS total_silver_rows,
    (SELECT SUM(total_reports) FROM product_stats) AS total_gold_product_reports,
    CASE 
        WHEN (SELECT COUNT(*) FROM silver_reports) = (SELECT SUM(total_reports) FROM product_stats)
        THEN 'PASSED: Gold is consistent with Silver (GR3)'
        ELSE 'FAILED: Row count mismatch between layers'
    END AS gr3_verification_status;



