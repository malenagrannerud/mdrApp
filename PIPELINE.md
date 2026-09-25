# PIPELINE.md — ETL Pipeline: Medallion Architecture
This document covers the pipeline behind the [Aegis Compliance](./README.md) dashboard. 
This analyisis answers

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
## Purpose & Scope
Turn raw incident data into a source for competitive risk monitoring and PMS planning.

## Pipeline steps
```
[ Source: FDA MAUDE - DEVICE2024.txt ] (could be from an API, DB etc)
       │
       ▼  
┌─────────────────────────────────────────┐
│ bronze_ingest.py                        │
| - Reads a source file                   │
| - Writes raw data to bronze_reports     │
|   in Supabase                           │
└─────────────────────────────────────────┘
       │
       ▼  
┌─────────────────────────────────────────┐
│ 02_silver.sql                           │
│  - Reads from table bronze_reports      │
│  - Washes data and writes to            │
│     silver_reports                      │
└─────────────────────────────────────────┘
       │
       ▼  
┌─────────────────────────────────────────┐
│ 03_gold.sql                             │
│  - Reads from table silver_reports      │
│  - Aggregates data into product_stats & │
│    manufacturer_stats                   │
└─────────────────────────────────────────┘
       │
       ├───────────────────┬───────────────────┐
       ▼                   ▼                   ▼
[ Dashboard (Power BI) ][ AI / ML Models ][ Ad-hoc Analysis ]
```

## REQUIREMENTS

### Bronze Layer
Purpose: Ingest and store raw data from source systems.

Data Quality: 1 - Critical columns must exist (schema validity), 2 - The file cant be empty, 3 - Data must have meta data (source file and time stamp), 4 - Data must be saved as "append only": no update/delete, new data is inserted only

Rules for bronze data before building the silver layer: 1 - Duplicated batches not allowed

---
### Silver Layer
Purpose: Conform the raw data into a single source of truth ready for analytics.

Data Quality: Data must be 1 - Type converted, 2 - Deduplicated, 3 - Filtered, 4 - Enriched with other tables by JOIN, 5 - If GDPR: use HASHBYTES

Rules before building the Gold layer: 1 - Duplicated PK's not allowed, 2 - Null values on PK's not allowed

---
### Gold Layer
Purpose: Deliver business-focused, aggregated, and highly performant data models (e.g., star schemas with facts and dimensions) directly to BI tools.

Data Quality: Guarantees that data is strictly analytics-ready

Performance: Optimized for end-user querying through pre-calculated metrics and aggregations.

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
| `MDR_REPORT_KEY` | Foreign key – links this file to other MAUDE files. Can be duplicated. Good to have for joining files later | 
| `DEVICE_REPORT_PRODUCT_CODE` | FDA product classification code (3 letters) | 
| `BRAND_NAME` | Manufacturer's marketing name  | 
| `GENERIC_NAME` | Medical/technical product name | 
| `MANUFACTURER_D_NAME` | Company that manufactured the device | 

Other headers: 
`IMPLANT_FLAG`, `DATE_REMOVED_FLAG`, `DEVICE_SEQUENCE_NO`, `IMPLANT_DATE_YEAR`, `DATE_REMOVED_YEAR`, `SERVICED_BY_3RD_PARTY_FLAG`, `DATE_RECEIVED`, `MANUFACTURER ADDRESS ......`, `DEVICE_OPERATOR`, `EXPIRATION_DATE_OF_DEVICE`, `MODEL_NUMBER`, `CATALOG_NUMBER`, `LOT_NUMBER`, `OTHER_ID_NUMBER`, `DEVICE_AVAILABILITY`, `DATE_RETURNED_TO_MANUFACTURER`, `DEVICE_AGE_TEXT`, `DEVICE_EVALUATED_BY_MANUFACTURER`, `COMBINATION_PRODUCT_FLAG`, `UDI-DI`, `UDI-PUBLIC`


### Step 1 — Create tables
Run `01_create_tables.sql` in the Supabase SQL editor.

### Step 2 — Run Bronze 
```bash
pip install -r medallion/requirements.txt
python medallion/01_bronze_ingest.py
```
#### Verify upload in console
Should print:  `BRONZE KLAR`, `bronze_reports` is populated in Supabase.

#### Inspect the data, verify no duplicates on primary key


### Step 3 — Run Silver
Run `02_silver.sql` in Supabase. Should have fewer rows than `bronze_reports`, and no duplicates on PK 

### Verify number of rows dropped
```sql
SELECT
    (SELECT COUNT(*) FROM bronze_reports) AS bronze_rows,
    (SELECT COUNT(*) FROM silver_reports) AS silver_rows,
    (SELECT COUNT(*) FROM bronze_reports) - (SELECT COUNT(*) FROM silver_reports) AS rows_dropped;
```
RESULTS 
| bronze_rows | silver_rows | rows_dropped |
| ----------- | ----------- | ------------ |
| 20000       | 19950       | 50           |


### Verify duplicated report_key 
```sql
-- Duplicates: report_keys that appear more than once in bronze
SELECT report_key, COUNT(*) AS occurrences
FROM bronze_reports
GROUP BY report_key
HAVING COUNT(*) > 1
ORDER BY report_key;
```
RESULTS  39 report_keys has duplicates

| report_key  | occurrences| |
| ----------- | ------------ | 
| 18423161    | 2            | 
| 18423519    | 2            | 
| 18423562    | 2            | 
| 18424434    | 2            | 
| ...         | ...          | 

### Verify invalid manudacturer rows



### Validation rate
| Layer   | Rows   | Notes                                                  |
| ------- | ------ | ------------------------------------------------------ |
| Bronze  | 20 000 | Raw rows as ingested from DEVICE2024.txt               |
| Silver  | 19 950 | After deduplication and invalid manufacturer filtering |
| Dropped | 50     | 39 duplicate PK + 11 invalid manufacturers             |
Validation rate: 19 950 / 20 000 = 99.75%


### Step 4 — Run Gold
Run `03_gold.sql` in Supabase.



### Step 5 — View the dashboard
`Dashboard.jsx` reads the top rows from `product_stats` and `manufacturer_stats` and renders them as charts.


