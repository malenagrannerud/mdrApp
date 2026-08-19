# ETL Pipeline: Medallion Architecture

Detta projekt transformerar rådata (FDA MAUDE) till aggregerad, dashboard-klar
data via en medaljong-arkitektur: bronze → silver → gold, byggd med Python och
Postgres (via Supabase).

## Pipeline-steg

1. `1_bronze_ingest.py` — Läser rådata från DEVICE2024.txt, sparar i bronze_reports.
2. `2_bronze_to_silver.py` — Rensar, validerar, normaliserar och dedupar, sparar i silver_reports.
3. `3_silver_to_gold.py` — Aggregerar till product_stats och manufacturer_stats, som Dashboard.jsx läser.

### Regler för Bronze-lagret

- Append-only (immutability). Ingen rad uppdateras eller raderas.
- Skräprader (saknad produktkod, "UNKNOWN" tillverkare, dubbletter) sparas 
- Varje rad berikas med `_inserted_at` och `_source_file` för spårbarhet.

### Regler för Silver-lagret

- Rader utan produktkod eller med skräpvärde som tillverkare kastas.
- En rad per unikt `report_key` (deduplicering, första förekomsten vinner).
- Tillverkarnamn normaliseras (skiljetecken/mellanslag städas, juridiska suffix tas bort) och kända varianter slås ihop via en manuell lista.
- Skrivs med `upsert` — säkert att köra om (idempotent).

### Regler för Gold-lagret

- En rad per produktkod i `product_stats`, med totalt antal rapporter samt vanligast förekommande varumärke/generiskt namn/tillverkare.
- En rad per tillverkare i `manufacturer_stats`, med totalt antal rapporter oavsett produkt.

[ Source: FDA MAUDE - DEVICE2024.txt ] (API, DB, Filer)
       │
       ▼  (Ingestering / Inlastning)
┌─────────────────────────────────────────┐
│              BRONZE LAGER               │
│  - Raw Data                            │
│  - Historik sparas (Append-only)        │
│  - Inga filter eller tvätt              │
└─────────────────────────────────────────┘
       │
       ▼  (Tvätt, Validering, Strukturering)
┌─────────────────────────────────────────┐
│              SILVER LAGER               │
│  - Renad och validerad data             │
│  - Berikad (Enriched)                   │
│  - Gemensamt format (T.ex. Delta/Parquet)│
└─────────────────────────────────────────┘
       │
       ▼  (Aggregering, Affärslogik)
┌─────────────────────────────────────────┐
│               GOLD LAGER                │
│  - Verksamhetsanpassad data             │
│  - Aggregerad och snabb                 │
│  - Klar för rapportering                │
└─────────────────────────────────────────┘
       │
       ├───────────────────┬───────────────────┐
       ▼                   ▼                   ▼
[ Power BI / Tableau ]   [ AI / ML Modeller ]   [ Ad-hoc Analys ]






## Steg för att köra pipelinen

### Steg 0 — Ladda ner data
1. Gå till FDA MAUDE: https://www.fda.gov/medical-devices/medical-device-reporting-mdr-how-report-medical-device-problems/mdr-data-files#download
2. Ladda ner en rådatafil:
```bash
mkdir -p src/data
cd src/data
curl -O https://www.accessdata.fda.gov/MAUDE/ftparea/device2024.zip
unzip device2024.zip
cd ../..
```
3. Inspektera i bash:
```bash
head -3 src/data/DEVICE2024.txt
wc -l src/data/DEVICE2024.txt
```

### Steg 1 — Skapa tabeller i Supabase
Kör SQL-schemat för `bronze_reports`, `silver_reports`, `product_stats`, `manufacturer_stats` i Supabase SQL Editor 
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




### Steg 2 — Installera Python-beroenden
```bash
pip install -r python_medal/requirements.txt
python -c "from supabase import create_client; print('OK')"
```

### Steg 3 — Kör Bronze
```bash
python python_medal/1_bronze_ingest.py
```
Verifiera: konsolen visar "BRONZE KLAR", `bronze_reports` är fylld i Supabase.

### Steg 4 — Kör Silver
```bash
python python_medal/2_bronze_to_silver.py
```
Verifiera: `silver_reports` har färre rader än `bronze_reports`. Kontrollera att inga dubbletter finns kvar:
```sql
SELECT report_key, COUNT(*)
FROM silver_reports
GROUP BY report_key
HAVING COUNT(*) > 1;
```
Ska returnera 0 rader.

### Steg 5 — Kör Gold
```bash
python python_medal/3_silver_to_gold.py
```
Verifiera:
```sql
SELECT * FROM product_stats ORDER BY total_reports DESC LIMIT 10;
```

### Steg 6 — Se dashboarden
`Dashboard.jsx` läser topp 10 från `product_stats` och `manufacturer_stats` och renderar dem som diagram.