-- ============================================================
-- 03_silver.sql
-- Author: Malena
-- Created: 2026-08-02
-- Description: Creates tables for the medallion architecture
--
-- Input:  bronze_reports (append-only raw data)
-- Output: silver_reports (cleaned, deduplicated, normalized)
-- Return value: Function returns number of rows written (rows_written)
--
-- Idempotent: silver_reports is TRUNCATEd before insert (so re-running produces the same result as long as bronze is unchanged.)
--
-- DATA CLEANING:

--   Rule 2: Rows with invalid manufacturer names are filtered out (NULL manufacturers are allowed through)
--   Rule 3: Duplicate report_key rows are removed, first occurrence  wins
--           
-- NORMALIZATION:
--   Rule 4: Manufacturer names are normalized:
--             - Commas and periods are replaced with spaces
--             - Whitespace is collapsed to single spaces
--             - Legal suffixesremoved 
--   Rule 5: Known name variants are merged into a canonical name (hardcoded in CASE — currently NOBEL BIOCARE, MEDTRONIC, OLYMPUS variants)
--   Rule 6: Brand/generic names are uppercased and whitespace collapsed 
--   Rule 7: Empty strings ('') are converted to NULL
--
-- ============================================================

CREATE OR REPLACE FUNCTION refresh_silver_reports()
RETURNS TABLE(rows_written BIGINT) AS $$
DECLARE
    written BIGINT;
BEGIN

    TRUNCATE TABLE silver_reports;

    WITH
    invalid_values AS (
        SELECT unnest(ARRAY[
            'NI', 'UNK', '*', 'N/A', 'NA', 'UNKNOWN',
            'NO INFORMATION', '?', 'NONE'
        ]) AS val
    ),

    -- RULE 3 
    deduped AS (
        SELECT
            *,
            ROW_NUMBER() OVER (
                PARTITION BY report_key
                ORDER BY id
            ) AS row_number
        FROM bronze_reports
    ),

    cleaned AS (
        SELECT
            d.report_key,
            d.product_code_raw AS product_code,

            -- RULE 6 & 7
            NULLIF(
                UPPER(TRIM(regexp_replace(d.brand_name_raw, '\s+', ' ', 'g'))),
                ''
            ) AS brand_name,

            -- RULE 6 & 7
            NULLIF(
                UPPER(TRIM(regexp_replace(d.generic_name_raw, '\s+', ' ', 'g'))),
                ''
            ) AS generic_name,

             -- → RULE 4, RULE 7
            NULLIF(
                TRIM(
                    regexp_replace(
                        regexp_replace(
                            replace(replace(d.manufacturer_raw, ',', ' '), '.', ' '),
                            '\s+', ' ', 'g'
                        ),
                        '\s(inc|llc|ltd|co|corp|corporation|as|ag|gmbh|sa|ab)$',
                        '', 'i'
                    )
                ),
                ''
            ) AS manufacturer_normalized

        FROM deduped d
        WHERE d.row_number = 1                      -- RULE 3
          AND d.product_code_raw IS NOT NULL        -- RULE 1
          AND d.product_code_raw <> ''              -- RULE 1
          AND (
                d.manufacturer_raw IS NULL          -- RULE 2
                OR (
                    UPPER(TRIM(d.manufacturer_raw)) NOT IN (SELECT val FROM invalid_values)
                    AND length(TRIM(d.manufacturer_raw)) >= 2
                )
              )
    ),

    -- RULE 5
    merged AS (
        SELECT
            report_key,
            product_code,
            brand_name,
            generic_name,
            CASE UPPER(manufacturer_normalized)
                WHEN 'NOBEL BIOCARE GÖTEBORG' THEN 'NOBEL BIOCARE'
                WHEN 'MEDTRONIC MINIMED' THEN 'MEDTRONIC'
                WHEN 'MEDTRONIC PUERTO RICO OPERATIONS' THEN 'MEDTRONIC'
                WHEN 'AIZU OLYMPUS' THEN 'OLYMPUS'
                WHEN 'SHIRAKAWA OLYMPUS' THEN 'OLYMPUS'
                ELSE manufacturer_normalized
            END AS manufacturer_name
        FROM cleaned
    )

    INSERT INTO silver_reports (
        report_key,
        product_code,
        brand_name,
        generic_name,
        manufacturer_name
    )
    SELECT
        report_key,
        product_code,
        brand_name,
        generic_name,
        manufacturer_name
    FROM merged;

    GET DIAGNOSTICS written = ROW_COUNT;
    RETURN QUERY SELECT written;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM refresh_silver_reports();
