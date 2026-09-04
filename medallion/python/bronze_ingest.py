"""
bronze_ingest.py

Author: Malena
Created: 2026-08-02
Description: Reads from a source text file and writes to the Supabase
bronze_reports table. 
"""

import os # Operating systems library for file path operations with functions
import time
import logging
from typing import Optional, Iterator

from dotenv import load_dotenv
from pydantic import ValidationError

from config import (
    SOURCE_FILE,
    WRITE_BATCH_SIZE,
    MAX_RETRIES,
    RETRY_BACKOFF_SECONDS,
    MAX_ROWS_LIMIT,
    REQUIRED_HEADERS, # 
)
from models import BronzeRow
from supabase_client import get_supabase_client

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


# ============================================================
# HELPER FUNCTIONS — each does one thing, testable in isolation
# ============================================================

def find_source_file(source_file: str) -> str: 

    """Finds the source file whether you run from the root or python subdir

    This function searches for the file in two locations:
        1. The current directory (relative path)
        2. The medallion/ directory (absolute path)
    
    Args:
        source_file(str): The name of the source file.

    Returns:
        str: The path to the source file
            Example: "data/DEVICE2024.txt" or "medallion/data/DEVICE2024.txt"
    
    Example:
        >>> find_source_file("data/DEVICE2024.txt") # Running from medallion/python/
        'data/DEVICE2024.txt'
    
        >>> find_source_file("data/DEVICE2024.txt") # Running from medallion/ (project root)
        'medallion/data/DEVICE2024.txt'

    Raises: 
        SystemExit: If file not found 
        
    Notes:
        - This function uses os.path.exists() to check if the file exists
        - The function works on Windows, Mac, and Linux    
    """
    if os.path.exists(source_file):
        return source_file
    if os.path.exists(f"medallion/{source_file}"): # f = StringBuiler in Java
        return f"medallion/{source_file}"
    raise SystemExit(f"Error: source file not found at {source_file}")

# ============================================================

def read_source_lines(path: str) -> Iterator[tuple[int, str]]:

    r"""Reads the raw file line by line and streams it with a number.
    
    This is a generator function that is memory effcient since it reads one line at a time,
    since reading the whole file at once can crash for large files. 

    The expected source file format is pipe-separated ("|") with newlines (\n) & 
    the first line is typically the header:

        MDR_REPORT_KEY|DEVICE_REPORT_PRODUCT_CODE|BRAND_NAME|GENERIC_NAME|MANUFACTURER_D_NAME\n 
        12345|ABC|Servo Air|Ventilator|Getinge\n 
        12346|DEF|Tube Flow|Ventilator|Medtronic Inc\n 
    
    Args: 
        path (str): The path to the source file.

    Yields:
        tuple[int, str]: A tuple containing the 0-indexed line number (int) 
            and the cleaned line content (str).
    
    Examples:
        >>> for line_num, line in read_source_lines("data/DEVICE2024.txt"):
        ...     print(f"{line_num}: {line}")                                                     
        (0: "MDR_REPORT_KEY|DEVICE_REPORT_PRODUCT_CODE|BRAND_NAME|GENERIC_NAME|MANUFACTURER_D_NAME") # OUTPUT: First iteration
        (1: "12345|ABC|Servo Air|Ventilator|Getinge") # Second iteration
        (2: "12346|DEF|Tube Flow|Ventilator|Medtronic Inc") # Third iteration
        ...
    
    Notes:
        - The function uses open() with encoding="utf-8" and errors="replace" to replace invalid characters with �
        - The function uses enumerate() to give each line a number starting from 0.
        - The function uses rstrip("\n") to remove the newline character from each line.
    
    Trade-offs:
            * Memory vs. Speed: This function is highly memory-efficient 
              because it streams data, but it may be slower than reading the 
              entire file into memory at once for small to medium files.
            * Indexing: Line numbers are 0-indexed and include empty lines, 
              which preserves exact file geometry but requires manual filtering 
              if blank lines should be ignored.
        
    """
    with open(path, encoding="utf-8", errors="replace") as f: # Strange letters are replaced with �
        for line_num, line in enumerate(f): #enumerate gives each line a nr
            yield line_num, line.rstrip("\n")  # rstrip("\n") removes each "\n"

