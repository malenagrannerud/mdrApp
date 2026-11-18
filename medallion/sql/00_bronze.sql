/*
  00_bronze.sql
  Author: Malena | Updated: 2026-11-18

  Creates bronze_reports, the table the ingest loads into, and makes it append-only.
  Run once, before bronze_ingest.py. It is safe to run again: it never drops or changes data.

Rules:
| B1 | No data changed. The archive is immutable
| B2 | Data is saved in original format
| B3 | Each row has a timestamp

  One row per line of a file:
    source_file  which file the line comes from
    row_num      the line number in the file (the header is line 1)
    raw          the line exactly as it is in the file
    ingested_at  when the row was loaded (B3)
*/

-- ============================================================
-- TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS bronze_reports (
    source_file  text        NOT NULL,
    row_num      bigint      NOT NULL,
    raw          text        NOT NULL,
    ingested_at  timestamptz NOT NULL,
    PRIMARY KEY (source_file, row_num)
);

ALTER TABLE bronze_reports ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON public.bronze_reports TO service_role;

-- ============================================================
-- B1
-- ============================================================
CREATE OR REPLACE FUNCTION prevent_bronze_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'bronze_reports is append-only: % operations are not permitted', TG_OP;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_bronze_immutability ON bronze_reports;
CREATE TRIGGER enforce_bronze_immutability
    BEFORE UPDATE OR DELETE ON bronze_reports
    FOR EACH ROW
    EXECUTE FUNCTION prevent_bronze_mutation();

DROP TRIGGER IF EXISTS enforce_bronze_no_truncate ON bronze_reports;
CREATE TRIGGER enforce_bronze_no_truncate
    BEFORE TRUNCATE ON bronze_reports
    FOR EACH STATEMENT
    EXECUTE FUNCTION prevent_bronze_mutation();