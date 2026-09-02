"""
 b_bronze_ingest.py 
 Author: Malena 
 Created: 2026-08-02
 Description: Reads from a text fila and writes to Supabase bronze_reports table.
"""

import os
import time
import logging
from typing import Optional

from dotenv import load_dotenv
from supabase import create_client
from pydantic import BaseModel, ConfigDict, Field, ValidationError

"""
 CONFIGURATION
"""

load_dotenv() # Load environment variables from .env file (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)

SOURCE_FILE = "data/DEVICE2024.txt" # Path to the source file with raw data 
WRITE_BATCH_SIZE = 1000 
MAX_RETRIES = 3
RETRY_BACKOFF_SECONDS = 2  # dubblas för varje nytt försök: 2s, 4s, 8s
MAX_ROWS_LIMIT = 20000 # Make sure Supabase dont get overloaded during ELT-process. (Free-tier Supabase: 500MB storage limit, so we keep it safe.)

# ============================================================
# LOGGNING 
# ============================================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


# ============================================================
# SUPABASE-KLIENT (Hämtar nu både URL och KEY från .env)
# ============================================================
def get_supabase_client():
    """
     Skapar en Supabase-klient med inställningar från .env.
     Avbryter körningen med felmeddelande om värden saknas.
    """
    supabase_url = os.environ.get("SUPABASE_URL")
    service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    
    if not supabase_url:
        raise SystemExit("❌ Fel: SUPABASE_URL saknas i din .env-fil!")
    if not service_role_key:
        raise SystemExit("❌ Fel: SUPABASE_SERVICE_ROLE_KEY saknas i din .env-fil!")
        
    return create_client(supabase_url, service_role_key)
supabase = get_supabase_client()


# ============================================================
# VALIDERINGSMODELL 
# ============================================================
class BronzeRow(BaseModel):
    """
    Validerar att fälten i en rad är text eller saknas.
    """
    model_config = ConfigDict(populate_by_name=True)

    report_key: Optional[str] = None
    product_code_raw: Optional[str] = None
    brand_name_raw: Optional[str] = None
    generic_name_raw: Optional[str] = None
    manufacturer_raw: Optional[str] = None
    source_file: str = Field(alias="_source_file")

# ============================================================
# BATCH-SKRIVNING MED RETRY + BACKOFF 
# Skriver exakt EN batch i taget till Supabase. Releasar minnet direkt efteråt.
# ============================================================

# Minnessäkra för Supabase: Tar emot en batch i taget, sparar inget i RAM
def upload_single_batch(batch: list[dict]) -> int:
    attempt = 0
    while attempt < MAX_RETRIES:
        try:
            supabase.table("bronze_reports").insert(batch).execute()
            return len(batch)
        except Exception as exc:  # noqa: BLE001
            attempt += 1
            if attempt >= MAX_RETRIES:
                logger.error(
                    "❌ Batch misslyckades efter %s försök, hoppas över (%s rader): %s",
                    MAX_RETRIES, len(batch), exc,
                )
            else:
                wait = RETRY_BACKOFF_SECONDS * (2 ** (attempt - 1))
                logger.warning(
                    "⚠️ Batch misslyckades (försök %s/%s), försöker igen om %ss: %s",
                    attempt, MAX_RETRIES, wait, exc,
                )
                time.sleep(wait)
    return 0


# ============================================================
# HUVUDFUNKTION
# ============================================================
def main() -> None:
    logger.info("[BRONZE] Läser in rådata från %s...", SOURCE_FILE)
    logger.info("[BRONZE] Säkrad maxgräns: %s rader (Skyddar Supabase-minnet)", MAX_ROWS_LIMIT)

    col_idx: dict[str, int] = {}
    buffer: list[dict] = []
    count = 0
    inserted = 0
    invalid = 0
    start = time.time()

    # Säkra sökvägen om du kör inifrån eller utanför mappen
    actual_source = SOURCE_FILE
    if not os.path.exists(actual_source):
        if os.path.exists(f"medallion/{SOURCE_FILE}"):
            actual_source = f"medallion/{SOURCE_FILE}"
        else:
            raise SystemExit(f"❌ Fel: Hittade inte källfilen på {SOURCE_FILE}")

    with open(actual_source, encoding="utf-8", errors="replace") as f:
        for line_num, line in enumerate(f):
            line = line.rstrip("\n")

            # Första raden = rubriker, hitta kolumnpositioner
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

            raw_row = {
                "report_key": get(col_idx["reportKey"]),
                "product_code_raw": get(col_idx["productCode"]),
                "brand_name_raw": get(col_idx["brandName"]),
                "generic_name_raw": get(col_idx["genericName"]),
                "manufacturer_raw": get(col_idx["manufacturerRaw"]),
                "_source_file": actual_source,
            }

            try:
                validated = BronzeRow(**raw_row)
                buffer.append(validated.model_dump(by_alias=True))
            except ValidationError as exc:
                invalid += 1
                logger.warning("[BRONZE] Ogiltig rad %s hoppades över: %s", line_num, exc)

            count += 1

            # MINNESSÄKRA BATCH-LOOPEN:
            if len(buffer) >= WRITE_BATCH_SIZE:
                inserted += upload_single_batch(buffer)
                buffer = []  # Tömmer listan DIREKT för att frigöra RAM i Codespaces
                logger.info("[BRONZE] Skrev %s rader totalt (läst: %s)", f"{inserted:,}", f"{count:,}")

            # SÄKERHETSAVBROTT: Stoppa innan Supabase blir fullt
            if inserted >= MAX_ROWS_LIMIT:
                logger.info("[BRONZE] Nådde %s rader. Avbryter inläsning för att spara lagring på gratisnivån.", MAX_ROWS_LIMIT)
                break

    # SISTA BATCH (Skickar resterna om vi inte slog i limit exakt):
    if buffer and inserted < MAX_ROWS_LIMIT:
        inserted += upload_single_batch(buffer)

    elapsed = time.time() - start
    logger.info(
        "BRONZE KLAR — %s rader lästa, %s sparade, %s ogiltiga hoppades över (%.1f sekunder).",
        f"{count - 1:,}", f"{inserted:,}", f"{invalid:,}", elapsed,
    )

if __name__ == "__main__":
    main()
