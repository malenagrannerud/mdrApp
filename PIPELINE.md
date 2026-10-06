

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


#### 2.2 EXPLORATORY DATA ANALYSIS (EDA) TO DISCOVER REQUIREMENTS FOR SILVER 
```bash 
python medallion/analysis/eda_device.py
```

##### 1. WHAT IS A ROW?  
```
rows: 2,629,410 | unique MDR_REPORT_KEY: 2,627,121 | duplicated (MDR_REPORT_KEY, DEVICE_SEQUENCE_NO): 33 | duplicated (one row): 31 
```
**Conclusion:**
- PK is MDR_REPORT_KEY, DEVICE_SEQUENCE_NO
- Deduplicate 31 identical rows on primary key (PK)


##### 2. MISSING VALUES (%) ? 
```
MDR_REPORT_KEY: 0.00 | DEVICE_SEQUENCE_NO: 0.00 | GENERIC_NAME: 0.02 | MANUFACTURER_D_NAME: 0.16 | DEVICE_REPORT_PRODUCT_CODE: 0.00
```
**Conclusion:** Handle missing GENERIC_NAME (0.02 %) and MANUFACTURER_D_NAME (0.16 %) 


##### 3. JUNK MANUFAKTURER NAMES? 
```
junk list: 1,065 | shorter than 2 chars: 15 | MPRI 34885 | UNK 537 | BD 113 | 0HP 21 | SERF 18 | . 12 | 000 5 | DSS 3 | BIOS 3 | REMI 3
```
**Conclusion:**
- Explore MPRI 
- Flag rows with junk manufacturer names 

##### 4. SAME COMPANY, MANY SPELLINGS (TOP 5) ? 
```
OLYMPUS: 43 different spellings, 55,957 rows | MEDTRONIC: 99 different spellings, 274,262 rows | ALCON: 20 different spellings, 11,719 rows | BOSTON SCIENTIFIC: 27 different spellings, 64,829 rows | ABBOTT: 95 different spellings, 90,271 rows
```
**Conclusion:** Normalize manufacturer names 


##### 5. One product code, several names? 
```
codes: 2,206 | codes with more than 1 name: 1,402
```
**Conclusion:** Build canonical product name — product_code_dim with the most common GENERIC_NAME per DEVICE_REPORT_PRODUCT_CODE.


##### 6. Concentration 
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
       |
       ▼                   
[ BI Dashboard ]     
(Power BI Insights)        
                 
```


### STEP 1 - REQUIREMENTS ON EACH LAYER FOR TRACEABILITY 

#### Bronze Layer
Principle: read all rows, do not modify data 

| # | Rule | What | Why | Implemented in |
|---|------|------|-----|-----|
| B1 | Read file with correct format | Pipe-delimited, latin-1, `QUOTE_NONE` | Wrong encoding corrupts names | | 
| B2 | Keep all RELEVANT columns | Even empty ones | Limited space, keep important data only | | 
| B3 | Keep all rows | No dedup, no filtering, keep bad lines | Traceability — Silver decides | | 
| B4 | Read everything as `str` | No type conversion | Avoid silent type errors | | 
| B5 | Add metadata | `_source_file`, `_ingested_at` | Traceability and lineage | | 
| GKB | GATEKEEPER BEFORE DATA IS PASSED TO SILVER | GATE KEEPER BEFORE DATA IS PASSED TO SILVER | | 

---
#### Silver Layer

| # | Rule | What & why | Risk (severity) | Implemented in |
|---|------|------|-----|----------------|
| S1 | PK | `(MDR_REPORT_KEY, DEVICE_SEQUENCE_NO)` since unique in 99.999 % of rows| | |
| S2 | Deduplicate | Remove 31 identical rows on PK |  | |
| S3 | Flag missing values | `has_missing_generic_name`, `has_missing_manufacturer` to preserve data integrity — do not impute | | |
| S4 | Flag junk manufacturers | `manufacturer_is_junk = TRUE/FALSE` to excludes junk from Gold | | |
| S5 | Normalize manufacturers | `manufacturer_normalized` via mapping table. Ex: Medtronic has 99 spellings |  | |
| S6 | Canonical product name | `product_code_dim` with most common `GENERIC_NAME` | 1,402 of 2,206 codes have >1 name | |
| S7 | Build mapping automatically | `manufacturer_parent` keyword rules → `manufacturer_mapping` | Extensible without touching Silver logic | |
| S8 | Data reconciliation | `bronze_count = silver_count + silver_rejected_count` | Ensures zero row loss during processing | |
| S9 | Quarantine handling | Route the 0.001 % non-unique PK rows to `silver_rejected` | Prevents pipeline crashes on unique indexes | |
| GKS1 | Gatekeeper before GOLD | `bronze_count = silver_count + silver_rejected_count`, else throws loud error and stops | Ensures zero row loss during processing | |


---
#### Gold Layer
| # | Rule | What | Why | Implemented in |
|---|------|------|-----|-----|
| G1 | Aggregate per product code | `GROUP BY device_report_product_code` + `COUNT` | Answers Q1  |
| G2 | Aggregate per manufacturer | `GROUP BY manufacturer_normalized` + `COUNT` | Answers Q2 |
| G3 | Rank results | `RANK() OVER (ORDER BY total_reports DESC)` | Enables "#1, #2, #3" — not just a list |
| G4 | Filter high volume | `WHERE is_high_volume_code = TRUE` | Top 10 codes = 65.5 % of all rows |
| G5 | Exclude junk | `WHERE manufacturer_is_junk = FALSE` | Correct rankings |
| G6 | Label clearly | "Number of reports" — not "rate" | No denominator exists |
| G7 |	Downstream Protection |	sum(total_reports) = silver_count|	Guarantees aggregate integrity for BI layer
| G8 |	Business Assertion|	total_reports > 0	|Prevents logical anomalies in dashboards
| G9 |	Automated Circuit Breaker |	Transactional ROLLBACK on G7/G8 failure + log to pipeline_runs	|Stops corrupt data from publishing|
| G10 | Handle Missing Dimensions | COALESCE(manufacturer_normalized, 'UNKNOWN')	Prevents blank spaces in BI dashboards |
| G11 | Dynamic High Volume | Materialize is_high_volume_code based on Pareto (Top 80% volume) | Replaces hardcoded top 10 with data-driven threshold |

#### Gatekeeper before Dashboard (enforced inside refresh_gold()):
- sum(total_reports) = silver row count
- no total_reports <= 0
- If either fails, the transaction rolls back and pipeline_runs logs a failed row.
---


### STEP 2 — CREATE TABLES 
Run `01_create_tables.sql` in the Supabase SQL editor.

| Table | Role | Governing layer|
|---|------|
| bronze_reports | | Bronze | 
| silver_reports || Silver | 
| silver_rejected || Silver | 
| product_code_dim || ?  | 
| manufacturer_mapping || ? |
| manufacturer_parent || ? | 
| product_stats || Gold| 
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

Note: No GDPR since MAUDE data, else use encode(digest(column_name, 'sha256'), 'hex') etc to remove sensitive info. 
