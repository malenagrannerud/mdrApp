/*
  01_silver.sql
  Author: Malena | Updated: 2026-10-15

  Cleans and standardizes data and splits every row into silver_reports (valid data)
  or silver_rejected (invalid data, with a reason).

  FUNCTIONS
  Helper functions:  normalize_mfr_name()
  Functions: refresh_silver_reports() runs the steps in order

  STEPS
  Step 1: Data cleaning on bronze_reports
  Step 2: Standardize formats on bronze_reports
  Step 3: Data from different sources is joined FUTURE STEP
  Step 4: Cleaned standardized data is stored in silver_reports 
          and unused in silver_quaranteen

Rules:
| S1 | Data cleaning (remove junk, handle duplicates, handle missing values etc)
| S2 | Standardize formats (For example UTC dates, company names)
| S3 | Join data sets (consolidated customer/product view - NOT YET)


 HOW SILVER READS BRONZE
  bronze_reports holds every line of a file as one text value (raw), the header as
  line 1 (row_num = 1). Splitting a line into fields is interpretation, so it happens here:
  - the view bronze_device finds each needed column BY NAME in the header line of each
    file, so files with another column order work, and a repeated column name gives the
    first one;
  - the delimiter is | (MAUDE). Files that do not have all five columns are not device
    data and are left out of silver (the input check reports them with a NOTICE);
  - a value is the text between the delimiters, unchanged. An empty field is '' (as in bronze).
  "bronze rows" in the key rule above means the data rows (row_num > 1) of those files.


  THE KEY RULE: bronze rows = silver rows + rejected rows.
*/



-- SETUP A: index on bronze_reports. Finds the header line of every file without reading the whole table
CREATE INDEX IF NOT EXISTS idx_bronze_header ON bronze_reports (source_file) WHERE row_num = 1;

-- SETUP B: silver tables (created here, kept between runs)
CREATE TABLE IF NOT EXISTS silver_reports (
  run_id                   uuid        NOT NULL,
  report_key               text        NOT NULL,
  device_sequence_no       text        NOT NULL,
  generic_name             text,
  product_code             text        NOT NULL,
  manufacturer_name        text,
  manufacturer_normalized  text,
  manufacturer_is_junk     boolean     NOT NULL,
  has_missing_generic_name boolean     NOT NULL,
  has_missing_manufacturer boolean     NOT NULL,
  _silver_updated_at       timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (report_key, device_sequence_no)
);

-- SETUP C: Quarantine table: one row per rejected bronze row, per run, with the reason. It points back to bronze with (source_file, row_num).
CREATE TABLE IF NOT EXISTS silver_rejected (
  run_id             uuid        NOT NULL,
  source_file        text        NOT NULL,
  row_num            bigint      NOT NULL,
  report_key         text,
  device_sequence_no text,
  generic_name       text,
  product_code       text,
  manufacturer_name  text,
  rejection_reason   text        NOT NULL,
  rejected_at        timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (run_id, source_file, row_num)
);

CREATE TABLE IF NOT EXISTS product_code_dim (
  product_code           text PRIMARY KEY,
  canonical_generic_name text NOT NULL
);

CREATE TABLE IF NOT EXISTS manufacturer_mapping (
  raw_name        text PRIMARY KEY,
  normalized_name text NOT NULL
);

ALTER TABLE silver_reports       ENABLE ROW LEVEL SECURITY;
ALTER TABLE silver_rejected      ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_code_dim     ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_mapping ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE
    ON silver_reports, silver_rejected, product_code_dim, manufacturer_mapping TO service_role;


