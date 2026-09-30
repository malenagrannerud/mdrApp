/*
  04_gold.sql
  WHAT:  Creates refresh_gold(), which rebuilds product_stats and manufacturer_stats.
  WHY a function? So run_pipeline() can run silver + gold as ONE transaction.
         If gold fails, silver is rolled back too. Gold can never be stale.
  NOTE:  This file only CREATES the function. run_pipeline() calls it.
*/

DROP FUNCTION IF EXISTS refresh_gold();

CREATE OR REPLACE FUNCTION refresh_gold()
RETURNS TABLE(o_products bigint, o_manufacturers bigint) AS $$
DECLARE
    v_silver       bigint;
    v_products     bigint;
    v_manufacturer bigint;
BEGIN
    -- GUARD: never build gold on an empty silver (dashboard would silently show nothing)
    SELECT COUNT(*) INTO v_silver FROM silver_reports;
    IF v_silver = 0 THEN
        RAISE EXCEPTION 'Gold aborted: silver_reports is empty';
    END IF;

    -- Gold is always rebuilt from scratch from silver (idempotent, GR1)
    TRUNCATE TABLE product_stats;
    TRUNCATE TABLE manufacturer_stats;

    -- One row per product_code (the PK). MODE() = most common name for that code.
    INSERT INTO product_stats (product_code, generic_name, total_reports)
    SELECT product_code,
           MODE() WITHIN GROUP (ORDER BY generic_name),
           COUNT(*)
    FROM silver_reports
    GROUP BY product_code;

    INSERT INTO manufacturer_stats (name, total_reports)
    SELECT manufacturer_name, COUNT(*)
    FROM silver_reports
    WHERE manufacturer_name IS NOT NULL
    GROUP BY manufacturer_name;

    -- GR3: every silver row is counted exactly once, in BOTH tables
    SELECT COALESCE(SUM(total_reports), 0) INTO v_products     FROM product_stats;
    SELECT COALESCE(SUM(total_reports), 0) INTO v_manufacturer FROM manufacturer_stats;

    IF v_silver <> v_products THEN
        RAISE EXCEPTION 'GR3 FAILED (products): silver=% but sum=%', v_silver, v_products;
    END IF;
    IF v_silver <> v_manufacturer THEN
        RAISE EXCEPTION 'GR3 FAILED (manufacturers): silver=% but sum=%', v_silver, v_manufacturer;
    END IF;

    -- GR2: no zero or negative counts
    IF EXISTS (SELECT 1 FROM product_stats WHERE total_reports <= 0)
    OR EXISTS (SELECT 1 FROM manufacturer_stats WHERE total_reports <= 0) THEN
        RAISE EXCEPTION 'GR2 FAILED: a gold row has total_reports <= 0';
    END IF;

    RETURN QUERY SELECT (SELECT COUNT(*) FROM product_stats),
                        (SELECT COUNT(*) FROM manufacturer_stats);
END;
$$ LANGUAGE plpgsql;