# ============================================================

def parse_column_index(headers: list[str]) -> dict[str, int]:

    """Maps column names to their position.
    
    Args:
        headers (list[str]): The list of column names.
    
    Returns:
        dict[str, int]: Column name → position mapping.
    
    Example:
        >>> headers = ["MDR_REPORT_KEY", "DEVICE_REPORT_PRODUCT_CODE", "BRAND_NAME"]
        >>> parse_column_index(headers)
        {'reportKey': 0, 'productCode': 1, 'brandName': 2}
        
        >>> headers = ["BRAND_NAME", "GENERIC_NAME"]  # Missing columns
        >>> parse_column_index(headers)
        {'reportKey': -1, 'productCode': -1, 'brandName': 0, 'genericName': 1}
    """

    return {
        key: headers.index(source_col) if source_col in headers else -1
        for key, source_col in REQUIRED_HEADERS.items()
    }


# ============================================================

def build_raw_row(fields: list[str], col_idx: dict[str, int], source_file: str) -> dict:
    """Builds the raw row dict for a single data line, ready for BronzeRow validation."""
    return {
        "report_key": get_field(col_idx["reportKey"], fields),
        "product_code_raw": get_field(col_idx["productCode"], fields),
        "brand_name_raw": get_field(col_idx["brandName"], fields),
        "generic_name_raw": get_field(col_idx["genericName"], fields),
        "manufacturer_raw": get_field(col_idx["manufacturerRaw"], fields),
        "_source_file": source_file,
    }


# ============================================================
def get_field(idx: int, fields: list[str]) -> Optional[str]:

    """Extracts and trims one field from a pipe-split line.
    
    Args:
        idx (int): The position of the field.
        fields (list[str]): The list of fields.
    
    Returns:
        Optional[str]: The trimmed field, or None.
    
    Example:
        >>> get_field(1, ["12345", "ABC", "SomeBrand"])
        'ABC'
        
        >>> get_field(5, ["12345", "ABC"])
        None
        
        >>> get_field(0, ["  padded  "])
        'padded'
    """

    if idx < 0 or idx >= len(fields):
        return None
    val = fields[idx].strip()
    return val or None

# ============================================================

def validate_batch_before_upload(batch: list[dict]) -> None:
  
    """Validates a batch before upload.
    
    Args:
        batch (list[dict]): The batch to validate.
    
    Returns:
        None
    
    Raises:
        ValueError: If validation fails.
    
    Example:
        >>> batch = [
        ...     {"report_key": "A1", "_source_file": "file.txt"},
        ...     {"report_key": "A2", "_source_file": "file.txt"}
        ... ]
        >>> validate_batch_before_upload(batch)  # No error - passes!
        
        >>> batch = [
        ...     {"report_key": "A1", "_source_file": None},
        ...     {"report_key": "A2", "_source_file": "file.txt"}
        ... ]
        >>> validate_batch_before_upload(batch)
        ValueError: Rows missing _source_file at batch positions: [0]
    """
    missing_source = [i for i, row in enumerate(batch) if not row.get("_source_file")]
    if missing_source:
        raise ValueError(f"Rows missing _source_file at batch positions: {missing_source}")

    seen: set[str] = set()
    duplicates: set[str] = set()
    for row in batch:
        key = row.get("report_key")
        if key is None:
            continue
        if key in seen:
            duplicates.add(key)
        seen.add(key)

    if duplicates:
        raise ValueError(f"Duplicate report_key values within batch: {duplicates}")

# ============================================================

def retry_with_backoff(func, max_retries: int = MAX_RETRIES, backoff_seconds: int = RETRY_BACKOFF_SECONDS):
    """Runs func() with exponential backoff retry. Returns func()'s
    result, or None if every attempt fails."""
    attempt = 0
    while attempt < max_retries:
        try:
            return func()
        except Exception as exc:  # noqa: BLE001
            attempt += 1
            if attempt >= max_retries:
                logger.error("Operation failed after %s attempts: %s", max_retries, exc)
                return None
            wait = backoff_seconds * (2 ** (attempt - 1))
            logger.warning("Attempt %s/%s failed, retrying in %ss: %s", attempt, max_retries, wait, exc)
            time.sleep(wait)
    return None

