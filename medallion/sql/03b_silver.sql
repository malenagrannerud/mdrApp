/*
  03b_silver.sql
  Author: Malena | Updated: 2026-10-07

  Reads bronze_reports and splits every row into silver_reports (valid)
  or silver_rejected (invalid, with a reason).

  WHY:   Gold must only see trusted data. Bad rows are quarantined,
         not deleted, so we can always explain why a row was excluded.

  THE KEY RULE (S7): bronze rows = silver rows + rejected rows.
         If the numbers do not match, data was lost silently.
         The function then fails and undoes everything.

  Input:
    - bronze_reports
    - manufacturer_mapping
    - manufacturer_parent

  Output:
    - silver_reports
    - silver_rejected
    - manufacturer_mapping
    - product_code_dim

  RULES IMPLEMENTED HERE:
    RULE S1  Primary key
    RULE S2  Duplicate keys go to quarantine
    RULE S3  Missing values: NULL + flag, never impute
    RULE S4  Flag junk manufacturers
    RULE S5  Normalize manufacturers, deterministic
    RULE S6  Canonical product name, deterministic
    RULE S7  Reconciliation
    RULE GKS Silver -> Gold gatekeeper (S7 + silver not empty)
*/


-- ============================================================
-- STEP 0: LOOK BEFORE YOU CLEAN (read-only)
-- ============================================================
SELECT report_key, device_sequence_no, COUNT(*) AS times_seen
FROM bronze_reports
GROUP BY report_key, device_sequence_no
HAVING COUNT(*) > 1
ORDER BY times_seen DESC
LIMIT 20;

SELECT COUNT(*) AS junk_manufacturer_count
FROM bronze_reports
WHERE UPPER(TRIM(manufacturer_raw)) IN
      ('NI','UNK','*','N/A','NA','UNKNOWN','NO INFORMATION','?','NONE','NO MATCH','NO DATA')
   OR length(TRIM(manufacturer_raw)) < 2;

SELECT
    COUNT(*) FILTER (WHERE manufacturer_raw IS NULL) AS missing_manufacturer_count,
    COUNT(*) FILTER (WHERE product_code_raw   IS NULL) AS missing_product_code_count,
    COUNT(*) FILTER (WHERE generic_name       IS NULL) AS missing_generic_name_count
FROM bronze_reports;


