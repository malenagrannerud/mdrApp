/*
  02_gold.sql
  Author: Malena | Updated: 2026-10-15

| G1 | See use cases and build SQL queries to tailor it | `05_gold.sql` |
| G2 | Create optimized structures (star schemas, aggregation) | `05_gold.sql` |
| G3 | Read optimized tables for dashboards | `05_gold.sql` |

  Functions:refresh_gold() - runs steps 
  two dashboard views.

*/

-- ---------------------------------------------------------
-- Create tables 
CREATE TABLE IF NOT EXISTS product_stats (
    product_code  text PRIMARY KEY,
    generic_name  text,
    total_reports integer
);

CREATE TABLE IF NOT EXISTS manufacturer_stats (
    name          text PRIMARY KEY,
    total_reports integer
);

ALTER TABLE product_stats      ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_stats ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON product_stats, manufacturer_stats TO service_role;

-- ---------------------------------------------------------

DROP FUNCTION IF EXISTS refresh_gold();

CREATE OR REPLACE FUNCTION refresh_gold()
RETURNS TABLE(o_products bigint, o_manufacturers bigint) AS $$
DECLARE
    v_silver       bigint;
    v_products     bigint;
    v_manufacturer bigint;
BEGIN
    -- GUARD: never build gold on an empty silver
    SELECT COUNT(*) INTO v_silver FROM silver_reports;
    IF v_silver = 0 THEN
        RAISE EXCEPTION 'Gold aborted: silver_reports is empty';
    END IF;

    DELETE FROM product_stats;
    DELETE FROM manufacturer_stats;

    -- --------------------------------------------------------------------
    -- G1: Q1-One row per product_code (the PK)
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

    -- --------------------------------------------------------------------
    -- G1: Q2- One row per manufacturer 
    INSERT INTO manufacturer_stats (name, total_reports)
    SELECT
        manufacturer_normalized AS name,
        COUNT(*) AS total_reports
    FROM silver_reports
    WHERE manufacturer_normalized IS NOT NULL
      AND manufacturer_is_junk = FALSE
    GROUP BY manufacturer_normalized;

    -- --------------------------------------------------------------------
    -- Exact reconciliation
    SELECT COALESCE(SUM(total_reports), 0) INTO v_products     FROM product_stats;
    SELECT COALESCE(SUM(total_reports), 0) INTO v_manufacturer FROM manufacturer_stats;

    IF v_products <> v_silver THEN
        RAISE EXCEPTION 'GKG1 FAILED (products): silver=% but sum=%', v_silver, v_products;
    END IF;

    IF v_manufacturer <> (SELECT COUNT(*) FROM silver_reports
                          WHERE manufacturer_is_junk = FALSE
                            AND manufacturer_normalized IS NOT NULL) THEN
        RAISE EXCEPTION 'GKG2 FAILED (manufacturers): sum=% does not match silver', v_manufacturer;
    END IF;

    -- --------------------------------------------------------
    -- SANITY: every gold row has total_reports > 0
    -- --------------------------------------------------------
    IF EXISTS (SELECT 1 FROM product_stats WHERE total_reports <= 0)
    OR EXISTS (SELECT 1 FROM manufacturer_stats WHERE total_reports <= 0) THEN
        RAISE EXCEPTION 'SANITY FAILED: a gold row has total_reports <= 0';
    END IF;

    RETURN QUERY SELECT
        (SELECT COUNT(*) FROM product_stats),
        (SELECT COUNT(*) FROM manufacturer_stats);
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- Views: rank computed at read time, not stored
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