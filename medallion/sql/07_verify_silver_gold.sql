/*
  medallion/sql/07_verify_silver_gold.sql
  Author: Malena | Created: 2026-10-08

  DESCRIPTION: Read-only checks that prove the silver and gold layers obey their rules.

  HOW TO:   Step 1: Paste this code in SQL and run (creates the functions).
           Step 2: Run SELECT * FROM verify_pipeline();
           Step 3: Analyse results. Any false = investigate.

  NOTE:  silver_rejected is never cleared between runs, so all rejected-row
         checks filter on the run_id of the CURRENT silver. Without that filter
         S7 would double count after a second run.
*/

DROP FUNCTION IF EXISTS verify_pipeline();

CREATE OR REPLACE FUNCTION verify_pipeline()
RETURNS TABLE(check_id text, description text, passed boolean, detail text) AS $$

WITH
-- The run that produced the silver rows we are looking at
latest AS (
    SELECT run_id
    FROM silver_reports
    GROUP BY run_id
    ORDER BY MAX(_silver_updated_at) DESC
    LIMIT 1
),

-- Same junk list as 03b_silver.sql
junk(marker) AS (
    VALUES ('NI'),('UNK'),('*'),('N/A'),('NA'),('UNKNOWN'),('NO INFORMATION'),
           ('NO MATCH'),('NO DATA'),('NONE'),('?'),('0HP'),('000')
),

-- Bronze rows that have a usable key (same test as S1 in 03b_silver.sql)
bronze_keyed AS (
    SELECT report_key, device_sequence_no
    FROM bronze_reports
    WHERE NULLIF(TRIM(report_key), '') IS NOT NULL
      AND NULLIF(TRIM(device_sequence_no), '') IS NOT NULL
),

