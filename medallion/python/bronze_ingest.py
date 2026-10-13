"""medallion/python/bronze_ingest.py

Loads the raw FDA MAUDE device file into bronze_reports using COPY.
Rules implemented: B1-B6 (see PIPELINE.md).

Usage, from the repo root:
    python medallion/python/bronze_ingest.py [--file PATH] [--limit N]

Environment (medallion/.env):
    LOCAL_DATABASE_URL   Postgres connection string of the local database.

The whole load runs in ONE transaction: it either completes or leaves
bronze_reports untouched. A second run is detected and adds nothing (B6).
"""

from __future__ import annotations

import argparse
import csv
import logging
import os
import sys
import time
from collections.abc import Iterable, Iterator
from dataclasses import dataclass
from pathlib import Path
from typing import Protocol

import pandas as pd
import psycopg
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

# ===================================== CONFIGURATION =====================================
DEFAULT_SOURCE_FILE = Path(__file__).resolve().parents[1] / "data" / "DEVICE2024.txt"
SOURCE_FILE_LABEL = "DEVICE2024.txt"   # B5: stored in the source_file column
CHUNK_SIZE = 50_000                    # rows per COPY statement
LOG_EVERY_N_CHUNKS = 5

# B2: only these raw columns are kept. Raw FDA column name -> bronze_reports column name
COLUMN_MAP = {
    "MDR_REPORT_KEY":              "report_key",
    "DEVICE_SEQUENCE_NO":          "device_sequence_no",
    "GENERIC_NAME":                "generic_name",
    "DEVICE_REPORT_PRODUCT_CODE":  "product_code_raw",
    "MANUFACTURER_D_NAME":         "manufacturer_raw",
}
BRONZE_COLUMNS = (*COLUMN_MAP.values(), "source_file", "source_row_num")
COPY_SQL = f"COPY bronze_reports ({', '.join(BRONZE_COLUMNS)}) FROM STDIN"

BronzeRow = tuple  # values in BRONZE_COLUMNS order

logger = logging.getLogger("bronze_ingest")


# ===================================== TYPES =====================================
@dataclass
class IngestStats:
    """Numbers reported at the end of a run (observability)."""
    rows_loaded: int = 0
    chunks: int = 0
    skipped_lines: int = 0
    seconds: float = 0.0
    already_loaded: bool = False


class BronzeRepository(Protocol):
    """The only two things ingest needs from the database."""

    def count_rows(self, source_file: str) -> int: ...

    def append(self, rows: Iterable[BronzeRow]) -> None: ...


class PostgresBronzeRepository:
    """Real repository: reads and appends through one psycopg connection."""

    def __init__(self, conn: psycopg.Connection) -> None:
        self._conn = conn

    def count_rows(self, source_file: str) -> int:
        with self._conn.cursor() as cur:
            cur.execute(
                "SELECT COUNT(*) FROM bronze_reports WHERE source_file = %s",
                (source_file,),
            )
            return cur.fetchone()[0]

    def append(self, rows: Iterable[BronzeRow]) -> None:
        with self._conn.cursor() as cur, cur.copy(COPY_SQL) as copy:
            for row in rows:
                copy.write_row(row)


# ===================================== PARSING (no database needed) =====================================
def _require_columns(chunk: pd.DataFrame) -> None:
    """B2: fail loudly if the source header changed, instead of loading NULLs."""
    missing = [col for col in COLUMN_MAP if col not in chunk.columns]
    if missing:
        raise ValueError(f"Source file is missing expected columns: {missing}")


def _to_rows(chunk: pd.DataFrame, first_row_num: int) -> list[BronzeRow]:
    """Select the B2 columns, turn empty values into None, add B5 metadata."""
    frame = chunk[list(COLUMN_MAP)].rename(columns=COLUMN_MAP)
    frame = frame.astype(object).where(frame.notna(), None)  # empty -> NULL, never imputed
    records = frame.itertuples(index=False, name=None)
    return [
        (*record, SOURCE_FILE_LABEL, row_num)
        for row_num, record in enumerate(records, start=first_row_num)
    ]