-- ============================================================
-- SETUP C: bronze_device = the five device columns, split out of raw
-- ============================================================
-- WHY a view and not a table? Nothing is copied or stored twice, and it always matches bronze.
-- WHY security_invoker? RLS on bronze_reports then applies to whoever reads the view.
CREATE OR REPLACE VIEW bronze_device WITH (security_invoker = true) AS
WITH header AS (
    SELECT source_file, string_to_array(raw, '|') AS cols
    FROM bronze_reports
    WHERE row_num = 1
),
pos AS (
    SELECT source_file,
           array_position(cols, 'MDR_REPORT_KEY')             AS p_key,
           array_position(cols, 'DEVICE_SEQUENCE_NO')         AS p_seq,
           array_position(cols, 'GENERIC_NAME')               AS p_name,
           array_position(cols, 'DEVICE_REPORT_PRODUCT_CODE') AS p_code,
           array_position(cols, 'MANUFACTURER_D_NAME')        AS p_mfr
    FROM header
)
SELECT b.source_file,
       b.row_num,
       split_part(b.raw, '|', p.p_key)  AS report_key,
       split_part(b.raw, '|', p.p_seq)  AS device_sequence_no,
       split_part(b.raw, '|', p.p_name) AS generic_name,
       split_part(b.raw, '|', p.p_code) AS product_code_raw,
       split_part(b.raw, '|', p.p_mfr)  AS manufacturer_raw
FROM bronze_reports b
JOIN pos p ON p.source_file = b.source_file
WHERE b.row_num > 1
  AND p.p_key IS NOT NULL AND p.p_seq  IS NOT NULL AND p.p_name IS NOT NULL
  AND p.p_code IS NOT NULL AND p.p_mfr IS NOT NULL;

GRANT SELECT ON bronze_device TO service_role;

-- -----------------------------------------------------------------------

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

-- -----------------------------------------------------------------------
DROP FUNCTION IF EXISTS refresh_silver_reports();

CREATE OR REPLACE FUNCTION refresh_silver_reports()
RETURNS TABLE(o_run_id uuid, o_bronze bigint, o_written bigint, o_rejected bigint) AS $$
DECLARE
    v_run_id   uuid := gen_random_uuid();
    v_junk     text[] := ARRAY['NI','UNK','*','N/A','NA','UNKNOWN','NO INFORMATION',
                               'NO MATCH','NO DATA','NONE','?','0HP','000'];
   
    v_bronze   bigint;
    v_written  bigint;
    v_rejected bigint;
