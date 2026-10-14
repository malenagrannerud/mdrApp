# PIPELINE.md — ETL Pipeline: Medallion Architecture
This document covers the process behind the [Aegis Compliance](./README.md) dashboard. 
 
![Post-market surveillance dashboard](./screenshots/dashboard.png)
 
This documentation contains 
- I - STEPS IN CONDUCTING THE ANALYSIS &
- II - STEPS IN CONDUCTING THE PIPELINE

  
## I - STEPS IN CONDUCTING THE ANALYSIS
### STEP 1 - DEFINE THE RESEARCH QUESTION 
The purpose is to answer
| #  | Question | 
|---|---|
| Q1 | Which products have the most device reports in 2024? |
| Q2 | Which manufacturers have the most device reports in 2024? |
 
 
 
### STEP 2 - EXPLORE AVAILABLE FILES FROM THE DATABASE 
See [FDA's MAUDE database](https://www.fda.gov/medical-devices/medical-device-reporting-mdr-how-report-medical-device-problems/mdr-data-files#download)
 
| Available Files | Description | 
|---|---|
| mdrfoi*.zip | Master data: Summary of all data files, event types, reporters |
| patientthru*.zip | Patient data: Information related to the patient(s) involved |
| foitext*.zip | Text data: Textual information from MEDWATCH |
| device*.txt | Device data: Information related to the device(s) involved |
 
All are strings and pipeline delimited. Device data will be used in this analysis. 
 
#### 2.1 EXPLORE THE TARGET FILE TO SELECT DATA FIELDS 
 
2.1.1 DOWNLOAD THE RAW FILE
```bash
mkdir -p medallion/data
cd medallion/data
curl -O https://www.accessdata.fda.gov/MAUDE/ftparea/device2024.zip
unzip device2024.zip
cd ../..
```
 
2.1.2 SELECT DATA FIELDS
```bash
head -n 1 medallion/data/DEVICE2024.txt | tr '|' '\n'
```
 
| Column Headers | Description | 
|---|---|
| `MDR_REPORT_KEY` | Links this file to other MAUDE files. Can be duplicated.| 
| `DEVICE_SEQUENCE_NO`| Unique per unit in a report|
| `GENERIC_NAME`  | The generic common name of the medical device | 
| `DEVICE_REPORT_PRODUCT_CODE` | FDA product classification code (3 letters) | 
| `MANUFACTURER_D_NAME` | Company that manufactured the device | 
 
 
#### 2.2 EXPLORATORY DATA ANALYSIS (EDA) TO DISCOVER REQUIREMENTS
 
```bash 
python medallion/analysis/eda_device.py
```

SUMMARY (for details, see medallion/analysis/eda_device.txt )

```
 === 1. Duplicates on primary key ===
rows: 2,629,410
unique MDR_REPORT_KEY: 2,627,121
unique DEVICE_SEQUENCE_NO: 2,629,373
duplicated (MDR_REPORT_KEY, DEVICE_SEQUENCE_NO): 33
duplicated (the whole row): 31
```
```
=== 2. Missing values (%) ===
MDR_REPORT_KEY: 0.00 | DEVICE_SEQUENCE_NO: 0.00 | GENERIC_NAME: 0.02 | MANUFACTURER_D_NAME: 0.16 | DEVICE_REPORT_PRODUCT_CODE: 0.00
```
```
=== 3. Junk MANUFACTURER_D_NAME = ===
junk list: 1,065 | shorter than 2 chars: 15

Short MANUFACTURER_D_NAME 
MPRI: 34885 | UNK: 537 | BD: 113 | 0HP: 21 | SERF: 18 | .: 12 | 000: 5 | DSS: 3 | BIOS: 3
```
```
=== 4. Variants of MANUFACTURER_D_NAME ===
OLYMPUS: 43 spellings, 55,957 rows
MEDTRONIC: 99 spellings, 274,262 rows
ALCON: 20 spellings, 11,719 rows
BOSTON SCIENTIFIC: 27 spellings, 64,829 rows
ABBOTT: 95 spellings, 90,271 rows
```
```
=== 5. One PRODUCT_CODE, several GENERIC_NAMES? ===
codes: 2,206 | codes with more than 1 name: 1,402
```
```
=== 6. Concentration of PRODUCT_CODE'S (COUNTS) ===
DZE: 697107 | QBJ: 347156 | QFG: 273207 | OZP: 129596 | BZD: 68264 | FRN: 57739
top 30 codes = 77.7% of rows
top 20 manufacturers = 68.3% of rows
```

#### DATA LIMITATIONS
- Under-reporting of events
- Inaccuracies in reports
- Lack of verification that the device caused the reported event
- Lack of information about frequency of device use
- Nr of reports will be high where there are many products on the market, this is not risk


#### 2.3 - ANALYSIS METHOD
Aggregation + ranking, since categorical and numerical data types
 
 
 
## II - STEPS IN CONDUCTING THE PIPELINE
### FILE STRUCTURE
```
             

medallion
├── supabase.js
├── data
│   └── DEVICE2024.txt
├── analysis
│   └── eda_device.py
├── python
│   ├── bronze_ingest.py
│   ├── publish_gold.py
│   ├── test_bronze_ingest.py
│   └── requirements.txt
├── scripts
│   ├── db_setup.sh
│   └── db_run.sh
└── sql
    ├── 01_create_tables.sql
    ├── 02_bronze.sql
    ├── 03a_seed_manufacturers.sql
    ├── 03b_silver.sql
    ├── 04_gold.sql
    ├── 06_pipeline.sql
    ├── 07_verify_silver_gold.sql
    └── 08_quality_checks.sql
src
└── components
    ├── Dashboard.jsx
    └── DataQualityPanel.jsx
```
 
### Pipeline Architecture & Data Flow
```
 DEVICE2024.txt
      │  bronze_ingest.py
      ▼
 ┌────────────┐
 │  BRONZE    │  raw, append-only
 └─────┬──────┘
       │  Gate keeper tests before SILVER
       ▼
 ┌────────────┐   
 │  SILVER    │──────────────► silver_rejected 
 └─────┬──────┘
       │  Gate keeper tests before GOLD (S7 reconciliation, silver not empty)
       ▼
 ┌────────────┐
 │  GOLD      │  product_stats, manufacturer_stats, ranked views
 └─────┬──────┘
       │  GKG  (G3 reconciliation, G4 sanity)
       ▼
   run_pipeline() logs the run in pipeline_runs
       │  GKD  (every verify_pipeline() check passed)
       ▼  publish_gold.py
 ┌────────────┐
 │  SUPABASE  │  gold only
 └─────┬──────┘
       ▼
  Dashboard + Data quality panel      
```
 
### STEP 1 - REQUIREMENTS ON EACH LAYER  
 
#### Bronze
 
| ID | Requirement | Test |
|---|---|---|
| B1 | Pipe-delimited reading, `latin-1`, `QUOTE_NONE` | `test_B1_latin1_names` |
| B2 | Five headers are unchanged. A changed header fails loudly. | `test_B2_only_mapped_columns_are_stored`, `test_B2_empty_value_stays_null`, `test_B2_missing_source_column_fails_loudly`, `02_bronze.sql`: columns filled |
| B3 | Append-only: parsed rows are kept, unparseable rows are counted and logged, UPDATE/DELETE/TRUNCATE are blocked | `test_B3_every_parsed_row_is_kept`, `test_B3_bad_lines_are_counted_and_logged`, `02_bronze.sql`: blocking test |
| B4 | Values are stored as text. Empty field becomes `NULL` and `N/A` stay as text. | `test_B4_all_text`, `test_B4_junk_markers_are_not_turned_into_null` |
| B5 | Every row has `source_file`, `source_row_num` and `inserted_at` | `test_B5_metadata_and_row_numbers`, `02_bronze.sql`: metadata filled |
| B6 | A rerun is detected, logged and adds nothing; and `UNIQUE (source_file, source_row_num)` is the backstop. | `test_B6_double_run_same_count` |
| **GKB** | Gate keeper: Silver runs only if B1–B6 pass | `db_run.sh` runs `02_bronze.sql` first and stops on error |
 
#### Silver
 
| ID | Requirement | Test |
|---|---|---|
| S1 | Rows without a PK are rejected as `S1_missing_key` | `verify_pipeline()` |
| S2 | For duplicate PK, keep the row with the lowest bronze `id`; reject the rest as `S2_duplicate_key` | `verify_pipeline()` |
| S3 | Missing `generic_name` / `manufacturer` is stored as `NULL` with a flag, never imputed; missing `product_code` is rejected as `S3_missing_product_code` | `verify_pipeline()` |
| S4 | Junk manufacturers are flagged (`manufacturer_is_junk = TRUE`) and the row is kept | `verify_pipeline()`|
| S5 | Manufacturer names are normalized deterministically (longest keyword wins, then parent name A–Z). The mapping is built over distinct raw names, not over all rows. | `verify_pipeline()` |
| S6 | Each product code has one canonical name (most common non-NULL, ties A–Z) | `verify_pipeline()` |
| **GKS** | Gate keeper: `bronze = silver + rejected`, otherwise error and rollback | `verify_pipeline()` |

 
#### Gold
 
| ID | Requirement | Test |
|---|---|---|
| G1 | Count per `product_code` with canonical name (`MISSING NAME` if none) | `verify_pipeline()` |
| G2 | Count per normalized manufacturer, excluding junk and NULL | `verify_pipeline()` |
| G5 | Rank is computed in `*_ranked` views, not stored | `verify_pipeline()` |
| G7 | A failed Silver/Gold run is rolled back and logged in `pipeline_runs` | `verify_pipeline()` |
| G8 | RLS on all tables; `anon` can only `SELECT` Gold tables, views, `pipeline_runs` and `quality_checks` | `verify_pipeline()` |
| **GKG** | `sum(product_stats)`=silver rows; `sum(manufacturer_stats)`=silver rows that are not junk and not NULL.`verify_pipeline()`. `total_reports > 0` in every Gold row. Else rollback and the previous Gold data stays  | Enforced in `refresh_gold()`; `verify_pipeline()` |
 

#### Observability
| ID | Requirement | Test |
|---|---|---|
|O1| Ingest progress, skipped lines, rows per second, duration | `bronze_ingest.py` log |
|O2| One row per pipeline run (counts, status, error) | `pipeline_runs` |
|O3| Result of every verification check at publish | `quality_checks` |
|O4| Rows per layer, % valid rows (threshold 95 %), checks passed | Dashboard: `DataQualityPanel.jsx` |
 

### STEP 2 — SET UP THE DATABASES
cp .env.example .env                 # fill in the values
pip install -r python/requirements.txt
pytest python                        # tests, no database needed

scripts/setup.sh $LOCAL_URL          # runs sql 01, 02
python python/ingest.py              # bronze
scripts/run.sh $LOCAL_URL            # runs sql 03 to 06: gates, silver, gold, checks
python python/publish.py             # to Supabase

cd dashboard && npm install && npm run dev

 
## FUTURE STEPS 
- dbt: turn the gates into dbt tests. GKB: not_null, unique, row count. GKS: unique_combination_of_columns, not_null(product_code), accepted_values(rejection_reason), S7 and S4 as singular tests. GKG: G3 and G4 as singular tests. dbt build skips everything downstream of a failed test, which is what a gate should do.
- CI job with a Postgres service container, a small fixture and negative tests.
- Silver: join mdrfoi and patient files to add severity (death, injury, malfunction).
- "Which products have an unusually high share of serious events (PRR)?"

Note: MAUDE data is public and contains no personal data. For other sources, hash sensitive columns, e.g. encode(digest(col, 'sha256'), 'hex').