-- ============================================================
-- 03_silver.sql
-- Author: Malena
-- Created: 2026-08-02
-- Updated: 2026-09-21
-- Description: Cleans, deduplicates and normalizes bronze_reports into silver_reports. Rejected rows are routed
--              to silver_rejected for audit and replay.
--
-- End goal:
--      1 - Which are the most reported products to FDA 2024?
--      2 - Which are the most reported manufacturers to FDA 2024? 
--
--
-- Idempotent: silver_reports is TRUNCATEd before insert. silver_rejected is append-only to preserve audit history.
--
-- ============================================================

-- HOW MANY ROWS DO WE HAVE?
SELECT COUNT(*) AS total_rows
FROM bronze_reports;
-- result: one batch, 2000 rows

-- WHAT DOES THE DATA LOOK LIKE?
SELECT *
FROM bronze_reports
ORDER BY id ASC
LIMIT 20;
-- result: 20 sample rows. 
-- | id | report_key | product_code_raw | brand_name_raw                                       | generic_name_raw                        | manufacturer_raw                             | inserted_at                   | source_file                   |
-- | -- | ---------- | ---------------- | ---------------------------------------------------- | --------------------------------------- | -------------------------------------------- | ----------------------------- | ----------------------------- |
-- | 1  | 18423065   | FDF              | EVIS EXERA II COLONOVIDEOSCOPE                       | COLONOVIDEOSCOPE                        | AIZU OLYMPUS CO., LTD.                       | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt |
-- | 2  | 18423066   | EOQ              | EVIS EXERA III BRONCHOVIDEOSCOPE                     | BRONCHOVIDEOSCOPE                       | AIZU OLYMPUS CO., LTD.                       | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt |
-- | 3  | 18423067   | EOQ              | EVIS LUCERA ELITE BRONCHOVIDEOSCOPE                  | BRONCHOVIDEOSCOPE                       | AIZU OLYMPUS CO., LTD.                       | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt |
-- | 4  | 18423068   | NAY              | ENDOWRIST                                            | FENESTRATED BIPOLAR FORCEPS             | INTUITIVE SURGICAL, INC                      | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt |
-- | 5  | 18423069   | EOQ              | ION                                                  | VISION PROBE                            | INTUITIVE SURGICAL, INC                      | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt |
-- | 6  | 18423070   | NAY              | ENDOWRIST                                            | TENACULUM FORCEPS                       | INTUITIVE SURGICAL, INC                      | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt |
-- | 7  | 18423071   | LRO              | CONSTELLATION SURGICAL PROCEDURE PACK                | GENERAL SURGERY TRAY (KIT)              | ALCON RESEARCH, LLC - HOUSTON                | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt |
-- | 8  | 18423072   | DZE              | DYMIC                                                | DYNAMIC IMPLANT SP 3.75X10              | PALTOP ADVANCED DENTAL SOLUTIONS INC.        | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt |
-- | 9  | 18423073   | FHW              | AMS INFLATABLE PENILE PROSTHESIS                     | DEVICE IMPOTENCE MECHANICAL/HYDRAULIC   | BOSTON SCIENTIFIC CORPORATION                | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt |
-- | 10 | 18423074   | FHW              | AMS INFLATABLE PENILE PROSTHESIS                     | DEVICE IMPOTENCE MECHANICAL/HYDRAULIC   | BOSTON SCIENTIFIC CORPORATION                | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt |
-- | 11 | 18423075   | KNQ              | EZDILATE BALLOON DILATOR (WG) 13.5-14.5-15.5 (JAPAN) | DILATOR, ESOPHAGEAL                     | GYRUS ACMI, INC.                             | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt |
-- | 12 | 18423076   | MLZ              | CONSTELLATION ULTRAVIT PROBE                         | VITRECTOMY, INSTRUMENT CUTTER           | ALCON RESEARCH, LLC - HOUSTON                | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt |
-- | 13 | 18423077   | LRO              | CONSTELLATION SURGICAL PROCEDURE PACK                | GENERAL SURGERY TRAY (KIT)              | ALCON RESEARCH, LLC - HOUSTON                | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt |
-- | 14 | 18423078   | LRO              | CONSTELLATION SURGICAL PROCEDURE PACK                | GENERAL SURGERY TRAY (KIT)              | ALCON RESEARCH, LLC - HOUSTON                | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt |
-- | 15 | 18423079   | LRO              | LEGACY SURGICAL PROCEDURE PAK                        | GENERAL SURGERY TRAY (KIT)              | ALCON RESEARCH, LLC - HOUSTON                | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt |
-- | 16 | 18423080   | BZD              | DREAMSTATION AUTO CPAP                               | VENTILATOR, NON-CONTINUOUS (RESPIRATOR) | RESPIRONICS, INC.                            | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt |
-- | 17 | 18423081   | BZD              | DREAMSTATION AUTO CPAP                               | VENTILATOR, NON-CONTINUOUS (RESPIRATOR) | RESPIRONICS, INC.                            | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt |
-- | 18 | 18423082   | HQC              | INTREPID TRANSFORMER                                 | UNIT, PHACOFRAGMENTATION                | ALCON RESEARCH, LLC - ALCON PRECISION DEVICE | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt |
-- | 19 | 18423083   | LRO              | CONSTELLATION SURGICAL PROCEDURE PACK                | GENERAL SURGERY TRAY (KIT)              | ALCON RESEARCH, LLC - HOUSTON                | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt |
-- | 20 | 18423084   | DZE              | PCA                                                  | CONICAL ACTIVE IMPLANT 3.75X16          | PALTOP ADVANCED DENTAL SOLUTIONS INC.        | 2026-09-17 13:14:18.945897+00 | medallion/data/DEVICE2024.txt |


