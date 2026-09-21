
-- ============================================================
-- 02_inspect.sql
-- Author: Malena
-- Created: 2026-08-02
-- Description: Inspect data to create rules for the silver layer
--
-- Input:  bronze_reports (append-only raw data)
-- Output: a number of rules for data quality
-- 
===============================================================

-- I1: Discovery - Total Batch Volume Check
SELECT COUNT(*) AS totalt_antal_rader 
FROM bronze_reports; --- one batch, 2000 rows

-- I2: Discovery - Raw Geometries Sample Inspection

SELECT * 
FROM bronze_reports 
ORDER BY id ASC 
LIMIT 20;

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


-- I3: Discovery - Target Malformed & Token Junk String Counts

SELECT COUNT(*) AS antal_ogiltiga_namn
FROM bronze_reports
WHERE UPPER(TRIM(manufacturer_raw)) IN (
    'NI', 'UNK', '*', 'N/A', 'NA', 'UNKNOWN', 
    'NO INFORMATION', '?', 'NONE'
)
OR length(TRIM(manufacturer_raw)) < 2;    -- RESULT: 11. Map theese as NULL --> RULE 



-- I4: Discovery - Missing Optional Attribute Frequency

SELECT COUNT(*) AS antal_null_namn
FROM bronze_reports
WHERE manufacturer_raw IS NULL;  -- 15



-- I5: Discovery - Primary Identifier Uniqueness & Redundant Row Volume

SELECT 
    report_key, 
    COUNT(*) AS antal_forekomster
FROM bronze_reports
GROUP BY report_key
HAVING COUNT(*) > 1
ORDER BY antal_forekomster DESC;   

SELECT COUNT(*) - COUNT(DISTINCT report_key) AS totalt_antal_extra_rader
FROM bronze_reports; -- 39 extra rows




-- E1: Volume & Density Metrics
SELECT 
    COUNT(*) AS totalt_antal_rader,
    COUNT(manufacturer_raw) AS rader_med_tillverkare,
    COUNT(*) - COUNT(manufacturer_raw) AS antal_null_tillverkare
FROM bronze_reports;

-- | exakt_tidsstampel             | antal_inladdade_rader |
-- | ----------------------------- | --------------------- |
-- | 2026-09-17 13:14:22.132372+00 | 1000                  |
-- | 2026-09-17 13:14:19.584989+00 | 1000                  |
-- | 2026-09-17 13:14:21.495067+00 | 1000                  |


-- E2: Core Schema Integrity Check
SELECT 
    COUNT(*) - COUNT(DISTINCT report_key) AS antal_dubbletter_report_key,
    COUNT(*) - COUNT(product_code_raw) AS antal_saknade_produktkoder
FROM bronze_reports;

-- | antal_dubbletter_report_key | antal_saknade_produktkoder |
-- | --------------------------- | -------------------------- |
-- | 39                          | 0                          |


-- E3: Edge Cases
SELECT 
    id,
    manufacturer_raw AS original,
    regexp_replace(manufacturer_raw, '\s(INC|LLC|LTD|CO|CORP)$', '', 'i') AS nuvarande_regex_test,
    CASE 
        WHEN replace(manufacturer_raw, '.', ' ') ~ '\s$' THEN 'JA (Skapar dolt mellanslag på slutet!)'
        ELSE 'NEJ'
    END AS punkt_skapar_ends_with_space
FROM bronze_reports
WHERE manufacturer_raw ILIKE '%-%' 
   OR manufacturer_raw ILIKE '%.%'
LIMIT 5;

-- | id | original                              | nuvarande_regex_test                  | punkt_skapar_ends_with_space           |
-- | -- | ------------------------------------- | ------------------------------------- | -------------------------------------- |
-- | 1  | AIZU OLYMPUS CO., LTD.                | AIZU OLYMPUS CO., LTD.                | JA (Skapar dolt mellanslag på slutet!) |
-- | 2  | AIZU OLYMPUS CO., LTD.                | AIZU OLYMPUS CO., LTD.                | JA (Skapar dolt mellanslag på slutet!) |
-- | 3  | AIZU OLYMPUS CO., LTD.                | AIZU OLYMPUS CO., LTD.                | JA (Skapar dolt mellanslag på slutet!) |
-- | 7  | ALCON RESEARCH, LLC - HOUSTON         | ALCON RESEARCH, LLC - HOUSTON         | NEJ                                    |
-- | 8  | PALTOP ADVANCED DENTAL SOLUTIONS INC. | PALTOP ADVANCED DENTAL SOLUTIONS INC. | JA (Skapar dolt mellanslag på slutet!) |



-- S1: Attribute Frequency & Share Percentage Distribution
SELECT 
    product_code_raw AS produktkod,
    COUNT(*) AS antal_rapporter,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) AS procentuell_andel
FROM bronze_reports
GROUP BY product_code_raw
ORDER BY antal_rapporter DESC
LIMIT 5;

-- | produktkod | antal_rapporter | procentuell_andel |
-- | ---------- | --------------- | ----------------- |
-- | DZE        | 4252            | 21.26             |
-- | QBJ        | 2938            | 14.69             |
-- | QFG        | 2102            | 10.51             |
-- | OZP        | 1096            | 5.48              |
-- | BZD        | 393             | 1.97              |


-- S2: Logical Cross-Reference & Entity Domain Validation
SELECT 
    product_code_raw AS produktkod,
    brand_name_raw AS varumarke,
    COUNT(*) AS antal_kopplingar
FROM bronze_reports
GROUP BY product_code_raw, brand_name_raw
ORDER BY antal_kopplingar DESC
LIMIT 5;

-- | produktkod | varumarke                                         | antal_kopplingar |
-- | ---------- | ------------------------------------------------- | ---------------- |
-- | QBJ        | DEXCOM G6 CONTINUOUS GLUCOSE MONITORING SYSTEM    | 1935             |
-- | QFG        | T:SLIM X2 INSULIN PUMP WITH CONTROL-IQ TECHNOLOGY | 1860             |
-- | QBJ        | DEXCOM G7 CONTINUOUS GLUCOSE MONITORING SYSTEM    | 993              |
-- | BZD        | DREAMSTATION AUTO CPAP                            | 204              |
-- | MVK        | LIFEVEST WCD 4000 SYSTEM                          | 196              |



-- S3: Timestamp Clustering & Ingestion Pattern Analysis
SELECT 
    inserted_at AS exakt_tidsstampel,
    COUNT(*) AS antal_inladdade_rader
FROM bronze_reports
GROUP BY inserted_at
ORDER BY antal_inladdade_rader DESC
LIMIT 3;

-- | exakt_tidsstampel             | antal_inladdade_rader |
-- | ----------------------------- | --------------------- |
-- | 2026-09-17 13:14:22.132372+00 | 1000                  |
-- | 2026-09-17 13:14:19.584989+00 | 1000                  |
-- | 2026-09-17 13:14:21.495067+00 | 1000                  |