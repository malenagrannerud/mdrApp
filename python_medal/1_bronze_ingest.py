
"""
BRONZE LAYER
 
Mål: Läsa in den råa DEVICE2024.txt-filen till tabellen
bronze_reports i Supabase (Postgres).
 
Input:  src/data/DEVICE2024.txt
Output: bronze_reports
 
Regler för Bronze (medvetna designval, inte glömda features):
    - Ingenting tas bort, korrigeras eller dedupliceras.
    - Varje rad från källfilen sparas, även skräprader
      (saknad produktkod, "UNKNOWN" som tillverkare, dubbla
      report_key). 
    - Metadatakolumner (_inserted_at, _source_file) läggs till
      för spårbarhet, men innehållet i raden rörs inte.

    - Append-only: kör man skriptet igen på en ny källfil läggs
      nya rader till, inget skrivs över. 
      
      OBS: kör man samma fil två gånger uppstår dubbletter i Bronze med avsikt — det är
      Silver som ansvarar för att deduplicera senare.
"""
 
import os
import time
 
from dotenv import load_dotenv
from supabase import create_client
 
# Läser in miljövariabler från .env (t.ex. SUPABASE_SERVICE_ROLE_KEY).
# Måste köras innan vi läser os.environ längre ner.
load_dotenv()
 
SOURCE_FILE = "src/data/DEVICE2024.txt"
# Antal rader vi samlar i minnet innan vi skickar en batch till Supabase.
# En insert per rad hade gett en nätverksrundtur per rad (långsamt
# för hundratusentals rader) — batching gör en rundtur per 1000 rader istället.
BATCH_SIZE = 1000
SUPABASE_URL = "https://kgoxvplsaceqdvorqsle.supabase.co"
 
# Service role-nyckeln ger skrivbehörighet förbi RLS.
# Den ska ALDRIG committas till git — bara finnas i lokal .env eller i
# CI/CD-miljöns secret-hantering. Skriptet vägrar starta om den saknas,
# hellre än att krascha längre in i körningen.

service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
if not service_role_key:
    raise SystemExit("❌ Fel: SUPABASE_SERVICE_ROLE_KEY saknas i din .env-fil!")
 
supabase = create_client(SUPABASE_URL, service_role_key)
 

def insert_batch(rows: list[dict]) -> int:

    """
    Skickar en batch till bronze_reports.
 
    Returnerar antalet sparade rader. Om insert misslyckas
    (t.ex. nätverksfel eller Supabase-limit) fångas felet här så att HELA
    körningen inte kraschar på grund av en enda trasig batch — vi hellre
    loggar felet och fortsätter med nästa batch.

    APPEND ONLY: Använder endast insert(), ingen upsert(). 
    """



    if not rows:
        return 0
    try:
        supabase.table("bronze_reports").insert(rows).execute()
        return len(rows)
    except Exception as exc:  # noqa: BLE001
        print(f"  ❌ Fel vid insert i bronze_reports: {exc}")
        return 0
 
 
def main() -> None:
    print(f"🚀 [BRONZE] Läser in rådata från {SOURCE_FILE}...")
    start_time = time.time()
 
    col_idx = {}
    buffer: list[dict] = []
    count = 0
    inserted = 0
 
    # encoding="utf-8", errors="replace": FDA:s källfiler innehåller ibland
    # tecken som inte är giltig UTF-8. Utan errors="replace" hade ett enda
    # trasigt tecken kraschat inläsningen efter hundratusentals rader.
    # Med "replace" byts ogiltiga tecken ut mot ett platshållartecken
    # istället, och resten av filen kan fortsätta läsas.
    with open(SOURCE_FILE, encoding="utf-8", errors="replace") as f:
        for line_num, line in enumerate(f):
            line = line.rstrip("\n")
 
            if line_num == 0:
                # Första raden är header. Vi mappar kolumnnamn -> index
                # istället för att anta en fast kolumnordning. Det gör
                # skriptet robust om FDA lägger till/tar bort kolumner
                # i en framtida version av filen — vi letar upp rätt
                # kolumn via NAMN, inte position.
                headers = [h.strip() for h in line.split("|")]
                col_idx = {
                    "reportKey": headers.index("MDR_REPORT_KEY") if "MDR_REPORT_KEY" in headers else -1,
                    "productCode": headers.index("DEVICE_REPORT_PRODUCT_CODE") if "DEVICE_REPORT_PRODUCT_CODE" in headers else -1,
                    "brandName": headers.index("BRAND_NAME") if "BRAND_NAME" in headers else -1,
                    "genericName": headers.index("GENERIC_NAME") if "GENERIC_NAME" in headers else -1,
                    "manufacturerRaw": headers.index("MANUFACTURER_D_NAME") if "MANUFACTURER_D_NAME" in headers else -1,
                }
                count += 1
                continue
 
            # FDA-filen är pipe-separerad (|), inte kommaseparerad (CSV) —
            # troligen för att fritextfält i datan annars hade kunnat
            # innehålla kommatecken och trasa sönder kolumnindelningen.
            fields = line.split("|")



           
            def get(idx: int) -> str | None:
            """
            Hämtar ett fältvärde säkert på givet index.
 
            Returnerar None om kolumnen saknades i headern (idx == -1)
            eller om raden har färre fält än förväntat (trasig rad).
            Tomma strängar normaliseras också till None, så att
            "saknas" alltid representeras på samma sätt i databasen.
            """
                if idx < 0 or idx >= len(fields):
                    return None
                val = fields[idx].strip()
                return val or None
 


            # Bronze-principen: spara data som det är, + tomma rader eller skräpvärden. 
            # IMMUTABLE: bara getter, inge setter
            buffer.append({
                "report_key": get(col_idx["reportKey"]),
                "product_code_raw": get(col_idx["productCode"]),
                "brand_name_raw": get(col_idx["brandName"]),
                "generic_name_raw": get(col_idx["genericName"]),
                "manufacturer_raw": get(col_idx["manufacturerRaw"]),
                "_source_file": SOURCE_FILE,
            })
            count += 1
 
            # När bufferten är full: skicka den som en batch och töm den.
            # Håller minnesanvändningen konstant oavsett hur stor filen är,
            # istället för att bygga upp en lista med miljontals rader
            # i minnet innan något skrivs till databasen.
            if len(buffer) >= BATCH_SIZE:
                inserted += insert_batch(buffer)
                buffer = []
                # Enkel framstegsindikator var 50 000:e rad, så man ser
                # att skriptet fortfarande jobbar under en lång körning.
                if inserted % 50000 < BATCH_SIZE:
                    print(f"  ✅ [BRONZE] Skrev {inserted:,} rader totalt (läst: {count:,})")
 
        # Sista, ofullständiga bufferten (mindre än BATCH_SIZE rader)
        # måste också skickas — annars tappas de sista raderna i filen.
        if buffer:
            inserted += insert_batch(buffer)
 
    elapsed = time.time() - start_time
    print("\n=== 📊 Bronze-rapport ===")
    print(f"  Totalt lästa rader (exkl. header): {count - 1:,}")
    print(f"  Totalt sparade rader i bronze_reports: {inserted:,}")
    print("  Alla rader sparade oförändrade, inklusive ev. skräprader (det är Silvers jobb att rensa).")
    print(f"  ⏱️  Total körtid: {elapsed:.1f} sekunder")
    print("\n🎉 BRONZE KLAR. Kör nu: python 2_silver_transform.py")
 
 
if __name__ == "__main__":
    main()
 