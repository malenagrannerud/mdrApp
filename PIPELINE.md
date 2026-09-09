# PIPELINE.md — ETL Pipeline: Medallion Architecture
This document covers the pipeline behind the [Aegis Compliance](./README.md) dashboard. 

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
    ├── 02_silver.sql
    ├── 03_gold.sql
    └── dbt_schema.yml
        
```
## Purpose & Scope
Turn raw incident data into a source for competitive risk monitoring and PMS planning.

## Pipeline steps
```
[ Source: FDA MAUDE - DEVICE2024.txt ] (could be from an API, DB etc)
       │
       ▼  
┌─────────────────────────────────────────┐
│ 01_bronze_ingest.py                     │
| - Reads a source file (`DEVICE2024.txt`)│
| - Writes to table bronze_reports        │
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
Purpose: Ingest and store untouched raw data (Append-only) from source systems as fast and cost-effectively as possible.

Data Quality: Validates data shape and structural schemas (data types and column names) in Python to prevent ingestion crashes.

Lineage: Enriches every row with metadata like file name (source_file) and timestamp (inserted_at) to enable incremental loading and auditing.
---
### Silver Layer
Purpose: Clean, standardize, and conform the raw data into a single source of truth ready for analytics.

Data Quality: Utilizes dbt tests as a quality gate to strictly enforce unique and not_null constraints on business keys before building the layer.

Business Logic: Deduplicates records, filters out invalid rows, handles missing columns (index -1), and standardizes formatting (dates, strings, currencies).
---
### Gold Layer
Purpose: Deliver business-focused, aggregated, and highly performant data models (e.g., star schemas with facts and dimensions) directly to BI tools.

Data Quality: Guarantees that data is strictly analytics-ready and aligns with corporate KPIs and accounting rules.

Performance: Optimized for end-user querying through pre-calculated metrics and aggregations, completely removing complex SQL logic from dashboards.
---

## Running the pipeline

### Step 0 — Download the data
1. FDA MAUDE: https://www.fda.gov/medical-devices/medical-device-reporting-mdr-how-report-medical-device-problems/mdr-data-files#download

2. Download a raw data file:
```bash
mkdir -p medallion/data
cd medallion/data
curl -O https://www.accessdata.fda.gov/MAUDE/ftparea/device2024.zip
unzip device2024.zip
cd ../..
```

3. Inspect the headers:
```bash
head -n 1 medallion/data/DEVICE2024.txt | tr '|' '\n'
```
Key columns used by this pipeline: `MDR_REPORT_KEY`, `DEVICE_REPORT_PRODUCT_CODE`, `BRAND_NAME`, `GENERIC_NAME`, `MANUFACTURER_D_NAME`

Other headers: 
`MDR_REPORT_KEY`, `DEVICE_EVENT_KEY`, `IMPLANT_FLAG`, `DATE_REMOVED_FLAG`, `DEVICE_SEQUENCE_NO`, `IMPLANT_DATE_YEAR`, `DATE_REMOVED_YEAR`, `SERVICED_BY_3RD_PARTY_FLAG`, `DATE_RECEIVED`, `BRAND_NAME`, `GENERIC_NAME`, `MANUFACTURER_D_NAME`, `MANUFACTURER ADDRESS ......`, `DEVICE_OPERATOR`, `EXPIRATION_DATE_OF_DEVICE`, `MODEL_NUMBER`, `CATALOG_NUMBER`, `LOT_NUMBER`, `OTHER_ID_NUMBER`, `DEVICE_AVAILABILITY`, `DATE_RETURNED_TO_MANUFACTURER`, `DEVICE_REPORT_PRODUCT_CODE`, `DEVICE_AGE_TEXT`, `DEVICE_EVALUATED_BY_MANUFACTUR`, `COMBINATION_PRODUCT_FLAG`, `UDI-DI`, `UDI-PUBLIC`

