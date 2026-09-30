/*
  03_silver.sql
  Author: Malena
  Updated: 2026-09-30

  WHAT:  Cleans bronze_reports and splits every row into
         silver_reports (valid) or silver_rejected (invalid, with a reason).
  WHY:   Gold must only see trusted data. Bad rows are quarantined,
         not deleted, so we can always explain why a row was excluded.

  THE KEY RULE:  bronze rows = silver rows + rejected rows.
         If the numbers do not match, data was lost silently.
         The function then fails and undoes everything.

  Run order: 
  Step 1: 01_create_tables.sql 
  Step 2: 03_silver.sql
  Step 3: If you want to rebuild silver, run: SELECT * FROM refresh_silver_reports();

*/


-- ============================================================
-- STEP 0: LOOK BEFORE YOU CLEAN (read-only, changes nothing)
-- ============================================================
-- WHY? Know data problems before writing rules. These numbers also become evidence that each rule is needed.

-- Rows sharing a device_event_key (needed for rule SR2, deduplication)
SELECT device_event_key, COUNT(*) AS times_seen
FROM bronze_reports
GROUP BY device_event_key
HAVING COUNT(*) > 1
ORDER BY times_seen DESC
LIMIT 20;

-- Junk manufacturer names (needed for rule SR4)
SELECT COUNT(*) AS junk_manufacturer_count
FROM bronze_reports
WHERE UPPER(TRIM(manufacturer_raw)) IN
      ('NI','UNK','*','N/A','NA','UNKNOWN','NO INFORMATION','?','NONE','NO MATCH','NO DATA')
   OR length(TRIM(manufacturer_raw)) < 2;

-- Missing manufacturer (needed for rule SR3)
SELECT COUNT(*) AS missing_manufacturer_count
FROM bronze_reports
WHERE manufacturer_raw IS NULL;


-- ============================================================
-- STEP 1: THE CLEANING FUNCTION
-- ============================================================
-- WHY a function? It runs as ONE transaction: either everything succeeds,
-- or nothing changes. If the reconciliation check at the end fails,
-- the database rolls back to how it was before. No half-finished silver.

DROP FUNCTION IF EXISTS refresh_silver_reports();

CREATE OR REPLACE FUNCTION refresh_silver_reports()
RETURNS TABLE(o_run_id uuid, o_bronze bigint, o_written bigint, o_rejected bigint) AS $$
DECLARE
    -- WHY a run_id? It stamps every row this run creates, so later you can
    -- answer "which run produced this number?" (traceability).
    v_run_id   uuid := gen_random_uuid();
    v_bronze   bigint;
    v_written  bigint;
    v_rejected bigint;