-- ======================================= REPORT_KEY - DEDUP =======================================

-- I: HOW MANY REPORT_KEY APPEAR > ONCE?
-- A primary key should only appear once
SELECT
    report_key,
    COUNT(*) AS times_seen
FROM bronze_reports
GROUP BY report_key
HAVING COUNT(*) > 1
ORDER BY times_seen DESC;

SELECT COUNT(*) - COUNT(DISTINCT report_key) AS duplicate_rows
FROM bronze_reports;
-- result: 39 
-- >>> RULE R1 - DEDUPLICATION: keep first (earliest) row per report_key

-- ======================================= DATA CLEANING =======================================

-- HOW MANY JUNK MANUFACTURER VALUES ARE THERE?
SELECT COUNT(*) AS junk_manufacturer_count
FROM bronze_reports
WHERE UPPER(TRIM(manufacturer_raw)) IN (
    'NI', 'UNK', '*', 'N/A', 'NA', 'UNKNOWN',
    'NO INFORMATION', '?', 'NONE'
)
OR length(TRIM(manufacturer_raw)) < 2;
-- result: 11
-- >>> RULE R2 - VALIDITY: junk values -> reject in silver.

-- HOW MANY ROWS ARE MISSING A MANUFACTURER?
SELECT COUNT(*) AS missing_manufacturer_count
FROM bronze_reports
WHERE manufacturer_raw IS NULL;
-- result: 15
-- >>> RULE R3 - COMPLETENESS: missing manufacturer -> reject.

-- WHAT DO MANUFACTURER NAMES LOOK LIKE IN DETAIL?
SELECT
    id,
    manufacturer_raw AS original,
    regexp_replace(manufacturer_raw, '\s(INC|LLC|LTD|CO|CORP|CORPORATION)$', '', 'i') AS no_suffix,
    CASE WHEN manufacturer_raw ~ '\.$' THEN 'YES (trailing dot)' ELSE 'NO' END AS has_trailing_dot
FROM bronze_reports
WHERE manufacturer_raw IS NOT NULL
  AND (manufacturer_raw ~ '\.' OR manufacturer_raw ~ '\s(INC|LLC|LTD|CO|CORP)$')
ORDER BY id
LIMIT 10;
-- result: many rows have trailing dots and legal suffixes
-- see table: several rows in brand_name_raw contain '�' (from ® / ™) --> regexp_replace(x, '[^\x20-\x7E]', '', 'g')
-- >>> RULE R4: strip dots, collapse spaces, strip suffixes, TRIM.


-- ======================================= analysis =======================================

-- HOW ARE PRODUCT CODES DISTRIBUTED?
SELECT
    product_code_raw AS product_code,
    COUNT(*) AS report_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) AS percent_share
FROM bronze_reports
GROUP BY product_code_raw
ORDER BY report_count DESC
LIMIT 10;
-- result: DZE 21.26 %, QBJ 14.69 %, QFG 10.51 %, OZP 5.48 %, BZD 1.97 %

-- HOW WERE ROWS LOADED OVER TIME?
SELECT inserted_at AS load_timestamp, COUNT(*) AS rows_loaded
FROM bronze_reports
GROUP BY inserted_at
ORDER BY load_timestamp;
-- result: 3 batches of 1000 rows. 






























TRUNCATE TABLE silver_reports;
TRUNCATE TABLE silver_rejected;   -- NY: keeps audit clean, same reason


DROP FUNCTION IF EXISTS refresh_silver_reports();

CREATE OR REPLACE FUNCTION refresh_silver_reports()
RETURNS TABLE(rows_written BIGINT, rows_rejected BIGINT) AS $$
DECLARE
    written  BIGINT;
    rejected BIGINT;
