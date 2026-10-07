"""medallion/python/bronze_ingest.py

Author: Malena | Updated: 2026-10-01

Description: Reads the raw FDA MAUDE file and loads it into the Supabase bronze_reports table.
             
Rules implemented here (see PIPELINE.md):
    B1  Read file with correct format
    B2  Keep source columns as they are (deviation: only 5 stored)
    B3  Append-only, keep every parsed row, count skipped lines
    B4  Store everything as text
    B5  Add metadata (source_file, row number; inserted_at is set by the DB)
    B6  Idempotent ingest (a rerun adds nothing)

A rerun adds nothing. Raise DEV_SAMPLE_LIMIT to load more rows.

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
SOURCE_FILE_LABEL = "DEVICE2024.txt"   # B5: stored in source_file column
BATCH_SIZE = 1000                      # rows per Supabase upsert
DEV_SAMPLE_LIMIT = 20000               # rows to load; None = full file. Supabase would manage about 100 ingestions with 20 000 records 

# RULE B2: these 5 columns are kept.
# Raw FDA column name -> bronze_reports column name
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

    # RULE B3: malformed lines are counted and logged, never hidden.
    skipped = {"count": 0}

    def count_bad_line(fields):
        skipped["count"] += 1
        return None  # None = skip the line

    reader = pd.read_csv(
        source_file,
        sep="|",                          # RULE B1: pipe-delimited
        encoding="latin-1",               # RULE B1: wrong encoding corrupts names
        quoting=csv.QUOTE_NONE,           # RULE B1: do not interpret quotes
        dtype=str,                        # RULE B4: everything as text, no type conversion
        on_bad_lines=count_bad_line,      # RULE B3: count skipped lines
        engine="python",                  # required for a callable on_bad_lines
        chunksize=BATCH_SIZE,
    )

    rows_read = 0      # position in the parsed file, used as source_row_num
    total_batches = 0

    for batch_num, chunk in enumerate(reader, start=1):
        # RULE B2: keep only the columns we need (after reading, so that
        # lines with the wrong number of fields are still detected by B3)
        chunk = chunk[list(COLUMN_MAP.keys())]

        chunk = chunk.rename(columns=COLUMN_MAP)

        # RULE B5: metadata for traceability (inserted_at is set by the database)
        chunk["source_file"] = SOURCE_FILE_LABEL
        ...
        # RULE B6: row number makes each row identifiable, so a rerun is detected.
        # The database enforces UNIQUE (source_file, source_row_num).
        chunk["source_row_num"] = range(rows_read + 1, rows_read + len(chunk) + 1)

        # pandas turns None back into NaN in to_dict(), and JSON cannot hold NaN.
        # So we clean each row AFTER to_dict(). Empty values become NULL (B2/B4: no imputing).
        records = chunk.to_dict(orient="records")
        records = [
            {k: (None if pd.isna(v) else v) for k, v in row.items()}
            for row in records
        ]

        try:
            # RULE B3: only inserts, never update or delete (the DB triggers enforce this too).
            # RULE B6: rows that already exist are ignored, so a rerun adds nothing.
            supabase_client.table("bronze_reports").upsert(
                records,
                on_conflict="source_file,source_row_num",
                ignore_duplicates=True,
            ).execute()
        except Exception as e:
            logger.error(f"Batch {batch_num} failed: {e}")
            raise

        rows_read += len(records)
        total_batches += 1
        logger.info(f"Batch {batch_num} processed: {len(records):,} rows "
                    f"(total read: {rows_read:,})")

        if DEV_SAMPLE_LIMIT and rows_read >= DEV_SAMPLE_LIMIT:
            logger.info(f"DEV_SAMPLE_LIMIT reached ({DEV_SAMPLE_LIMIT:,}). Stopping.")
            break

    # RULE B3: report skipped lines
    logger.info(f"Skipped (malformed) lines: {skipped['count']:,}")
    logger.info(f"BRONZE DONE: {rows_read:,} rows read in {total_batches} batches")
    logger.info("Next: run 02_bronze.sql (gatekeeper GKB) before running Silver")




# ===================================== MAIN =====================================
if __name__ == "__main__":
    if not os.path.exists(SOURCE_FILE):
        raise SystemExit(f"Error: source file not found at {SOURCE_FILE}")

    client = get_supabase_client()
    ingest(SOURCE_FILE, client)