BEGIN

    -- WHY truncate silver_reports? Silver is always recalculated from scratch
    -- from bronze. Running twice gives the same result (idempotent).
    -- silver_rejected is NOT truncated: it is the audit history.
    TRUNCATE TABLE silver_reports;

    -- --------------------------------------------------------
    -- STEP 1.1: Give every bronze row ONE label
    -- --------------------------------------------------------
    -- WHY one label per row? With one label per row and a
    -- split on that label, a row can only go one of two ways.
    -- ON COMMIT DROP: the temp table cleans itself up.
    CREATE TEMP TABLE tmp_classified ON COMMIT DROP AS
    WITH
    junk AS (
        SELECT unnest(ARRAY['NI','UNK','*','N/A','NA','UNKNOWN','NO INFORMATION',
                            'NO MATCH','NO DATA','NONE','?']) AS marker
    ),

    -- SR2: number the rows per device_event_key; the earliest gets 1.
    -- WHY earliest? It is the original report; later ones are repeats.
    ranked AS (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY device_event_key ORDER BY id) AS rn
        FROM bronze_reports
    ),

    -- SR5: normalize manufacturer names ("Medtronic Inc." -> "Medtronic").
    -- WHY? Without it, the same company is counted as several different
    -- manufacturers and the top-10 chart is wrong.
    -- Step by step: (1) remove dots, (2) remove everything after a comma,
    -- (3) remove a legal suffix at the end, then trim spaces.
    norm AS (
        SELECT r.*,
               NULLIF(TRIM(regexp_replace(regexp_replace(regexp_replace(
                   r.manufacturer_raw, '\.', '', 'g'),
                   ',.*$', '', 'g'),
                   '\s(inc|llc|ltd|co|corp|corporation|as|ag|gmbh|sa|ab)$', '', 'i')), '')
               AS manufacturer_norm
        FROM ranked r
    )

    SELECT
        n.id AS bronze_id,
        n.device_event_key, n.report_key, n.generic_name,
        n.product_code_raw, n.manufacturer_raw, n.manufacturer_norm,

        -- The label. CASE stops at the FIRST match, so the order matters:
        -- the most fundamental problem is checked first.
        -- NULL means "no problem found = valid row".
        CASE
            WHEN n.device_event_key IS NULL
                THEN 'missing_device_event_key'   -- cannot be the primary key
            WHEN n.rn > 1
                THEN 'duplicate_device_event_key' -- SR2
            WHEN NULLIF(TRIM(n.product_code_raw), '') IS NULL
                THEN 'missing_product_code'       -- gold groups by this
            WHEN n.manufacturer_raw IS NULL
                THEN 'missing_manufacturer'       -- SR3
            WHEN UPPER(TRIM(n.manufacturer_raw)) IN (SELECT marker FROM junk)
              OR length(TRIM(n.manufacturer_raw)) < 2
              OR n.manufacturer_norm IS NULL
                THEN 'invalid_manufacturer'       -- SR4 (also catches "INC." only)
            ELSE NULL
        END AS rejection_reason
    FROM norm n;

    -- --------------------------------------------------------
    -- STEP 1.2: Rows WITH a problem go to quarantine
    -- --------------------------------------------------------
    -- WHY bronze_id? It points back to the exact raw row (traceability chain).
    INSERT INTO silver_rejected (run_id, bronze_id, device_event_key, report_key,
                                 generic_name, product_code, manufacturer_name,
                                 rejection_reason)
    SELECT v_run_id, bronze_id, device_event_key, report_key,
           generic_name, product_code_raw, manufacturer_raw, rejection_reason
    FROM tmp_classified
    WHERE rejection_reason IS NOT NULL;

    -- WHY count here? We need the number for the reconciliation check below.
    GET DIAGNOSTICS v_rejected = ROW_COUNT;

    -- --------------------------------------------------------
    -- STEP 1.3: Rows WITHOUT a problem go to silver
    -- --------------------------------------------------------
    -- This is the exact opposite condition of step 1.2, by construction.
    INSERT INTO silver_reports (run_id, device_event_key, report_key,
                                generic_name, product_code, manufacturer_name)
    SELECT
        v_run_id,
        device_event_key,
        report_key,

        -- SR6: unify product names (trim, UPPERCASE, empty -> 'UNKNOWN PRODUCT').
        -- WHY a default instead of rejecting? A missing product NAME does not
        -- make the report unusable, and the product CODE is what we group by.
        COALESCE(NULLIF(UPPER(TRIM(generic_name)), ''), 'UNKNOWN PRODUCT'),

        TRIM(product_code_raw),

        -- Merge known spelling variants into one company.
        -- WHY a manual list? Regex cannot know that "ALCON RESEARCH, LLC"
        -- and "ALCON LABORATORIES" are the same group. Extend as you find more.
        CASE
            WHEN UPPER(manufacturer_norm) LIKE 'DENTSPLY%'      THEN 'DENTSPLY'
            WHEN UPPER(manufacturer_norm) LIKE 'ALCON%'         THEN 'ALCON'
            WHEN UPPER(manufacturer_norm) LIKE 'MEDTRONIC%'     THEN 'MEDTRONIC'
            WHEN UPPER(manufacturer_norm) LIKE '%OLYMPUS%'      THEN 'OLYMPUS'
            WHEN UPPER(manufacturer_norm) LIKE 'NOBEL BIOCARE%' THEN 'NOBEL BIOCARE'
            ELSE manufacturer_norm
        END
    FROM tmp_classified
    WHERE rejection_reason IS NULL;

    GET DIAGNOSTICS v_written = ROW_COUNT;

    -- --------------------------------------------------------
    -- STEP 1.4: RECONCILIATION - prove that no row was lost
    -- --------------------------------------------------------
    -- WHY RAISE EXCEPTION and not just a log message? A log message can be
    -- ignored. An exception stops the run AND rolls back everything above,
    -- so a broken silver layer can never reach gold or the dashboard.
    SELECT COUNT(*) INTO v_bronze FROM bronze_reports;

    IF v_bronze <> v_written + v_rejected THEN
        RAISE EXCEPTION 'Reconciliation failed: bronze=% but silver=% + rejected=%',
                        v_bronze, v_written, v_rejected;
    END IF;

    RETURN QUERY SELECT v_run_id, v_bronze, v_written, v_rejected;
END;
$$ LANGUAGE plpgsql;


--   SELECT * FROM refresh_silver_reports();
