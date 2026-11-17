# PIPELINE.md — ETL Pipeline: Medallion Architecture


### Pipeline Architecture & Data Flow
```
 DEVICE2024.txt
      │  bronze_ingest.py
      ▼
┌─ SUPABASE (Postgres) ─────────────────────────┐
│  ┌──────────┐                                 │
│  │  BRONZE  │                                 │
│  └────┬─────┘                                 │
│       ▼ Gate keeper before SILVER             │
│  ┌──────────┐                                 │
│  │  SILVER  │──► quarantine (silver_rejected) │
│  └────┬─────┘                                 │
│       ▼ Gate keeper before GOLD               │
│  ┌──────────┐                                 │
│  │   GOLD   │                                 │
│  └────┬─────┘                                 │
│       ▼  Gate keeper before dashboard         │
└───────┬───────────────────────────────────────┘
        ▼
  Dashboard + Data quality panel  
```
 
### STEP 1 - REQUIREMENTS ON EACH LAYER  

- Every requirement traces back to Q1, Q2 or an EDA finding, and forward to one test.
- Gatekeeper tests (GK) come last in each layer.
- The next layer is built only if all gatekeeper tests of the previous layer pass.
- All other failed tests are reported, not blocking

#### Database configuration checks
Run once before the pipeline

| ID | Requirement | Why | Test Location |
|---|---|---|---|
| DB1 | The public `anon` role cannot read raw data | Least privilege: only gold is public | `01_create_tables.sql`|
| DB2 | Bronze is append-only | Raw data can never be changed after load | `01_create_tables.sql` |

#### Bronze
| ID | Requirement | Why | Test Location |
|---|---|---|---|
| B1 | Read pipe-delimited `latin-1`, quotes as plain text | Wrong encoding corrupts manufacturer names | `test_bronze_ingest.py` |
| B2 | A changed source header fails loudly | FDA can change the file format; a wrong mapping must not load silently | `test_bronze_ingest.py` |
| B3 | Malformed lines are counted and logged, never hidden | No silent data loss | `test_bronze_ingest.py` |
| B4 | Values are stored raw: text only, leading zeros and junk markers (`N/A`) kept; only an empty field becomes `NULL` | Bronze is the untouched source of truth | `test_bronze_ingest.py` |
| B5 | Every row is traceable to file and line | Any number on the dashboard can be traced back to the source | `test_bronze_ingest.py` |
| B6 | A rerun adds nothing | Idempotent ingest: safe to run again | `test_bronze_ingest.py` |
| **GKB1** | Every source column is mapped | Catches a wrong file or mapping on real data | `03_bronze.sql` |

#### Silver

| ID | Requirement | Why | Test Location |
|---|---|---|---|
| S1 | Invalid rows are quarantined with a reason, never dropped | EDA: 33 duplicate keys | `04_silver.sql` |
| S2 | Missing name or manufacturer: `NULL` + flag, never imputed | EDA: 0.16 % missing manufacturer | `04_silver.sql`|
| S3 | Junk manufacturer names are flagged and kept | EDA: 1,065 junk names (`UNK`, `NI`, …) | `04_silver.sql`  |
| S4 | Manufacturer names map to the correct parent company | EDA: up to 99 spellings per manufacturer; protects Q2 | `04_silver.sql` |
| S5 | Each product code has one canonical name | EDA: 1,402 codes with more than one name; protects Q1 | `04_silver.sql` |
| **GKS1** | Reconciliation: bronze = silver + quarantine | Proves no row was lost between layers | `04_silver.sql`|

#### Gold

| ID | Requirement | Why | Test Location |
|---|---|---|---|
| **GKG1** | Reconciliation: products | Protects the answer to Q1 | `05_gold.sql` |
| **GKG2** | Reconciliation: manufacturers, junk and `NULL` excluded | Protects the answer to Q2 | `05_gold.sql` |

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
│   │   ├── 01_create_tables.sql
│   │   ├── 02_seed_manufacturers.sql
│   │   ├── 03_bronze.sql
│   │   ├── 04_silver.sql
│   │   ├── 05_gold.sql
│   │   ├── 06_pipeline.sql
│   │   └── 07_verify_silver_gold.sql
│   └── supabase.js
├── src
│   ├── components
│   │   ├── Dashboard.jsx
│   │   ├── DataQualityPanel.jsx
    └── ...                           
```



Note: MAUDE data is public and contains no personal data. For other sources, hash sensitive columns, e.g. encode(digest(col, 'sha256'), 'hex').
