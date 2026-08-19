"""
2_bronze_to_silver.py

SILVER LAYER

Mål: Läsa rådata från bronze_reports, rensa och normalisera den,
och skriva en deduplicerad, validerad rad per report_key till silver_reports.

Input:  bronze_reports (Supabase)
Output: silver_reports (Supabase)

Regler som tillämpas här (medvetna designval):
    - Rader utan produktkod kastas — utan produktkod går raden inte
      att koppla till Gold-lagrets aggregering senare.
    - Rader med skräpvärde som tillverkare kastas (se INVALID_VALUES).
    - Deduplicering på report_key — första förekomsten vinner.
    - Tillverkarnamn normaliseras: skiljetecken bort, mellanslag
      kollapsas, juridiska suffix (Inc, LLC, AB, GmbH...) tas bort.
    - Kända varianter av samma tillverkare slås ihop manuellt
      (t.ex. olika regionala dotterbolag av samma bolag).
"""

import os
import re
import time

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

# Antal rader vi läser från Bronze per databasanrop. Vi paginerar istället
# för att hämta hela tabellen på en gång — håller minnesanvändningen
# konstant oavsett hur många miljoner rader Bronze innehåller.
PAGE_SIZE = 5000
# Antal rader vi skriver till Silver per batch, samma resonemang som i Bronze.
WRITE_BATCH_SIZE = 1000
SUPABASE_URL = "https://kgoxvplsaceqdvorqsle.supabase.co"

# Explicit lista över textvärden som FDA-filen använder som "vet ej"-markörer.
# De är INTE null i källfilen — de är riktiga strängar som *betyder* null,
# så vi måste matcha dem manuellt istället för att lita på NULL-hantering.
INVALID_VALUES = {"NI", "UNK", "*", "N/A", "NA", "UNKNOWN", "NO INFORMATION", "?", "NONE"}

# Manuell lookup-tabell för tillverkarvarianter som regex INTE kan fånga —
# t.ex. helt olika namn på samma bolags regionala dotterbolag.
# En algoritmisk lösning (fuzzy matching) hade riskerat att slå ihop
# två olika bolag av misstag; en explicit lista är långsammare att
# underhålla men garanterat korrekt.
MANUFACTURER_MERGES = {
    "NOBEL BIOCARE GÖTEBORG": "NOBEL BIOCARE",
    "MEDTRONIC MINIMED": "MEDTRONIC",
    "MEDTRONIC PUERTO RICO OPERATIONS": "MEDTRONIC",
    "AIZU OLYMPUS": "OLYMPUS",
    "SHIRAKAWA OLYMPUS": "OLYMPUS",
}

# Matchar juridiska suffix i SLUTET av strängen ($), skiftlägesokänsligt.
# Gör att t.ex. "Medtronic Inc" och "Medtronic" räknas som samma tillverkare.
SUFFIX_RE = re.compile(r"\s(inc|llc|ltd|co|corp|corporation|as|ag|gmbh|sa|ab)$", re.IGNORECASE)

service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
if not service_role_key:
    raise SystemExit("❌ Fel: SUPABASE_SERVICE_ROLE_KEY saknas i din .env-fil!")

supabase = create_client(SUPABASE_URL, service_role_key)


def is_invalid_value(name: str | None) -> bool:
    """
    Avgör om ett fältvärde ska räknas som "saknas".

    Kollar mot skräplistan (case-insensitive) och mot en minimilängd —
    en enstaka bokstav som inte finns i listan är ändå troligen skräp.
    """
    if not name:
        return True
    cleaned = name.strip()
    return cleaned.upper() in INVALID_VALUES or len(cleaned) < 2


