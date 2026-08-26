"""
01_bronze_ingest.py — BRONZE LAYER (EXTRACT + LOAD)

Mål: Läsa in DEVICE2024.txt och skriva rakt in i bronze_reports.
Ingenting rensas, korrigeras eller deduplicieras här — det är Silvers jobb.

Lägger till inserted_at och _source_file för att kunna spåra när och varifrån varje rad kom.

"""
import os
import time
import logging
from typing import Optional

from dotenv import load_dotenv
from supabase import create_client
from pydantic import BaseModel, ConfigDict, Field, ValidationError

# ============================================================
# KONFIGURATION
# ============================================================
load_dotenv()

SUPABASE_URL = "https://maojzvwygiaxpvkmtnts.supabase.co"
SOURCE_FILE = "data/DEVICE2024.txt"
WRITE_BATCH_SIZE = 1000
MAX_RETRIES = 3
RETRY_BACKOFF_SECONDS = 2  # dubblas för varje nytt försök: 2s, 4s, 8s

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
# SUPABASE-KLIENT 
# ============================================================

def get_supabase_client():
    """
    Skapar en Supabase-klient med service role-nyckeln från .env.
    Avbryter körningen med tydligt felmeddelande om nyckeln saknas,
    hellre än att krascha längre in i skriptet med ett svårtolkat auth-fel.
    """
    service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not service_role_key:
        raise SystemExit("❌ Fel: SUPABASE_SERVICE_ROLE_KEY saknas i din .env-fil!")
    return create_client(SUPABASE_URL, service_role_key)

supabase = get_supabase_client()

# ============================================================
# VALIDERINGSMODELL 
# ============================================================

class BronzeRow(BaseModel):
    """
    Validerar bara FORMEN på en rad — att fälten är text eller saknas.
    Kollar INTE om innehållet är giltigt (t.ex. "UNKNOWN" som tillverkare
    eller saknad produktkod) — det är Silvers ansvar, inte Bronze.
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
# ============================================================

def upload_in_batches(rows: list[dict], batch_size: int = WRITE_BATCH_SIZE) -> int:
    """
    Skriver rader till bronze_reports i batchar, med retry+backoff
    om en batch misslyckas (t.ex. tillfälligt nätverksfel mot Supabase).
    Ger upp en batch efter MAX_RETRIES försök och fortsätter med resten,
    så att en trasig batch inte kraschar hela körningen.
    Returnerar antal rader som faktiskt sparades.
    """
    inserted = 0
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i + batch_size]
        attempt = 0
        while attempt < MAX_RETRIES:
            try:
                supabase.table("bronze_reports").insert(batch).execute()
                inserted += len(batch)
                break
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
    return inserted

# ============================================================
# HUVUDFUNKTION
# ============================================================

def main() -> None:
    logger.info("[BRONZE] Läser in rådata från %s...", SOURCE_FILE)

    col_idx: dict[str, int] = {}
    buffer: list[dict] = []
    count = 0
    inserted = 0
    invalid = 0
    start = time.time()

    with open(SOURCE_FILE, encoding="utf-8", errors="replace") as f:
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
                "_source_file": SOURCE_FILE,
            }

            try:
                validated = BronzeRow(**raw_row)
                buffer.append(validated.model_dump(by_alias=True))
            except ValidationError as exc:
                invalid += 1
                logger.warning("[BRONZE] Ogiltig rad %s hoppades över: %s", line_num, exc)

            count += 1

            if len(buffer) >= WRITE_BATCH_SIZE:
                inserted += upload_in_batches(buffer)
                buffer = []
                if inserted % 50000 < WRITE_BATCH_SIZE:
                    logger.info("[BRONZE] Skrev %s rader totalt (läst: %s)", f"{inserted:,}", f"{count:,}")

    if buffer:
        inserted += upload_in_batches(buffer)

    elapsed = time.time() - start
    logger.info(
        "BRONZE KLAR — %s rader lästa, %s sparade, %s ogiltiga hoppades över (%.1f sekunder).",
        f"{count - 1:,}", f"{inserted:,}", f"{invalid:,}", elapsed,
    )


if __name__ == "__main__":
    main()