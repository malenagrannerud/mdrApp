/*
  05_pipeline.sql
  WHAT:  pipeline_runs (a log of every run) + run_pipeline() (one command for everything).
  WHY:   You should never have to remember "silver, then gold". One command,
         fixed order, and every run is logged so you can answer
         "when did it last run, and did the numbers add up?".
*/

-- ============================================================
-- The run log (observability)
-- ============================================================
CREATE TABLE IF NOT EXISTS pipeline_runs (
  run_id                uuid PRIMARY KEY,        -- same id as on silver_reports / silver_rejected
  started_at            timestamptz NOT NULL,
  finished_at           timestamptz NOT NULL DEFAULT now(),
  status                text NOT NULL CHECK (status IN ('success', 'failed')),
  rows_bronze           bigint,
  rows_silver           bigint,
  rows_rejected         bigint,
  products_in_gold      bigint,
  manufacturers_in_gold bigint,
  error_message         text                     -- filled only when status = 'failed'
);

-- WHY RLS? Supabase exposes tables through its API. With RLS on and only a
-- read policy, the public (anon) key can read the log but never change it.
ALTER TABLE pipeline_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read pipeline_runs" ON pipeline_runs;
CREATE POLICY "public read pipeline_runs" ON pipeline_runs
  FOR SELECT USING (true);

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
    -- The inner BEGIN...EXCEPTION block works like a safety net:
    -- if silver OR gold fails, everything done inside it is undone,
    -- and we can still write a 'failed' row in the log afterwards.
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