def normalize_manufacturer(name: str | None) -> str:
    """
    Städar ett tillverkarnamn i fyra steg:
    1. Tar bort komma/punkt (skiljetecken som stör matchning)
    2. Kollapsar flera mellanslag till ett
    3. Tar bort juridiska suffix i slutet
    4. Kollapsar mellanslag igen (suffix-borttagningen kan lämna dubbla)
    """
    if not name:
        return ""
    cleaned = name.replace(",", " ").replace(".", " ")
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    cleaned = SUFFIX_RE.sub("", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


def merge_known_duplicates(name: str) -> str:
    """Slår ihop kända namnvarianter till ett kanoniskt namn, om det finns i listan."""
    return MANUFACTURER_MERGES.get(name.upper(), name)


def main() -> None:
    print("🚀 [SILVER] Läser rådata från bronze_reports och rensar...")
    start_time = time.time()

    # Ett set i minnet håller koll på vilka report_key vi redan sparat,
    # för dedupliceringen. Fungerar så länge datan får plats i minnet —
    # för riktigt stora volymer hade en databas-baserad dedup varit säkrare.
    seen_keys: set[str] = set()
    silver_rows: list[dict] = []

    removed_no_product_code = 0
    removed_bad_manufacturer = 0
    removed_duplicate = 0
    total_read = 0

    offset = 0
    while True:
        # Paginerad läsning: hämtar PAGE_SIZE rader åt gången tills
        # Bronze-tabellen är slut (page blir tom).
        response = (
            supabase.table("bronze_reports")
            .select("report_key, product_code_raw, brand_name_raw, generic_name_raw, manufacturer_raw")
            .range(offset, offset + PAGE_SIZE - 1)
            .execute()
        )
        page = response.data
        if not page:
            break

        total_read += len(page)

        for row in page:
            # Filter 1: måste ha produktkod, annars går raden inte att
            # koppla till Gold-aggregeringen senare.
            if not row["product_code_raw"]:
                removed_no_product_code += 1
                continue
            # Filter 2: tillverkarnamnet får inte vara ett känt skräpvärde.
            if is_invalid_value(row["manufacturer_raw"]):
                removed_bad_manufacturer += 1
                continue
            # Filter 3: har vi redan sett detta report_key i denna körning?
            if row["report_key"] in seen_keys:
                removed_duplicate += 1
                continue
            seen_keys.add(row["report_key"])

            manufacturer = merge_known_duplicates(normalize_manufacturer(row["manufacturer_raw"]))

            brand = row["brand_name_raw"]
            generic = row["generic_name_raw"]

            silver_rows.append({
                "report_key": row["report_key"],
                "product_code": row["product_code_raw"],
                # Versaler + kollapsade mellanslag för konsekvent format.
                # is_invalid_value-koll även här, eftersom brand/generic
                # kan ha samma typ av skräpvärden som manufacturer_raw.
                "brand_name": re.sub(r"\s+", " ", brand).strip().upper() if not is_invalid_value(brand) else None,
                "generic_name": re.sub(r"\s+", " ", generic).strip().upper() if not is_invalid_value(generic) else None,
                "manufacturer_name": manufacturer or None,
            })

        # Enkel framstegslogg var 500 000:e läst rad.
        if total_read % 500000 < PAGE_SIZE:
            print(f"  ⏳ Läst {total_read:,} rader från Bronze...")

        offset += PAGE_SIZE
        # Om sidan var mindre än PAGE_SIZE var det sista sidan — sluta loopa.
        if len(page) < PAGE_SIZE:
            break

    print(f"\n📤 Skriver {len(silver_rows):,} rensade rader till silver_reports...")
    for i in range(0, len(silver_rows), WRITE_BATCH_SIZE):
        batch = silver_rows[i:i + WRITE_BATCH_SIZE]
        try:
            # upsert (inte insert): om report_key redan finns skrivs raden
            # över istället för att ge ett fel. Gör skriptet idempotent —
            # säkert att köra om utan att skapa dubbletter i Silver.
            supabase.table("silver_reports").upsert(batch, on_conflict="report_key").execute()
        except Exception as exc:  # noqa: BLE001
            print(f"  ❌ Fel vid upsert i silver_reports: {exc}")

    elapsed = time.time() - start_time
    print("\n=== 📊 Silver-rapport ===")
    print(f"  Lästa rader från Bronze:         {total_read:,}")
    print(f"  Borttagna (saknar produktkod):   {removed_no_product_code:,}")
    print(f"  Borttagna (ogiltig tillverkare):  {removed_bad_manufacturer:,}")
    print(f"  Borttagna (dubbletter):           {removed_duplicate:,}")
    pct = (len(silver_rows) / total_read * 100) if total_read else 0
    print(f"  Behållna unika rader i Silver:    {len(silver_rows):,} ({pct:.1f}%)")
    print(f"  ⏱️  Total körtid: {elapsed:.1f} sekunder")
    print("\n🎉 SILVER KLAR. Kör nu: python 3_silver_to_gold.py")


if __name__ == "__main__":
    main()