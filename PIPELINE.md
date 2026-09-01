# PIPELINE.md - ETL Pipeline: Medallion Architecture

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

[ Source: FDA MAUDE - DEVICE2024.txt ] ( kan vara API, DB, Filer)
       │
       ▼  (Ingestering: 1_bronze_ingest.py)
┌─────────────────────────────────────────┐
│ BRONZE LAGER | bronze_reports (Supabase)│
│  - Raw Data                             │
│  - Historik sparas (Append-only)        │
│  - Inga filter eller tvätt              │
└─────────────────────────────────────────┘
       │
       ▼  (2_bronze_to_silver.py)
┌─────────────────────────────────────────┐
│ SILVER LAGER | silver_reports (Supabase)│
│  - Renad, validerad, deduplicerad data  │
│  - Tillvesnamn normaliserade            │
└─────────────────────────────────────────┘
       │
       ▼  (3_silver_to_gold.py)
┌─────────────────────────────────────────┐
│ GOLD LAGER                │
│  - product_stats, manufacturer_stats    │
│  - Aggregerad och snabb                 │
│  - Klar för rapportering                │
└─────────────────────────────────────────┘
       │
       ├───────────────────┬───────────────────┐
       ▼                   ▼                   ▼
[ Dashboard (Power BI) ][ AI / ML Modeller ][ Ad-hoc Analys ]


## Steg för att köra pipelinen
### Steg 0 — Ladda ner data

1. FDA MAUDE: https://www.fda.gov/medical-devices/medical-device-reporting-mdr-how-report-medical-device-problems/mdr-data-files#download

2. Ladda ner en rådatafil:
```bash
mkdir -p src/data
cd src/data
curl -O https://www.accessdata.fda.gov/MAUDE/ftparea/device2024.zip
unzip device2024.zip
cd ../..
```

3. Inspektera rubriker:
```bash
head -n 1 data/DEVICE2024.txt | tr '|' '\n'
```
MDR_REPORT_KEY
DEVICE_EVENT_KEY
IMPLANT_FLAG
DATE_REMOVED_FLAG
DEVICE_SEQUENCE_NO
IMPLANT_DATE_YEAR
DATE_REMOVED_YEAR
SERVICED_BY_3RD_PARTY_FLAG
DATE_RECEIVED
BRAND_NAME
GENERIC_NAME
MANUFACTURER_D_NAME
MANUFACTURER ADDRESS ......
DEVICE_OPERATOR
EXPIRATION_DATE_OF_DEVICE
MODEL_NUMBER
CATALOG_NUMBER
LOT_NUMBER
OTHER_ID_NUMBER
DEVICE_AVAILABILITY
DATE_RETURNED_TO_MANUFACTURER
DEVICE_REPORT_PRODUCT_CODE
DEVICE_AGE_TEXT
DEVICE_EVALUATED_BY_MANUFACTUR
COMBINATION_PRODUCT_FLAG
UDI-DI
UDI-PUBLIC


### Steg 1 — Skapa tabeller (Supabase)

Kör 00_create_tables.sql i Supabase. 
Skapar `bronze_reports`, `silver_reports`, `product_stats`, `manufacturer_stats` i Supabase SQL Editor 


### Steg 2 — Kör Bronze

Installera Python-beroenden
```bash
pip install -r medallion/requirements.txt
python -c "from supabase import create_client; print('OK')"
```
Kör 01_bronze_ingest.sql i Supabase. Verifiera: konsolen visar "BRONZE KLAR", `bronze_reports` är fylld i Supabase.


### Steg 3 — Kör Silver (Supabase)

Kör 02_silver.sql i Supabase. Verifiera: `silver_reports` har färre rader än `bronze_reports`. Kontrollera att inga dubbletter finns kvar:
```sql
SELECT report_key, COUNT(*)
FROM silver_reports
GROUP BY report_key
HAVING COUNT(*) > 1;
```
Ska returnera 0 rader.


### Steg 4 — Kör Gold (Supabase)

Kör 03_gold.sql i Supabase.
Verifiera:
```sql
SELECT * FROM product_stats ORDER BY total_reports DESC LIMIT 10;
```

### Steg 5 — Validera (Supabase)

- 20 000 rader lästes in i bronze (nuvarande MAX_ROWS_LIMIT)
- 19 950 av dem klarade sig genom Silver-lagrets rensning (deduplicering + filtrering av ogiltiga tillverkare/produktkoder)
- Det ger en valideringsandel på 19 950 / 20 000 = 99,75%
- 555 unika produktkoder och 493 unika normaliserade tillverkare i Gold-lagret


### Steg 6 — Se dashboarden

`Dashboard.jsx` läser topp 10 från `product_stats` och `manufacturer_stats` och renderar dem som diagram.