BEGIN

    TRUNCATE TABLE silver_reports;

    -- STEP 1: IDENTIFY REJECTED ROWS (R1, R2, R3)
    WITH
    -- Junk markers that mean "no value provided".
    -- Used in BOTH the reject step and the clean step so the
    -- definition lives in one place.
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
                PARTITION BY report_key
                ORDER BY id
            ) AS row_number
        FROM bronze_reports
    ),

    -- A row is rejected if ANY of these are true:
    --   R1 - it is a duplicate (row_number > 1)
    --   R3 - manufacturer_raw IS NULL
    --   R2 - manufacturer_raw is junk OR too short
    --   R2 - brand_name_raw is junk (new)
    --   R2 - generic_name_raw is junk (new)
    rejected_rows AS (
        SELECT
            r.id AS bronze_id,
            r.report_key,
            CASE
                WHEN r.row_number > 1
                    THEN 'duplicate_report_key'                        -- R1
                WHEN r.manufacturer_raw IS NULL
                    THEN 'missing_manufacturer'                        -- R3
                WHEN UPPER(TRIM(r.manufacturer_raw)) IN
                     (SELECT marker FROM junk_markers)
                    THEN 'invalid_manufacturer'                        -- R2
                WHEN length(TRIM(r.manufacturer_raw)) < 2
                    THEN 'invalid_manufacturer'                        -- R2
                WHEN UPPER(TRIM(r.brand_name_raw)) IN
                     (SELECT marker FROM junk_markers)
                    THEN 'invalid_brand_name'                          -- R2
                WHEN UPPER(TRIM(r.generic_name_raw)) IN
                     (SELECT marker FROM junk_markers)
                    THEN 'invalid_generic_name'                        -- R2
                ELSE 'unknown_reason'
            END AS rejection_reason
        FROM ranked r
        WHERE r.row_number > 1
           OR r.manufacturer_raw IS NULL
           OR UPPER(TRIM(r.manufacturer_raw)) IN
              (SELECT marker FROM junk_markers)
           OR length(TRIM(r.manufacturer_raw)) < 2
           OR UPPER(TRIM(r.brand_name_raw)) IN
              (SELECT marker FROM junk_markers)
           OR UPPER(TRIM(r.generic_name_raw)) IN
              (SELECT marker FROM junk_markers)
    )
-- | rows_written | rows_rejected |
-- | ------------ | ------------- |
-- | 19611        | 331           |

    INSERT INTO silver_rejected (bronze_id, report_key, rejection_reason)
    SELECT bronze_id, report_key, rejection_reason
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
                PARTITION BY report_key
                ORDER BY id
            ) AS row_number
        FROM bronze_reports
    ),

    cleaned AS (
        SELECT
            r.report_key,
            r.product_code_raw AS product_code,

            -- R4: strip non-ASCII (removes � from ® and ™),
            --     collapse whitespace, trim, UPPER.
            --     Junk markers already rejected, so no CASE needed.
            NULLIF(
                UPPER(TRIM(regexp_replace(
                    regexp_replace(r.brand_name_raw, '[^\x20-\x7E]', '', 'g'),
                    '\s+', ' ', 'g'
                ))),
                ''
            ) AS brand_name,

            NULLIF(
                UPPER(TRIM(regexp_replace(
                    regexp_replace(r.generic_name_raw, '[^\x20-\x7E]', '', 'g'),
                    '\s+', ' ', 'g'
                ))),
                ''
            ) AS generic_name,

            -- R4: strip dots, collapse whitespace, remove legal suffixes.
            --     Done BEFORE the merge so the CASE below sees a
            --     consistent form ('MEDTRONIC PUERTO RICO OPERATIONS'
            --     without trailing 'co').
            NULLIF(
                TRIM(
                    regexp_replace(
                        regexp_replace(
                            regexp_replace(r.manufacturer_raw, '\.', '', 'g'),
                            ',\s*$', '', 'g'
                        ),
                        '\s(inc|llc|ltd|co|corp|corporation|as|ag|gmbh|sa|ab)$',
                        '', 'i'
                    )
                ),
                ''
            ) AS manufacturer_normalized

        FROM ranked r
        WHERE r.row_number = 1                              -- R1
          AND r.product_code_raw IS NOT NULL
          AND r.product_code_raw <> ''
          AND r.manufacturer_raw IS NOT NULL                -- R3
          AND UPPER(TRIM(r.manufacturer_raw)) NOT IN
              (SELECT marker FROM junk_markers)             -- R2
          AND length(TRIM(r.manufacturer_raw)) >= 2         -- R2
          AND UPPER(TRIM(r.brand_name_raw)) NOT IN
              (SELECT marker FROM junk_markers)             -- R2
          AND UPPER(TRIM(r.generic_name_raw)) NOT IN
              (SELECT marker FROM junk_markers)             -- R2
    ),

    merged AS (
        SELECT
            report_key,
            product_code,
            brand_name,
            generic_name,
            CASE UPPER(manufacturer_normalized)
                WHEN 'NOBEL BIOCARE GÖTEBORG'           THEN 'NOBEL BIOCARE'
                WHEN 'MEDTRONIC MINIMED'                THEN 'MEDTRONIC'
                WHEN 'MEDTRONIC PUERTO RICO OPERATIONS' THEN 'MEDTRONIC'
                WHEN 'AIZU OLYMPUS'                     THEN 'OLYMPUS'
                WHEN 'SHIRAKAWA OLYMPUS'                THEN 'OLYMPUS'
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

    RETURN QUERY SELECT written, rejected;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM refresh_silver_reports();
