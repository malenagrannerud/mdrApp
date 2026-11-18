"""medallion/python/bronze_ingest.py

Loads any text file into bronze_reports, line by line, exactly as it is in the file.

Rules (PIPELINE.md):
| B1 | No data changed. The archive is immutable | `test_bronze_ingest.py` |
| B2 | Data is saved in original format | `test_bronze_ingest.py` |
| B3 | Each row has a timestamp | `test_bronze_ingest.py` |

Usage:
    python medallion/python/bronze_ingest.py FILE[=ROWS] [FILE[=ROWS] ...] [--limit ROWS]
      FILE=ROWS     load the header and the first ROWS data rows of that file (default: all)
      --limit N     the same number of data rows for every file that has no =ROWS
      --encoding    override the detected text encoding
    A rerun adds nothing. A rerun with a higher ROWS adds only the new lines.

Table bronze_reports (one row per line of a file):
    source_file text, row_num bigint, raw text, ingested_at timestamptz
    primary key (source_file, row_num)

Design choices
- A line is stored as one text value, character for character. Nothing is split, trimmed,
  renamed or converted, so any file works whatever its delimiter, quotes or column names.
  Splitting a line into fields is interpretation, and that is done in silver.
- row_num is the line number in the file. The header is line 1 and is stored like any other
  line. Blank lines are stored as empty lines.
- Only the line terminator (\\n, \\r\\n or \\r) is left out: it separates rows and is not data.
- (source_file, row_num) is the key. Files never collide, and a rerun is harmless: existing
  rows are skipped (ignore_duplicates), never overwritten. That is B1.
- The text is decoded to store it as text. Encoding is detected: BOM -> utf-8 / utf-16, then
  utf-8, then Windows-1252, and last Latin-1, which accepts every byte. This costs one extra
  read of the file. Use --encoding if the detection is wrong.

Limits
- A line with a NUL character cannot be stored in a Postgres text column; the load stops
  with an error.
- On any error the load stops. Lines loaded before it stay (the archive is append-only);
  fix the cause and rerun.

  RUN: python medallion/python/bronze_ingest.py medallion/data/DEVICE2024.txt=1000
"""

import argparse
import codecs
import logging
import os
import re
import time
from datetime import datetime, timezone
from itertools import islice
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

TABLE = "bronze_reports"
CONFLICT_COLUMNS = "source_file,row_num"
BATCH_SIZE = 1000            # lines per upload
LOG_EVERY_BATCHES = 50       # progress line every 50 000 lines
READ_CHUNK = 1 << 20         # characters read at a time when checking the encoding (1 Mi)
LINE_END = re.compile(r"(\r\n|\n|\r)$")

logger = logging.getLogger("bronze_ingest")


# ===================================== READING =====================================
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
                while f.read(READ_CHUNK):  # read it all: a bad byte may be anywhere
                    pass
            return encoding
        except UnicodeDecodeError:
            pass
    return "latin-1"


def read_lines(path: str, encoding: str, limit: int | None = None):
    """Yields (line number, line text) for the header and the first `limit` data rows (all if None)."""
    with open(path, encoding=encoding, newline="") as f:  # newline="": no line-ending conversion
        for line_number, line in enumerate(f, start=1):
            if limit is not None and line_number > limit + 1:  # line 1 is the header
                break
            yield line_number, LINE_END.sub("", line)


# ===================================== INGEST =====================================
def build_rows(lines: list[tuple[int, str]], source_name: str) -> list[dict]:
    """One bronze row per line: file, line number, the line as it is, timestamp."""
    stamp = datetime.now(timezone.utc).isoformat()  # B3: every row has a timestamp
    return [
        {"source_file": source_name, "row_num": number, "raw": text, "ingested_at": stamp}
        for number, text in lines
    ]


def ingest(path: str, client: Client, encoding: str | None = None, limit: int | None = None) -> int:
    """Loads the header and the first `limit` data rows of a file (all if None) into bronze_reports.

    Returns the number of lines read.
    """
    started = time.monotonic()
    encoding = encoding or find_encoding(path)
    lines = read_lines(path, encoding, limit)
    name, done, batch_num = Path(path).name, 0, 0

    try:
        while batch := list(islice(lines, BATCH_SIZE)):
            batch_num += 1
            # B1: existing rows are skipped, never overwritten, so a rerun adds nothing
            client.table(TABLE).upsert(
                build_rows(batch, name), on_conflict=CONFLICT_COLUMNS, ignore_duplicates=True
            ).execute()
            done += len(batch)
            if batch_num % LOG_EVERY_BATCHES == 0:
                logger.info("%s: %s lines", name, f"{done:,}")
    except Exception:
        # Lines loaded before the error stay (the archive is append-only); a rerun continues safely.
        logger.exception("%s: load stopped after %s lines", name, f"{done:,}")
        raise

    seconds = time.monotonic() - started
    logger.info("%s: done, %s lines in %.1f s (%s lines/s)",
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
    parser.add_argument("--limit", type=int, help="data rows to load from each file without =ROWS")
    parser.add_argument("--encoding", help="text encoding (default: detected)")
    args = parser.parse_args(argv)

    logging.basicConfig(level=logging.INFO, datefmt="%H:%M:%S",
                        format="%(asctime)s [%(levelname)s] %(message)s")

    targets = [split_arg(arg, args.limit) for arg in args.files]
    for path, _ in targets:
        if not os.path.exists(path):
            raise SystemExit(f"Error: source file not found at {path}")

    client = get_client()
    for path, rows in targets:
        ingest(path, client, args.encoding, rows)


if __name__ == "__main__":
    main()