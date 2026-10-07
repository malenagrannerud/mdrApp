/*
  06_pipeline.sql
  Author: Malena | Updated: 2026-10-07

 This file is a log file 
    1 - Allows service_role to run the pipeline (silver + gold) in one transaction.
    2 - Defines run_pipeline() which runs silver -> gold and logs the run in pipeline_runs.


  RULES IMPLEMENTED
    G7  Failed run is rolled back and logged
    G8  Least privilege (RLS on pipeline_runs)
    GKS Silver -> Gold gatekeeper (enforced in refresh_silver_reports)
    GKG Gold -> Dashboard gatekeeper (enforced in refresh_gold)


  DATA FLOW 
    SELECT * FROM run_pipeline();
       │
       ├── refresh_silver_reports()
       │      ├── DELETE silver_reports
       │      ├── klassificera alla bronze-rader
       │      ├── INSERT silver_rejected 
       │      ├── INSERT silver_reports 
       │      └── S7: bronze = silver + rejected? annars RAISE
       │
       ├── refresh_gold()
       │      ├── DELETE product_stats, manufacturer_stats
       │      ├── INSERT product_stats (G1)
       │      ├── INSERT manufacturer_stats (G2)
       │      ├── G3: sum = silver? annars RAISE
       │      └── G4: total_reports > 0? annars RAISE
       │
       └── INSERT pipeline_runs (success eller failed)
    
*/

-- ============================================================
-- Grants for service_role (function execution)
-- ============================================================
GRANT EXECUTE ON FUNCTION public.run_pipeline()           TO service_role;
GRANT EXECUTE ON FUNCTION public.refresh_silver_reports() TO service_role;
GRANT EXECUTE ON FUNCTION public.refresh_gold()           TO service_role;


-- ============================================================
-- The one command
-- ============================================================
-- ============================================================
-- The one command
-- ============================================================
DROP FUNCTION IF EXISTS run_pipeline();

CREATE OR REPLACE FUNCTION run_pipeline()
RETURNS TABLE(o_run_id uuid, o_status text, o_bronze bigint,
              o_written bigint, o_rejected bigint, o_error text) AS $$
DECLARE
    v_started  timestamptz := clock_timestamp();
    v_run_id   uuid;
    v_bronze   bigint;
    v_written  bigint;
    v_rejected bigint;
    v_prod     bigint;
    v_manu     bigint;
    v_err      text;
BEGIN
    BEGIN
        SELECT s.o_run_id, s.o_bronze, s.o_written, s.o_rejected
          INTO v_run_id, v_bronze, v_written, v_rejected
          FROM refresh_silver_reports() s;

        SELECT g.o_products, g.o_manufacturers
          INTO v_prod, v_manu
          FROM refresh_gold() g;

    EXCEPTION WHEN OTHERS THEN
        v_err    := SQLERRM;
        v_run_id := gen_random_uuid();
        SELECT COUNT(*) INTO v_bronze FROM bronze_reports;

        INSERT INTO pipeline_runs (run_id, started_at, status, rows_bronze, error_message)
        VALUES (v_run_id, v_started, 'failed', v_bronze, v_err);

        RETURN QUERY SELECT v_run_id, 'failed'::text, v_bronze,
                            NULL::bigint, NULL::bigint, v_err;
        RETURN;
    END;

    INSERT INTO pipeline_runs (run_id, started_at, status, rows_bronze, rows_silver,
                               rows_rejected, products_in_gold, manufacturers_in_gold)
    VALUES (v_run_id, v_started, 'success', v_bronze, v_written,
            v_rejected, v_prod, v_manu);

    RETURN QUERY SELECT v_run_id, 'success'::text, v_bronze,
                        v_written, v_rejected, NULL::text;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- Grants for service_role (function execution)
-- ============================================================
GRANT EXECUTE ON FUNCTION public.run_pipeline()           TO service_role;
GRANT EXECUTE ON FUNCTION public.refresh_silver_reports() TO service_role;
GRANT EXECUTE ON FUNCTION public.refresh_gold()           TO service_role;


-- ============================================================
-- Usage
-- ============================================================
-- Run everything (silver + gold) as one transaction:
--   SELECT * FROM run_pipeline();
--
-- Check the last run:
--   SELECT run_id, started_at, status, rows_bronze, rows_silver, rows_rejected,
--          products_in_gold, manufacturers_in_gold, error_message
--   FROM pipeline_runs
--   ORDER BY started_at DESC
--   LIMIT 5;