def read_rows(
    source_file: Path,
    stats: IngestStats,
    *,
    chunk_size: int = CHUNK_SIZE,
    limit: int | None = None,
) -> Iterator[list[BronzeRow]]:
    """Yield the file as chunks of bronze rows. Counts malformed lines in stats (B3)."""

    def count_bad_line(_fields: list[str]) -> None:
        stats.skipped_lines += 1
        return None  # None = skip the line

    emitted = 0
    with pd.read_csv(
        source_file,
        sep="|",                      # B1: pipe-delimited
        encoding="latin-1",           # B1: wrong encoding corrupts names
        quoting=csv.QUOTE_NONE,       # B1: do not interpret quotes
        dtype=str,                    # B4: everything as text
        keep_default_na=False,        # B4: "N/A", "NA", "NONE" are junk VALUES, not NULL
        na_values=[""],               # only an empty field is missing
        on_bad_lines=count_bad_line,  # B3: count skipped lines
        engine="python",              # required for a callable on_bad_lines
        chunksize=chunk_size,
    ) as reader:
        for chunk in reader:
            _require_columns(chunk)
            if limit is not None:
                chunk = chunk.iloc[: limit - emitted]
            if chunk.empty:
                break
            rows = _to_rows(chunk, first_row_num=emitted + 1)  # B6: stable row numbers
            emitted += len(rows)
            yield rows
            if limit is not None and emitted >= limit:
                break


# ===================================== INGEST =====================================
def ingest(
    source_file: str | Path,
    repo: BronzeRepository,
    *,
    limit: int | None = None,
    chunk_size: int = CHUNK_SIZE,
) -> IngestStats:
    """Append the source file to bronze. Returns what happened."""
    stats = IngestStats()
    started = time.perf_counter()

    existing = repo.count_rows(SOURCE_FILE_LABEL)
    if existing:  # B6: a rerun adds nothing
        stats.already_loaded = True
        logger.warning(
            "B6: %s is already loaded (%s rows). Nothing added.",
            SOURCE_FILE_LABEL, f"{existing:,}",
        )
        return stats

    for chunk_no, rows in enumerate(
        read_rows(Path(source_file), stats, chunk_size=chunk_size, limit=limit),
        start=1,
    ):
        repo.append(rows)
        stats.rows_loaded += len(rows)
        stats.chunks = chunk_no
        if chunk_no % LOG_EVERY_N_CHUNKS == 0:
            elapsed = time.perf_counter() - started
            logger.info(
                "progress rows=%s skipped=%s rows_per_s=%s",
                f"{stats.rows_loaded:,}", stats.skipped_lines,
                f"{stats.rows_loaded / elapsed:,.0f}",
            )

    stats.seconds = time.perf_counter() - started
    logger.info("Skipped (malformed) lines: %s", f"{stats.skipped_lines:,}")
    logger.info(
        "BRONZE DONE: %s rows in %s chunks, %.1fs",
        f"{stats.rows_loaded:,}", stats.chunks, stats.seconds,
    )
    return stats


# ===================================== MAIN =====================================
def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Load the MAUDE device file into bronze_reports.")
    parser.add_argument("--file", type=Path, default=DEFAULT_SOURCE_FILE, help="path to DEVICE2024.txt")
    parser.add_argument("--limit", type=int, default=None, help="load only the first N rows (trial runs)")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%H:%M:%S",
    )
    args = parse_args(argv)

    db_url = os.environ.get("LOCAL_DATABASE_URL")
    if not db_url:
        logger.error("LOCAL_DATABASE_URL is missing (set it in medallion/.env)")
        return 2
    if not args.file.exists():
        logger.error("Source file not found: %s", args.file)
        return 2

    try:
        # Leaving the with-block commits; an exception rolls everything back.
        with psycopg.connect(db_url) as conn:
            ingest(args.file, PostgresBronzeRepository(conn), limit=args.limit)
    except Exception:
        logger.exception("Ingest failed. Transaction rolled back, bronze_reports unchanged.")
        return 1

    logger.info("Next: medallion/scripts/db_run.sh <database-url>")
    return 0


if __name__ == "__main__":
    sys.exit(main())