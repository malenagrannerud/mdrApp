"""medallion/python/bronze_ingest.py

Author: Malena
Created: 2026-08-02
Updated: 2026-09-25
Description: Reads data from a source text file and writes to the Supabase bronze_reports table. Inserts a source_file column to each row. Includes GENERIC_NAME in the pipeline.

"""

import os           # Operating systems library for file path operations with functions
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
WRITE_BATCH_SIZE = 1000     # Nr of rows buffered before writing to Supabase in one batch
MAX_RETRIES = 3             # Max nr of attempts to write to Supabase before giving up
RETRY_BACKOFF_SECONDS = 2   # Initial wait time that doubles on each retry: 2s, 4s, 8s
DEV_SAMPLE_LIMIT = 20000    # Keeps free-tier Supabase (500MB) from filling up. the file has 2,6 M rows

HEADER_DICTIONARY = {
    "reportKey":      "MDR_REPORT_KEY",            
    "deviceEventKey": "DEVICE_EVENT_KEY",          # PK – unique per device event
    "genericName":    "GENERIC_NAME",              
    "productCode":    "DEVICE_REPORT_PRODUCT_CODE",
    "manufacturerRaw":"MANUFACTURER_D_NAME",
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
    r"""Initializes and returns a Supabase client using environment variables service_role_key & url.

    Returns:
        Client: An authenticated Supabase client instance.

    Raises:
        SystemExit: If SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from the environment variables.
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
            "Error: the 'supabase' package is required; install it with "
            "'pip install supabase'"
        ) from exc
    return supabase.create_client(url, service_role_key)


# ============================================================
# HELPER FUNCTIONS AND CLASSES — each does one thing, testable in isolation
# ============================================================
def find_source_file(source_file: str) -> str: 
    r"""Finds the source file whether you run from the root or python subdir

    This function: 
        1. Looks for the file in the rootmap. If file found, returns the string. 
        2. Looks in /medallion. If file found, returns medallion/file_name
        3. If nothing found, throws an error
    """
    if os.path.exists(source_file):
        return source_file
    if os.path.exists(f"medallion/{source_file}"): # f = f-string in Python
        return f"medallion/{source_file}"
    raise SystemExit(f"Error: source file not found at {source_file}")

# ============================================================
def read_source_lines(path: str) -> Iterator[tuple[int, str]]:
    r"""Reads the raw file line by line, removes newline and streams it with a number"""
    with open(path, encoding="utf-8", errors="replace") as f:  # Opens file with UTF-8 encoding & replaces invalid characters with 
        for line_num, line in enumerate(f):    
            yield line_num, line.rstrip("\n")  

# ============================================================
def build_header_mapping(headers: list[str]) -> dict[str, int]:
    r"""Takes the header row & returns a dictionary mapping internal names to column positions"""
    return {
        key: headers.index(source_col) if source_col in headers else -1
        for key, source_col in HEADER_DICTIONARY.items()
    }

# ============================================================
class BronzeRow(BaseModel):
    r"""This class defines the schema (form) of each row to be saved in bronze_table"""
    model_config = ConfigDict(populate_by_name=True)
    report_key: Optional[str] = Field(default=None, alias="reportKey")
    device_event_key: Optional[str] = Field(default=None, alias="deviceEventKey")     
    generic_name: Optional[str] = Field(default=None, alias="genericName") # LÄGG TILL: Pydantic-validering för generic_name
    product_code_raw: Optional[str] = Field(default=None, alias="productCode")
    manufacturer_raw: Optional[str] = Field(default=None, alias="manufacturerRaw")
    source_file: str = Field(..., alias="source_file")

# ============================================================
def build_raw_row(fields: list[str], col_idx: dict[str, int], source_file: str) -> dict:
    r"""Builds a dictionary for a single data line, ready for BronzeRow validation."""
    
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
        "source_file": source_file
    }

# ============================================================
def write_batch_with_retry(supabase_client: Any, batch: list[dict]) -> None:
    r"""Writes a batch of records to Supabase with exponential backoff retry logic."""
    backoff = RETRY_BACKOFF_SECONDS
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            supabase_client.table("bronze_reports").insert(batch).execute()
            return
        except Exception as e:
            if attempt == MAX_RETRIES:
                logger.error(f"Failed to write batch after {MAX_RETRIES} attempts. Error: {e}")
                raise e
            logger.warning(f"Database insert failed (attempt {attempt}/{MAX_RETRIES}). Retrying in {backoff}s... Error: {e}")
            time.sleep(backoff)
            backoff *= 2

# ===================================== MAIN EXECUTION =====================================
def main() -> None:
    logger.info("Starting Bronze Ingestion Pipeline...")
    supabase = get_supabase_client()
    source_path = find_source_file(SOURCE_FILE)
    logger.info(f"Using source file: {source_path}")
    line_stream = read_source_lines(source_path)
    
    try:                                 # Extract the header row
        _, header_line = next(line_stream)
        headers = [h.strip() for h in header_line.split("|")]
    except StopIteration:
        raise SystemExit("Error: Ingested source file is completely empty.")
        
    col_idx = build_header_mapping(headers)
    logger.info(f"Detected column indices: {col_idx}")
    
    if col_idx["deviceEventKey"] == -1 or col_idx["reportKey"] == -1:     # Verify critical mapping exists (BR1)
        raise SystemExit("Error: Missing critical mapping keys in file header.")

    batch_buffer = []
    processed_count = 0
    
    for line_num, line in line_stream:
        if processed_count >= DEV_SAMPLE_LIMIT:
            logger.info(f"Reached development limit sample of {DEV_SAMPLE_LIMIT} rows. Stopping ingestion.")
            break
            
        fields = line.split("|")
        raw_dict = build_raw_row(fields, col_idx, SOURCE_FILE)
        
        try:
            validated_row = BronzeRow(**raw_dict) # Validate using Pydantic model
            batch_buffer.append(validated_row.model_dump(by_alias=True)) # Convert to dictionary using the aliases that match database column names
            processed_count += 1
        except ValidationError as ve:
            logger.warning(f"Row {line_num} failed schema validation. Skipping. Error: {ve}")
            continue
            
        if len(batch_buffer) >= WRITE_BATCH_SIZE: # Write batch when buffer size is met
            write_batch_with_retry(supabase, batch_buffer)
            logger.info(f"Successfully ingested {processed_count} rows...")
            batch_buffer = []
             
    if batch_buffer:                             # Flush remaining records
        write_batch_with_retry(supabase, batch_buffer)
        logger.info(f"Successfully ingested final batch. Total rows: {processed_count}")
    print("BRONZE DONE")
if __name__ == "__main__":
    main()

