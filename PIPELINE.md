# PIPELINE.md — ETL Pipeline: Medallion Architecture

This document covers the analysis and pipeline behind the [Aegis Compliance](./README.md) dashboard. First, steps in conduction data analysis is presented, and seconly, steps in developing and running the pipeline. 

## STEPS IN CONDUCTING THE ANALYSIS

### STEP 1 - DEFINE THE QUESTION 
The purpose is to answer
- What type of medical device has a high rate of incident reports? What devices are connected to death or serious events?
- What manufacturer are behind the most frequently reported products?

**Aim:** Help PMS teams to detect what to focus on, for a product. 


### STEP 2 — EXPLORE FILES
 FDA MAUDE : [-report-medical-device-problems/mdr-data-files#download](https://www.fda.gov/medical-devices/medical-device-reporting-mdr-how-report-medical-device-problems/mdr-data-files#download)

AVAILABLE FILES
Master data-file  (mdrfoi*.zip) : Summary of all data files, event types, reporter
Patient data-file (patientthru*.zip) : Information related to the patient(s) involved
Text data-file (foitext*.zip) : Textual information from MEDWATCH Form Sections B5, H3, and H10
Device data-file (device*.txt)

### 2.1 EXPLORE DEVICE2024.txt

DOWNLOAD A RAW FILE
```bash
mkdir -p medallion/data
cd medallion/data
curl -O https://www.accessdata.fda.gov/MAUDE/ftparea/device2024.zip
unzip device2024.zip
cd ../..
```

EXPLORE AND SELECT HEADINGS

```bash
head -n 1 medallion/data/DEVICE2024.txt | tr '|' '\n'
```

| Column | Role | 
|---|---|
| `MDR_REPORT_KEY` | Primary key – links this file to other MAUDE files. Can be duplicated.| 
| `DEVICE_SEQUENCE_NO`| Unique per unit in a report|
| `GENERIC_NAME`  | The generic common name of the medical device | 
| `DEVICE_REPORT_PRODUCT_CODE` | FDA product classification code (3 letters) | 
| `MANUFACTURER_D_NAME` | Company that manufactured the device | 


### 2.2 EDA - DEVICE2024.txt

Information related to the device involved

```bash
python medallion/analysis/eda_device.py
```

```
=== 1. What is a row? ===
rows: 2,629,410
unique MDR_REPORT_KEY: 2,627,121
duplicated (MDR_REPORT_KEY, DEVICE_SEQUENCE_NO): 33
duplicated (one row): 31
```

--> S1 Deduplicate 31 identical rows on PK
--> S2: PK is MDR_REPORT_KEY , DEVICE_SEQUENCE_NO
```
=== 2. Missing values (%) ===
MDR_REPORT_KEY                0.00
DEVICE_SEQUENCE_NO            0.00
GENERIC_NAME                  0.02
MANUFACTURER_D_NAME           0.16
DEVICE_REPORT_PRODUCT_CODE    0.00
dtype: float64
```
--> S3: Handle missing GENERIC_NAME (0.02 %) and MANUFACTURER_D_NAME (0.16 %) — flag, do not impute.


```
=== 3. Junk manufacturer names ===
junk list: 1,065 | shorter than 2 chars: 15
Most common values that look suspicious (short names):
MANUFACTURER_D_NAME
MPRI    34885
UNK       537
BD        113
0HP        21
SERF       18
.          12
000         5
DSS         3
BIOS        3
REMI        3
BARD        2
I           2
AIZU        2
QFIX        1
MERZ        1
Name: count, dtype: int64
```
--> S4: Explore MPRI 
--> S4: Flag rows with junk manufacturer names — manufacturer_is_junk = TRUE/FALSE. Keep rows in Silver, exclude from Gold rankings.
```
=== 4. Same company, many spellings ===
This is the variable MANUFACTURER_D_NAME

- OLYMPUS: 43 different spellings, 55,957 rows. Top 5:
       AIZU OLYMPUS CO., LTD.                       24834
       SHIRAKAWA OLYMPUS CO., LTD.                  20768
       OLYMPUS WINTER & IBE GMBH                     7019
       AOMORI OLYMPUS CO., LTD.                      2330
       OLYMPUS WINTER & IBE GMBH BERLIN FACILITY      575
- MEDTRONIC: 99 different spellings, 274,262 rows. Top 5:
- ALCON: 20 different spellings, 11,719 rows. Top 5:
- BOSTON SCIENTIFIC: 27 different spellings, 64,829 rows. Top 5:
- ABBOTT: 95 different spellings, 90,271 rows. Top 5:
```
--> S5: Normalize manufacturer names — add manufacturer_normalized column mapped to parent company via explicit mapping table.

```
=== 5. One product code, several names? ===
codes: 2,206 | codes with more than 1 name: 1,402
```
--> S6: Build canonical product name — product_code_dim with the most common GENERIC_NAME per DEVICE_REPORT_PRODUCT_CODE.


```
=== 6. Concentration ===
DEVICE_REPORT_PRODUCT_CODE
DZE    697107
QBJ    347156
QFG    273207
OZP    129596
BZD     68264
FRN     57739
FPA     47212
QLG     35122
LGW     35083
FTR     30774
Name: count, dtype: int64
top 10 codes = 65.5 % of rows
top 10 manufacturers = 55.0 % of rows
```
#### DATA LIMITATIONS
- Under-reporting of events
- Inaccuracies in reports
- Lack of verification that the device caused the reported event
- Lack of information about frequency of device use

### 2.3 - ANALYSIS METHOD
Aggregation + ranking, since kategorical and numerical data types






## STEPS IN CONDUCTING THE PIPELINE

```
medallion
├── data
│   └── DEVICE2024.txt
├── python
│   ├── bronze_ingest.py
│   ├── test_bronze_ingest.py
│   └── requirements.txt
│   
└── sql
    ├── 01_create_tables.sql
    ├── 02_bronze.sql
    ├── 03_silver.sql
    └── 04_gold.sql
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
       ▼ (Transformation & DQ via SQL/dbt)
┌───────────────────────────────────────────┐
│ SILVER LAYER (Cleaned & Normalized)       │
│ - Deduplication & Type Casting            │
│ - Junk filtering ──> [ Quarantine Table ] │
└───────────────────────────────────────────┘
       │
       ▼ (Aggregation & Feature Engineering)
┌─────────────────────────────────────────┐
│ GOLD LAYER (Business & ML Ready)        │
│ - High-performance materialized views    │
│ - Analytical Star Schema                │
└─────────────────────────────────────────┘
       │
       ├───────────────────┼───────────────────────────┐
       ▼                   ▼                           ▼
[ BI Dashboard ]     [ Feature Store ]   [ NOT YET - Ad-hoc Analysis ]
(Power BI Insights)        │
                           ▼
                 [ Future ML Pipelines ]
```






### STEP 1 - LIST REQUIREMENTS

### Bronze Layer
Principle: read everythong, do not modify data 

| # | Rule | Detail |
|---|------|--------|
| B1 | Read file with correct format | Pipe-delimited, latin-1, `QUOTE_NONE` |
| B2 | Keep all columns | Even empty ones (`DEVICE_EVENT_KEY`) — decisions belong in Silver |
| B3 | Keep all rows | No dedup, no filtering |
| B4 | Read everything as `str` | No type conversion — that belongs in Silver |
| B5 | Add metadata | `_source_file`, `_ingested_at` for traceability |

---


### Silver Layer
| # | Rule |
|---|------|
| S1 | Deduplicate 31 identical rows on PK |
| S2 | PK is `MDR_REPORT_KEY`, `DEVICE_SEQUENCE_NO` |
| S3 | Handle missing `GENERIC_NAME` & `MANUFACTURER_D_NAME` — flag, do not impute |
| S4 | Explore `MPRI` |
| S5 | Flag rows with junk manufacturer names — `manufacturer_is_junk = TRUE/FALSE`. Keep rows in Silver, exclude from Gold rankings |
| S6 | Normalize manufacturer names — add `manufacturer_normalized` column mapped to parent company via explicit mapping table |
| S7 | Build canonical product name — `product_code_dim` with the most common `GENERIC_NAME` per `DEVICE_REPORT_PRODUCT_CODE` |

---

### Gold Layer

| # | Rule | What |
|---|------|------|
| G1 | Aggregate per product code | `GROUP BY device_report_product_code` + `COUNT` |
| G2 | Aggregate per manufacturer | `GROUP BY manufacturer_normalized` + `COUNT` |
| G3 | Split by severity | D / IN / M per group |
| G4 | Rank results | `RANK() OVER (ORDER BY total_reports DESC)` |
| G5 | Filter high volume | `WHERE is_high_volume_code = TRUE` |
| G6 | Exclude junk | `WHERE manufacturer_is_junk = FALSE` |
| G7 | Use normalized names | `manufacturer_normalized` |
| G8 | Monthly trend | Join with `mdrfoi` |
| G9 | Label clearly | "Number of reports" — not "rate" |


---



### STEP 2 — CREATE TABLES 

Run `01_create_tables.sql` in the Supabase SQL editor.

### STEP 3 — RUN BRONZE 
```bash
pip install -r medallion/python/requirements.txt
python medallion/bronze_ingest.py
```
#### Verify upload in console
Expected:  `BRONZE DONE`, `bronze_reports` is populated in Supabase.


#### Verify data quality rules 
dbt - later


### STEP 4 — RUN SILVER

Run `03_silver.sql` in Supabase. Should have fewer rows than `bronze_reports`, and no duplicates on PK 

#### Verify data quality rules 
dbt - later

#### Validation rate



### STEP 5 — RUN GOLD

Run `04_gold.sql` in Supabase.

#### Verify data quality rules 
dbt - later



### FUTURE STEPS 
* dbt - verify that requirements are met 
* Silver: Enrich with mdrfoi.txt and  by JOIN for better insights. 
* star schemas 

Note: No GDPR, else use encode(digest(column_name, 'sha256'), 'hex') etc to remove sensitive info. 
