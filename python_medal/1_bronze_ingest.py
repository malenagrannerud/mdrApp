
"""
1_bronze_ingest.py - BRONZE LAYER
 
Mål: Läsa in den råa DEVICE2024.txt-filen till tabellen
bronze_reports i Supabase (Postgres).
 
Input:  src/data/DEVICE2024.txt
Output: bronze_reports (till Supabase/Postgres)
 
Regler för Bronze:
    - Ingenting tas bort, korrigeras eller dedupliceras från källfilen (saknad produktkod, 
      "UNKNOWN" som tillverkare, dubbla report_key sparas). 
    - Metadatakolumner (_inserted_at, _source_file) läggs till
      för spårbarhet.
    - Append-only: kör man skriptet igen på en ny källfil läggs
      nya rader till, inget skrivs över. 
    - Immutable: bara insert(), inga update() eller delete() i Bronze.
      
      OBS: kör man samma fil två gånger uppstår dubbletter i Bronze med avsikt — 
      Silver lagret ansvarar för att deduplicera.
"""

from db import get_supabase_client
from batch_writer import upload_in_batches
from timing import timed_run
from pipeline_logging import get_logger
from config import SOURCE_FILE, WRITE_BATCH_SIZE

logger = get_logger(__name__)
supabase = get_supabase_client()


def main() -> None:
    logger.info("[BRONZE] Läser in rådata från %s...", SOURCE_FILE)

    col_idx = {}
    buffer: list[dict] = []
    count = 0
    inserted = 0

    with timed_run("BRONZE"):
        with open(SOURCE_FILE, encoding="utf-8", errors="replace") as f:
            for line_num, line in enumerate(f):
                line = line.rstrip("\n")

                if line_num == 0:
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

                fields = line.split("|")

                def get(idx: int) -> str | None:
                    if idx < 0 or idx >= len(fields):
                        return None
                    val = fields[idx].strip()
                    return val or None

                buffer.append({
                    "report_key": get(col_idx["reportKey"]),
                    "product_code_raw": get(col_idx["productCode"]),
                    "brand_name_raw": get(col_idx["brandName"]),
                    "generic_name_raw": get(col_idx["genericName"]),
                    "manufacturer_raw": get(col_idx["manufacturerRaw"]),
                    "_source_file": SOURCE_FILE,
                })

                count += 1

                if len(buffer) >= WRITE_BATCH_SIZE:
                    inserted += upload_in_batches(supabase, "bronze_reports", buffer)
                    buffer = []
                    if inserted % 50000 < WRITE_BATCH_SIZE:
                        logger.info("[BRONZE] Skrev %s rader totalt (läst: %s)", f"{inserted:,}", f"{count:,}")

            if buffer:
                inserted += upload_in_batches(supabase, "bronze_reports", buffer)

    logger.info("BRONZE KLAR — %s rader lästa, %s sparade.", f"{count - 1:,}", f"{inserted:,}")


if __name__ == "__main__":
    main()