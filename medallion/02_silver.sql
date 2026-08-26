-- ============================================================
-- 02_silver.sql
-- BRONZE → SILVER
--
-- SILVER → GOLD
--

-- Funktion refresh_silver_reports(): rensar och deduplicerar
-- rådata från bronze_reports, skriver till silver_reports.
--
-- Regler för rensning och deduplicering:
--   - Rader utan product_code_raw filtreras bort
--   - Rader med ogiltig tillverkare filtreras bort (skräplista)
--   - Dubbletter på report_key: första förekomsten (lägst id) vinner
--   - Tillverkarnamn normaliseras: skiljetecken bort, mellanslag
--     kollapsas, juridiska suffix (Inc/LLC/AB/GmbH osv.) tas bort
--   - Kända namnvarianter slås ihop till kanoniskt namn
--   - Brand/generic-namn versaliseras och mellanslag kollapsas
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

    -- Första förekomsten av varje report_key (dedup, likt seen_keys-set i Python)
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

            -- Brand/generic: versalisera + kollapsa mellanslag,
            -- eller NULL om skräpvärde
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
    -- (motsvarar MANUFACTURER_MERGES-dictionaryn)
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