"""medallion/python/bronze_ingest.py

Loads any delimited text file into bronze_reports without changing it.

Rules (PIPELINE.md):
| B1 | No data changed. The archive is immutable | `test_bronze_ingest.py` |
| B2 | Data is saved in original format | `test_bronze_ingest.py` |
| B3 | Each row has a timestamp | `test_bronze_ingest.py` |

Usage:
    python medallion/python/bronze_ingest.py FILE[=ROWS] [FILE[=ROWS] ...] [--limit ROWS]
      FILE=ROWS          load only the first ROWS rows of that file (default: all rows)
      --limit N          the same limit for every file that has no =ROWS
      --sep, --encoding  override the automatic detection
    A rerun adds nothing. A rerun with a higher ROWS adds only the new rows.

Table bronze_reports (one row per data row of a file):
    source_file text, row_num bigint, raw jsonb, ingested_at timestamptz
    primary key (source_file, row_num)

Design choices
- The row is stored as one JSON object (column name -> text) instead of fixed columns, so any
  file can be loaded and nothing is lost because a column was not planned for. Silver decides
  which columns matter.
- (source_file, row_num) is the key, so files never collide, and a rerun is harmless:
  existing rows are skipped (ignore_duplicates), never overwritten. That is B1.
- row_num is the position among the data rows (header excluded). Blank lines are loaded as
  empty rows, so nothing in the file is dropped and row_num = line number - 1.
- Everything is read as text: no type conversion, no NA parsing (B2).
- Encoding is detected: BOM -> utf-8 / utf-16, then utf-8, then Windows-1252, and last Latin-1,
  which accepts every byte. This costs one extra read of the file.
- Delimiter is the one of | , ; tab that splits the first lines into the same number of fields.
- Quotes are normally kept as text. They are removed only where a whole field is wrapped in
  quotes and contains the delimiter, e.g. "Smith, John", to keep that field in one piece.

Limits (the load stops with an error, nothing is dropped silently)
- A line with more fields than the header stops the load. Rows loaded before it stay; fix the
  file or pass --sep / --encoding, and rerun.
- Duplicate column names stop the load: a JSON object cannot hold them unchanged.
- The quote check looks at the first SAMPLE_BYTES only. A quoted field with the delimiter
  further down makes the line too long, which stops the load as above.
"""

import argparse
import codecs
import csv
import logging
import os
import re
import time
from datetime import datetime, timezone
from itertools import islice
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

TABLE = "bronze_reports" 
CONFLICT_COLUMNS = "source_file,row_num"
BATCH_SIZE = 1000            # rows per upload
LOG_EVERY_BATCHES = 50       # progress line every 50 000 rows
DELIMITERS = "|,;\t"
SAMPLE_LINES = 50            # lines used to detect the delimiter
SAMPLE_BYTES = 1 << 20       # bytes used to detect quoted fields (1 MiB)

logger = logging.getLogger("bronze_ingest")


# ===================================== FILE DETECTION =====================================
def find_encoding(path: str) -> str:
    """UTF-8 (with or without BOM), UTF-16, Windows-1252 or Latin-1."""
    with open(path, "rb") as f:
        head = f.read(4)
    if head.startswith(codecs.BOM_UTF8):
        return "utf-8-sig"
    if head.startswith((codecs.BOM_UTF16_LE, codecs.BOM_UTF16_BE)):
        return "utf-16"
    for encoding in ("utf-8", "cp1252"):
        try:
            with open(path, encoding=encoding) as f:
                while f.read(SAMPLE_BYTES):  # read it all: a bad byte may be anywhere
                    pass
            return encoding
        except UnicodeDecodeError:
            pass
    return "latin-1"


def find_sep(path: str, encoding: str) -> str:
    """The delimiter that splits the first lines into the same number of fields."""
    with open(path, encoding=encoding) as f:
        lines = [line for line in islice(f, SAMPLE_LINES) if line.strip()]

    def score(delimiter: str) -> tuple[float, int]:
        """(share of lines with the most common delimiter count, that count)"""
        counts = [line.count(delimiter) for line in lines]
        common = max(set(counts), key=counts.count) if counts else 0
        return (counts.count(common) / len(counts), common) if common else (0.0, 0)

    best = max(DELIMITERS, key=score)
    return best if score(best)[1] else "\t"  # one-column file: any delimiter not in the text


def has_quoted_delimiter(path: str, encoding: str, sep: str) -> bool:
    """True if a whole field is wrapped in quotes AND contains the delimiter, e.g. "Smith, John"."""
    with open(path, encoding=encoding) as f:
        sample = f.read(SAMPLE_BYTES)
    d = re.escape(sep)
    return re.search(rf'(^|{d})"[^"\n]*{d}[^"\n]*"({d}|$)', sample, re.M) is not None


