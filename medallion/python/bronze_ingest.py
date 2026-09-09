"""medallion/python/bronze_ingest.py

Author: Malena
Created: 2026-08-02
Description: Reads data from a source text file and writes to the Supabase bronze_reports table. All components consolidated into one file.

"""

import os           # Operating systems library for file path operations with functions
import time
import logging

from typing import Any, Optional, Iterator
from importlib import import_module
from dotenv import load_dotenv
from pydantic import BaseModel, ConfigDict, Field, ValidationError

load_dotenv()

# ===================================== CONFIGURATION =====================================
SOURCE_FILE = "data/DEVICE2024.txt"
WRITE_BATCH_SIZE = 1000     # Nr of rows buffered before writing to Supabase in one batch
MAX_RETRIES = 3             # Max nr of attempts to write to Supabase before giving up
RETRY_BACKOFF_SECONDS = 2   # Initial wait time that doubles on each retry: 2s, 4s, 8s
MAX_ROWS_LIMIT = 20000      # Keeps free-tier Supabase (500MB) from filling up

HEADER_DICTIONARY = {                           # Maps FDA column names to internal names
    "reportKey": "MDR_REPORT_KEY",              # ID number for each report
    "productCode": "DEVICE_REPORT_PRODUCT_CODE",  # Letter code for device type. EX: CBK = Ventilator, FPA = Catheter, MDS = Infusion pump, LZW = Pacemaker
    "brandName": "BRAND_NAME",                  # Commerial name of the device. EX: "Servo Air"
    "genericName": "GENERIC_NAME",              # Clinical name. EX: "Ventilator"
    "manufacturerRaw": "MANUFACTURER_D_NAME",   # Name of manufacturer as reported. EX: "Getinge", "Medtronic Inc" etc
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
    r"""Initializes and returns a Supabase client using environment variables service_role_key and url.

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
        3. If nothing founf, throws an error

    Args:
        source_file (str): The name of the source file.

    Returns:
            str: The path to the source file

    Raises: 
        SystemExit: If file not found in either location
    """

    if os.path.exists(source_file):
        return source_file
    if os.path.exists(f"medallion/{source_file}"): # f = f-string in Python
        return f"medallion/{source_file}"
    raise SystemExit(f"Error: source file not found at {source_file}")

# ============================================================
def read_source_lines(path: str) -> Iterator[tuple[int, str]]:
    r"""Reads the raw file line by line, removes newline and streams it with a number

    This function: 
        1. Opens the file. with closes the file safely
        2. Numerates the rows after each other
        3. Streams out the data

    Args: 
        path (str): 
            The path to the source file.

    Yields:
        tuple[int,str]: A tuple of [nr, content] for each line.

    Notes:
        - Trade-offs:
            * This streaming may be slower than reading the entire file at once for small/medium files.
            * Line numbers are 0-indexed and include empty lines, which preserves exact file geometry but requires 
              manual filtering if blank lines should be ignored.
    """

    with open(path, encoding="utf-8", errors="replace") as f:  # Opens file with UTF-8 encoding & replaces invalid characters with �
        for line_num, line in enumerate(f):    
            yield line_num, line.rstrip("\n")  

# ============================================================
def get_column_index(headers: list[str]) -> dict[str, int]:
    r"""Takes the header row & returns a dictionary mapping internal names to column positions

    This function: 
        1. Goes trough columns in HEADER_DICTIONARY   
        2. Finds where that column is located in the sorce file (its index number).
        3. If the column is not found in the file, it sets the index to -1.
    
    Args:
        headers (list[str]): A list of the column names from the source file.
    
    Returns:
        dict[str, int]: A dictionary mapping internal column names to their position in the source file.
    
    Examples:
        >>> headers = ["MDR_REPORT_KEY", "DEVICE_REPORT_PRODUCT_CODE", "BRAND_NAME", "GENERIC_NAME", "MANUFACTURER_D_NAME"] # Input: Header line from the source file.
        >>> get_column_index(headers) # Output: Internal name mapped to column position
        {
            'reportKey': 0,        # "MDR_REPORT_KEY" found at position 0
            'productCode': 1,      # "DEVICE_REPORT_PRODUCT_CODE" found at position 1
            'brandName': 2,        # "BRAND_NAME" found at position 2
            'genericName': 3,      # "GENERIC_NAME" found at position 3
            'manufacturerRaw': 4,  # "MANUFACTURER_D_NAME" found at position 4
        }
    
    """
    return {
        key: headers.index(source_col) if source_col in headers else -1
        for key, source_col in HEADER_DICTIONARY.items()
    }

# ============================================================
class BronzeRow(BaseModel):
    r"""This class defines the schema (form) of each row to be saved in bronze_table

    This class inherits from Pydantics BaseModel to use automated data validation. 
    Each field is Optional[str] (can be str or None) except source_file which is required.

    Args: 
        report_key (Optional[str] = None)
        product_code_raw (Optional[str] = None)
        brand_name_raw (Optional[str] = None)
        generic_name_raw (Optional[str] = None)
        manufacturer_raw (Optional[str] = None)
        source_file (str)

    Examples:
        When an object is created 
            >>> raw_row = {
            ...    "report_key": "124",
            ...    "product_code_raw": "CBK",
            ...    "brand_name_raw": "Servo Air",
            ...    "generic_name_raw": None,           # None OK
            ...    "manufacturer_raw": "Getinge",
            ...    "source_file": "data/DEVICE2024.txt"
            ... }
            >>> validated = BronzeRow(**raw_row)  # Validerar att allt matchar schemat
            >>> print(validated.report_key)
            '124'
    Notes:
        - Optional[str] is used because FDA data may have empty fields (missing columns).
        - source_file is NOT Optional because you always want to know which file the data came from.
        - Bronze layer validates shape only; content rules (e.g. rejecting "UNKNOWN" as manufacturer) belong to Silver.
    """

    model_config = ConfigDict(populate_by_name=True)
    report_key: Optional[str] = None
    product_code_raw: Optional[str] = None
    brand_name_raw: Optional[str] = None
    generic_name_raw: Optional[str] = None
    manufacturer_raw: Optional[str] = None
    source_file: str

# ============================================================
def build_raw_row(fields: list[str], col_idx: dict[str, int], source_file: str) -> dict:
    r"""Builds a dictionary for a single data line, ready for BronzeRow validation.
    
    Takes a line split by "|" and uses the column index mapping to extract each value
    into a dictionary with internal field names. Missing columns map to None.

    Args:
        fields (list[str]): The line split by "|" into individual field values.
        col_idx (dict[str, int]): Maps internal names to column positions in the file.
            Missing columns have value -1.
        source_file (str): Path to the source file, added to every row for traceability.

    Returns:
        dict: A dictionary with internal field names as keys and extracted values as values.
            Keys: report_key, product_code_raw, brand_name_raw, generic_name_raw,
            manufacturer_raw, source_file.

    Examples:
        >>> fields = ["12345", "CBK", "Servo Air", "Ventilator", "Getinge"]
        >>> col_idx = {"reportKey": 0, "productCode": 1, "brandName": 2,
        ...            "genericName": 3, "manufacturerRaw": 4}
        >>> build_raw_row(fields, col_idx, "data/DEVICE2024.txt")
        {'report_key': '12345', 'product_code_raw': 'CBK', 'brand_name_raw': 'Servo Air',
         'generic_name_raw': 'Ventilator', 'manufacturer_raw': 'Getinge',
         'source_file': 'data/DEVICE2024.txt'}

    Notes:
        - Implementation: Uses get_field() to extract and trim each value.
        - Trade-offs:
            * If a column is missing (col_idx value is -1), get_field() returns None.
            * source_file is always populated even if all other fields are None.

    """
    return {
        "report_key": get_field(col_idx["reportKey"], fields),
        "product_code_raw": get_field(col_idx["productCode"], fields),
        "brand_name_raw": get_field(col_idx["brandName"], fields),
        "generic_name_raw": get_field(col_idx["genericName"], fields),
        "manufacturer_raw": get_field(col_idx["manufacturerRaw"], fields),
        "source_file": source_file,
    }


# ============================================================
def get_field(idx: int, fields: list[str]) -> Optional[str]:
    r"""Extracts and trims one field from a pipe-split line.
    
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
    r"""Validates a batch before upload to Supabase. 
    
    This function validates the file by testing for 
    (1) Unique report_key in each batch (alert if doubles are sent in the raw data) 
    (2) Non null source_file. Note: Rows with ``report_key=None``are allowed
    
    Args:
        batch (list[dict]): 
            The batch to validate: rows of the source file
    
    Returns:
        None
    
    Raises:
        ValueError: 
            If validation fails.
    
    Examples:
        >>> batch = [
        ...     {"report_key": "121", "source_file": "data/DEVICE2024.txt"},
        ...     {"report_key": "122", "source_file": "data/DEVICE2024.txt"}
        ... ]
        >>> validate_batch_before_upload(batch)  # PASS!
        
        >>> batch = [
        ...     {"report_key": "123", "source_file": "None"},
        ...     {"report_key": "124", "source_file": "data/DEVICE2024.txt"}
        ... ]
        >>> validate_batch_before_upload(batch)  # FAIL! ValueError: Rows missing source_file at batch positions: [0]
        """
    missing_source = [i for i, row in enumerate(batch) if not row.get("source_file")]
    if missing_source:
        raise ValueError(f"Rows missing source_file at batch positions: {missing_source}")

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
def upload_single_batch(batch: list[dict], supabase) -> int:
    r"""Writes one batch to Supabase, with retry + exponential backoff.

    Args:
        batch (list[dict]): The batch of rows to upload.
        supabase: The Supabase client instance.

    Returns:
        int: Number of rows successfully uploaded (0 if all retries failed).

    Examples:
        >>> supabase = get_supabase_client()
        >>> batch = [{"report_key": "124", "source_file": "data/DEVICE2024.txt"}]
        >>> upload_single_batch(batch, supabase)
        1

    Notes:
        - Implementation: Uses retry_with_backoff() to handle transient failures.
        - If all retries fail, returns 0 instead of crashing.
    """
    def _do_insert():
        supabase.table("bronze_reports").insert(batch).execute()
        return len(batch)

    result = retry_with_backoff(_do_insert)
    return result if result is not None else 0

# ============================================================
def retry_with_backoff(func, max_retries: int = MAX_RETRIES, backoff_seconds: int = RETRY_BACKOFF_SECONDS):
    r"""Runs func() with exponential backoff retry. Returns func()'s result, or None if every attempt fails.

    Args:
        func: The function to retry.
        max_retries (int): Maximum number of attempts. Default is MAX_RETRIES (3).
        backoff_seconds (int): Initial wait time in seconds. Doubles on each retry. Default is RETRY_BACKOFF_SECONDS (2).

    Returns:
        The result of func(), or None if all attempts fail.

    Examples:
        >>> def failing_func():
        ...     raise ValueError("Connection error")
        >>> retry_with_backoff(failing_func, max_retries=2, backoff_seconds=1)
        None

    Notes:
        - Implementation: Exponential backoff: 2s, 4s, 8s...
        - If func() succeeds, returns immediately without further retries.
    """
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
    r"""If buffer has reached batch_size: validates and uploads it, returns (empty buffer, rows uploaded). Otherwise: (buffer, 0).

    Args:
        buffer (list[dict]): The current buffer of rows.
        batch_size (int): The batch size threshold.
        upload_fn: The function to call for uploading the batch.

    Returns:
        tuple[list[dict], int]: (buffer, rows_uploaded). If buffer was flushed, returns (empty list, rows uploaded).
            If buffer not full, returns (unchanged buffer, 0).

    Examples:
        >>> buffer = [{"report_key": "1"}, {"report_key": "2"}]
        >>> buffer, uploaded = flush_if_full(buffer, 2, lambda b: len(b))
        >>> buffer
        []
        >>> uploaded
        2

    Notes:
        - If buffer is full, it is validated before upload.
        - Returns the buffer unchanged if it has not reached batch_size.
    """
    if len(buffer) < batch_size:
        return buffer, 0
    validate_batch_before_upload(buffer)
    uploaded = upload_fn(buffer)
    return [], uploaded

# ============================================================
def log_ingestion_summary(count: int, inserted: int, invalid: int, elapsed: float) -> None:
    r"""Logs final summary of the bronze ingestion run.

    Args:
        count (int): Total number of rows read (including header).
        inserted (int): Number of rows successfully inserted.
        invalid (int): Number of rows skipped due to validation errors.
        elapsed (float): Total time elapsed in seconds.

    Returns:
        None

    Examples:
        >>> log_ingestion_summary(1001, 950, 50, 12.5)
        BRONZE DONE — 1,000 rows read, 950 saved, 50 invalid skipped (12.5s).

    Notes:
        - count - 1 is logged because the header row is not a data row.
    """
    logger.info(
        "BRONZE DONE — %s rows read, %s saved, %s invalid skipped (%.1fs).",
        f"{count - 1:,}", f"{inserted:,}", f"{invalid:,}", elapsed,
    )


# ========================= MAIN — orchestrates the functions ========================
def main() -> None:

    supabase = get_supabase_client()
    logger.info("[BRONZE] Reading raw data from %s...", SOURCE_FILE)                        # Name this layer [BRONZE]
    logger.info("[BRONZE] Row limit: %s (protects Supabase free storage)", MAX_ROWS_LIMIT)

    col_idx: dict[str, int] = {} 
    buffer: list[dict] = []
    count = 0
    inserted = 0
    invalid = 0
    start = time.time()

    # STEP 2 - Find the source file, put it in df_raw
    df_raw = find_source_file(SOURCE_FILE) 

    # STEP 3 — Read line and process each into a ROW 
    for line_num, line in read_source_lines(df_raw):

        # STEP 3.1 — 
        if line_num == 0:                                  # Finds the line with headers
            headers = [h.strip() for h in line.split("|")] # Splits the header line by "|" and removes whitespaces
            col_idx = get_column_index(headers) 
            count += 1  # Count header as "read" and moves on
            continue

        # STEP 3.2 — Build a row dict from the raw line
        fields = line.split("|")
        raw_row = build_raw_row(fields, col_idx, df_raw) # Build ROWS 

        # STEP 3.3 — Validate row shape, buffer if valid
        try:
            validated = BronzeRow(**raw_row)
            buffer.append(validated.model_dump())
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
            logger.info("[BRONZE] Reached %s rows. Stopping ingestion to protect storage.", MAX_ROWS_LIMIT)
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