# PIPELINE.md — ETL Pipeline: Medallion Architecture
This document covers the pipeline behind the [Aegis Compliance](./README.md) dashboard. The purpose of this analysis is to answer

1 - Which are the most reported products to FDA 2024?

2 - Which are the most reported manufacturers to FDA 2024? 
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
[ Source: FDA MAUDE (DEVICE2024.txt) ] 
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
[ BI Dashboard ]     [ Feature Store ]   [ NOT YET-Ad-hoc Analysis ]
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

## Running the pipeline

### Step 0 — Download the data - inspect headers
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