def check_header(path: str, encoding: str, sep: str, quoting: int) -> None:
    """Stops on duplicate column names: pandas would rename them, which changes the data (B2)."""
    with open(path, encoding=encoding) as f:
        header = next(csv.reader([f.readline()], delimiter=sep, quoting=quoting), [])
    duplicates = sorted({name for name in header if header.count(name) > 1})
    if duplicates:
        raise ValueError(f"{path}: duplicate column names {duplicates} cannot be stored unchanged")


# ===================================== INGEST =====================================
def build_rows(chunk: pd.DataFrame, source_name: str, first_row_num: int) -> list[dict]:
    """One bronze row per data row: file, position, raw text values, timestamp."""
    stamp = datetime.now(timezone.utc).isoformat()  # B3: every row has a timestamp
    return [
        {"source_file": source_name, "row_num": n, "raw": raw, "ingested_at": stamp}
        for n, raw in enumerate(chunk.to_dict("records"), start=first_row_num)
    ]


def ingest(path: str, client: Client, sep: str | None = None,
           encoding: str | None = None, limit: int | None = None) -> int:
    """Loads the first `limit` data rows of a file (all if None) into bronze_reports.

    Returns the number of rows read. Raises if the file cannot be read as a table.
    """
    started = time.monotonic()
    encoding = encoding or find_encoding(path)
    sep = sep or find_sep(path, encoding)
    quoting = csv.QUOTE_MINIMAL if has_quoted_delimiter(path, encoding, sep) else csv.QUOTE_NONE
    check_header(path, encoding, sep, quoting)

    # B2: all values stay raw text. dtype=str and keep_default_na=False stop type conversion and
    # NA parsing; skip_blank_lines=False keeps blank lines as empty rows.
    reader = pd.read_csv(path, sep=sep, quoting=quoting, dtype=str, keep_default_na=False,
                         skip_blank_lines=False, encoding=encoding, nrows=limit,
                         chunksize=BATCH_SIZE)
    name, done = Path(path).name, 0

    try:
        for batch_num, chunk in enumerate(reader, start=1):
            rows = build_rows(chunk, name, done + 1)
            # B1: existing rows are skipped, never overwritten, so a rerun adds nothing
            client.table(TABLE).upsert(
                rows, on_conflict=CONFLICT_COLUMNS, ignore_duplicates=True
            ).execute()
            done += len(rows)
            if batch_num % LOG_EVERY_BATCHES == 0:
                logger.info("%s: %s rows", name, f"{done:,}")
    except Exception:
        # Rows loaded before the error stay (the archive is append-only); a rerun continues safely.
        logger.exception("%s: load stopped after %s rows", name, f"{done:,}")
        raise

    seconds = time.monotonic() - started
    logger.info("%s: done, %s rows in %.1f s (%s rows/s)",
                name, f"{done:,}", seconds, f"{done / max(seconds, 1e-9):,.0f}")
    return done


# ===================================== COMMAND LINE =====================================
def split_arg(arg: str, default_limit: int | None = None) -> tuple[str, int | None]:
    """'data/file.txt=5000' -> ('data/file.txt', 5000);  'data/file.txt' -> ('data/file.txt', default)."""
    path, _, count = arg.rpartition("=")
    if path and count.isdigit():
        return path, int(count)
    return arg, default_limit


def get_client() -> Client:
    """Supabase client built from SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."""
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url:
        raise SystemExit("Error: SUPABASE_URL is missing from your .env file")
    if not key:
        raise SystemExit("Error: SUPABASE_SERVICE_ROLE_KEY is missing from your .env file")
    return create_client(url, key)


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Load files into bronze_reports unchanged.")
    parser.add_argument("files", nargs="+", help="FILE or FILE=ROWS")
    parser.add_argument("--limit", type=int, help="rows to load from each file without =ROWS")
    parser.add_argument("--sep", help="delimiter (default: detected)")
    parser.add_argument("--encoding", help="text encoding (default: detected)")
    args = parser.parse_args(argv)

    logging.basicConfig(level=logging.INFO, datefmt="%H:%M:%S",
                        format="%(asctime)s [%(levelname)s] %(message)s")

    targets = [split_arg(arg, args.limit) for arg in args.files]
    for path, _ in targets:
        if not os.path.exists(path):
            raise SystemExit(f"Error: source file not found at {path}")

    sep = args.sep.replace("\\t", "\t") if args.sep else None  # allow --sep '\t'
    client = get_client()
    for path, rows in targets:
        ingest(path, client, sep, args.encoding, rows)


if __name__ == "__main__":
    main()