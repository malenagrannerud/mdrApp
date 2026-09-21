-- ============================================================
-- 02_bronze.sql
-- Author: Malena
-- Created: 2026-08-02
-- Updated: 2026-09-21
-- Description: Inspect data from bronze_reports_raw 
--
-- End goal:
--      1 - Which are the most reported products to FDA 2024?
--      2 - Which are the most reported manufacturers to FDA 2024? 
--
-- Data flow
-- 1 - dbt: Structural checks (report_key is not_null)
-- 2 - Input:  bronze_reports (append-only raw data)
-- 3 - Output: bronze_reports validated
-- 4 - dbt: Check if OK to load bronze_reports to silver_reports
--
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




-- I10: Batch pattern — when rows were loaded
SELECT
    inserted_at AS load_timestamp,
    COUNT(*) AS rows_loaded
FROM bronze_reports
GROUP BY inserted_at
ORDER BY load_timestamp;


SELECT COUNT(*) AS total_rows FROM bronze_reports;



-- HOW MUCH OF EACH ROW IS FILLED? 
-- Why: shows which columns have missing data without running a separate COUNT for each one.
SELECT
    COUNT(*)                        AS total_rows,
    COUNT(report_key)               AS report_key_filled,
    COUNT(product_code_raw)         AS product_code_filled,
    COUNT(brand_name_raw)           AS brand_name_filled,
    COUNT(generic_name_raw)         AS generic_name_filled,
    COUNT(manufacturer_raw)         AS manufacturer_filled,
    COUNT(source_file)              AS source_file_filled
FROM bronze_reports;





