/*
  04_gold.sql
  Author: Malena
  Updated: 2026-09-30
  Builds the two small tables the dashboard reads:
           product_stats      (most reported products)
           manufacturer_stats (most reported manufacturers)


  WHY:   The dashboard should read ~10 rows, not count millions of rows
         on every page load. All numbers can be recomputed from silver (GR1).

  Run order: 
    (1) 03_silver.sql 
    (2) SELECT * FROM refresh_silver_reports();  
    (3) this file
*/


-- ============================================================
-- GUARD: never build gold on top of an empty or broken silver
-- ============================================================
-- WHY? If silver is empty, gold would be truncated and rebuilt as empty,
-- and the dashboard would silently show nothing. Better to stop here.
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM silver_reports) = 0 THEN
    RAISE EXCEPTION 'Gold aborted: silver_reports is empty. Run refresh_silver_reports() first.';
  END IF;
END $$;


-- ============================================================
-- 1. product_stats - Question 1: which products are reported most?
-- ============================================================
-- WHY TRUNCATE first? Gold is always rebuilt from scratch from silver.
-- Running this file twice gives the same result (idempotent).
TRUNCATE TABLE product_stats;

-- WHY group ONLY by product_code?
-- product_code is the primary key, so we need exactly one row per code.
-- The old version grouped by (product_code, generic_name). If one code had
-- two different names in the data, it produced two rows with the same key,
-- and the insert crashed.
-- WHY MODE()? It picks the most common name for each code, so the chart
-- gets one readable label per code.
-- WHY no HAVING COUNT(*) > 0? A group always has at least one row, so the
-- condition can never be false. GR2 is checked properly in section 3.
INSERT INTO product_stats (product_code, generic_name, total_reports)
SELECT
    product_code,
    MODE() WITHIN GROUP (ORDER BY generic_name) AS generic_name,
    COUNT(*)                                    AS total_reports
FROM silver_reports
GROUP BY product_code;


-- ============================================================
-- 2. manufacturer_stats - Question 2: which manufacturers are reported most?
-- ============================================================
TRUNCATE TABLE manufacturer_stats;

-- WHY manufacturer_name IS NOT NULL? It is the primary key, and a key
-- cannot be NULL. Silver already rejects rows without a manufacturer,
-- so this is a safety net that should never remove anything.
INSERT INTO manufacturer_stats (name, total_reports)
SELECT
    manufacturer_name AS name,
    COUNT(*)          AS total_reports
FROM silver_reports
WHERE manufacturer_name IS NOT NULL
GROUP BY manufacturer_name;


-- ============================================================
-- 3. QUALITY CHECKS - fail loudly, do not just show a message
-- ============================================================
-- WHY RAISE EXCEPTION? The old version only printed PASSED/FAILED text
-- that nobody was forced to read. An error is impossible to overlook.
DO $$
DECLARE
  v_silver       bigint := (SELECT COUNT(*) FROM silver_reports);
  v_products     bigint := (SELECT COALESCE(SUM(total_reports), 0) FROM product_stats);
  v_manufacturer bigint := (SELECT COALESCE(SUM(total_reports), 0) FROM manufacturer_stats);
BEGIN
  -- GR3 (products): every silver row is counted exactly once.
  IF v_silver <> v_products THEN
    RAISE EXCEPTION 'GR3 FAILED (products): silver=% but product_stats sum=%', v_silver, v_products;
  END IF;

  -- GR3 (manufacturers): same check for the second table.
  -- WHY the old version missed this: it only checked product_stats.
  IF v_silver <> v_manufacturer THEN
    RAISE EXCEPTION 'GR3 FAILED (manufacturers): silver=% but manufacturer_stats sum=%', v_silver, v_manufacturer;
  END IF;

  -- GR2: no row with zero or negative counts.
  IF EXISTS (SELECT 1 FROM product_stats WHERE total_reports <= 0)
  OR EXISTS (SELECT 1 FROM manufacturer_stats WHERE total_reports <= 0) THEN
    RAISE EXCEPTION 'GR2 FAILED: a gold row has total_reports <= 0';
  END IF;

  RAISE NOTICE 'GOLD PASSED: silver=% rows, both gold tables add up (GR2, GR3)', v_silver;
END $$;

