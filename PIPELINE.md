## Steps in how the dashboard was created

### STEP 0 - Download data
1. Go to FDA MAUDE: https://www.fda.gov/medical-devices/medical-device-reporting-mdr-how-report-medical-device-problems/mdr-data-files#download

2. Download a raw file  
``` bash
mkdir -p src/data
cd src/data
curl -O https://www.accessdata.fda.gov/MAUDE/ftparea/device2024.zip
unzip device2024.zip
cd ../..
```

3. Open in bash to inspect. Displays 3 first rows
```bash 
head -3 src/data/DEVICE2024.txt
wc -l src/data/DEVICE2024.txt
```

### STEP 1 - Create empty tables in Supabase
bronze_reports, silver_reports, product_stats, manufacturer_stats. Run the code in Supabase

```sql
-- ============================================================
-- Medallion architecture schema for FDA MAUDE (DEVICE2024)
-- ============================================================

-- ------------------------------------------------------------
-- BRONZE: raw, unfiltered, immutable, append-only.
-- Everything from the source file including bad rows 
-- (missing product code, junk manufacturer, duplicates).
-- Nothing is dropped or corrected. 
-- ------------------------------------------------------------
create table if not exists bronze_reports (
  id bigint generated always as identity primary key,
  report_key text,
  product_code_raw text,
  brand_name_raw text,
  generic_name_raw text,
  manufacturer_raw text,
  _inserted_at timestamptz not null default now(),
  _source_file text not null
);

create index if not exists idx_bronze_report_key on bronze_reports (report_key);
create index if not exists idx_bronze_source_file on bronze_reports (_source_file);

-- ------------------------------------------------------------
-- SILVER: cleaned, typed, deduplicated, normalized.
-- One row per unique report_key. Manufacturer names normalized
-- and merged. Invalid/junk values converted to NULL.
-- ------------------------------------------------------------
create table if not exists silver_reports (
  report_key text primary key,
  product_code text not null,
  brand_name text,
  generic_name text,
  manufacturer_name text,
  _silver_updated_at timestamptz not null default now()
);

create index if not exists idx_silver_product_code on silver_reports (product_code);
create index if not exists idx_silver_manufacturer on silver_reports (manufacturer_name);

-- ------------------------------------------------------------
-- GOLD: aggregated, business-ready, what the dashboard reads.
-- ------------------------------------------------------------
create table if not exists product_stats (
  product_code text primary key,
  total_reports integer not null,
  brand_name text,
  generic_name text,
  manufacturer_name text
);

create table if not exists manufacturer_stats (
  name text primary key,
  count integer not null
);
```

### STEP 2 - Install python
```bash
pip install -r python_medal/requirements.txt
```
Verify: 
```bash
python -c "from supabase import create_client; print('OK')"
```

### Step 3 - Run Bronze
```bash
python python_medal/1_bronze_load.py
```
Verify: 
- See "Bronze klar", 
- See a filled bronze_reports array in Supabase with wc-1 rows and heck one row, make sure not empty

### Step 4 - Run Silver
```bash
python python_medal/2_silver_transform.py
```
Reads from bronze_reports, cleanses/dedupes/normalizes, writes to silver_reports.

Verify: 
- Terminalen skriver ut en rapport: antal borttagna (saknar produktkod / ogiltig tillverkare / dubbletter) och antal kvar
- In Supabase Table Editor → silver_reports: nr of rows shall be < nr of rows in Bronze (since cleaned rows should be removed)
- Run this SQL-enquiery in SQL Editor and check so duplicates are reomved:

```sql
SELECT report_key, COUNT(*) 
FROM silver_reports 
GROUP BY report_key 
HAVING COUNT(*) > 1;
```
Shall return 0 rows, else the dedup logic is wrong. 

### Step 5 - Run Gold
```bash
python python_medal/3_gold_aggregate.py
```
Reads from silver_reports, aggregates to product_stats and manufacturer_stats.

Verify: I Supabase → product_stats: ska innehålla en rad per unik produktkod.  Kör:

```sql
SELECT * FROM product_stats ORDER BY total_reports DESC LIMIT 10;
```

### STEP 6 — See dashboard 
Dashboard.jsx reads and displays top 10 most reported data from the tables product_stats and manufacturer_stats from Supabase

Verify: Inspect plots
