"""medallion/python/bronze_ingest.py

Author: Malena
Updated: 2026-09-30
Description: Reads the raw FDA MAUDE file and appends it to the Supabase
             bronze_reports table. Adds source_file to every row.

WHY: Bronze keeps data exactly as it arrived. No cleaning happens here.
     Bad rows are still loaded (silver quarantines them with a reason).
     Only rows that cannot be parsed at all are skipped, and they are counted.
"""

import os
import time
import logging

from typing import Any, Optional, Iterator
from importlib import import_module

from pathlib import Path
from dotenv import load_dotenv
from pydantic import BaseModel, ConfigDict, Field, ValidationError

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

# ===================================== CONFIGURATION =====================================
SOURCE_FILE = "data/DEVICE2024.txt"
WRITE_BATCH_SIZE = 1000     # rows buffered before one write to Supabase
MAX_RETRIES = 3             # attempts per batch before giving up
RETRY_BACKOFF_SECONDS = 2   # wait doubles each retry: 2s, 4s, 8s
DEV_SAMPLE_LIMIT = 20000    # keeps the free Supabase tier (500 MB) from filling up.
                            # The full file has ~2.6 M rows. Set to None for all rows.

HEADER_DICTIONARY = {
    "reportKey":       "MDR_REPORT_KEY",
    "deviceEventKey":  "DEVICE_EVENT_KEY",
    "genericName":     "GENERIC_NAME",
    "productCode":     "DEVICE_REPORT_PRODUCT_CODE",
    "manufacturerRaw": "MANUFACTURER_D_NAME",
}

# ===================================== LOGGING SETUP =====================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


# ===================================== SUPABASE CLIENT =====================================
def get_supabase_client() -> Any:
    """Returns a Supabase client built from SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.

    WHY the service role key? Bronze is locked by RLS, so only the pipeline
    (not the public dashboard key) may write to it.

    Raises:
        SystemExit: if a variable is missing or the supabase package is not installed.
    """
    url = os.environ.get("SUPABASE_URL")
    service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url:
        raise SystemExit("Error: SUPABASE_URL is missing from your .env file")
    if not service_role_key:
        raise SystemExit("Error: SUPABASE_SERVICE_ROLE_KEY is missing from your .env file")
    try:
        supabase = import_module("supabase")
    except ImportError as exc:
        raise SystemExit(
            "Error: the 'supabase' package is required; install it with 'pip install supabase'"
        ) from exc
    return supabase.create_client(url, service_role_key)


# ============================================================
# HELPER FUNCTIONS: each does one thing and can be tested alone
# ============================================================
def find_source_file(source_file: str) -> str:
    """Finds the source file whether you run from the repo root or a subfolder."""
    if os.path.exists(source_file):
        return source_file
    if os.path.exists(f"medallion/{source_file}"):
        return f"medallion/{source_file}"
    raise SystemExit(f"Error: source file not found at {source_file}")


def read_source_lines(path: str) -> Iterator[tuple[int, str]]:
    """Streams the file line by line (never loads 2.6 M rows into memory)."""
    with open(path, encoding="utf-8", errors="replace") as f:
        for line_num, line in enumerate(f):
            yield line_num, line.rstrip("\r\n")


def build_header_mapping(headers: list[str]) -> dict[str, int]:
    """Maps internal names to column positions. -1 means 'column not in file'."""
    return {
        key: headers.index(source_col) if source_col in headers else -1
        for key, source_col in HEADER_DICTIONARY.items()
    }


class BronzeRow(BaseModel):
    """Schema of one bronze row.

    WHY aliases? The source uses camelCase keys, the database uses snake_case
    columns. Fields are filled by alias, but model_dump() returns the field
    names, which match the database columns.
    """
    model_config = ConfigDict(populate_by_name=True)
    report_key: Optional[str] = Field(default=None, alias="reportKey")
    device_event_key: Optional[str] = Field(default=None, alias="deviceEventKey")
    generic_name: Optional[str] = Field(default=None, alias="genericName")
    product_code_raw: Optional[str] = Field(default=None, alias="productCode")
    manufacturer_raw: Optional[str] = Field(default=None, alias="manufacturerRaw")
    source_file: str = Field(..., alias="source_file")


def build_raw_row(fields: list[str], col_idx: dict[str, int], source_file: str) -> dict:
    """Builds a dict for one data line. Missing or empty values become None."""

    def get_field(key: str) -> Optional[str]:
        idx = col_idx.get(key, -1)
        if idx == -1 or idx >= len(fields):
            return None
        val = fields[idx].strip()
        return val if val else None

    return {
        "reportKey": get_field("reportKey"),
        "deviceEventKey": get_field("deviceEventKey"),
        "genericName": get_field("genericName"),
        "productCode": get_field("productCode"),
        "manufacturerRaw": get_field("manufacturerRaw"),
        "source_file": source_file,
    }


def write_batch_with_retry(supabase_client: Any, batch: list[dict]) -> None:
    """Writes one batch, retrying with doubling wait time on failure."""
    backoff = RETRY_BACKOFF_SECONDS
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            supabase_client.table("bronze_reports").insert(batch).execute()
            return
        except Exception as e:
            if attempt == MAX_RETRIES:
