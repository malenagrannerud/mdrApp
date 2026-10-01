"""medallion/python/bronze_ingest.py

Author: Malena
Updated: 2026-10-01
Description: Reads the raw FDA MAUDE file and appends it to the Supabase
             bronze_reports table.
             - Adds source_file to every row.
             - Loads a sample (DEV_SAMPLE_LIMIT) to protect the free tier.
             - A new run adds DEV_SAMPLE_LIMIT new rows. 


WHY pandas? Replaces the manual line-by-line reader and Pydantic model.
     pandas handles parsing, column selection and NaN handling directly.
"""

import os
import csv
import logging
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv
from supabase import create_client

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

# ===================================== CONFIGURATION =====================================
SOURCE_FILE = "medallion/data/DEVICE2024.txt"
SOURCE_FILE_LABEL = "DEVICE2024.txt"   # stored in source_file column
BATCH_SIZE = 1000                      # rows per Supabase insert
DEV_SAMPLE_LIMIT = 20000               # rows to load; None = full file

# Raw FDA column name -> bronze_reports column name
COLUMN_MAP = {
    "MDR_REPORT_KEY":              "report_key",
    "DEVICE_SEQUENCE_NO":          "device_sequence_no",
    "DEVICE_EVENT_KEY":            "device_event_key",
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
    reader = pd.read_csv(
        source_file,
        sep="|",
        usecols=list(COLUMN_MAP.keys()),
        dtype=str,
        encoding="latin-1",
        quoting=csv.QUOTE_NONE,
        on_bad_lines="skip",
        chunksize=BATCH_SIZE,
    )

    total_rows = 0
    total_batches = 0

    for batch_num, chunk in enumerate(reader, start=1):
        chunk = chunk.rename(columns=COLUMN_MAP)
        chunk["source_file"] = SOURCE_FILE_LABEL

        # WHY: pandas converts None back to NaN inside to_dict() for object
        # dtype columns. httpx refuses to serialize NaN to JSON. So we clean
        # each row AFTER to_dict(), not before.
        records = chunk.to_dict(orient="records")
        records = [
            {k: (None if pd.isna(v) else v) for k, v in row.items()}
            for row in records
        ]

        try:
            supabase_client.table("bronze_reports").insert(records).execute()
        except Exception as e:
            logger.error(f"Batch {batch_num} failed: {e}")
            raise

        total_rows += len(records)
        total_batches += 1
        logger.info(f"Batch {batch_num} written: {len(records):,} rows "
                    f"(total: {total_rows:,})")

        if DEV_SAMPLE_LIMIT and total_rows >= DEV_SAMPLE_LIMIT:
            logger.info(f"DEV_SAMPLE_LIMIT reached ({DEV_SAMPLE_LIMIT:,}). Stopping.")
            break

    logger.info(f"BRONZE DONE — {total_rows:,} rows in {total_batches} batches")


# ===================================== MAIN =====================================
if __name__ == "__main__":
    if not os.path.exists(SOURCE_FILE):
        raise SystemExit(f"Error: source file not found at {SOURCE_FILE}")

    client = get_supabase_client()
    ingest(SOURCE_FILE, client)

