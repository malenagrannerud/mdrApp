/*
  04_silver.sql
  Author: Malena | Updated: 2026-10-15

  Reads bronze_reports and splits every row into silver_reports (valid)
  or silver_rejected (invalid, with a reason).


  THE KEY RULE (GKS2): bronze rows = silver rows + rejected rows.
         If the numbers do not match, data was lost silently.
         The function then fails and undoes everything.

  Input:
    - bronze_reports
    - manufacturer_mapping
    - manufacturer_parent

  Output:
    - manufacturer_mapping       (built when this file runs)
    - refresh_silver_reports(),  called by run_pipeline(), builds
      silver_reports, silver_rejected and product_code_dim

  RULES IMPLEMENTED HERE (IDs as in PIPELINE.md):
    S1   Invalid rows are quarantined with a reason
    S2   Missing name/manufacturer: NULL + flag, never imputed
    S3   Junk manufacturers are flagged and kept
    S4   Manufacturer names map to a parent company
    S5   One canonical name per product code
    GKS1 product_code is never NULL in silver (via S1)
    GKS2 Reconciliation: bronze = silver + rejected
*/


-- ============================================================
-- RULE S4: normalize names before keyword matching
-- ============================================================
-- WHY: Strips legal suffixes and punctuation so "Medtronic, Inc." and
-- "MEDTRONIC" collapse to the same string before keyword matching.
CREATE OR REPLACE FUNCTION normalize_mfr_name(raw text)
RETURNS text AS $$
    SELECT UPPER(
        TRIM(
            regexp_replace(
                regexp_replace(
                    regexp_replace(raw, '[,\.]', '', 'g'),
                    '\s+(INC|LLC|LTD|CO|CORP|CORPORATION|GMBH|AG|SA|AB|BV|NV|PLC|SRL|LP|LLP|PC|PLLC)$',
                    '', 'i'),
                '\s+', ' ', 'g'
            )
        )
    );
$$ LANGUAGE sql IMMUTABLE PARALLEL SAFE;


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
    -- RULE S1: Give every bronze row ONE label
    -- --------------------------------------------------------
    -- WHY ROW_NUMBER() and not DISTINCT ON?
    --   RULE S1 says duplicates must go to silver_rejected, not be
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
            -- S1: missing key
            WHEN mp.report_key IS NULL OR NULLIF(TRIM(mp.report_key), '') IS NULL
                THEN 'S1_missing_key'
            WHEN mp.device_sequence_no IS NULL OR NULLIF(TRIM(mp.device_sequence_no), '') IS NULL
                THEN 'S1_missing_key'
            -- S1: duplicate key, the lowest bronze id is kept
            WHEN mp.rn > 1
                THEN 'S2_duplicate_key'
            -- S1 + GKS1: missing product code
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
    -- RULE S2 + S3: Everything else goes to silver (with flags)
    -- --------------------------------------------------------
    -- RULE S2: missing generic_name and manufacturer stay NULL, never
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
    -- RULE S5: build product_code_dim (canonical name per code)
    -- --------------------------------------------------------
    -- WHY here? It must be built from the silver rows just written.
    --   Built outside the function it would be empty on the first run
    --   and one run behind after that.
    -- WHY generic_name as the third sort key?
    --   Two names with the same count would otherwise be picked randomly.
    --   A-Z tie-break makes the result reproducible (S5).
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

    -- --------------------------------------------------------
    -- RULE GKS2: RECONCILIATION
    -- --------------------------------------------------------
    SELECT COUNT(*) INTO v_bronze FROM bronze_reports;

    IF v_bronze <> v_written + v_rejected THEN
        RAISE EXCEPTION 'GKS2 failed: bronze=% but silver=% + rejected=%',
                        v_bronze, v_written, v_rejected;
    END IF;

    -- GUARD: never hand an empty silver to gold
    IF v_written = 0 THEN
        RAISE EXCEPTION 'GUARD failed: silver is empty';
    END IF;

    RETURN QUERY SELECT v_run_id, v_bronze, v_written, v_rejected;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- RULE S4: auto-generate manufacturer_mapping from manufacturer_parent
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
    SELECT n.raw_name,
           p.parent_name,
           MAX(length(kw)) AS kw_len
    FROM (SELECT DISTINCT manufacturer_raw AS raw_name
          FROM bronze_reports
          WHERE manufacturer_raw IS NOT NULL
            AND length(TRIM(manufacturer_raw)) >= 2) n
    CROSS JOIN manufacturer_parent p
    CROSS JOIN LATERAL unnest(p.keywords) AS kw
    WHERE normalize_mfr_name(n.raw_name) LIKE '%' || kw || '%'
    GROUP BY n.raw_name, p.parent_name
) m
ORDER BY normalize_mfr_name(raw_name), kw_len DESC, parent_name;


-- ============================================================
-- NOTE: RULE S5 (product_code_dim) is built INSIDE refresh_silver_reports(),
-- right after silver is written, so it always matches the current silver.
-- ============================================================
