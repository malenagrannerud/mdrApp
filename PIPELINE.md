# PIPELINE.md — ETL Pipeline: Medallion Architecture
This document covers the pipeline behind the [Aegis Compliance](./README.md) dashboard. The purpose is to answer
- What type of medical device has a high rate of incident reports? What devices are connected to death or serious events?
  
- What manufacturer are behind the most frequently reported products?
  
Aim: Help PMS teams to detect what to focus on, for a product. 

## Steps in conducting the analysis and building the pipeline

### Step 1 — Find and explore data 
Data: FDAs MAUDE database: mandatory reportings by sources User Facility (U), Distributor (D), Manufacturer (M), and voluntary submitter (P). 

| File | Description | 
| :--- | :--- |
| **mdrfoi.zip** | One record per reporting. *Ex.: If  U, D M and P report the same event --> four event records.* |   
| **Device Data** | Details related to the medical device(s) involved. |
| **Patient Data** | Details related to the  patient(s) involved in the event. | 
| **Text Data** | Free text extracted  |
| **Device Problem Data** | Device Problem Code data from MEDWATCH Form Sections F10 and H6. |
| **Patient Problem Data** | Contains Health Effect – Clinical Code data from MEDWATCH |

- Records are linked by MDR REPORT KEY, found in each file.

#### Record/Data Characteristics
- The data has one record per line, with the data fields pipe-delimited, "|". 
- Data elements are alpha-numeric.
- All text fields contain whatever data was entered. If no, the field will be left empty. If an asterisk ("*") is present, it represents what was entered on the 3500/3500A.


#### Master Event Record Data Elements
NEW RECORD|DEVICE EVENT KEY|REPORT SOURCE CODE|MDR REPORT KEY|Section B

- All other data elements will be blank.

#### MDRFOI  (82 fields)
Example

MDR Report Key|Empty field|Report Number|Report Source Code||Manufacturer Link Flag|Number Devices in Event |Number Patient in Event |Date Received |Adverse Event Flag (B1)|Product Problem Flag (B1)|Date Report (B4) | Date of Event (B3)|Single Use Flag|Reporter Occupation Code (E3)|000 OTHER ... 501 ADMINISTRATOR/SUPERVISOR| 

#### DEVICE file (48 fields)
MDR Report Key|Device Event key |...|Generic Name (D2) | Manufacturer Name (D3)| 

#### Patient (10 files)


#### PATIENT file, 10 fields

#### TEXT file, 6 fields
MDR Report Key | MDR Text Key | Text Type Code (D=B5, E=H3, N=H10 from mdr_text table)|Patient Sequence Number (from mdr_text table)|Date Report (from mdr_text table)|Text (B5, or H3 or H10 from mdr_text table)


1. FDA MAUDE: https://www.fda.gov/medical-devices/medical-device-reporting-mdr-how-report-medical-device-problems/mdr-data-files#download

2. Download a raw data file:
```bash
mkdir -p medallion/data
cd medallion/data
curl -O https://www.accessdata.fda.gov/MAUDE/ftparea/device2024.zip
unzip device2024.zip
cd ../..
```

3. Inspect headers:
```bash
head -n 1 medallion/data/DEVICE2024.txt | tr '|' '\n'
```

| Column | Role | 
|---|---|
| `DEVICE_EVENT_KEY` | Primary key – unique for each device event | 
| `MDR_REPORT_KEY` | Foreign key – links this file to other MAUDE files. Can be duplicated.| 
| `GENERIC_NAME`  | The generic common name of the medical device | 
| `DEVICE_REPORT_PRODUCT_CODE` | FDA product classification code (3 letters) | 
| `MANUFACTURER_D_NAME` | Company that manufactured the device | 

