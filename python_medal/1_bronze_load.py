"""
1_bronze_load.py

BRONZE LAYER
Reads the raw src/data/DEVICE2024.txt file and loads it, UNFILTERED,
into the bronze_reports table in Supabase.

Rules for Bronze:
    - Nothing is dropped, corrected, or deduplicated here.
    - Every row from the source file is kept, even junk rows
      (missing product code, "UNKNOWN" manufacturer, duplicate
      report keys). Silver is responsible for cleaning.
    - Metadata columns (_inserted_at, _source_file) are added for
      traceability, but the content itself is untouched.
    - Append-only: re-running this script for a new source file
      adds new rows, it does not overwrite existing Bronze data.
"""

import os
import time

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SOURCE_FILE = "src/data/DEVICE2024.txt"
BATCH_SIZE = 1000
SUPABASE_URL = "https://kgoxvplsaceqdvorqsle.supabase.co"

service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
if not service_role_key:
    raise SystemExit("❌ Fel: SUPABASE_SERVICE_ROLE_KEY saknas i din .env-fil!")

supabase = create_client(SUPABASE_URL, service_role_key)


def insert_batch(rows: list[dict]) -> int:
    """Insert a batch into bronze_reports. Returns rows inserted."""
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

            # Bronze --> keep everything including empty/junk values.
            buffer.append({
                "report_key": get(col_idx["reportKey"]),
                "product_code_raw": get(col_idx["productCode"]),
                "brand_name_raw": get(col_idx["brandName"]),
                "generic_name_raw": get(col_idx["genericName"]),
                "manufacturer_raw": get(col_idx["manufacturerRaw"]),
                "_source_file": SOURCE_FILE,
            })

            count += 1

            if len(buffer) >= BATCH_SIZE:
                inserted += insert_batch(buffer)
                buffer = []
                if inserted % 50000 < BATCH_SIZE:
                    print(f"  ✅ [BRONZE] Skrev {inserted:,} rader totalt (läst: {count:,})")

        # flush remainder
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