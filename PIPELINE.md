# PIPELINE.md — ETL Pipeline: Medallion Architecture
This document covers the pipeline behind the [Aegis Compliance](./README.md) dashboard. 

```
medallion
├── data
│   └── DEVICE2024.txt
├── python
│   ├── bronze_ingest.py
│   ├── config.py
│   ├── models.py
│   ├── requirements.txt
│   ├── supabase_client.py
│   └── tests
│       └── unit_tests.py
└── sql
    ├── 01_create_tables.sql
    ├── 02_silver.sql
    ├── 03_gold.sql
    └── tests
        
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

| ID | Requirement | Verification |
|---|---|---|
| BR-01 | Append-only / immutable data: Since raw data is the source of truth | Attempt `UPDATE`/`DELETE` on `bronze_reports` → must raise an error |
| BR-02 | No transformation or filtering: Set must mirror the source including junk data | Row count in `bronze_reports` = in source file |
| BR-03 | Minimal schema changes on load: No type casting | Column types in `bronze_reports` match source format (`text` here)|
| BR-04 | Every row must be traceable (source file, batch ID, timestamp) | `SELECT * WHERE _inserted_at IS NULL OR _source_file IS NULL` → 0 rows |
| BR-05 | Idempotent ingestion (desirable): Re-running the same ingestion shouldn't corrupt the logical history — either by allowing controlled duplicates or deduplicating by batch ID | Re-run ingestion on the same file → row count increases predictably (controlled duplicates), no data overwritten |
| BR-06 | Scalable, low-cost storage: Bronze grows indefinitely, should be optimized for writes and storage not fast queries | Batched writes (1,000 rows/batch) with retry — confirmed in `01_bronze_ingest.py` logs |
| BR-07 | No business logic in Bronze: Bronze doesn't know what's "valid" | Code review of `01_bronze_ingest.py` — no filtering/validation beyond row *shape* (Pydantic), no content rules |
| BR-08 | Malformed rows don't crash ingestion: A single corrupt line (e.g. missing fields) must not stop the entire run | Feed a file with a deliberately malformed line → ingestion completes, bad row logged and skipped |
| BR-09 | Ingestion respects the row limit safeguard: Prevents exceeding free-tier storage | Run against a file exceeding `MAX_ROWS_LIMIT` → ingestion stops exactly at the limit, no crash |

---

### Silver Layer

| ID | Requirement | Why | Verification |
|---|---|---|---|
| SR-01 | Rows must have a product code | A report with no product reference is unusable for risk analysis | `product_code not null` constraint on `silver_reports` |
| SR-02 | Junk manufacturer values excluded | Placeholder values (`"UNKNOWN"`, `"N/A"`, etc.) would distort manufacturer-level aggregates | Filtered against explicit denylist in `02_silver.sql` |
| SR-03 | Exactly one row per unique `report_key` | Duplicate reports would inflate incident counts | `report_key` primary key constraint; zero-duplicates check in `validate.sql` |
| SR-04 | Manufacturer names normalized and merged | Same manufacturer appearing under multiple name variants would fragment aggregates | Regex cleanup + explicit mapping table in `02_silver.sql` |
| SR-05 | Fully rebuildable from Bronze, identical output every run | A bug in cleaning logic must never mean lost or corrupted history, only a re-run | `TRUNCATE` + `INSERT` on every run — no incremental state |
| SR-06 | Manufacturer merges don't over-consolidate distinct manufacturers | Two genuinely different manufacturers must never be merged into one by accident | Manual review: each entry in the merge mapping table checked against source names — no fuzzy/automatic matching used |

---

### Gold Layer

| ID | Requirement | Why | Verification |
|---|---|---|---|
| GR-01 | Exactly one row per product code in `product_stats` | Dashboard needs exactly one data point per product | Primary key constraint on `product_code`; validated in `validate.sql` |
| GR-02 | Each row includes total report count and dominant brand/generic/manufacturer | Supports the dashboard's top-10 chart and tooltip | Aggregation logic in `03_gold.sql` |
| GR-03 | Exactly one row per manufacturer in `manufacturer_stats`, with total report count | Dashboard needs exactly one data point per manufacturer | Primary key constraint on `name`; validated in `validate.sql` |
| GR-04 | Gold's per-product counts match Silver's counts exactly | Silent aggregation error would misrepresent actual risk level | Cross-check query against Silver in `validate.sql` |
| GR-05 | `total_reports` is always positive | A zero or negative count signals a broken aggregation, not a real product | `SELECT * FROM product_stats WHERE total_reports <= 0` → 0 rows |
| GR-06 | Gold reflects the latest Silver run | Dashboard must never silently show stale data from a previous run | Compare `product_stats` row values against a fresh `SELECT` from `silver_reports` after a rebuild — must match |

---

### Cross-Layer & Operational Requirements

| ID | Requirement | Why | Verification |
|---|---|---|---|
| XL-01 | Full pipeline is idempotent end-to-end | Running bronze → silver → gold twice must produce identical Gold output both times | Run the full pipeline twice on the same source file → diff `product_stats`/`manufacturer_stats` between runs → no difference |
| XL-02 | Secrets are never committed to version control | Supabase service-role key exposure would compromise the entire database | `.env` is in `.gitignore`; `git log -p` shows no credentials in history |
| XL-03 | Pipeline failure at any stage is visible, not silent | A silently failed run could leave the dashboard showing incomplete or stale data without warning | Console logging at each stage (`BRONZE KLAR`, row counts); non-zero exit / raised exception on unrecoverable failure |

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
