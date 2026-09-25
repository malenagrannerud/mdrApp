-- ============================================================
-- 03_silver.sql
-- Author: Malena
-- Created: 2026-08-02
-- Updated: 2026-09-25
-- Description: Cleans, deduplicates and normalizes bronze_reports into silver_reports. Rejected rows are routed
--              to silver_rejected for audit and replay.
--
-- Idempotent: silver_reports is TRUNCATEd before insert. silver_rejected is append-only to preserve audit history.
--
-- input : bronze_reports
-- output: silver_reports, silver_rejected
--
-- ============================================================


-- ======================================= DEVICE_EVENT_KEY - DEDUP =======================================

-- HOW MANY device_event_key APPEAR > ONCE?
SELECT
    device_event_key,
    COUNT(*) AS times_seen
FROM bronze_reports
GROUP BY device_event_key
HAVING COUNT(*) > 1
ORDER BY times_seen DESC;

-- ======================================= DATA CLEANING =======================================

-- R2: HOW MANY JUNK MANUFACTURER VALUES ARE THERE?
SELECT COUNT(*) AS junk_manufacturer_count
FROM bronze_reports
WHERE UPPER(TRIM(manufacturer_raw)) IN (
    'NI', 'UNK', '*', 'N/A', 'NA', 'UNKNOWN',
    'NO INFORMATION', '?', 'NONE'
)
OR length(TRIM(manufacturer_raw)) < 2;


-- HOW MANY ROWS ARE MISSING A MANUFACTURER?
SELECT COUNT(*) AS missing_manufacturer_count
FROM bronze_reports
WHERE manufacturer_raw IS NULL;


-- ======================================= RUN SILVER =======================================

TRUNCATE TABLE silver_reports;
TRUNCATE TABLE silver_rejected;

DROP FUNCTION IF EXISTS refresh_silver_reports();

CREATE OR REPLACE FUNCTION refresh_silver_reports()
RETURNS TABLE(rows_written BIGINT, rows_rejected BIGINT) AS $$
DECLARE
    written  BIGINT;
    rejected BIGINT;
BEGIN

    TRUNCATE TABLE silver_reports;

    -- ========================================================
    -- STEP 1: IDENTIFY REJECTED ROWS (R1, R2, R3)
    -- ========================================================
    WITH
    junk_markers AS (
        SELECT unnest(ARRAY[
            'NI', 'UNK', '*', 'N/A', 'NA', 'UNKNOWN',
            'NO INFORMATION', 'NO MATCH', 'NO DATA', 'NONE', '?'
        ]) AS marker
    ),

    ranked AS (
        SELECT
            *,
            ROW_NUMBER() OVER (
                PARTITION BY device_event_key
                ORDER BY id
            ) AS row_number
        FROM bronze_reports
    ),

    rejected_rows AS (
        SELECT
            r.id AS bronze_id,
            r.device_event_key,
            r.report_key,
            r.product_code_raw AS product_code,
            r.manufacturer_raw AS manufacturer_name,
            CASE
                WHEN r.row_number > 1
                    THEN 'duplicate_device_event_key'                   -- R1
                WHEN r.manufacturer_raw IS NULL
                    THEN 'missing_manufacturer'                         -- R3
                WHEN UPPER(TRIM(r.manufacturer_raw)) IN
                     (SELECT marker FROM junk_markers)
                    THEN 'invalid_manufacturer'                         -- R2
                WHEN length(TRIM(r.manufacturer_raw)) < 2
                    THEN 'invalid_manufacturer'                         -- R2
                ELSE 'unknown_reason'
            END AS rejection_reason
        FROM ranked r
        WHERE r.row_number > 1
           OR r.manufacturer_raw IS NULL
           OR UPPER(TRIM(r.manufacturer_raw)) IN
              (SELECT marker FROM junk_markers)
           OR length(TRIM(r.manufacturer_raw)) < 2
    )

    INSERT INTO silver_rejected (
        bronze_id,
        device_event_key,
        report_key,
        product_code,
        manufacturer_name,
        rejection_reason
    )
    SELECT
        bronze_id,
        device_event_key,
        report_key,
        product_code,
        manufacturer_name,
        rejection_reason
    FROM rejected_rows;

    GET DIAGNOSTICS rejected = ROW_COUNT;


    -- ========================================================
    -- STEP 2: CLEAN AND INSERT VALID ROWS (R1, R2, R3, R4)
    -- ========================================================
    WITH
    junk_markers AS (
        SELECT unnest(ARRAY[
            'NI', 'UNK', '*', 'N/A', 'NA', 'UNKNOWN',
            'NO INFORMATION', 'NO MATCH', 'NO DATA', 'NONE', '?'
        ]) AS marker
    ),

    ranked AS (
        SELECT
            *,
            ROW_NUMBER() OVER (
                PARTITION BY device_event_key
                ORDER BY id
            ) AS row_number
        FROM bronze_reports
    ),

    cleaned AS (
        SELECT
            r.device_event_key,
            r.report_key,
            r.product_code_raw AS product_code,

            -- R4: strip dots, collapse whitespace, remove legal suffixes
            NULLIF(
                TRIM(
                    regexp_replace(
                        regexp_replace(
                            regexp_replace(r.manufacturer_raw, '\.', '', 'g'),
                            ',.*$', '', 'g'
                        ),
                        '\s(inc|llc|ltd|co|corp|corporation|as|ag|gmbh|sa|ab)$',
                        '', 'i'
                    )
                ),
                ''
            ) AS manufacturer_normalized

        FROM ranked r
        WHERE r.row_number = 1                              -- R1
          AND r.device_event_key IS NOT NULL                 -- PK
          AND r.product_code_raw IS NOT NULL
          AND r.product_code_raw <> ''
          AND r.manufacturer_raw IS NOT NULL                 -- R3
          AND UPPER(TRIM(r.manufacturer_raw)) NOT IN
              (SELECT marker FROM junk_markers)              -- R2
          AND length(TRIM(r.manufacturer_raw)) >= 2          -- R2
    ),

    merged AS (
        SELECT
            device_event_key,
            report_key,
            product_code,

            CASE
                WHEN UPPER(manufacturer_normalized) LIKE 'DENTSPLY%'      THEN 'DENTSPLY'
                WHEN UPPER(manufacturer_normalized) LIKE 'ALCON%'         THEN 'ALCON'
                WHEN UPPER(manufacturer_normalized) LIKE 'MEDTRONIC%'     THEN 'MEDTRONIC'
                WHEN UPPER(manufacturer_normalized) LIKE '%OLYMPUS%'      THEN 'OLYMPUS'
                WHEN UPPER(manufacturer_normalized) LIKE 'NOBEL BIOCARE%' THEN 'NOBEL BIOCARE'
                ELSE manufacturer_normalized
            END AS manufacturer_name

        FROM cleaned
    )

    INSERT INTO silver_reports (
        device_event_key,
        report_key,
        product_code,
        manufacturer_name
    )
    SELECT
        device_event_key,
        report_key,
        product_code,
        manufacturer_name
    FROM merged;

    GET DIAGNOSTICS written = ROW_COUNT;

    RETURN QUERY SELECT written, rejected;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM refresh_silver_reports();
