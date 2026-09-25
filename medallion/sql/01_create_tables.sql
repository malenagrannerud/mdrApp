/* 
  01_create_tables.sql 
  Author: Malena 
  Created: 2026-08-02
  Updated: 2026-09-25
  Description: Creates tables for the medallion architecture, including GENERIC_NAME 
 */

-- ------------------------------------------------------------------------
/* 
BRONZE LAYER: 
  Creates bronze_reports to save raw data
  Adds a time stamp for each row
*/

-- TRUNCATE TABLE bronze_reports; -- RUN TO DELETE DATA, FOR TESTS

CREATE TABLE IF NOT EXISTS bronze_reports (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  report_key text,
  device_event_key text,        
  generic_name text,            -- Rå data från python-ingestorn
  product_code_raw text,
  manufacturer_raw text,
  inserted_at timestamptz NOT NULL DEFAULT now(),
  source_file text NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_bronze_report_key ON bronze_reports (report_key);
CREATE INDEX IF NOT EXISTS idx_bronze_device_event_key ON bronze_reports (device_event_key);   
CREATE INDEX IF NOT EXISTS idx_bronze_source_file ON bronze_reports (source_file);

-- prevent_bronze_mutation()
-- Makes bronze_reports immutable and append-only 
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


-- ---------------------- SILVER LAYER: Creates silver_reports and silver_rejected ----------------------
CREATE TABLE IF NOT EXISTS silver_reports (
  device_event_key text PRIMARY KEY,
  report_key text,
  generic_name text NOT NULL,   -- Tvättad och säkrad produktkategori
  product_code text NOT NULL,
  manufacturer_name text,
  _silver_updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_silver_report_key ON silver_reports (report_key);
CREATE INDEX IF NOT EXISTS idx_silver_product_code ON silver_reports (product_code);
CREATE INDEX IF NOT EXISTS idx_silver_manufacturer ON silver_reports (manufacturer_name);
CREATE INDEX IF NOT EXISTS idx_silver_generic_name ON silver_reports (generic_name);

-- SILVER_REJECTED: Karantän för rader som misslyckas i valideringen
CREATE TABLE IF NOT EXISTS silver_rejected (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  bronze_id bigint NOT NULL,
  device_event_key text,
  report_key text,
  generic_name text,
  product_code text,
  manufacturer_name text,
  rejection_reason text NOT NULL,
  _rejected_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_silver_rejected_reason ON silver_rejected (rejection_reason);


-- ---------------------- GOLD LAYER: Aggregerad data för BI ----------------------

-- SVAR PÅ FRÅGA 1: Behåller product_code som PK (GR4), har generic_name för dashboarden
CREATE TABLE IF NOT EXISTS product_stats (
  product_code text PRIMARY KEY,
  generic_name text NOT NULL,
  total_reports integer NOT NULL
);

-- SVAR PÅ FRÅGA 2: Mest rapporterade tillverkare
CREATE TABLE IF NOT EXISTS manufacturer_stats (
  name text PRIMARY KEY,
  total_reports integer NOT NULL
);
