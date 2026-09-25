-- ============================================================
-- 03_silver.sql
-- Author: Malena
-- Created: 2026-08-02, Updated: 2026-09-25
-- Description: Cleans, deduplicates and normalizes bronze_reports into silver_reports. 
--              Rejected rows are routed to silver_rejected for audit and replay.
--
-- Idempotent: silver_reports is TRUNCATEd before insert. silver_rejected is append-only to preserve audit history.
--
-- input : bronze_reports
-- output: silver_reports, silver_rejected
--
-- RULES APPLIED (FROM PIPELINE.md):
--   SR1 – Type conversion: Explicit text mapping.
--   SR2 – Deduplication: Keep first (earliest) row per device_event_key.
--   SR3 – Completeness: Missing manufacturer (NULL) is rejected.
--   SR4 – Validity: Junk manufacturer values or length < 2 are rejected.
--   SR5 – Normalization: Strip dots, collapse whitespace, remove legal suffixes from manufacturer.
--   SR6 – Normalization: GENERIC_NAME is trimmed, capitalized, and defaults to 'UNKNOWN PRODUCT'.
--   SR7 – Constraints: Unique/not_null on PK device_event_key.
-- ============================================================


-- ======================================= STEP 0: VERIFY =======================================

-- HOW MANY device_event_key APPEAR > ONCE? (Pre-check for SR2)
SELECT
    device_event_key,
    COUNT(*) AS times_seen
FROM bronze_reports
GROUP BY device_event_key
HAVING COUNT(*) > 1
ORDER BY times_seen DESC;

-- HOW MANY report_key APPEAR > ONCE?
SELECT
    report_key,
    COUNT(*) AS times_seen
FROM bronze_reports
GROUP BY report_key
HAVING COUNT(*) > 1
ORDER BY times_seen DESC;

-- HOW MANY JUNK MANUFACTURER VALUES ARE THERE? (Pre-check for SR4)
SELECT COUNT(*) AS junk_manufacturer_count
FROM bronze_reports
WHERE UPPER(TRIM(manufacturer_raw)) IN (
    'NI', 'UNK', '*', 'N/A', 'NA', 'UNKNOWN',
    'NO INFORMATION', '?', 'NONE', 'NO MATCH', 'NO DATA'
)
OR length(TRIM(manufacturer_raw)) < 2;

-- HOW MANY ROWS ARE MISSING A MANUFACTURER? (Pre-check for SR3)
SELECT COUNT(*) AS missing_manufacturer_count
FROM bronze_reports
WHERE manufacturer_raw IS NULL;


-- ======================================= STEP 1: RUN SILVER =======================================

DROP FUNCTION IF EXISTS refresh_silver_reports();

CREATE OR REPLACE FUNCTION refresh_silver_reports()
RETURNS TABLE(rows_written BIGINT, rows_rejected BIGINT) AS $$
DECLARE
    written  BIGINT;
    rejected BIGINT;
BEGIN

    -- Tömmer silver_reports för att garantera idempotens. 
    -- silver_rejected rörs INTE här eftersom den ska vara append-only för historik (Audit log).
    TRUNCATE TABLE silver_reports;

    -- ========================================================
    -- STEP 1.1: IDENTIFY AND ROUTE REJECTED ROWS TO QUARANTINE. Applies rules: SR2, SR3, SR4
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
            r.generic_name,                                              
            r.product_code_raw AS product_code,
            r.manufacturer_raw AS manufacturer_name,
            CASE
                WHEN r.row_number > 1
                    THEN 'duplicate_device_event_key'                   -- SR2
                WHEN r.manufacturer_raw IS NULL
                    THEN 'missing_manufacturer'                         -- SR3
                WHEN UPPER(TRIM(r.manufacturer_raw)) IN
                     (SELECT marker FROM junk_markers)
                    THEN 'invalid_manufacturer'                         -- SR4
                WHEN length(TRIM(r.manufacturer_raw)) < 2
                    THEN 'invalid_manufacturer'                         -- SR4
                ELSE 'unknown_reason'
            END AS rejection_reason
        FROM ranked r
        WHERE r.row_number > 1                                      -- SR2
           OR r.manufacturer_raw IS NULL                            -- SR3
           OR UPPER(TRIM(r.manufacturer_raw)) IN
              (SELECT marker FROM junk_markers)                     -- SR4
           OR length(TRIM(r.manufacturer_raw)) < 2                  -- SR4
    )

    INSERT INTO silver_rejected (
        bronze_id,
        device_event_key,
        report_key,
        generic_name,                                              
        product_code,
        manufacturer_name,
        rejection_reason
    )
    SELECT
        bronze_id,
        device_event_key,
        report_key,
        generic_name,
        product_code,
        manufacturer_name,
        rejection_reason
    FROM rejected_rows;

    GET DIAGNOSTICS rejected = ROW_COUNT;


    -- ========================================================
    -- STEP 1.2: CLEAN, NORMALIZE AND INSERT VALID ROWS. Applies rules: SR1, SR2, SR3, SR4, SR5, SR6, SR7
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
            r.device_event_key,                                      -- SR7 (PK-kandidat)
            r.report_key,
            
            -- SR6: Normaliserar GENERIC_NAME (trimmar, UPPERCASE, fallback till 'UNKNOWN PRODUCT')
            COALESCE(
                NULLIF(UPPER(TRIM(r.generic_name)), ''), 
                'UNKNOWN PRODUCT'
            ) AS generic_name_clean,

            r.product_code_raw AS product_code,                      -- SR1

            -- SR5: Normaliserar tillverkare (tar bort punkter, kommatecken, legal suffixes)
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
        WHERE r.row_number = 1                                      -- SR2
          AND r.device_event_key IS NOT NULL                         -- SR7 (Not Null)
          AND r.product_code_raw IS NOT NULL
          AND r.product_code_raw <> ''
          AND r.manufacturer_raw IS NOT NULL                         -- SR3
          AND UPPER(TRIM(r.manufacturer_raw)) NOT IN
              (SELECT marker FROM junk_markers)                      -- SR4
          AND length(TRIM(r.manufacturer_raw)) >= 2                  -- SR4
    ),

    merged AS (
        SELECT
            device_event_key,
            report_key,
            generic_name_clean AS generic_name,
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
        generic_name,                                               
        product_code,
        manufacturer_name
    )
    SELECT
        device_event_key,
        report_key,
        generic_name,
        product_code,
        manufacturer_name
    FROM merged;

    GET DIAGNOSTICS written = ROW_COUNT;

    RETURN QUERY SELECT written, rejected;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM refresh_silver_reports();