BEGIN
-- -----------------------------------------------------------------------
-- STEPS


    -- ========================================================
    -- STEP 1: CLEAN (S1). Give every bronze row ONE label and flag junk and missing values.
    -- ========================================================
    -- WHY ROW_NUMBER() and not DISTINCT ON?
    --   RULE S1 says duplicates must go to silver_rejected, not be silently dropped.
    --   ROW_NUMBER() lets us label rn > 1 as 'S2_duplicate_key' so they appear in the
    --   quarantine table. rn = 1 is the first row (file name, then line number), which is kept.
    -- RULE S1: missing generic_name and manufacturer stay NULL, never imputed. Flags mark them.
    CREATE TEMP TABLE tmp_cleaned ON COMMIT DROP AS
    SELECT
        r.source_file, r.row_num,
        r.report_key, r.device_sequence_no,
        r.generic_name, r.product_code_raw, r.manufacturer_raw,
        CASE
            -- missing key
            WHEN NULLIF(TRIM(r.report_key), '') IS NULL
              OR NULLIF(TRIM(r.device_sequence_no), '') IS NULL
                THEN 'S1_missing_key'
            -- duplicate key, the first row is kept
            WHEN r.rn > 1
                THEN 'S2_duplicate_key'
            -- missing product code (GKS1)
            WHEN NULLIF(TRIM(r.product_code_raw), '') IS NULL
                THEN 'S3_missing_product_code'
            ELSE NULL
        END AS rejection_reason,
        (NULLIF(TRIM(r.manufacturer_raw), '') IS NULL
         OR UPPER(TRIM(r.manufacturer_raw)) = ANY (v_junk)
         OR length(TRIM(r.manufacturer_raw)) < 2)         AS manufacturer_is_junk,
        (NULLIF(TRIM(r.generic_name), '') IS NULL)        AS has_missing_generic_name,
        (NULLIF(TRIM(r.manufacturer_raw), '') IS NULL)    AS has_missing_manufacturer
    FROM (
        SELECT d.*,
               ROW_NUMBER() OVER (PARTITION BY d.report_key, d.device_sequence_no
                                  ORDER BY d.source_file, d.row_num) AS rn
        FROM bronze_device d
    ) r;

    -- ========================================================
    -- STEP 2: STANDARDIZE (S2). Trim and company names.
    -- ========================================================
    -- Company names. WHY longest keyword wins?
    --   A raw name can match several parents if keywords overlap (e.g. 'BARD' for BD and
    --   'BARD PERIPHERAL' for BD). Without a tie-break, the database would pick randomly
    --   and the same input could give different outputs on different runs.
    -- WHY here? The mapping is rebuilt on every run, so it always matches the current bronze.
    DELETE FROM manufacturer_mapping;

    INSERT INTO manufacturer_mapping (raw_name, normalized_name)
    SELECT DISTINCT ON (normalize_mfr_name(raw_name)) raw_name, parent_name
    FROM (
        SELECT n.raw_name,
               p.parent_name,
               MAX(length(kw)) AS kw_len
        FROM (SELECT DISTINCT manufacturer_raw AS raw_name
              FROM tmp_cleaned
              WHERE length(TRIM(manufacturer_raw)) >= 2) n
        CROSS JOIN manufacturer_parent p
        CROSS JOIN LATERAL unnest(p.keywords) AS kw
        WHERE normalize_mfr_name(n.raw_name) LIKE '%' || kw || '%'
        GROUP BY n.raw_name, p.parent_name
    ) m
    ORDER BY normalize_mfr_name(raw_name), kw_len DESC, parent_name;

    -- Trimmed values, and the parent company where the name is known (else the trimmed name).
    CREATE TEMP TABLE tmp_standardized ON COMMIT DROP AS
    SELECT
        c.*,
        NULLIF(TRIM(c.generic_name), '')      AS generic_name_std,
        NULLIF(TRIM(c.product_code_raw), '')  AS product_code_std,
        NULLIF(TRIM(c.manufacturer_raw), '')  AS manufacturer_name_std,
        COALESCE(m.normalized_name, NULLIF(TRIM(c.manufacturer_raw), '')) AS manufacturer_normalized
    FROM tmp_cleaned c
    LEFT JOIN manufacturer_mapping m
           ON normalize_mfr_name(c.manufacturer_raw) = normalize_mfr_name(m.raw_name);

    -- ========================================================
    -- STEP 3: JOIN (S3). FUTURE STEP: data from different sources is joined here.
    -- ========================================================

    -- ========================================================
    -- STEP 4: STORE. Quarantine, silver, one name per product code, reconciliation.
    -- ========================================================
    -- Rows that cannot be used go to quarantine, with their raw values and the reason.
    INSERT INTO silver_rejected (run_id, source_file, row_num, report_key, device_sequence_no,
                                 generic_name, product_code, manufacturer_name, rejection_reason)
    SELECT v_run_id, source_file, row_num, report_key, device_sequence_no,
           generic_name, product_code_raw, manufacturer_raw, rejection_reason
    FROM tmp_standardized
    WHERE rejection_reason IS NOT NULL;

    GET DIAGNOSTICS v_rejected = ROW_COUNT;

    -- WHY DELETE and not TRUNCATE? TRUNCATE takes an ACCESS EXCLUSIVE lock,
    -- which conflicts with the open result set of a RETURNS TABLE function.
    DELETE FROM silver_reports;

    INSERT INTO silver_reports (
        run_id, report_key, device_sequence_no, generic_name, product_code,
        manufacturer_name, manufacturer_normalized, manufacturer_is_junk,
        has_missing_generic_name, has_missing_manufacturer
    )
    SELECT v_run_id, report_key, device_sequence_no, generic_name_std, product_code_std,
           manufacturer_name_std, manufacturer_normalized, manufacturer_is_junk,
           has_missing_generic_name, has_missing_manufacturer
    FROM tmp_standardized
    WHERE rejection_reason IS NULL;

    GET DIAGNOSTICS v_written = ROW_COUNT;

    -- RULE S5: one canonical name per product code.
    -- WHY here? It must be built from the silver rows just written.
    -- WHY generic_name as the third sort key? Two names with the same count would otherwise
    --   be picked randomly. The A-Z tie-break makes the result reproducible.
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

    -- Verify nothing is lost between bronze and silver.
    SELECT COUNT(*) INTO v_bronze FROM bronze_device;

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