Other headers: 
`BRAND_NAME`, `IMPLANT_FLAG`, `DATE_REMOVED_FLAG`, `DEVICE_SEQUENCE_NO`, `IMPLANT_DATE_YEAR`, `DATE_REMOVED_YEAR`, `SERVICED_BY_3RD_PARTY_FLAG`, `DATE_RECEIVED`, `MANUFACTURER ADDRESS ......`, `DEVICE_OPERATOR`, `EXPIRATION_DATE_OF_DEVICE`, `MODEL_NUMBER`, `CATALOG_NUMBER`, `LOT_NUMBER`, `OTHER_ID_NUMBER`, `DEVICE_AVAILABILITY`, `DATE_RETURNED_TO_MANUFACTURER`, `DEVICE_AGE_TEXT`, `DEVICE_EVALUATED_BY_MANUFACTURER`, `COMBINATION_PRODUCT_FLAG`, `UDI-DI`, `UDI-PUBLIC`


DATA LIMITATIONS

- Underrapportering
- Felaktigheter i rapporter
- Brist på verifiering att produkten orsakade händelsen
- Brist på information om användningsfrekvens




## Step 2 — EDA




















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

## Pipeline Architecture & Data Flow
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






## REQUIREMENTS

### Bronze Layer
Purpose: Ingest and store raw data from source systems.

Data Quality RULES: 
- BR1 – Schema: Critical columns must exist 
- BR2 – Volume: The source file must contain at least one data row
- BR3 – Metadata: Every row must have source_file and inserted_at
- BR4 – Immutability: Append-only. No UPDATE or DELETE. Enforced by DB trigger.
- BR5 - Unique/not_null PK - `id`

---
### Silver Layer
Purpose: Conform the raw data into a single source of truth ready for analytics.

Data Quality rules:
- SR1 – Type conversion: All columns have explicit, correct data types
- SR2 – Deduplication: One row per device_event_key. Earliest row is kept
- SR3 – Completeness: Rows with NULL in key columns (manufacturer_raw) are rejected.
- SR4 – Validity: Rows with junk manufacturer values (blocklist + length < 2) are rejected.
- SR5 – Normalization: Manufacturer names are trimmed, dots stripped, legal suffixes removed, case normalized.
- SR6 – Normalization: `GENERIC_NAME` is stripped of extra spaces, converted to UPPERCASE, and empty strings default to `'UNKNOWN PRODUCT'` to ensure robust aggregation for Question 1.
- SR7 - Unique/not_null on PK - `device_event_key`

---
### Gold Layer
Purpose: Deliver business-focused, aggregated, and highly performant data models (e.g., star schemas with facts and dimensions) directly to BI tools.

Data Quality Rules: 
- GR1 – Reproducibility: All metrics can be recomputed from Silver
- GR2 – Sanity: total_reports > 0 in both tables
- GR3 – Consistency: Sum of total_reports in product_stats equals row count in silver_reports
- GR4 – unique/not_null on PK's `product_stats.product_code` and `manufacturer_stats.name`

Performance:
- Pre-calculated metrics and aggregations --> makes code faster
- Materialized as tables (TRUNCATE + INSERT -->  idempotency)

---












### Step 1 — Create tables
Run `01_create_tables.sql` in the Supabase SQL editor.

### Step 2 — Run Bronze 
```bash
pip install -r medallion/python/requirements.txt
python medallion/bronze_ingest.py
```
#### Verify upload in console
Expected:  `BRONZE DONE`, `bronze_reports` is populated in Supabase.

#### Verify data quality rules 

### Step 3 — Run Silver
Run `03_silver.sql` in Supabase. Should have fewer rows than `bronze_reports`, and no duplicates on PK 

#### Verify data quality rules 

#### Verify validation rate

### Step 4 — Run Gold
Run `04_gold.sql` in Supabase.

#### Verify data quality rules 

### Step 5 — View the dashboard
`Dashboard.jsx` reads the top rows from `product_stats` and `manufacturer_stats` and renders them as charts.

## Future steps
* dbt
* Silver: Enrich with other tables by JOIN for better insights. 
* star schemas 

Note: No GDPR, else use encode(digest(column_name, 'sha256'), 'hex') etc to remove sensitive info. 