-- ============================================================
-- RULE S5 preprocessing: normalize raw manufacturer names
-- ============================================================
-- WHY: Strips legal suffixes and punctuation so "Medtronic, Inc." and
-- "MEDTRONIC" collapse to the same string before keyword matching.
CREATE OR REPLACE FUNCTION normalize_mfr_name(raw text)
RETURNS text AS $$
BEGIN
    RETURN UPPER(
        TRIM(
            regexp_replace(
                regexp_replace(
                    regexp_replace(raw,
                        '[,\.]', '', 'g'),
                    '\s+(INC|LLC|LTD|CO|CORP|CORPORATION|GMBH|AG|SA|AB|BV|NV|PLC|SRL|LP|LLP|PC|PLLC)$',
                    '', 'i'),
                '\s+', ' ', 'g'
            )
        )
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;


-- ============================================================
-- THE CLEANING FUNCTION
-- ============================================================
DROP FUNCTION IF EXISTS refresh_silver_reports();

CREATE OR REPLACE FUNCTION refresh_silver_reports()
RETURNS TABLE(o_run_id uuid, o_bronze bigint, o_written bigint, o_rejected bigint) AS $$
DECLARE
    v_run_id   uuid := gen_random_uuid();
    v_bronze   bigint;
    v_written  bigint;
    v_rejected bigint;
BEGIN

    -- WHY DELETE and not TRUNCATE? TRUNCATE takes an ACCESS EXCLUSIVE lock,
    -- which conflicts with the open result set of a RETURNS TABLE function.
    DELETE FROM silver_reports;

    CREATE TEMP TABLE tmp_junk ON COMMIT DROP AS
    SELECT unnest(ARRAY['NI','UNK','*','N/A','NA','UNKNOWN','NO INFORMATION',
                        'NO MATCH','NO DATA','NONE','?','0HP','000']) AS marker;

    -- --------------------------------------------------------
    -- RULE S1 + S2 + S3: Give every bronze row ONE label
    -- --------------------------------------------------------
    -- WHY ROW_NUMBER() and not DISTINCT ON?
    --   RULE S2 says duplicates must go to silver_rejected, not be
    --   silently dropped. ROW_NUMBER() lets us label rn > 1 as
    --   'S2_duplicate_key' so they appear in the quarantine table.
    --   rn = 1 is the row with the lowest bronze id, which is kept.
    CREATE TEMP TABLE tmp_classified ON COMMIT DROP AS
    WITH
    ranked AS (
        SELECT
            id, report_key, device_sequence_no,
            generic_name, product_code_raw, manufacturer_raw,
            ROW_NUMBER() OVER (
                PARTITION BY report_key, device_sequence_no
                ORDER BY id
            ) AS rn
        FROM bronze_reports
    ),
    mapped AS (
        SELECT r.*,
               COALESCE(m.normalized_name,
                        NULLIF(TRIM(r.manufacturer_raw), '')) AS manufacturer_norm
        FROM ranked r
        LEFT JOIN manufacturer_mapping m
               ON normalize_mfr_name(r.manufacturer_raw) = normalize_mfr_name(m.raw_name)
    )
    SELECT
        mp.id AS bronze_id,
        mp.report_key, mp.device_sequence_no,
        mp.generic_name, mp.product_code_raw,
        mp.manufacturer_raw, mp.manufacturer_norm,
        mp.rn,
        CASE
            -- RULE S1: nyckel saknas
            WHEN mp.report_key IS NULL OR NULLIF(TRIM(mp.report_key), '') IS NULL
                THEN 'S1_missing_key'
            WHEN mp.device_sequence_no IS NULL OR NULLIF(TRIM(mp.device_sequence_no), '') IS NULL
                THEN 'S1_missing_key'
            -- RULE S2: dubblett, lägsta id behålls
            WHEN mp.rn > 1
                THEN 'S2_duplicate_key'
            -- RULE S3: produktkod saknas
            WHEN NULLIF(TRIM(mp.product_code_raw), '') IS NULL
                THEN 'S3_missing_product_code'
            ELSE NULL
        END AS rejection_reason
    FROM mapped mp;

    -- --------------------------------------------------------
    -- Rows that cannot be used go to quarantine
    -- --------------------------------------------------------
    INSERT INTO silver_rejected (run_id, bronze_id, report_key, device_sequence_no,
                                 generic_name, product_code, manufacturer_name,
                                 rejection_reason)
    SELECT v_run_id, bronze_id, report_key, device_sequence_no,
           generic_name, product_code_raw, manufacturer_raw, rejection_reason
    FROM tmp_classified
    WHERE rejection_reason IS NOT NULL;

    GET DIAGNOSTICS v_rejected = ROW_COUNT;

    -- --------------------------------------------------------
    -- RULE S3 + S4: Everything else goes to silver (with flags)
    -- --------------------------------------------------------
    -- RULE S3: missing generic_name and product_code stay NULL, never
    -- imputed. Flags mark them instead.
    INSERT INTO silver_reports (
        run_id,
        report_key, device_sequence_no,
        generic_name, product_code,
        manufacturer_name, manufacturer_normalized, manufacturer_is_junk,
        has_missing_generic_name, has_missing_manufacturer
    )
    SELECT
        v_run_id,
        report_key,
        device_sequence_no,
        NULLIF(TRIM(generic_name), ''),
        NULLIF(TRIM(product_code_raw), ''),
        NULLIF(TRIM(manufacturer_raw), ''),
        manufacturer_norm,
        (manufacturer_raw IS NULL
         OR UPPER(TRIM(manufacturer_raw)) IN (SELECT marker FROM tmp_junk)
         OR length(TRIM(manufacturer_raw)) < 2) AS manufacturer_is_junk,
        (generic_name IS NULL OR NULLIF(TRIM(generic_name), '') IS NULL)         AS has_missing_generic_name,
        (manufacturer_raw IS NULL OR NULLIF(TRIM(manufacturer_raw), '') IS NULL) AS has_missing_manufacturer
    FROM tmp_classified
    WHERE rejection_reason IS NULL;

    GET DIAGNOSTICS v_written = ROW_COUNT;

    -- --------------------------------------------------------
    -- RULE S7: RECONCILIATION
    -- --------------------------------------------------------
    SELECT COUNT(*) INTO v_bronze FROM bronze_reports;

    IF v_bronze <> v_written + v_rejected THEN
        RAISE EXCEPTION 'S7 failed: bronze=% but silver=% + rejected=%',
                        v_bronze, v_written, v_rejected;
    END IF;

    -- RULE GKS: Silver -> Gold gatekeeper
    IF v_written = 0 THEN
        RAISE EXCEPTION 'GKS failed: silver is empty';
    END IF;

    RETURN QUERY SELECT v_run_id, v_bronze, v_written, v_rejected;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- RULE S5: auto-generate manufacturer_mapping from manufacturer_parent
-- ============================================================
-- WHY longest keyword wins?
--   A raw name can match several parents if keywords overlap
--   (e.g. 'BARD' for BD and 'BARD PERIPHERAL' for BD). Without a
--   tie-break, the database would pick randomly and the same input
--   could give different outputs on different runs.
TRUNCATE TABLE manufacturer_mapping;

INSERT INTO manufacturer_mapping (raw_name, normalized_name)
SELECT DISTINCT ON (normalize_mfr_name(raw_name)) raw_name, parent_name
FROM (
    SELECT b.manufacturer_raw AS raw_name,
           p.parent_name,
           MAX(length(kw)) AS kw_len
    FROM bronze_reports b
    CROSS JOIN manufacturer_parent p
    CROSS JOIN LATERAL unnest(p.keywords) AS kw
    WHERE b.manufacturer_raw IS NOT NULL
      AND length(TRIM(b.manufacturer_raw)) >= 2
      AND normalize_mfr_name(b.manufacturer_raw) LIKE '%' || kw || '%'
    GROUP BY b.manufacturer_raw, p.parent_name
) m
ORDER BY normalize_mfr_name(raw_name), kw_len DESC, parent_name;


-- ============================================================
-- RUN THE FUNCTION
-- ============================================================
-- Must run AFTER the mapping exists so silver_reports picks it up.
SELECT * FROM refresh_silver_reports();


-- ============================================================
-- RULE S6: build product_code_dim (canonical name per code)
-- ============================================================
-- WHY generic_name as the third sort key?
--   Two names with the same count would otherwise be picked randomly.
--   A-Z tie-break makes the result reproducible (S6).
DELETE FROM product_code_dim;

INSERT INTO product_code_dim (product_code, canonical_generic_name)
SELECT DISTINCT ON (product_code)
       product_code,
       generic_name AS canonical_generic_name
FROM silver_reports
WHERE product_code IS NOT NULL
  AND generic_name IS NOT NULL
GROUP BY product_code, generic_name
ORDER BY product_code, COUNT(*) DESC, generic_name;


-- ============================================================
-- STEP 6: verify (read-only)
-- ============================================================
-- S7: bronze = silver + rejected
-- SELECT
--     (SELECT COUNT(*) FROM bronze_reports)  AS bronze_rows,
--     (SELECT COUNT(*) FROM silver_reports)  AS silver_rows,
--     (SELECT COUNT(*) FROM silver_rejected) AS rejected_rows;
--
-- S2: how many duplicates and other reasons?
-- SELECT rejection_reason, COUNT(*) FROM silver_rejected GROUP BY 1 ORDER BY 2 DESC;
--
-- S5: how much is mapped?
-- SELECT
--     COUNT(*) FILTER (WHERE manufacturer_normalized = manufacturer_name) AS unmapped,
--     COUNT(*) FILTER (WHERE manufacturer_normalized <> manufacturer_name) AS mapped,
--     COUNT(*) AS total,
--     ROUND(100.0 * COUNT(*) FILTER (WHERE manufacturer_normalized <> manufacturer_name) / COUNT(*), 1) AS pct_mapped
-- FROM silver_reports
-- WHERE manufacturer_is_junk = FALSE;
--
-- S5: top unmapped (to extend manufacturer_parent keywords)
-- SELECT manufacturer_name, COUNT(*) AS rows
-- FROM silver_reports
-- WHERE manufacturer_is_junk = FALSE
--   AND manufacturer_normalized = manufacturer_name
-- GROUP BY manufacturer_name
-- ORDER BY rows DESC
-- LIMIT 50;