# ============================================================

def flush_if_full(buffer: list[dict], batch_size: int, upload_fn) -> tuple[list[dict], int]:
    """If buffer has reached batch_size: validates and uploads it,
    returns (empty buffer, rows uploaded). Otherwise: (buffer, 0)."""
    if len(buffer) < batch_size:
        return buffer, 0
    validate_batch_before_upload(buffer)
    uploaded = upload_fn(buffer)
    return [], uploaded

# ============================================================

def log_ingestion_summary(count: int, inserted: int, invalid: int, elapsed: float) -> None:
    logger.info(
        "BRONZE DONE — %s rows read, %s saved, %s invalid skipped (%.1fs).",
        f"{count - 1:,}", f"{inserted:,}", f"{invalid:,}", elapsed,
    )
# ============================================================


def upload_single_batch(batch: list[dict], supabase) -> int:
    """Writes exactly one batch to Supabase, with retry + exponential backoff."""
    def _do_insert():
        supabase.table("bronze_reports").insert(batch).execute()
        return len(batch)

    result = retry_with_backoff(_do_insert)
    return result if result is not None else 0


# ============================================================
# MAIN — orchestrates the functions 
# ============================================================
def main() -> None:
    # STEP 1 — Connect to Supabase
    supabase = get_supabase_client()

    logger.info("[BRONZE] Reading raw data from %s...", SOURCE_FILE)
    logger.info("[BRONZE] Row limit: %s (protects Supabase storage)", MAX_ROWS_LIMIT)

    col_idx: dict[str, int] = {} 
    buffer: list[dict] = []
    count = 0
    inserted = 0
    invalid = 0
    start = time.time()

    # STEP 2 — Find the source file, put it in df_raw
    df_raw = find_source_file(SOURCE_FILE)

    # STEP 3 — Read line and process each into a ROW 
    for line_num, line in read_source_lines(df_raw):

        # STEP 3.1 — Split the header line into list of cols
        if line_num == 0:                                  # Find the line with headers
            headers = [h.strip() for h in line.split("|")] # Remove whitespaces before || after "|", replace "|" with ","
            col_idx = parse_column_index(headers)          # Call parse_column_index() to map header to index positions for each col
            count += 1  # Count header and continue
            continue

        # STEP 3.2 — Build a row dict from the raw line
        fields = line.split("|")
        raw_row = build_raw_row(fields, col_idx, df_raw ) # Build ROWS 

        # STEP 3.3 — Validate row shape, buffer if valid
        try:
            validated = BronzeRow(**raw_row)
            buffer.append(validated.model_dump(by_alias=True))
        except ValidationError as exc:
            invalid += 1
            logger.warning("[BRONZE] Invalid row %s skipped: %s", line_num, exc)

        count += 1

        # STEP 3.4 — Flush to Supabase once the buffer is full
        buffer, uploaded = flush_if_full(
            buffer, WRITE_BATCH_SIZE, lambda b: upload_single_batch(b, supabase)
        )
        inserted += uploaded
        if uploaded:
            logger.info("[BRONZE] Wrote %s rows total (read: %s)", f"{inserted:,}", f"{count:,}")

        # STEP 3.5 — Stop once the safety row limit is reached
        if inserted >= MAX_ROWS_LIMIT:
            logger.info("[BRONZE] Reached %s rows. Stopping ingestion to protect free-tier storage.", MAX_ROWS_LIMIT)
            break

    # STEP 4 — Flush whatever's left in the buffer
    if buffer and inserted < MAX_ROWS_LIMIT:
        validate_batch_before_upload(buffer)
        inserted += upload_single_batch(buffer, supabase)

    # STEP 5 — Log final summary
    elapsed = time.time() - start
    log_ingestion_summary(count, inserted, invalid, elapsed)


if __name__ == "__main__":
    main()