# MDR COMPLIANCE WEB APP

## ABOUT
This web app contains 
- MDR Steps: EU 2017/745 compliance workflows
- QMS Steps: ISO 13485:2016 implementation workflows

with the aim of guiding cross-functional teams such as manufacturers, Quality and regulatory experts, Data Analysists, and Stakeholders to align on regulatory milestones and what these processes may look like in practice. 

## LIVE DEMO
[mdr-qms-steps.vercel.app](https://mdr-qms-steps.vercel.app/)


## METHODS AND RESULTS

### MDR Steps
The complex legal text of the EU 2017/745 regulation was transformed into a roadmap. Users gain a visual understanding of the CE-marking journey. 

### QMS Steps
The core requirements of ISO 13485:2016 were mapped into a step-by-step implementation guide. The interface focuses on the practical setup of a QMS, highlighting SOPs and WIs. Startups and manufacturers get a roadmap to understand how to build a compliant, audit-ready QMS.

### PMS Data Analysis
Using a dataset from FDA MAUDE of the most frequently reported products and manufacturers from 2024, this module illustrates:
- **Trend Spotting:** How manufacturers can monitor industry-wide product failures and common safety risks.
- **Competitor & Market Analysis:** How to filter and benchmark data to see which product categories generate the most incident reports.
- **Proactive Risk Management:** How data analysis feeds back into Clinical Evaluations and PMS planning to improve device safety before issues occur.

### Steps in how the dashboard was created

### STEP 0 - Download data

1. Go to FDA MAUDE: https://www.fda.gov/medical-devices/medical-device-reporting-mdr-how-report-medical-device-problems/mdr-data-files#download

2. Download a zipped raw  
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

bronze_reports, silver_reports, product_stats, manufacturer_stats


run the code in Supabase

```

-- ============================================================
-- Medallion architecture schema for FDA MAUDE (DEVICE2024)
-- Bronze -> Silver -> Gold
-- ============================================================

-- ------------------------------------------------------------
-- BRONZE: raw, unfiltered, immutable, append-only.
-- Everything from the source file lands here, including bad
-- rows (missing product code, junk manufacturer, duplicates).
-- Nothing is dropped or corrected at this stage.
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

-- Bronze is append-only: no unique constraint on report_key here,
-- duplicates from the source system are expected and kept as-is.
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
-- GOLD: aggregated, business-ready. Unchanged from your
-- existing tables -- these are what the dashboard reads.
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

Make sure raw data are not public




## FUTURE STEPS

### QA/RA
- [ ] Add documentation dependencies between MDR & QMS 
- [ ] Add fictive Audit checklists
- [ ] Add clickable abbreviations

### PMS Data Analysis



## CONTACT

Malena Grannerud 
malena.grannerud@gmail.com
https://www.linkedin.com/in/malena-grannerud



*Created by Malena Grannerud, 2026*
