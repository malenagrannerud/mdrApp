/*
  03b_silver.sql
  Author: Malena | Updated: 2026-10-01

  Reads bronze_reports and splits every row into silver_reports (valid) or silver_rejected (invalid, with a reason).
       

  WHY:   Gold must only see trusted data. Bad rows are quarantined,
         not deleted, so we can always explain why a row was excluded.

  THE KEY RULE:  bronze rows = silver rows + rejected rows.
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

  Rules implemented here:
    S1  Deduplicate on PK
    S2  PK is (report_key, device_sequence_no)
    S3  Flag missing values (do not impute)
    S4  Flag junk manufacturers (keep rows, exclude from Gold)
    S5  Normalize manufacturers: auto-generated from manufacturer_parent
    S6  Canonical product name (built after main function)
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
-- STEP 1: S5 preprocessing - normalize raw manufacturer names
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
-- STEP 2: THE CLEANING FUNCTION
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
    -- STEP 2.1: Give every bronze row ONE label (or none)
    -- --------------------------------------------------------
    -- WHY normalize_mfr_name() on BOTH sides of the join?
    --   The mapping is keyed by raw_name. Two raw names that differ only
    --   by ", Inc." would otherwise look like different companies.
    --   Normalizing both sides collapses them onto the same key.
    -- WHY DISTINCT ON in deduped?
    --   Bronze is append-only. If the same file was ingested twice, the
    --   same (report_key, device_sequence_no) appears twice. DISTINCT ON
    --   keeps the earliest id, so downstream inserts never violate the
    --   composite primary key on silver_reports.
    CREATE TEMP TABLE tmp_classified ON COMMIT DROP AS
    WITH
    deduped AS (
        SELECT DISTINCT ON (report_key, device_sequence_no)
               id, report_key, device_sequence_no,
               generic_name, product_code_raw, manufacturer_raw
        FROM bronze_reports
        ORDER BY report_key, device_sequence_no, id
    ),
    ranked AS (
        SELECT *,
               ROW_NUMBER() OVER (
                   PARTITION BY report_key, device_sequence_no
                   ORDER BY id
               ) AS rn
        FROM deduped
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
        CASE
            WHEN mp.report_key IS NULL OR NULLIF(TRIM(mp.report_key), '') IS NULL
                THEN 'missing_report_key'
            WHEN mp.device_sequence_no IS NULL OR NULLIF(TRIM(mp.device_sequence_no), '') IS NULL
                THEN 'missing_device_sequence_no'
            ELSE NULL
        END AS rejection_reason
    FROM mapped mp;

    -- --------------------------------------------------------
    -- STEP 2.2: Rows that cannot be keyed go to quarantine
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
    -- STEP 2.3: Everything else goes to silver (with flags)
    -- --------------------------------------------------------
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
        COALESCE(NULLIF(TRIM(generic_name), ''), 'UNKNOWN PRODUCT'),
        COALESCE(NULLIF(TRIM(product_code_raw), ''), 'UNKNOWN'),
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
    -- STEP 2.4: RECONCILIATION (GR3)
    -- --------------------------------------------------------
    SELECT COUNT(*) INTO v_bronze FROM bronze_reports;

    IF v_bronze <> v_written + v_rejected THEN
        RAISE EXCEPTION 'GR3 failed: bronze=% but silver=% + rejected=%',
                        v_bronze, v_written, v_rejected;
    END IF;

    RETURN QUERY SELECT v_run_id, v_bronze, v_written, v_rejected;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- STEP 3: S5 - auto-generate manufacturer_mapping from manufacturer_parent
-- ============================================================
-- WHY TRUNCATE first? The mapping is derived from manufacturer_parent.
-- Rebuilding it cleanly avoids stale rows when keywords change.
-- WHY DISTINCT ON (normalize_mfr_name(raw_name))?
--   Two raw names ("MEDTRONIC" and "MEDTRONIC, INC.") both normalize to
--   the same string. Without DISTINCT ON, both would be inserted. Then
--   refresh_silver_reports() LEFT JOINs on the normalized form and would
--   match BOTH mapping rows for a single bronze row -> 2 output rows ->
--   PK collision on silver_reports. DISTINCT ON keeps exactly one row
--   per normalized name.
TRUNCATE TABLE manufacturer_mapping;

INSERT INTO manufacturer_mapping (raw_name, normalized_name)
SELECT DISTINCT ON (normalize_mfr_name(raw_name))
       raw_name,
       normalized_name
FROM (
    SELECT DISTINCT
        s.manufacturer_name AS raw_name,
        p.parent_name       AS normalized_name
    FROM silver_reports s
    CROSS JOIN manufacturer_parent p
    WHERE s.manufacturer_is_junk = FALSE
      AND s.manufacturer_name IS NOT NULL
      AND EXISTS (
          SELECT 1 FROM unnest(p.keywords) kw
          WHERE normalize_mfr_name(s.manufacturer_name) LIKE '%' || kw || '%'
      )
) matches
ORDER BY normalize_mfr_name(raw_name);


-- ============================================================
-- STEP 4: RUN THE FUNCTION
-- ============================================================
-- Must run AFTER the mapping exists so silver_reports picks it up.
SELECT * FROM refresh_silver_reports();


-- ============================================================
-- STEP 5: S6 - build product_code_dim (canonical name per code)
-- ============================================================
DELETE FROM product_code_dim;

INSERT INTO product_code_dim (product_code, canonical_generic_name)
SELECT DISTINCT ON (product_code)
       product_code,
       generic_name AS canonical_generic_name
FROM silver_reports
WHERE product_code IS NOT NULL
  AND generic_name IS NOT NULL
GROUP BY product_code, generic_name
ORDER BY product_code, COUNT(*) DESC;


-- ============================================================
-- STEP 6: verify (read-only)
-- ============================================================
-- GR3: bronze = silver + rejected
-- SELECT
--     (SELECT COUNT(*) FROM bronze_reports)  AS bronze_rows,
--     (SELECT COUNT(*) FROM silver_reports)  AS silver_rows,
--     (SELECT COUNT(*) FROM silver_rejected) AS rejected_rows;
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