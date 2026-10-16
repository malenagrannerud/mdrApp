/*
  07_verify_silver_gold.sql
  Author: Malena | Created: 2026-10-08 | Updated: 2026-10-15

  Read-only checks that prove the silver and gold layers obey their rules.
               One check = one requirement ID, exactly as in PIPELINE.md.
               Requirement tests first, gatekeeper tests (GK) last in each layer.


  HOW TO:   Step 1: Paste this code in SQL and run (creates the function).
            Step 2: Run SELECT * FROM verify_pipeline();
            Step 3: Analyse results. Any false = investigate.

  NOTE:  silver_rejected is never cleared between runs, so all rejected-row
         checks filter on the run_id of the CURRENT silver. Without that filter
         S1 and GKS2 would double count after a second run.
  NEEDS: 04_silver.sql (normalize_mfr_name) and 02_seed_manufacturers.sql (for S4).
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

-- Same junk list as 04_silver.sql
junk(marker) AS (
    VALUES ('NI'),('UNK'),('*'),('N/A'),('NA'),('UNKNOWN'),('NO INFORMATION'),
           ('NO MATCH'),('NO DATA'),('NONE'),('?'),('0HP'),('000')
),

-- Bronze rows that have a usable key (same test as S1 in 04_silver.sql)
bronze_keyed AS (
    SELECT id, report_key, device_sequence_no, product_code_raw
    FROM bronze_reports
    WHERE NULLIF(TRIM(report_key), '') IS NOT NULL
      AND NULLIF(TRIM(device_sequence_no), '') IS NOT NULL
),

-- Quarantine of the current run
rejected_now AS (
    SELECT rejection_reason
    FROM silver_rejected
    WHERE run_id = (SELECT run_id FROM latest)
),

checks AS (

    -- ==================== SILVER ====================

    -- S1: every invalid row is in quarantine with its reason (expected/actual per reason)
    SELECT 1 AS ord, 'S1' AS id,
           'Invalid rows are quarantined with a reason, never dropped' AS descr,
           mk_a = mk_e AND dk_a = dk_e AND pc_a = pc_e AS ok,
           'missing_key=' || mk_a || '/' || mk_e ||
           ' duplicate_key=' || dk_a || '/' || dk_e ||
           ' missing_product_code=' || pc_a || '/' || pc_e AS det
    FROM (
        SELECT
            (SELECT COUNT(*) FROM bronze_reports) - (SELECT COUNT(*) FROM bronze_keyed)  AS mk_e,
            (SELECT COUNT(*) FROM bronze_keyed)
          - (SELECT COUNT(*) FROM (SELECT DISTINCT report_key, device_sequence_no
                                   FROM bronze_keyed) d)                                AS dk_e,
            (SELECT COUNT(*) FROM (
                SELECT product_code_raw,
                       ROW_NUMBER() OVER (PARTITION BY report_key, device_sequence_no
                                          ORDER BY id) AS rn
                FROM bronze_keyed) k
             WHERE rn = 1 AND NULLIF(TRIM(product_code_raw), '') IS NULL)             AS pc_e,
            (SELECT COUNT(*) FROM rejected_now WHERE rejection_reason = 'S1_missing_key')          AS mk_a,
            (SELECT COUNT(*) FROM rejected_now WHERE rejection_reason = 'S2_duplicate_key')        AS dk_a,
            (SELECT COUNT(*) FROM rejected_now WHERE rejection_reason = 'S3_missing_product_code') AS pc_a
    ) x

    UNION ALL
    SELECT 2, 'S2', 'Missing name or manufacturer: NULL + flag, never imputed',
           c = 0, c::text
    FROM (SELECT COUNT(*) AS c FROM silver_reports
          WHERE has_missing_generic_name <> (generic_name IS NULL)
             OR has_missing_manufacturer <> (manufacturer_name IS NULL)) x

    UNION ALL
    SELECT 3, 'S3', 'Junk manufacturers are flagged and kept',
           c = 0, c::text
    FROM (SELECT COUNT(*) AS c FROM silver_reports
          WHERE manufacturer_is_junk = FALSE
            AND manufacturer_name IS NOT NULL
            AND (UPPER(TRIM(manufacturer_name)) IN (SELECT marker FROM junk)
                 OR length(TRIM(manufacturer_name)) < 2)) x

    -- S4: a fixed reference list goes through the same rule as 04_silver.sql
    --     (longest keyword wins, then parent name A-Z). Catches wrong owners in the seed.
    UNION ALL
    SELECT 4, 'S4', 'Manufacturer names map to the correct parent company',
           COUNT(*) FILTER (WHERE got IS DISTINCT FROM expected) = 0,
           COALESCE(string_agg(raw_name || ' -> ' || COALESCE(got, 'NONE') || ' (expected ' || expected || ')', '; ')
                    FILTER (WHERE got IS DISTINCT FROM expected),
                    COUNT(*) || ' of ' || COUNT(*) || ' reference names mapped as expected')
    FROM (
        SELECT r.raw_name, r.expected,
               (SELECT p.parent_name
                FROM manufacturer_parent p
                CROSS JOIN LATERAL unnest(p.keywords) AS kw
                WHERE normalize_mfr_name(r.raw_name) LIKE '%' || kw || '%'
                ORDER BY length(kw) DESC, p.parent_name
                LIMIT 1) AS got
        FROM (VALUES
            ('NOBEL BIOCARE AB',          'ENVISTA'),
            ('MAQUET CRITICAL CARE AB',   'GETINGE'),
            ('DATASCOPE CORP',            'GETINGE'),
            ('STRAUMANN USA',             'STRAUMANN'),
            ('MEDTRONIC, INC.',           'MEDTRONIC'),
            ('COVIDIEN LP',               'MEDTRONIC'),
            ('BIOSENSE WEBSTER, INC.',    'JOHNSON & JOHNSON'),
            ('C.R. BARD, INC.',           'BECTON DICKINSON')
        ) AS r(raw_name, expected)
    ) t

    UNION ALL
    SELECT 5, 'S5', 'Each product code has one canonical name',
           c = 0, c::text
    FROM (SELECT COUNT(DISTINCT s.product_code) AS c
          FROM silver_reports s
          LEFT JOIN product_code_dim d ON d.product_code = s.product_code
          WHERE s.generic_name IS NOT NULL
            AND d.product_code IS NULL) x

    -- ---------- SILVER GATEKEEPERS ----------
    UNION ALL
    SELECT 6, 'GKS1', 'product_code is never NULL in silver',
           c = 0, c::text
    FROM (SELECT COUNT(*) AS c FROM silver_reports WHERE product_code IS NULL) x

    UNION ALL
    SELECT 7, 'GKS2', 'Reconciliation: bronze = silver + quarantine (current run)',
           b = s + r,
           'bronze=' || b || ' silver=' || s || ' rejected=' || r
    FROM (
        SELECT (SELECT COUNT(*) FROM bronze_reports) AS b,
               (SELECT COUNT(*) FROM silver_reports) AS s,
               (SELECT COUNT(*) FROM rejected_now)   AS r
    ) x

    -- ==================== GOLD ====================
    UNION ALL
    SELECT 8, 'G1', 'Every run is logged; the latest run succeeded and matches silver',
           COALESCE(r.status = 'success' AND r.rows_silver = (SELECT COUNT(*) FROM silver_reports), FALSE),
           COALESCE('status=' || r.status || ' rows_silver=' || r.rows_silver, 'no runs logged')
    FROM (SELECT 1) dummy
    LEFT JOIN LATERAL (SELECT status, rows_silver FROM pipeline_runs
                       ORDER BY started_at DESC LIMIT 1) r ON TRUE

    -- G2 (failed run is rolled back and logged) is a manual test of run_pipeline().

    UNION ALL
    SELECT 9, 'G3', 'The public anon role cannot read raw data',
           NOT has_table_privilege('anon', 'public.bronze_reports',  'SELECT')
       AND NOT has_table_privilege('anon', 'public.silver_reports',  'SELECT')
       AND NOT has_table_privilege('anon', 'public.silver_rejected', 'SELECT'),
           'privilege check on bronze, silver and quarantine'

    UNION ALL
    SELECT 10, 'G4', 'Row level security is on for all pipeline tables',
           c = 9, c || ' of 9 tables'
    FROM (SELECT COUNT(*) AS c
          FROM pg_class cl
          JOIN pg_namespace n ON n.oid = cl.relnamespace
          WHERE n.nspname = 'public'
            AND cl.relrowsecurity
            AND cl.relname IN ('bronze_reports','silver_reports','silver_rejected',
                               'product_stats','manufacturer_stats','product_code_dim',
                               'manufacturer_mapping','manufacturer_parent','pipeline_runs')) x

    -- ---------- GOLD GATEKEEPERS ----------
    UNION ALL
    SELECT 11, 'GKG1', 'Reconciliation: products (sum = silver rows)',
           p = s, 'products=' || p || ' silver=' || s
    FROM (SELECT COALESCE((SELECT SUM(total_reports) FROM product_stats), 0) AS p,
                 (SELECT COUNT(*) FROM silver_reports) AS s) x

    UNION ALL
    SELECT 12, 'GKG2', 'Reconciliation: manufacturers, junk and NULL excluded',
           m = s, 'manufacturers=' || m || ' silver=' || s
    FROM (SELECT COALESCE((SELECT SUM(total_reports) FROM manufacturer_stats), 0) AS m,
                 (SELECT COUNT(*) FROM silver_reports
                  WHERE manufacturer_is_junk = FALSE
                    AND manufacturer_normalized IS NOT NULL) AS s) x
)
SELECT id, descr, ok, det FROM checks ORDER BY ord;

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