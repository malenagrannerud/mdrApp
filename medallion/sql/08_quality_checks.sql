/*
  08_quality_checks.sql
  Snapshot of verify_pipeline() shown on the dashboard (observability).
  Written by publish_gold.py. Run on local Postgres and on Supabase.
*/

CREATE TABLE IF NOT EXISTS quality_checks (
  check_id    text PRIMARY KEY,
  description text NOT NULL,
  passed      boolean NOT NULL,
  detail      text,
  checked_at  timestamptz NOT NULL DEFAULT now()
);

-- RULE G8: least privilege. anon may only read.
ALTER TABLE quality_checks ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.quality_checks TO service_role;
GRANT SELECT ON public.quality_checks TO anon;

DROP POLICY IF EXISTS anon_read_quality_checks ON quality_checks;
CREATE POLICY anon_read_quality_checks ON quality_checks
    FOR SELECT TO anon USING (TRUE);