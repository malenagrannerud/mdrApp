# PIPELINE.md — ETL Pipeline: Medallion Architecture

```
  SOURCES
  APIs · IoT sensors · Transactional databases · Files
        │
        ▼
┌─────────────────────────────────────────────────────────┐
  BRONZE LAYER · Raw data, ground truth
  ─────────────────────────────────────────────────────────
  • No data changed (immutable archive)
  • Original format kept (JSON, CSV, Parquet)
  • Timestamped (permanent historical record)
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
        Scalable storage (here: Supabase / Postgres)
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
  SILVER LAYER · Cleansed source of truth
  ─────────────────────────────────────────────────────────
  • Data cleaning: remove junk, handle duplicates,
    handle missing values
  • Standardize formats (for example UTC dates)
  • Join data sets (consolidated customer/product view)
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
  GOLD LAYER · Refined, business-ready data
  ─────────────────────────────────────────────────────────
  • Tailored for specific use cases
  • Optimized structures
  • Fast performing
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
        Dashboard + Data quality panel
```
 
### STEP 1 - REQUIREMENTS ON EACH LAYER  
Gatekeeper tests (GK) come last in each layer. The next layer is built only if all gatekeeper tests of the previous layer pass.

#### Bronze
| ID | Requirement | Test Location |
|---|---|---|
| B1 | No data changed. The archive is immutable | `test_bronze_ingest.py` |
| B2 | Data is saved in original format | `test_bronze_ingest.py` |
| B3 | Each row has a timestamp | `test_bronze_ingest.py` |


#### Silver
| ID | Requirement | Test Location |
|---|---|---|
| S1 | Data cleaning (remove junk, handle duplicates, handle missing values)| `04_silver.sql` |
| S2 | Standardize formats (For example UTC dates, company names) | `04_silver.sql`|
| S3 | Join data sets (consolidated customer/product view) | `04_silver.sql`  |


#### Gold
| ID | Requirement | Test Location |
|---|---|---|
| G1 | See use cases   | `05_gold.sql` |
| G2 | Optimized structures (star schemas, aggregation) | `05_gold.sql` |
| G3 | Read optimized tables for dashboards | `05_gold.sql` |


#### Observability
| ID | Requirement | Test Location |
|---|---|---|
|O1| Ingest progress, skipped lines, rows per second, duration | `bronze_ingest.py` log |
|O2| One row per pipeline run (counts, status, error) | `pipeline.sql` |
|O3| Result of every verification check after a run | `db_run.sh` |
|O4| Rows per layer, % valid rows (threshold 95 %), checks passed | Dashboard: `DataQualityPanel.jsx` |
 

### STEP 2 — RUN THE PIPELINE
Run all commands from the repo root.
 
**Prerequisites**
- Python 3.12 and `psql` (PostgreSQL client)
- A Postgres database: a Supabase project, or a local Postgres for development
- `DEVICE2024.txt` from [FDA's MAUDE database](https://www.fda.gov/medical-devices/medical-device-reporting-mdr-how-report-medical-device-problems/mdr-data-files#download), unzipped into `medallion/data/`
- `medallion/.env` with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (used by the ingest)
```bash


# 0. Install dependencies and run the bronze unit tests 
pip install -r medallion/python/requirements.txt
(cd medallion/python && pytest -v)
 
# 1. Create roles, tables and manufacturer rules. Safe to rerun.
medallion/scripts/db_setup.sh "$DATABASE_URL"
 
# 2. Load the raw file into bronze. A rerun adds nothing.
python medallion/python/bronze_ingest.py
 
# 3. Bronze check -> silver -> gold -> verify_pipeline().
#    Saves all results in quality_checks; exits 1 if any check failed.
medallion/scripts/db_run.sh "$DATABASE_URL"
```
 
`$DATABASE_URL` is the Postgres connection string, e.g. `postgresql://user:password@host:5432/postgres`.
Expected last line of step 3: `ALL CHECKS PASSED`.
 

FILE STRUCTURE

```
├── PIPELINE.md
├── .github/workflows/ci.yml          # Runs bronze tests & the frontend build on every push
├── medallion
│   ├── analysis
│   │   ├── eda_device.py
│   │   └── eda_device_output.txt
│   ├── data                          
│   ├── python
│   │   ├── bronze_ingest.py
│   │   ├── requirements.txt
│   │   └── test_bronze_ingest.py
│   ├── scripts
│   │   ├── db_run.sh                 # Step 1
│   │   └── db_setup.sh               # Step 3
│   ├── sql
│   │   ├── 01_silver.sql
│   │   ├── 02_gold.sql
│   │   ├── 03_pipeline.sql
│   │   └── 04_verify_silver_gold.sql
│   └── supabase.js
├── src
│   ├── components
│   │   ├── Dashboard.jsx
│   │   ├── DataQualityPanel.jsx
    └── ...                           
```



Note: MAUDE data is public and contains no personal data. For other sources, hash sensitive columns, e.g. encode(digest(col, 'sha256'), 'hex').
