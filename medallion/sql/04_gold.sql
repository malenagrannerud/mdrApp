/*
  04_gold.sql
  Author: Malena
  Updated: 2026-10-01

  WHAT:  Creates refresh_gold() (rebuilds product_stats and manufacturer_stats)
         and two dashboard views (product_stats_ranked, manufacturer_stats_ranked).
  WHY a function? So run_pipeline() can run silver + gold as ONE transaction.
         If gold fails, silver is rolled back too. Gold can never be stale.
  NOTE:  This file only CREATES the function and views. run_pipeline() calls it.

  Input:
    - silver_reports       cleaned rows from 03_silver.sql
    - product_code_dim     S6 — canonical product name per code

  Output:
    - product_stats        G1 — one row per product code
    - manufacturer_stats   G2 — one row per normalized manufacturer
    - product_stats_ranked       G4 + G5 — rank + high-volume flag
    - manufacturer_stats_ranked  G4 — rank

  Rules implemented here:
    G1  Aggregate per product code
    G2  Aggregate per manufacturer
    G3  (LATER — requires mdrfoi.event_type)
    G4  Rank results (applied in views, not stored)
    G5  Flag high-volume codes (applied in product_stats_ranked)
    G6  Exclude junk manufacturers
    G7  Use normalized manufacturer names
    G8  Label clearly — "Number of reports", not "rate"
    GR1 Reproducibility — gold is always rebuilt from silver
    GR2 Sanity — total_reports > 0
    GR3 Consistency — sum(total_reports) = silver row count
    GR4 Unique PKs — enforced in 01_create_tables.sql
*/


-- ============================================================
-- FUNCTION: refresh_gold()
-- ============================================================
DROP FUNCTION IF EXISTS refresh_gold();

CREATE OR REPLACE FUNCTION refresh_gold()
RETURNS TABLE(o_products bigint, o_manufacturers bigint) AS $$
DECLARE
    v_silver       bigint;
    v_products     bigint;
    v_manufacturer bigint;
BEGIN
    -- GUARD: never build gold on an empty silver (dashboard would show nothing)
    SELECT COUNT(*) INTO v_silver FROM silver_reports;
    IF v_silver = 0 THEN
        RAISE EXCEPTION 'Gold aborted: silver_reports is empty';
    END IF;

    -- Gold is always rebuilt from scratch from silver (idempotent, GR1).
    -- WHY DELETE and not TRUNCATE? TRUNCATE takes an ACCESS EXCLUSIVE lock,
    -- which conflicts with the open result set of a RETURNS TABLE function.
    DELETE FROM product_stats;
    DELETE FROM manufacturer_stats;

    -- --------------------------------------------------------
    -- G1: One row per product_code (the PK)
    -- S6: use canonical_generic_name from product_code_dim, not raw silver name
    -- G8: column named total_reports ("number of reports", not "rate")
    -- --------------------------------------------------------
    INSERT INTO product_stats (product_code, generic_name, total_reports)
    SELECT
        s.product_code,
        COALESCE(d.canonical_generic_name,
                 MODE() WITHIN GROUP (ORDER BY s.generic_name)) AS generic_name,
        COUNT(*) AS total_reports
    FROM silver_reports s
    LEFT JOIN product_code_dim d ON d.product_code = s.product_code
    GROUP BY s.product_code, d.canonical_generic_name;

    -- --------------------------------------------------------
    -- G2: One row per manufacturer
    -- G6: exclude junk manufacturers
    -- G7: use manufacturer_normalized (parent company), not raw name
    -- --------------------------------------------------------
    INSERT INTO manufacturer_stats (name, total_reports)
    SELECT
        manufacturer_normalized AS name,
        COUNT(*) AS total_reports
    FROM silver_reports
    WHERE manufacturer_normalized IS NOT NULL
      AND manufacturer_is_junk = FALSE       -- G6
    GROUP BY manufacturer_normalized;

    -- --------------------------------------------------------
    -- GR3: every silver row is counted exactly once
    -- --------------------------------------------------------
    SELECT COALESCE(SUM(total_reports), 0) INTO v_products     FROM product_stats;
    SELECT COALESCE(SUM(total_reports), 0) INTO v_manufacturer FROM manufacturer_stats;

    IF v_silver <> v_products THEN
        RAISE EXCEPTION 'GR3 FAILED (products): silver=% but sum=%', v_silver, v_products;
    END IF;

    -- NOTE: manufacturer total is LOWER than silver because junk rows are
    -- excluded (G6). That is intentional. We check only that it is > 0 and
    -- never larger than silver.
    IF v_manufacturer = 0 THEN
        RAISE EXCEPTION 'GR3 FAILED (manufacturers): sum=0 after G6 filter';
    END IF;
    IF v_manufacturer > v_silver THEN
        RAISE EXCEPTION 'GR3 FAILED (manufacturers): sum=% > silver=%', v_manufacturer, v_silver;
    END IF;

    -- --------------------------------------------------------
    -- GR2: no zero or negative counts
    -- --------------------------------------------------------
    IF EXISTS (SELECT 1 FROM product_stats WHERE total_reports <= 0)
    OR EXISTS (SELECT 1 FROM manufacturer_stats WHERE total_reports <= 0) THEN
        RAISE EXCEPTION 'GR2 FAILED: a gold row has total_reports <= 0';
    END IF;

    RETURN QUERY SELECT
        (SELECT COUNT(*) FROM product_stats),
        (SELECT COUNT(*) FROM manufacturer_stats);
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- VIEWS: G4 (rank) + G5 (high-volume flag)
-- ============================================================
-- WHY views and not tables? Ranking and filtering are read-time concerns.
-- Storing the rank in a table would mean recomputing it on every rebuild.
-- The dashboard reads these views directly.

DROP VIEW IF EXISTS product_stats_ranked;
CREATE VIEW product_stats_ranked AS
SELECT
    product_code,
    generic_name,
    total_reports,
    RANK() OVER (ORDER BY total_reports DESC) AS rank,
    (product_code IN ('DZE','QBJ','QFG','OZP','BZD','FRN','FPA','QLG','LGW','FTR'))
        AS is_high_volume_code                                  -- G5
FROM product_stats;

DROP VIEW IF EXISTS manufacturer_stats_ranked;
CREATE VIEW manufacturer_stats_ranked AS
SELECT
    name,
    total_reports,
    RANK() OVER (ORDER BY total_reports DESC) AS rank
FROM manufacturer_stats;




GRANT SELECT ON public.product_stats_ranked       TO service_role;
GRANT SELECT ON public.manufacturer_stats_ranked  TO service_role;

GRANT SELECT ON public.product_stats_ranked       TO anon;
GRANT SELECT ON public.manufacturer_stats_ranked  TO anon;
GRANT SELECT ON public.product_stats              TO anon;
GRANT SELECT ON public.manufacturer_stats         TO anon;
-- ============================================================
-- Usage
-- ============================================================
-- Rebuild gold (usually called from run_pipeline()):
--   SELECT * FROM refresh_gold();
--
-- Read the dashboard:
--   SELECT * FROM product_stats_ranked       WHERE is_high_volume_code = TRUE;
--   SELECT * FROM manufacturer_stats_ranked  LIMIT 10;