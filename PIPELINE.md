# PIPELINE.md — ETL Pipeline: Medallion Architecture
This document covers the process behind the [Aegis Compliance](./README.md) dashboard. 
**Live demo:** [mdr-qms-steps.vercel.app](https://mdr-qms-steps.vercel.app/)
 
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
 
- All are strings and pipeline delimited. 
- Device data will be used in this analysis. 
 
 
#### 2.1 SELECT DATA FIELDS
 
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

 
### Pipeline Architecture & Data Flow
```
 DEVICE2024.txt
      │  bronze_ingest.py
      ▼
 ┌────────────┐
 │  BRONZE    │  
 └─────┬──────┘
       │  Gate keeper tests before SILVER
       ▼
 ┌────────────┐   
 │  SILVER    │──────────────► silver_rejected 
 └─────┬──────┘
       │  Gate keeper tests before GOLD 
       ▼
 ┌────────────┐
 │  GOLD      │  
 └─────┬──────┘
       │  Gate keeper tests before Dashboard  
       ▼
   run_pipeline() logs the run in pipeline_runs
       │  
       ▼  
 ┌────────────┐
 │  SUPABASE  │  
 └─────┬──────┘
       ▼
  Dashboard + Data quality panel      
```
 
### STEP 1 - REQUIREMENTS ON EACH LAYER  
 


#### Bronze

## Requirements and tests

- One requirement = one test = one ID. Gatekeeper tests (GK) come last in each layer.
- The next layer is built only if all gatekeeper tests of the previous layer pass.

### Bronze

| ID | Requirement | Acceptance criterion | Test | Status |
|---|---|---|---|---|
| B1 | Read pipe-delimited `latin-1`, quotes as plain text | A name with `Å` is stored unchanged | `test_B1_latin1_names` | Exists |
| B2 | Store only the five mapped columns | Every row has exactly the mapped columns + metadata | `test_B2_only_mapped_columns` | Exists |
| B3 | A changed source header fails loudly | A missing source column raises an error naming the column | `test_B3_missing_column_fails` | New |
| B4 | Malformed lines are counted, logged and not stored | Skipped count = malformed lines in the file | `test_B4_bad_lines_counted` | Exists |
| B5 | All values are stored as text | Key `00123` keeps its leading zeros | `test_B5_all_text` | Exists |
| B6 | An empty field becomes `NULL`, never imputed | Empty `generic_name` is `NULL`, not `""` | `test_B6_empty_is_null` | Exists |
| B7 | Junk markers stay as text | Manufacturer `N/A` is stored as `"N/A"`, not `NULL` | `test_B7_junk_markers_kept` | New + code fix |
| B8 | Every row is traceable to file and line | `source_file` is set; `source_row_num` runs 1..n without gaps | `test_B8_traceable_rows` | Exists |
| B9 | A rerun adds nothing | Second run with the same limit: row count unchanged | `test_B9_rerun_adds_nothing` | Exists |
| B10 | A higher sample limit adds only the new rows | Load 2 rows, then 5: total = 5, no duplicates | `test_B10_higher_limit_adds_new_rows` | New |
| B11 | Bronze is append-only | `DELETE` and `UPDATE` are refused; `TRUNCATE` trigger is enabled | `02_bronze.sql` | Manual |
| **GKB1** | Every source column is mapped | Each of the 5 columns has at least one non-`NULL` value | `02_bronze.sql` | Manual |
| **GKB2** | Every row has metadata | 0 rows with `NULL` `source_file`, `source_row_num` or `inserted_at` | `02_bronze.sql` | Manual |

### Silver

| ID | Requirement | Acceptance criterion | Test | Status |
|---|---|---|---|---|
| S1 | Invalid rows are quarantined with a reason, never dropped | Missing key, duplicate key (lowest bronze `id` kept) and missing product code each appear in quarantine with their reason | `verify_pipeline()` `S1` | Exists (as `S2`, duplicates only) |
| S2 | Missing name or manufacturer: `NULL` + flag, never imputed | Flags match the data in every row | `verify_pipeline()` `S2` | Exists (as `S3b`) |
| S3 | Junk manufacturers are flagged and kept | 0 junk names without `manufacturer_is_junk = TRUE` | `verify_pipeline()` `S3` | Exists (as `S4`) |
| S4 | Manufacturer names map to the correct parent company | A fixed reference list (e.g. `NOBEL BIOCARE → ENVISTA`, `MAQUET → GETINGE`) maps as expected | `verify_pipeline()` `S4` | New |
| S5 | Each product code has one canonical name | 0 named product codes missing in `product_code_dim` | `verify_pipeline()` `S5` | Exists (as `S6`) |
| **GKS1** | `product_code` is never `NULL` in silver | 0 silver rows with `NULL` `product_code` | `verify_pipeline()` `GKS1` | Exists (as `S3a`) |
| **GKS2** | Reconciliation: bronze = silver + quarantine | `bronze = silver + rejected` for the current run | `verify_pipeline()` `GKS2` | Exists (as `S7`) |

### Gold

| ID | Requirement | Acceptance criterion | Test | Status |
|---|---|---|---|---|
| G1 | Every run is logged; the latest run succeeded and matches silver | Latest `pipeline_runs` row is `success` and `rows_silver` = silver count | `verify_pipeline()` `G1` | Exists (as `G7`) |
| G2 | A failed run is rolled back and logged | Forced failure: `status = 'failed'` with error message, previous gold unchanged | `run_pipeline()` | Manual |
| G3 | The public `anon` role cannot read raw data | No `SELECT` for `anon` on bronze, silver or quarantine | `verify_pipeline()` `G3` | Exists (as `G8a`) |
| G4 | Row level security is on for all pipeline tables | RLS enabled on 9 of 9 tables | `verify_pipeline()` `G4` | Exists (as `G8c`) |
| **GKG1** | Reconciliation: products | `SUM(product_stats.total_reports)` = silver rows | `verify_pipeline()` `GKG1` | Exists (as `G3a`) |
| **GKG2** | Reconciliation: manufacturers, junk and `NULL` excluded | `SUM(manufacturer_stats.total_reports)` = non-junk, named silver rows | `verify_pipeline()` `GKG2` | Exists (as `G3b`) |
#### Observability
| ID | Requirement | Test |
|---|---|---|
|O1| Ingest progress, skipped lines, rows per second, duration | `bronze_ingest.py` log |
|O2| One row per pipeline run (counts, status, error) | `pipeline_runs` |
|O3| Result of every verification check at publish | `quality_checks` |
|O4| Rows per layer, % valid rows (threshold 95 %), checks passed | Dashboard: `DataQualityPanel.jsx` |
 

### STEP 2 — RUN THE PIPELINE

FILE STRUCTURE

```
├── PIPELINE.md
├── ingest.log
├── medallion
│   ├── analysis
│   │   ├── eda_device.py
│   │   └── eda_device_output.txt
│   ├── python
│   │   ├── bronze_ingest.py
│   │   ├── requirements.txt
│   │   └── test_bronze_ingest.py
│   ├── scripts
│   │   ├── db_run.sh
│   │   └── db_setup.sh
│   ├── sql
│   │   ├── 01_create_tables.sql
│   │   ├── 02_seed_manufacturers.sql
│   │   ├── 03_bronze.sql
│   │   ├── 04_silver.sql
│   │   ├── 05_gold.sql
│   │   ├── 06_pipeline.sql
│   │   └── 07_verify_silver_gold.sql
│   └── supabase.js
├── src
│   ├── components
│   │   ├── Dashboard.jsx
│   │   ├── DataQualityPanel.jsx
```


 
## FUTURE STEPS 
- dbt: turn the gates into dbt tests. 
- CI job with a Postgres service container, a small fixture and negative tests.
- Silver: join mdrfoi and patient files to add severity (death, injury, malfunction).
- "Which products have an unusually high share of serious events (PRR)?"

Note: MAUDE data is public and contains no personal data. For other sources, hash sensitive columns, e.g. encode(digest(col, 'sha256'), 'hex').