checks AS (

    -- ---------- SILVER ----------
    SELECT 'S1' AS id, 'No silver row has a missing key' AS descr,
           c = 0 AS ok, c::text AS det
    FROM (SELECT COUNT(*) AS c FROM silver_reports
          WHERE NULLIF(TRIM(report_key), '') IS NULL
             OR NULLIF(TRIM(device_sequence_no), '') IS NULL) x

    UNION ALL
    SELECT 'S2', 'Every duplicate bronze key is in quarantine (S2_duplicate_key)',
           expected = actual,
           'expected=' || expected || ' actual=' || actual
    FROM (
        SELECT
            (SELECT COUNT(*) FROM bronze_keyed)
          - (SELECT COUNT(*) FROM (SELECT DISTINCT report_key, device_sequence_no
                                   FROM bronze_keyed) d) AS expected,
            (SELECT COUNT(*) FROM silver_rejected
             WHERE run_id = (SELECT run_id FROM latest)
               AND rejection_reason = 'S2_duplicate_key') AS actual
    ) x

    UNION ALL
    SELECT 'S3a', 'No silver row has a NULL product_code',
           c = 0, c::text
    FROM (SELECT COUNT(*) AS c FROM silver_reports WHERE product_code IS NULL) x

    UNION ALL
    SELECT 'S3b', 'Missing-value flags match the data (never imputed)',
           c = 0, c::text
    FROM (SELECT COUNT(*) AS c FROM silver_reports
          WHERE has_missing_generic_name <> (generic_name IS NULL)
             OR has_missing_manufacturer <> (manufacturer_name IS NULL)) x

    UNION ALL
    SELECT 'S4', 'Every junk manufacturer name is flagged',
           c = 0, c::text
    FROM (SELECT COUNT(*) AS c FROM silver_reports
          WHERE manufacturer_is_junk = FALSE
            AND manufacturer_name IS NOT NULL
            AND (UPPER(TRIM(manufacturer_name)) IN (SELECT marker FROM junk)
                 OR length(TRIM(manufacturer_name)) < 2)) x

    UNION ALL
    SELECT 'S5', 'Every named manufacturer has a normalized name',
           c = 0, c::text
    FROM (SELECT COUNT(*) AS c FROM silver_reports
          WHERE manufacturer_name IS NOT NULL
            AND manufacturer_normalized IS NULL) x

    UNION ALL
    SELECT 'S6', 'Every silver product code with a name has a canonical name',
           c = 0, c::text
    FROM (SELECT COUNT(DISTINCT s.product_code) AS c
          FROM silver_reports s
          LEFT JOIN product_code_dim d ON d.product_code = s.product_code
          WHERE s.generic_name IS NOT NULL
            AND d.product_code IS NULL) x

    UNION ALL
    SELECT 'S7', 'bronze = silver + rejected (current run)',
           b = s + r,
           'bronze=' || b || ' silver=' || s || ' rejected=' || r
    FROM (
        SELECT (SELECT COUNT(*) FROM bronze_reports) AS b,
               (SELECT COUNT(*) FROM silver_reports) AS s,
               (SELECT COUNT(*) FROM silver_rejected
                WHERE run_id = (SELECT run_id FROM latest)) AS r
    ) x

    -- ---------- GOLD ----------
    UNION ALL
    SELECT 'G3a', 'sum(product_stats) = silver rows',
           p = s, 'products=' || p || ' silver=' || s
    FROM (SELECT COALESCE((SELECT SUM(total_reports) FROM product_stats), 0) AS p,
                 (SELECT COUNT(*) FROM silver_reports) AS s) x

    UNION ALL
    SELECT 'G3b', 'sum(manufacturer_stats) = non-junk named silver rows',
           m = s, 'manufacturers=' || m || ' silver=' || s
    FROM (SELECT COALESCE((SELECT SUM(total_reports) FROM manufacturer_stats), 0) AS m,
                 (SELECT COUNT(*) FROM silver_reports
                  WHERE manufacturer_is_junk = FALSE
                    AND manufacturer_normalized IS NOT NULL) AS s) x

    UNION ALL
    SELECT 'G4', 'No gold row has total_reports <= 0',
           c = 0, c::text
    FROM (SELECT (SELECT COUNT(*) FROM product_stats WHERE total_reports <= 0)
               + (SELECT COUNT(*) FROM manufacturer_stats WHERE total_reports <= 0) AS c) x

    UNION ALL
    SELECT 'G5', 'Rank 1 in the views is the largest count',
           (SELECT total_reports FROM product_stats_ranked WHERE rank = 1 LIMIT 1)
             = (SELECT MAX(total_reports) FROM product_stats)
       AND (SELECT total_reports FROM manufacturer_stats_ranked WHERE rank = 1 LIMIT 1)
             = (SELECT MAX(total_reports) FROM manufacturer_stats),
           'top product=' || COALESCE((SELECT MAX(total_reports) FROM product_stats)::text, 'none')

    UNION ALL
    SELECT 'G7', 'Latest pipeline run succeeded and matches silver',
           COALESCE(r.status = 'success' AND r.rows_silver = (SELECT COUNT(*) FROM silver_reports), FALSE),
           COALESCE('status=' || r.status || ' rows_silver=' || r.rows_silver, 'no runs logged')
    FROM (SELECT 1) dummy
    LEFT JOIN LATERAL (SELECT status, rows_silver FROM pipeline_runs
                       ORDER BY started_at DESC LIMIT 1) r ON TRUE

    -- ---------- SECURITY (G8) ----------
    UNION ALL
    SELECT 'G8a', 'anon cannot read bronze, silver or quarantine',
           NOT has_table_privilege('anon', 'public.bronze_reports',  'SELECT')
       AND NOT has_table_privilege('anon', 'public.silver_reports',  'SELECT')
       AND NOT has_table_privilege('anon', 'public.silver_rejected', 'SELECT'),
           'privilege check on 3 tables'

    UNION ALL
    SELECT 'G8b', 'anon can read the gold views the dashboard needs',
           has_table_privilege('anon', 'public.product_stats_ranked',      'SELECT')
       AND has_table_privilege('anon', 'public.manufacturer_stats_ranked', 'SELECT'),
           'privilege check on 2 views'

    UNION ALL
    SELECT 'G8c', 'Row level security is on for all 9 pipeline tables',
           c = 9, c || ' of 9 tables'
    FROM (SELECT COUNT(*) AS c
          FROM pg_class cl
          JOIN pg_namespace n ON n.oid = cl.relnamespace
          WHERE n.nspname = 'public'
            AND cl.relrowsecurity
            AND cl.relname IN ('bronze_reports','silver_reports','silver_rejected',
                               'product_stats','manufacturer_stats','product_code_dim',
                               'manufacturer_mapping','manufacturer_parent','pipeline_runs')) x
)
SELECT id, descr, ok, det FROM checks ORDER BY id;

$$ LANGUAGE sql STABLE;


-- Only the pipeline owner may run it
REVOKE ALL ON FUNCTION verify_pipeline() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION verify_pipeline() TO service_role;


-- ============================================================
-- Usage
-- ============================================================
-- All checks:
--   SELECT * FROM verify_pipeline();
--
-- Only failures (empty result = healthy):
--   SELECT * FROM verify_pipeline() WHERE NOT passed;
--
-- Later (CI or run_pipeline): fail loudly
--   DO $$ BEGIN
--     IF EXISTS (SELECT 1 FROM verify_pipeline() WHERE NOT passed) THEN
--       RAISE EXCEPTION 'verify_pipeline failed';
--     END IF;
--   END $$;