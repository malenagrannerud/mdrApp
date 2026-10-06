

# PIPELINE.md — ETL Pipeline: Medallion Architecture
This document covers the process behind the [Aegis Compliance](./README.md) dashboard. It contains 
- I - STEPS IN CONDUCTING THE ANALYSIS &
- II - STEPS IN CONDUCTING THE PIPELINE


## I - STEPS IN CONDUCTING THE ANALYSIS

### STEP 1 - DEFINE THE RESEARCH QUESTION 
The purpose is to answer
| #  | Question | 
|---|---|
| Q1 | What type of medical device has a high rate of incident reports? |
| Q2 | What manufacturers are behind the most frequently reported products? |

to help teams to detect what to focus on for a product. 


### STEP 2 - EXPLORE AVAILABLE FILES & STRUCTURE FROM THE TARGET DATABASE 
FDA MAUDE : [-report-medical-device-problems/mdr-data-files#download](https://www.fda.gov/medical-devices/medical-device-reporting-mdr-how-report-medical-device-problems/mdr-data-files#download)

| File | Description | 
|---|---|
| mdrfoi*.zip | Master data-file: Summary of all data files, event types, reporter |
| patientthru*.zip | Patient data-file: Information related to the patient(s) involved |
| foitext*.zip | Text data-file: Textual information from MEDWATCH |
| device*.txt | Device data-file: Information related to the device(s) involved |

All are string format

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
```bash 
python medallion/analysis/eda_device.py
```

1. WHAT IS A ROW?  
```
rows: 2,629,410 | unique MDR_REPORT_KEY: 2,627,121 | duplicated (MDR_REPORT_KEY, DEVICE_SEQUENCE_NO): 33 | duplicated (one row): 31 
```
**Conclusion:**
- PK is `MDR_REPORT_KEY, DEVICE_SEQUENCE_NO` — 33 duplicate PKs found, unique in 99.999 % of rows → **S1**
- 31 of those are exact duplicates → **S2** Remove 31 identical rows on PK



2. MISSING VALUES (%) ? 
```
MDR_REPORT_KEY: 0.00 | DEVICE_SEQUENCE_NO: 0.00 | GENERIC_NAME: 0.02 | MANUFACTURER_D_NAME: 0.16 | DEVICE_REPORT_PRODUCT_CODE: 0.00
```
**Conclusion:** Handle missing
- GENERIC_NAME (0.02 %) **S3** and
- MANUFACTURER_D_NAME (0.16 %) **S4**


3. JUNK MANUFAKTURER NAMES? 
```
junk list: 1,065 | shorter than 2 chars: 15 | MPRI 34885 | UNK 537 | BD 113 | 0HP 21 | SERF 18 | . 12 | 000 5 | DSS 3 | BIOS 3 | REMI 3
```
**Conclusion:**
- Classify MPRI as junk or valid  **S5**
- Flag rows with junk manufacturer names **S6**

  

4. SAME COMPANY, MANY SPELLINGS (TOP 5) ? 
```
OLYMPUS: 43 different spellings, 55,957 rows | MEDTRONIC: 99 different spellings, 274,262 rows | ALCON: 20 different spellings, 11,719 rows | BOSTON SCIENTIFIC: 27 different spellings, 64,829 rows | ABBOTT: 95 different spellings, 90,271 rows
```
**Conclusion:** Normalize manufacturer names **S7**



5. ONE PRODUCT CODE, SEVERAL NAMES? 
```
codes: 2,206 | codes with more than 1 name: 1,402
```
**Conclusion:** Build canonical product name — product_code_dim with the most common GENERIC_NAME per DEVICE_REPORT_PRODUCT_CODE **S8**



6. CONCENTRATION?
``` 
top 10 codes = 65.5 % of rows | top 10 manufacturers = 55.0 % of rows
```
**Conclusion:** Add all 2 M rows of data for future steps


#### DATA LIMITATIONS
- Under-reporting of events
- Inaccuracies in reports
- Lack of verification that the device caused the reported event
- Lack of information about frequency of device use
- To small sample to represent the complete set


#### 2.3 - ANALYSIS METHOD
Aggregation + ranking, since kategorical and numerical data types



## II - STEPS IN CONDUCTING THE PIPELINE
### RESULTING FILE STRUCTURE
```
medallion
├── data
│   └── DEVICE2024.txt
├── analysis
│   └── eda_device.py
├── python
│   ├── bronze_ingest.py
│   ├── test_bronze_ingest.py
│   └── requirements.txt
│
└── sql
    ├── 01_create_tables.sql
    ├── 02_bronze.sql
    ├── 03a_seed_manufacturers.sql
    ├── 03b_silver.sql
    ├── 04_gold.sql
    └── 05_pipeline.sql             
```

### Pipeline Architecture & Data Flow
```
[ Source file ] 
       │
       ▼ (Ingestion via Python)
┌─────────────────────────────────────────┐
│ BRONZE LAYER (Raw & Immutable)          │
│ - Append-only storage in Supabase       │
│ - Tracks ingestion metadata             │
└─────────────────────────────────────────┘
       │
       ▼ (Transformation & DQ via SQL)
┌───────────────────────────────────────────┐
│ SILVER LAYER (Cleaned & Normalized)       │
│ - Deduplication & Type Casting            │
│ - Junk filtering ──> [ Quarantine Table ] │
└───────────────────────────────────────────┘
       │
       ▼ (Aggregation & Feature Engineering)
┌─────────────────────────────────────────┐
│ GOLD LAYER (Business & ML Ready)        │
│ - High-performance materialized views   │
└─────────────────────────────────────────┘
       │
       ▼                   
[ BI Dashboard ]          
```


### STEP 1 - REQUIREMENTS ON EACH LAYER FOR TRACEABILITY 
Rows are split into "ORCHESTRATION" OR "DBT" for future automation. 

#### BRONZE LAYER

DESIGN REQUIREMENTS 

| # | Rule | What & why | Implemented in | Automation |
|---|------|------------|----------------|------------|
| B1 | Read file with correct format | Pipe-delimited, latin-1, `QUOTE_NONE` — wrong encoding corrupts names | | INGEST |
| B2 | Keep all RELEVANT columns | Even empty ones | | DBT |
| B3 | Keep all rows | No dedup, no filtering, keep bad lines — traceability, Silver decides | | DBT |
| B4 | Read everything as `str` | No type conversion — avoid silent type errors | | INGEST |
| B5 | Add metadata | `source_file`, `ingested_at` — traceability and lineage | | INGEST + DBT |
| GKB | Gatekeeper before SILVER | Verify B1–B5 on the ingested batch — format, columns, row count, type, metadata. Manual read only — catches malformed Bronze before transformation | | ORCHESTRATION |

---

#### SILVER LAYER

DATA QUALITY REQUIREMENTS
All fututre automation: DBT

| # | Rule | What & why | Implemented in |
|---|------|------------|----------------|
| S1 | PK | `(MDR_REPORT_KEY, DEVICE_SEQUENCE_NO)` since unique in 99.999 % of rows | |
| S2 | Deduplicate | Remove 31 identical rows on PK | |
| S3 | Flag missing generic name | `has_missing_generic_name` to preserve data integrity — do not impute | |
| S4 | Flag missing manufacturer | `has_missing_manufacturer` preserves data integrity — do not impute | |
| S5 | Classify MPRI | Determine if MPRI (34,885 rows) is junk or valid | |
| S6 | Flag junk manufacturers | `manufacturer_is_junk = TRUE/FALSE` to exclude junk from Gold | |
| S7 | Normalize manufacturers | `manufacturer_normalized` via mapping table. Ex: Medtronic has 99 spellings | |
| S8 | Canonical product name | `product_code_dim` with most common `GENERIC_NAME` — 1,402 of 2,206 codes have >1 name | |


DESIGN REQUIREMENTS

| # | Rule | What & why | Implemented in | Automation |
|---|------|------------|----------------|------------|
| S9 | Build mapping automatically | `manufacturer_parent` keyword rules → `manufacturer_mapping` — extensible without touching Silver logic | | DBT |
| S10 | Data reconciliation | `bronze_count = silver_count + silver_rejected_count` — ensures zero row loss | | DBT |
| S11 | Quarantine handling | Route the 0.001 % non-unique PK rows to `silver_rejected` — prevents pipeline crashes on unique indexes | | ORCHESTRATION |
| GKS1 | Gatekeeper before GOLD | `bronze_count = silver_count + silver_rejected_count`, else throws loud error and stops — ensures zero row loss | | DBT |
| GKS2 | Gatekeeper before GOLD | `refresh_silver_reports()` throws loud error and stops — stops unhandled exceptions from crashing the pipeline mid-write | | ORCHESTRATION |

---

#### GOLD LAYER

DATA QUALITY REQUIREMENTS

| # | Rule | What & why | Implemented in | Automation |
|---|------|------------|----------------|------------|
| G1 | Aggregate per product code | `GROUP BY device_report_product_code` + `COUNT` — answers Q1 | | DBT |
| G2 | Aggregate per manufacturer | `GROUP BY manufacturer_normalized` + `COUNT` — answers Q2 | | DBT |
| G3 | Rank results | `RANK() OVER (ORDER BY total_reports DESC)` — enables "#1, #2, #3", not just a list | | DBT |
| G4 | Filter high volume | `WHERE is_high_volume_code = TRUE` — top 10 codes = 65.5 % of all rows | | DBT |
| G5 | Exclude junk | `WHERE manufacturer_is_junk = FALSE` — correct rankings | | DBT |
| G6 | Label clearly | "Number of reports" — not "rate", no denominator exists | | DBT |
| G7 | Downstream protection | `sum(total_reports) = silver_count` — guarantees aggregate integrity for BI layer | | DBT |
| G8 | Business assertion | `total_reports > 0` — prevents logical anomalies in dashboards | | DBT |
| G10 | Handle missing dimensions | `COALESCE(manufacturer_normalized, 'UNKNOWN')` — prevents blank spaces in BI dashboards | | DBT |
| G11 | Dynamic high volume | Materialize `is_high_volume_code` based on Pareto (top 80 % volume) — replaces hardcoded top 10 with data-driven threshold | | DBT |


DESIGN REQUIREMENTS

| # | Rule | What & why | Implemented in | Automation |
|---|------|------------|----------------|------------|
| GKG1 | Gatekeeper before DASHBOARD | `sum(total_reports) = silver_count`, else throws loud error and stops — ensures aggregate integrity | | DBT |
| GKG2 | Gatekeeper before DASHBOARD | no `total_reports <= 0`, else throws loud error and stops — prevents logical anomalies | | DBT |
| GKG3 | Gatekeeper before DASHBOARD | if GKG1 or GKG2 fails → rollback + log failed row to `pipeline_runs` — stops corrupt data from publishing | | ORCHESTRATION |
| G9 | Automated circuit breaker | Transactional ROLLBACK triggered by GKG3 + log to `pipeline_runs` — stops corrupt data from publishing | | ORCHESTRATION |

---


### STEP 2 — CREATE TABLES 
Run `01_create_tables.sql` in the Supabase SQL editor.

| Table | Role | Layer|
|---|------|------|
| bronze_reports || Bronze | 
| silver_reports || Silver | 
| silver_rejected || Silver | 
| product_code_dim || Silver  | 
| manufacturer_mapping || Silver |
| manufacturer_parent || Silver | 
| product_stats || Gold | 
| manufacturer_stats || Gold | 


### STEP 3 — RUN BRONZE 
```bash
pip install -r medallion/python/requirements.txt
python medallion/bronze_ingest.py
```
**Expected:** `BRONZE DONE`, `bronze_reports` is populated in Supabase.



### STEP 4 — RUN SILVER
Run `03_silver.sql` in Supabase. This process cleanses, normalizes, and validates the data.

#### Validation Rate Metrics
*   Tracks the percentage of healthy rows: `(silver_rows / bronze_rows) * 100`.
*   An alert threshold is set at `< 95%` to catch sudden upstream API changes or corrupted source files.


### STEP 5 — RUN GOLD
Run `04_gold.sql` in Supabase. Output: refresh_gold() and the two ranked views.
Run `pipeline.sql`



## FUTURE STEPS 
- dbt — formalize the gatekeepers as dbt tests (not_null, unique, relationships, custom sum checks). One dbt test command instead of manual SQL checks.
- Silver: enrich with mdrfoi.txt and patient.txt via JOIN — adds severity per report (death / injury / malfunction).
- Star schema in Gold for ad-hoc analysis.
- Representative sample: current 20 k rows are the first rows of the file, not randomly drawn.
- AI analysis
- Risk analysis on requirements 

Note: No GDPR since MAUDE data, else use encode(digest(column_name, 'sha256'), 'hex') etc to remove sensitive info. 