4. Inspect the 10 first rows:
```bash
cd /workspaces/mdrApp && python3 -c '
import csv
with open("medallion/data/DEVICE2024.txt", mode="r", encoding="utf-8", errors="ignore") as f:
    reader = csv.DictReader(f, delimiter="|")
    keys = ["MDR_REPORT_KEY", "DEVICE_REPORT_PRODUCT_CODE", "BRAND_NAME", "GENERIC_NAME", "MANUFACTURER_D_NAME"]
    print("|".join(keys))
    for i, row in enumerate(reader):
        if i >= 10: break
        print("|".join([str(row.get(k, "")) for k in keys]))
'
```
MDR_REPORT_KEY|DEVICE_REPORT_PRODUCT_CODE|BRAND_NAME|GENERIC_NAME|MANUFACTURER_D_NAME
18423065|FDF|EVIS EXERA II COLONOVIDEOSCOPE|COLONOVIDEOSCOPE|AIZU OLYMPUS CO., LTD.
18423066|EOQ|EVIS EXERA III BRONCHOVIDEOSCOPE|BRONCHOVIDEOSCOPE|AIZU OLYMPUS CO., LTD.
18423067|EOQ|EVIS LUCERA ELITE BRONCHOVIDEOSCOPE|BRONCHOVIDEOSCOPE|AIZU OLYMPUS CO., LTD.
18423068|NAY|ENDOWRIST|FENESTRATED BIPOLAR FORCEPS|INTUITIVE SURGICAL, INC
18423069|EOQ|ION|VISION PROBE|INTUITIVE SURGICAL, INC
18423070|NAY|ENDOWRIST|TENACULUM FORCEPS|INTUITIVE SURGICAL, INC
18423071|LRO|CONSTELLATION SURGICAL PROCEDURE PACK|GENERAL SURGERY TRAY (KIT)|ALCON RESEARCH, LLC - HOUSTON
18423072|DZE|DYMIC|DYNAMIC IMPLANT SP 3.75X10|PALTOP ADVANCED DENTAL SOLUTIONS INC.
18423073|FHW|AMS INFLATABLE PENILE PROSTHESIS|DEVICE IMPOTENCE MECHANICAL/HYDRAULIC|BOSTON SCIENTIFIC CORPORATION
18423074|FHW|AMS INFLATABLE PENILE PROSTHESIS|DEVICE IMPOTENCE MECHANICAL/HYDRAULIC|BOSTON SCIENTIFIC CORPORATION

### Step 1 — Create tables (Supabase)
Run `00_create_tables.sql` in the Supabase SQL editor.
Creates `bronze_reports`, `silver_reports`, `product_stats`, `manufacturer_stats`.

### Step 2 — Run Bronze
```bash
pip install -r medallion/requirements.txt
python medallion/01_bronze_ingest.py
```
Verify: console prints `BRONZE KLAR`, `bronze_reports` is populated in Supabase.

### Step 3 — Run Silver
Run `02_silver.sql` in Supabase.
Verify `silver_reports` has fewer rows than `bronze_reports`, and no duplicates remain:
```sql
SELECT report_key, COUNT(*)
FROM silver_reports
GROUP BY report_key
HAVING COUNT(*) > 1;
```
Should return 0 rows.

### Step 4 — Run Gold
Run `03_gold.sql` in Supabase.
Verify:
```sql
SELECT * FROM product_stats ORDER BY total_reports DESC LIMIT 10;
```

### Step 5 — Validate
Run `validate.sql` for a full integrity check across all layers. Expected results for the current dataset:

- 20,000 rows ingested into Bronze (current `MAX_ROWS_LIMIT`)
- 19,950 passed Silver's cleaning (deduplication + invalid manufacturer/product code filtering)
- **Validation rate: 19,950 / 20,000 = 99.75%**
- 555 unique product codes and 493 unique normalized manufacturers in Gold

### Step 6 — View the dashboard
`Dashboard.jsx` reads the top 10 rows from `product_stats` and `manufacturer_stats` and renders them as charts.
