-- ============================================================
-- 03_silver.sql
--
-- Input:  bronze_reports (append-only raw data)
-- Output: silver_reports (cleaned, deduplicated, normalized)
-- Return value: Function returns number of rows written (rows_written)
--


-- Idempotent: silver_reports is TRUNCATEd before insert (so re-running produces the same result as long as bronze is unchanged.)
--
-- Data Cleaning:
--   Rule 1: Rows without or with empty product_code_raw are filtered out
--   Rule 2: Rows with invalid manufacturer (blocklist) or
--           manufacturer name shorter than 2 characters are filtered out
--           (NULL manufacturers are allowed through)
--           Blocklist: 'NI','UNK','*','N/A','NA','UNKNOWN',
--                      'NO INFORMATION','?','NONE'
--   Rule 3: Duplicate report_key rows are removed 
--           
-- Normalization rules:
--   Rule 4: Manufacturer names are normalized:
--             - Commas and periods are replaced with spaces
--             - Whitespace is collapsed to single spaces
--             - Legal suffixes (Inc/LLC/Ltd/Co/Corp/Corporation/AS/AG/GmbH/SA/AB) are removed from the END of the name only
--   Rule 5: Known name variants are merged into a canonical name (hardcoded in CASE — currently NOBEL BIOCARE, MEDTRONIC, OLYMPUS variants)
--   Rule 6: Brand/generic names are uppercased and whitespace collapsed (defensive — current source data is already uppercase)
--   Rule 7: Empty strings ('') are converted to NULL
--

-- ============================================================

-- ============================================================
-- 03_silver.sql (Supabase SQL Editor)
-- Author: Malena
-- Created: 2026-08-02
-- Description: Creates tables for the medallion architecture
-- ============================================================


CREATE OR REPLACE FUNCTION refresh_silver_reports()
RETURNS TABLE(rows_written BIGINT) AS $$
DECLARE
    written BIGINT;
BEGIN

    -- Rensa Silver helt inför en ny fullständig körning.
    -- (Bronze är källan till sanning, Silver byggs alltid om från grunden.)
    TRUNCATE TABLE silver_reports;

    WITH

    -- Skräplista över ogiltiga tillverkarvärden (motsvarar INVALID_VALUES)
    invalid_values AS (
        SELECT unnest(ARRAY[
            'NI', 'UNK', '*', 'N/A', 'NA', 'UNKNOWN',
            'NO INFORMATION', '?', 'NONE'
        ]) AS val
    ),

    -- Första förekomsten av varje report_key (dedup)
    deduped AS (
        SELECT
            *,
            ROW_NUMBER() OVER (
                PARTITION BY report_key
                ORDER BY id
            ) AS row_number
        FROM bronze_reports
    ),

    -- Filtrera + normalisera
    cleaned AS (
        SELECT
            d.report_key,
            d.product_code_raw AS product_code,

            -- Brand/generic: versalisera + kollapsa mellanslag, eller NULL om skräpvärde
            NULLIF(
                UPPER(TRIM(regexp_replace(d.brand_name_raw, '\s+', ' ', 'g'))),
                ''
            ) AS brand_name,

            NULLIF(
                UPPER(TRIM(regexp_replace(d.generic_name_raw, '\s+', ' ', 'g'))),
                ''
            ) AS generic_name,

            -- Tillverkare: ta bort punkt/komma, kollapsa mellanslag,
            -- ta bort juridiska suffix (inc/llc/ltd/co/corp/as/ag/gmbh/sa/ab)
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
        WHERE d.row_number = 1                          -- bara första förekomsten av report_key
          AND d.product_code_raw IS NOT NULL             -- måste ha produktkod
          AND d.product_code_raw <> ''
          AND (
                d.manufacturer_raw IS NULL
                OR (
                    UPPER(TRIM(d.manufacturer_raw)) NOT IN (SELECT val FROM invalid_values)
                    AND length(TRIM(d.manufacturer_raw)) >= 2
                )
              )
    ),

    -- Slå ihop kända namnvarianter till kanoniskt namn
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


-- Kör funktionen direkt när filen körs, så Silver är uppdaterat på en gång
SELECT * FROM refresh_silver_reports();
CREATE OR REPLACE FUNCTION refresh_silver_reports()
RETURNS TABLE(rows_written BIGINT) AS $$
DECLARE
    written BIGINT;
BEGIN

    -- Rensa Silver helt inför en ny fullständig körning.
    -- (Bronze är källan till sanning, Silver byggs alltid om från grunden.)
    TRUNCATE TABLE silver_reports;

    WITH

    -- Skräplista över ogiltiga tillverkarvärden (motsvarar INVALID_VALUES)
    invalid_values AS (
        SELECT unnest(ARRAY[
            'NI', 'UNK', '*', 'N/A', 'NA', 'UNKNOWN',
            'NO INFORMATION', '?', 'NONE'
        ]) AS val
    ),

    -- Första förekomsten av varje report_key (dedup)
    deduped AS (
        SELECT
            *,
            ROW_NUMBER() OVER (
                PARTITION BY report_key
                ORDER BY id
            ) AS row_number
        FROM bronze_reports
    ),

    -- Filtrera + normalisera
    cleaned AS (
        SELECT
            d.report_key,
            d.product_code_raw AS product_code,

            -- Brand/generic: versalisera + kollapsa mellanslag, eller NULL om skräpvärde
            NULLIF(
                UPPER(TRIM(regexp_replace(d.brand_name_raw, '\s+', ' ', 'g'))),
                ''
            ) AS brand_name,

            NULLIF(
                UPPER(TRIM(regexp_replace(d.generic_name_raw, '\s+', ' ', 'g'))),
                ''
            ) AS generic_name,

            -- Tillverkare: ta bort punkt/komma, kollapsa mellanslag,
            -- ta bort juridiska suffix (inc/llc/ltd/co/corp/as/ag/gmbh/sa/ab)
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
        WHERE d.row_number = 1                          -- bara första förekomsten av report_key
          AND d.product_code_raw IS NOT NULL             -- måste ha produktkod
          AND d.product_code_raw <> ''
          AND (
                d.manufacturer_raw IS NULL
                OR (
                    UPPER(TRIM(d.manufacturer_raw)) NOT IN (SELECT val FROM invalid_values)
                    AND length(TRIM(d.manufacturer_raw)) >= 2
                )
              )
    ),

    -- Slå ihop kända namnvarianter till kanoniskt namn
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