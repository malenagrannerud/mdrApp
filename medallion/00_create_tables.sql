-- ============================================================
-- 00_create_tables.sql
--
-- Database schema for FDA MAUDE medallion pipeline
-- SQL Editor → New query → klistra in → Run
--
--
-- Bronze  = raw source data
-- Silver  = cleaned and deduplicated data
-- Gold    = aggregated business-ready data
-- ============================================================


-- ============================================================
-- BRONZE
-- ============================================================

CREATE TABLE IF NOT EXISTS bronze_reports (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    report_key TEXT,

    product_code_raw TEXT,
    brand_name_raw TEXT,
    generic_name_raw TEXT,
    manufacturer_raw TEXT,

    _inserted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    _source_file TEXT NOT NULL
);


-- Indexes used when querying Bronze

CREATE INDEX IF NOT EXISTS idx_bronze_report_key
    ON bronze_reports (report_key);

CREATE INDEX IF NOT EXISTS idx_bronze_source_file
    ON bronze_reports (_source_file);


-- Bronze should be append-only.
-- Existing rows cannot be updated or deleted.

CREATE OR REPLACE RULE protect_bronze_updates
AS ON UPDATE TO bronze_reports
DO INSTEAD NOTHING;

CREATE OR REPLACE RULE protect_bronze_deletes
AS ON DELETE TO bronze_reports
DO INSTEAD NOTHING;


-- ============================================================
-- SILVER
-- ============================================================

CREATE TABLE IF NOT EXISTS silver_reports (
    report_key TEXT PRIMARY KEY,

    product_code TEXT NOT NULL,

    brand_name TEXT,

    generic_name TEXT,

    manufacturer_name TEXT,

    _silver_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE INDEX IF NOT EXISTS idx_silver_product_code
    ON silver_reports (product_code);

CREATE INDEX IF NOT EXISTS idx_silver_manufacturer
    ON silver_reports (manufacturer_name);


-- ============================================================
-- GOLD: PRODUCT STATISTICS
-- ============================================================

CREATE TABLE IF NOT EXISTS product_stats (
    product_code TEXT PRIMARY KEY,

    total_reports INTEGER NOT NULL,

    brand_name TEXT,

    generic_name TEXT,

    manufacturer_name TEXT
);


-- ============================================================
-- GOLD: MANUFACTURER STATISTICS
-- ============================================================

CREATE TABLE IF NOT EXISTS manufacturer_stats (
    name TEXT PRIMARY KEY,

    count INTEGER NOT NULL
);