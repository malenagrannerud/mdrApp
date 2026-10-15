/*
  04_gold.sql
  Author: Malena | Updated: 2026-10-07

  Creates refresh_gold() and two dashboard views.

  RULES IMPLEMENTED HERE:
    RULE G1  Count per product code
    RULE G2  Count per manufacturer
    RULE G3  Exact reconciliation
    RULE G4  Sanity check (total_reports > 0)
    RULE G5  Rank in views (not stored)
    RULE GKG Gold -> Dashboard gatekeeper
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
    -- RULE GKS guard: never build gold on an empty silver
    SELECT COUNT(*) INTO v_silver FROM silver_reports;
    IF v_silver = 0 THEN
        RAISE EXCEPTION 'Gold aborted: silver_reports is empty';
    END IF;

    DELETE FROM product_stats;
    DELETE FROM manufacturer_stats;

    -- --------------------------------------------------------
    -- RULE G1: One row per product_code (the PK)
    -- --------------------------------------------------------
    INSERT INTO product_stats (product_code, generic_name, total_reports)
    SELECT
        s.product_code,
        COALESCE(d.canonical_generic_name,
                 MODE() WITHIN GROUP (ORDER BY s.generic_name),
                 'MISSING NAME') AS generic_name,
        COUNT(*) AS total_reports
    FROM silver_reports s
    LEFT JOIN product_code_dim d ON d.product_code = s.product_code
    GROUP BY s.product_code, d.canonical_generic_name;

    -- --------------------------------------------------------
    -- RULE G2: One row per manufacturer (junk and NULL excluded)
    -- --------------------------------------------------------
    INSERT INTO manufacturer_stats (name, total_reports)
    SELECT
        manufacturer_normalized AS name,
        COUNT(*) AS total_reports
    FROM silver_reports
    WHERE manufacturer_normalized IS NOT NULL
      AND manufacturer_is_junk = FALSE
    GROUP BY manufacturer_normalized;

    -- --------------------------------------------------------
    -- RULE G3: Exact reconciliation
    -- --------------------------------------------------------
    SELECT COALESCE(SUM(total_reports), 0) INTO v_products     FROM product_stats;
    SELECT COALESCE(SUM(total_reports), 0) INTO v_manufacturer FROM manufacturer_stats;

    IF v_products <> v_silver THEN
        RAISE EXCEPTION 'G3 FAILED (products): silver=% but sum=%', v_silver, v_products;
    END IF;

    IF v_manufacturer <> (SELECT COUNT(*) FROM silver_reports
                          WHERE manufacturer_is_junk = FALSE
                            AND manufacturer_normalized IS NOT NULL) THEN
        RAISE EXCEPTION 'G3 FAILED (manufacturers): sum=% does not match silver', v_manufacturer;
    END IF;

    -- --------------------------------------------------------
    -- RULE G4: Sanity check
    -- --------------------------------------------------------
    IF EXISTS (SELECT 1 FROM product_stats WHERE total_reports <= 0)
    OR EXISTS (SELECT 1 FROM manufacturer_stats WHERE total_reports <= 0) THEN
        RAISE EXCEPTION 'G4 FAILED: a gold row has total_reports <= 0';
    END IF;

    RETURN QUERY SELECT
        (SELECT COUNT(*) FROM product_stats),
        (SELECT COUNT(*) FROM manufacturer_stats);
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- RULE G5: Views (rank computed at read time, not stored)
-- ============================================================
DROP VIEW IF EXISTS product_stats_ranked;
CREATE VIEW product_stats_ranked AS
SELECT
    product_code,
    generic_name,
    total_reports,
    RANK() OVER (ORDER BY total_reports DESC) AS rank
FROM product_stats;

DROP VIEW IF EXISTS manufacturer_stats_ranked;
CREATE VIEW manufacturer_stats_ranked AS
SELECT
    name,
    total_reports,
    RANK() OVER (ORDER BY total_reports DESC) AS rank
FROM manufacturer_stats;


-- ============================================================
-- Grants for the dashboard
-- ============================================================
GRANT SELECT ON public.product_stats_ranked      TO service_role;
GRANT SELECT ON public.manufacturer_stats_ranked TO service_role;

GRANT SELECT ON public.product_stats_ranked      TO anon;
GRANT SELECT ON public.manufacturer_stats_ranked TO anon;


-- ============================================================
-- Usage
-- ============================================================
-- Rebuild gold:
--   SELECT * FROM refresh_gold();
--
-- Read the dashboard:
--   SELECT * FROM product_stats_ranked       ORDER BY rank LIMIT 10;
--   SELECT * FROM manufacturer_stats_ranked  ORDER BY rank LIMIT 10;