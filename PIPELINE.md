# PIPELINE.md — ETL Pipeline: Medallion Architecture
This document covers the process behind the [Aegis Compliance](./README.md) dashboard. 
 
![Post-market surveillance dashboard](./screenshots/dashboard.png)
 
 
It contains 
- I - STEPS IN CONDUCTING THE ANALYSIS &
- II - STEPS IN CONDUCTING THE PIPELINE
## I - STEPS IN CONDUCTING THE ANALYSIS
 
### STEP 1 - DEFINE THE RESEARCH QUESTION 
The purpose is to answer
| #  | Question | 
|---|---|
| Q1 | Which products have the most device reports in 2024? |
| Q2 | Which manufacturers have the most device reports in 2024? |
 
to help teams to detect what to focus on for a product. 
 
 
### STEP 2 - EXPLORE AVAILABLE FILES & STRUCTURE FROM THE DATABASE 
See [FDA's MAUDE database](https://www.fda.gov/medical-devices/medical-device-reporting-mdr-how-report-medical-device-problems/mdr-data-files#download)
 
| File | Description | 
|---|---|
| mdrfoi*.zip | Master data-file: Summary of all data files, event types, reporter |
| patientthru*.zip | Patient data-file: Information related to the patient(s) involved |
| foitext*.zip | Text data-file: Textual information from MEDWATCH |
| device*.txt | Device data-file: Information related to the device(s) involved |
 
All are string format, pipeline delimited
 
#### 2.1 EXPLORE TARGET FILE TO SELECT DATA FIELDS 
 
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
 
| Column | Role | 
|---|---|
| `MDR_REPORT_KEY` | Links this file to other MAUDE files. Can be duplicated.| 
| `DEVICE_SEQUENCE_NO`| Unique per unit in a report|
| `GENERIC_NAME`  | The generic common name of the medical device | 
| `DEVICE_REPORT_PRODUCT_CODE` | FDA product classification code (3 letters) | 
| `MANUFACTURER_D_NAME` | Company that manufactured the device | 
 
 
#### 2.2 EXPLORATORY DATA ANALYSIS (EDA) TO DISCOVER DATA QUALITY REQUIREMENTS FOR SILVER 
This EDA is on the full file, 2.6 M rows. 
 
```bash 
python medallion/analysis/eda_device.py
```
 
1. WHAT IS A ROW?  
```
rows: 2,629,410 | unique MDR_REPORT_KEY: 2,627,121 | duplicated (MDR_REPORT_KEY, DEVICE_SEQUENCE_NO): 33 | duplicated (one row): 31 
```
**Conclusion:**
- PK is `MDR_REPORT_KEY, DEVICE_SEQUENCE_NO` — 33 duplicate PKs found, unique in 99.999 % of rows → **S1**
- 31 of those are exact duplicates → **S2** Duplicates are quarantined, not deleted
  (kept row = lowest bronze `id`; the rest go to `silver_rejected`)
2. MISSING VALUES (%) ? 
```
MDR_REPORT_KEY: 0.00 | DEVICE_SEQUENCE_NO: 0.00 | GENERIC_NAME: 0.02 | MANUFACTURER_D_NAME: 0.16 | DEVICE_REPORT_PRODUCT_CODE: 0.00
```
**Conclusion:** Handle missing
- GENERIC_NAME (0.02 %) and MANUFACTURER_D_NAME (0.16 %) → NULL + flag, never impute **S3**
3. JUNK MANUFAKTURER NAMES? 
```
junk list: 1,065 | shorter than 2 chars: 15 | MPRI 34885 | UNK 537 | BD 113 | 0HP 21 | SERF 18 | . 12 | 000 5 | DSS 3 | BIOS 3 | REMI 3
```
**Conclusion:**
- Flag rows with junk manufacturer names **S4**
- Classify MPRI as junk or valid → assumption **A1** (mapped to MEDTRONIC, unverified)
- Junk markers such as `N/A`, `NA` and `NONE` must reach silver as text, not as NULL → **B4**
  
4. SAME COMPANY, MANY SPELLINGS (TOP 5) ? 
```
OLYMPUS: 43 different spellings, 55,957 rows | MEDTRONIC: 99 different spellings, 274,262 rows | ALCON: 20 different spellings, 11,719 rows | BOSTON SCIENTIFIC: 27 different spellings, 64,829 rows | ABBOTT: 95 different spellings, 90,271 rows
```
**Conclusion:** Normalize manufacturer names **S5**
 
 
 
5. ONE PRODUCT CODE, SEVERAL NAMES? 
```
codes: 2,206 | codes with more than 1 name: 1,402
```
**Conclusion:** Build canonical product name — product_code_dim with the most common GENERIC_NAME per DEVICE_REPORT_PRODUCT_CODE **S6**
 
 
 
6. CONCENTRATION?
``` 
top 10 codes = 65.5 % of rows | top 10 manufacturers = 55.0 % of rows
```
**Conclusion:** Add all 2 M rows of data for future steps
(done: the full file runs locally, see D2)
 
 
#### DATA LIMITATIONS
- Under-reporting of events
- Inaccuracies in reports
- Lack of verification that the device caused the reported event
- Lack of information about frequency of device use
- Nr of reports will be high where there are many products on the market, this is not risk
#### 2.3 - ANALYSIS METHOD
Aggregation + ranking, since kategorical and numerical data types
 
 
 
## II - STEPS IN CONDUCTING THE PIPELINE
### FILE STRUCTURE
```
.env.example                      (frontend: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
medallion
├── .env.example                  (pipeline: LOCAL_DATABASE_URL, SUPABASE_DB_URL)
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
[ Source file ] 
       │
       ▼ (bronze_ingest.py, COPY, one transaction)
┌─────────────────────────────────────────┐
│ BRONZE LAYER (Raw & Immutable)          │
│ - Append-only storage in local Postgres │
│ - Tracks ingestion metadata             │
└─────────────────────────────────────────┘
       │
       ▼ (Transformation & DQ via SQL)
┌───────────────────────────────────────────┐
│ SILVER LAYER (Cleaned & Normalized)       │
│ - Deduplication & Normalization           │
│ - Junk filtering ──> [ Quarantine Table ] │
└───────────────────────────────────────────┘
       │
       ▼ (Aggregation)
┌─────────────────────────────────────────┐
│ GOLD LAYER (Business & ML Ready)        │
│ - Aggregated tables + ranked views      │
└─────────────────────────────────────────┘
       │
       ▼ (verify_pipeline(): all checks pass? GKD)
       ▼ (publish_gold.py: gold only, reconciled, one transaction)
[ Supabase ]  ← also receives quality_checks (snapshot of verify_pipeline)
       │
       ▼                   
[ BI Dashboard + Data quality panel ]          
```
 
### STEP 1 - REQUIREMENTS ON EACH LAYER FOR TRACEABILITY 
 
#### Bronze
 
| ID | Requirement | Test |
|---|---|---|
| B1 | File is read as pipe-delimited, `latin-1`, `QUOTE_NONE` | `test_B1_latin1_names` |
| B2 | Source columns are stored unchanged (see D1). Only the 5 mapped columns are kept. A changed source header fails loudly. | `test_B2_only_mapped_columns_are_stored`, `test_B2_empty_value_stays_null`, `test_B2_missing_source_column_fails_loudly`, `02_bronze.sql`: columns filled |
| B3 | Append-only: every parsed row is kept, unparseable rows are counted and logged, UPDATE/DELETE/TRUNCATE are blocked | `test_B3_every_parsed_row_is_kept`, `test_B3_bad_lines_are_counted_and_logged`, `02_bronze.sql`: blocking test |
| B4 | All values are stored as text. Only an empty field becomes NULL; junk values such as `N/A` stay as text. | `test_B4_all_text`, `test_B4_junk_markers_are_not_turned_into_null` |
| B5 | Every row has `source_file`, `source_row_num` and `inserted_at` | `test_B5_metadata_and_row_numbers`, `02_bronze.sql`: metadata filled |
| B6 | Ingesting the same file twice adds no rows. A rerun is detected, logged and adds nothing; the whole load is one transaction, and `UNIQUE (source_file, source_row_num)` is the backstop. | `test_B6_double_run_same_count` |
| **GKB** | **Gate: Silver runs only if B1–B6 pass** | `db_run.sh` runs `02_bronze.sql` first and stops on error |
 
#### Silver
 
| ID | Requirement | Test |
|---|---|---|
| S1 | Rows without a primary key value are rejected as `S1_missing_key` | `verify_pipeline()` S1 |
| S2 | For duplicate keys, keep the row with the lowest bronze `id`; reject the rest as `S2_duplicate_key` | `verify_pipeline()` S2 |
| S3 | Missing `generic_name` / `manufacturer` is stored as `NULL` with a flag, never imputed; missing `product_code` is rejected as `S3_missing_product_code` | `verify_pipeline()` S3a, S3b |
| S4 | Junk manufacturers are flagged (`manufacturer_is_junk = TRUE`) and the row is kept | `verify_pipeline()` S4 |
| S5 | Manufacturer names are normalized deterministically (longest keyword wins, then parent name A–Z). The mapping is built over distinct raw names, not over all rows. | `verify_pipeline()` S5 |
| S6 | Each product code has one canonical name (most common non-NULL, ties A–Z) | `verify_pipeline()` S6 |
| S7 | `bronze = silver + rejected`, otherwise error and rollback | `verify_pipeline()` S7 |
| **GKS** | **Gate: Gold runs only if S7 passes. On failure: rollback and a `failed` row in `pipeline_runs`** | `verify_pipeline()` G7 |
 
#### Gold
 
| ID | Requirement | Test |
|---|---|---|
| G1 | Count per `product_code` with canonical name (`MISSING NAME` if none) | `verify_pipeline()` G3a |
| G2 | Count per normalized manufacturer, excluding junk and NULL | `verify_pipeline()` G3b |
| G3 | `sum(product_stats)` = silver rows; `sum(manufacturer_stats)` = silver rows that are not junk and not NULL | `verify_pipeline()` G3a, G3b |
| G4 | `total_reports > 0` in every Gold row | `verify_pipeline()` G4 |
| G5 | Rank is computed in `*_ranked` views, not stored | `verify_pipeline()` G5 |
| G6 | Dashboard says "Number of device entries", never "rate" | Manual check |
| G7 | A failed Silver/Gold run is rolled back and logged in `pipeline_runs` | `verify_pipeline()` G7 |
| G8 | RLS on all tables; `anon` can only `SELECT` Gold tables, views, `pipeline_runs` and `quality_checks` | `verify_pipeline()` G8a, G8b, G8c |
| **GKG** | **Gate: G3 and G4 must pass, otherwise rollback and the previous Gold data stays** | Enforced in `refresh_gold()`; `verify_pipeline()` G3a, G3b, G4 |
 
#### Publish
 
| ID | Requirement | Test |
|---|---|---|
| P1 | Only Gold, `product_code_dim`, `pipeline_runs` and `quality_checks` are published to Supabase | `publish_gold.py::GOLD_TABLES` |
| P2 | Row counts and sums are equal locally and on Supabase before commit, otherwise rollback | `publish_gold.py::publish` (reconciliation) |
| **GKD** | **Gate: nothing is published unless every `verify_pipeline()` check passed** | `publish_gold.py::publish` |
 
#### Observability
 
| What | Where |
|---|---|
| Ingest progress, skipped lines, rows per second, duration | `bronze_ingest.py` log |
| One row per pipeline run (counts, status, error) | `pipeline_runs` |
| Result of every verification check at publish | `quality_checks` |
| Rows per layer, % valid rows (threshold 95 %), checks passed | Dashboard: `DataQualityPanel.jsx` |
 
#### Deviations, assumptions and later work
 
| ID | Type | Description |
|---|---|---|
| D1 | Deviation | Only 5 source columns are stored in Bronze. Production would store all. |
| D2 | Deviation | Bronze and Silver run on a local Postgres (free-tier limit on Supabase). Only Gold, `product_code_dim`, `pipeline_runs` and `quality_checks` are published to Supabase. |
| A1 | Assumption | MPRI is mapped to MEDTRONIC. |
| A2 | Assumption | For duplicate keys with different content, "lowest id" is arbitrary but reproducible. |
| L1 | Later | dbt tests, orchestration, 95 % valid-rows threshold as a hard gate (today it is shown on the dashboard), rebuild of `manufacturer_mapping` and `product_code_dim` inside `run_pipeline()`. |
 
 
### STEP 2 — SET UP THE DATABASES
Local Postgres (docker or apt), then:
```bash
cp medallion/.env.example medallion/.env      # fill in LOCAL_DATABASE_URL and SUPABASE_DB_URL
pip install -r medallion/python/requirements.txt
medallion/scripts/db_setup.sh $LOCAL_URL      # roles anon/service_role, 01, 03a, 08
```
Supabase: run `01_create_tables.sql`, `08_quality_checks.sql` and `04_gold.sql` once in the SQL editor (04 creates the ranked views the dashboard reads).
Use the Supabase **Session pooler** connection string.
 
 
 
### STEP 3 — RUN BRONZE 
Trial first, in a throwaway database:
```bash
LOCAL_DATABASE_URL=$PG/trial python medallion/python/bronze_ingest.py --limit 200000
```
Then the full file:
```bash
nohup python medallion/python/bronze_ingest.py > ingest.log 2>&1 &
tail -f ingest.log
```
**Expected:** `BRONZE DONE`, `bronze_reports` is populated in the local Postgres.
 
 
### STEP 4 — RUN SILVER AND GOLD
```bash
medallion/scripts/db_run.sh $LOCAL_URL
```
Runs `02_bronze.sql` (GKB), `03b_silver.sql`, `04_gold.sql`, `06_pipeline.sql`, `07_verify_silver_gold.sql`, then `run_pipeline()` and `verify_pipeline()`. Exit code 1 if any check fails.
 
#### Validation Rate Metrics
*   Tracks the percentage of healthy rows: `(silver_rows / bronze_rows) * 100`.
*   An alert threshold is set at `< 95%` to catch sudden upstream API changes or corrupted source files. Shown on the dashboard.
### STEP 5 — PUBLISH GOLD
```bash
python medallion/python/publish_gold.py
```
**Expected:** `GKD passed`, one `published table=...` line per table, `PUBLISH DONE`.
 
### STEP 6 — DASHBOARD
Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (root `.env` and Vercel). The Data quality panel and the two charts read from Supabase.
 
 
 
## FUTURE STEPS 
- dbt — formalize the gatekeepers as dbt tests (not_null, unique, relationships, custom sum checks). One dbt test command instead of manual SQL checks.
- Silver: enrich with mdrfoi.txt and patient.txt via JOIN — adds severity per report (death / injury / malfunction).
- Star schema in Gold for ad-hoc analysis.
- AI analysis
- Risk analysis on requirements 
- "Which products have an unusually high share of serious events (PRR)?"
Note: No GDPR since MAUDE data, else use encode(digest(column_name, 'sha256'), 'hex') etc to remove sensitive info. 
 