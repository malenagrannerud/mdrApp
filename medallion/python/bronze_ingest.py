"""medallion/python/bronze_ingest.py

Author: Malena | Updated: 2026-10-01

Automated pipeline to batch ingest a raw file into a scalable storage area.
Goal: To upload batches of raw data without changing the file. A timestamp is added.
OBS! Only selected columns are stored due to space restrictions.

Rules:

| B1 | No data changed. The archive is immutable | `test_bronze_ingest.py` |
| B2 | Data is saved in original format | `test_bronze_ingest.py` |
| B3 | Each row has a timestamp | `test_bronze_ingest.py` |

A rerun adds nothing. Raise DEV_SAMPLE_LIMIT to load more rows.
"""

import os
import csv
import logging
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv
from supabase import create_client

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

# ===================================== CONFIGURATION =====================================
SOURCE_FILE = "medallion/data/DEVICE2024.txt"
BATCH_SIZE = 1000
DEV_SAMPLE_LIMIT = 60000

COLUMN_MAP = {
    "MDR_REPORT_KEY":              "report_key",
    "DEVICE_SEQUENCE_NO":          "device_sequence_no",
    "GENERIC_NAME":                "generic_name",
    "DEVICE_REPORT_PRODUCT_CODE":  "product_code_raw",
    "MANUFACTURER_D_NAME":         "manufacturer_raw",
}

# ===================================== LOGGING =====================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


# ===================================== SUPABASE CLIENT =====================================
def get_supabase_client():
    """Returns a Supabase client built from SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."""
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url:
        raise SystemExit("Error: SUPABASE_URL is missing from your .env file")
    if not key:
        raise SystemExit("Error: SUPABASE_SERVICE_ROLE_KEY is missing from your .env file")
    return create_client(url, key)


# ===================================== INGEST =====================================
def ingest(source_file: str, supabase_client) -> None:
    """Streams the source file into bronze_reports in batches."""
    # RULE B2: Read raw text in original format without type conversion or NA parsing
    reader = pd.read_csv(
        source_file,
        sep="|",
        quoting=csv.QUOTE_NONE,
        dtype=str,
        keep_default_na=False,
        chunksize=BATCH_SIZE,
    )

    rows_read = 0
    total_batches = 0

    for batch_num, chunk in enumerate(reader, start=1):
        chunk = chunk[list(COLUMN_MAP.keys())].rename(columns=COLUMN_MAP)

        # Row number ensures a rerun adds nothing (even on empty/duplicate rows)
        chunk["row_num"] = range(rows_read + 1, rows_read + len(chunk) + 1)

        # RULE B3: Each row has a timestamp
        chunk["ingested_at"] = datetime.now(timezone.utc).isoformat()

        records = chunk.to_dict(orient="records")

        try:
            # RULE B1: Immutable archive — ignore duplicates so existing rows never change
            supabase_client.table("bronze_reports").upsert(
                records,
                on_conflict="row_num",
                ignore_duplicates=True,
            ).execute()
        except Exception as e:
            logger.error(f"Batch {batch_num} failed: {e}")
            raise

        rows_read += len(records)
        total_batches += 1
        logger.info(
            f"Batch {batch_num} processed: {len(records):,} rows "
            f"(total read: {rows_read:,})"
        )

        if DEV_SAMPLE_LIMIT and rows_read >= DEV_SAMPLE_LIMIT:
            logger.info(f"DEV_SAMPLE_LIMIT reached ({DEV_SAMPLE_LIMIT:,}). Stopping.")
            break
    logger.info(f"BRONZE DONE: {rows_read:,} rows read in {total_batches} batches")

# ===================================== MAIN =====================================
if __name__ == "__main__":
    if not os.path.exists(SOURCE_FILE):
        raise SystemExit(f"Error: source file not found at {SOURCE_FILE}")

    client = get_supabase_client()
    ingest(SOURCE_FILE, client)
