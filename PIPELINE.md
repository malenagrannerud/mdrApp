# PIPELINE.md — ETL Pipeline: Medallion Architecture
This document covers the technical data pipeline behind the [Aegis Compliance](./README.md) dashboard: raw FDA MAUDE data transformed into aggregated, dashboard-ready data via a medallion architecture (bronze → silver → gold), built with Python and PostgreSQL (Supabase).


## Why this matters
The tables this pipeline produces reflect post-market data manufacturers may use for ongoing safety monitoring:

- **Signal detection** — surfacing which products and manufacturers generate the most reports is the first step in spotting an emerging safety trend before it becomes a bigger problem
- **Self-monitoring** — a manufacturer can filter down to their own products to track incident trends over time, feeding into downstream processes like CAPA or risk file updates
- **Benchmarking** — comparing incident volume across product categories and manufacturers helps identify outliers worth investigating


## Pipeline steps
1. `01_bronze_ingest.py` — reads raw data from `DEVICE2024.txt`, writes to `bronze_reports`
2. `02_silver.sql` — cleans, validates, normalizes, and deduplicates, writes to `silver_reports`
3. `03_gold.sql` — aggregates into `product_stats` and `manufacturer_stats`, read by `Dashboard.jsx`


### Bronze layer rules
- Append-only (immutability) — no row is ever updated or deleted
- Junk rows (missing product code, `"UNKNOWN"` manufacturer, duplicates) are still stored — Bronze doesn't filter, it's a raw copy of the source
- Every row is enriched with `_inserted_at` and `_source_file` for full traceability


### Silver layer rules
- Rows missing a product code, or with a junk manufacturer value, are dropped
- One row per unique `report_key` (deduplication — first occurrence wins)
- Manufacturer names normalized (punctuation/whitespace cleaned, legal suffixes stripped) and known variants merged via a manual mapping
- Written via `upsert` — safe to re-run (idempotent)


### Gold layer rules
- One row per product code in `product_stats`, with total report count and the most common brand name / generic name / manufacturer
- One row per manufacturer in `manufacturer_stats`, with total report count across all products


### MAP
[ Source: FDA MAUDE - DEVICE2024.txt ] (could be an API, DB, or file)
       │
       ▼  (1_bronze_ingest.py)
┌─────────────────────────────────────────┐
│ bronze_reports (Supabase)               │
│  - Raw Data                             │
│  - History preserved (Append-only)      │
│  - No filtering or cleaning             │
└─────────────────────────────────────────┘
       │
       ▼  (02_silver.sql)
┌─────────────────────────────────────────┐
│ silver_reports (Supabase)               │
│  - Cleaned, validated, deduplicated     │
│  - Manufacturer names normalized        │
└─────────────────────────────────────────┘
       │
       ▼  (03_gold.sql)
┌─────────────────────────────────────────┐
│ product_stats, manufacturer_stats       │
│  - AAggregated and fast                 │
│  - Ready for reporting                  │
└─────────────────────────────────────────┘
       │
       ├───────────────────┬───────────────────┐
       ▼                   ▼                   ▼
[ Dashboard (Power BI) ][ AI / ML Models ][ Ad-hoc Analysis ]


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

Other columns
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