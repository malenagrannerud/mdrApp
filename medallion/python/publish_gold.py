"""medallion/python/publish_gold.py

Publishes the Gold layer from the local Postgres to Supabase.
The dashboard only reads Gold, so only Gold leaves the local database.

Gate GKD: nothing is published unless every verify_pipeline() check passed.
All-or-nothing: one transaction on Supabase. Row counts and sums are
reconciled against the local database BEFORE the commit.

Usage, from the repo root:
    python medallion/python/publish_gold.py

Environment (medallion/.env):
    LOCAL_DATABASE_URL   local Postgres (source)
    SUPABASE_DB_URL      Supabase SESSION POOLER connection string (target)
"""

from __future__ import annotations

import logging
import os
import sys
import time
from pathlib import Path

import psycopg
from dotenv import load_dotenv
from psycopg import sql

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

# Tables the dashboard reads. Same DDL on both sides (01_create_tables.sql).
GOLD_TABLES = ("product_stats", "manufacturer_stats", "product_code_dim", "pipeline_runs")
# Tables where a sum is also reconciled, not just the row count.
SUM_COLUMNS = {"product_stats": "total_reports", "manufacturer_stats": "total_reports"}

logger = logging.getLogger("publish_gold")


class PublishError(RuntimeError):
    """Publishing must stop. The Supabase transaction is rolled back."""


def read_checks(conn: psycopg.Connection) -> list[tuple]:
    """Run verify_pipeline() locally. Rows: (check_id, description, passed, detail)."""
    with conn.cursor() as cur:
        cur.execute(
            "SELECT check_id, description, passed, detail FROM verify_pipeline() ORDER BY check_id"
        )
        return cur.fetchall()


def totals(conn: psycopg.Connection, table: str) -> tuple[int, int]:
    """(row count, sum of the reconciled column or 0)."""
    column = SUM_COLUMNS.get(table)
    total = (
        sql.SQL("COALESCE(SUM({}), 0)").format(sql.Identifier(column))
        if column else sql.SQL("0")
    )
    query = sql.SQL("SELECT COUNT(*), {} FROM {}").format(total, sql.Identifier(table))
    with conn.cursor() as cur:
        cur.execute(query)
        count, total_sum = cur.fetchone()
    return count, int(total_sum)


def copy_table(src: psycopg.Connection, dst: psycopg.Connection, table: str) -> None:
    """Replace the contents of `table` on dst with the contents on src."""
    name = sql.Identifier(table)
    with dst.cursor() as dst_cur, src.cursor() as src_cur:
        dst_cur.execute(sql.SQL("DELETE FROM {}").format(name))
        with src_cur.copy(sql.SQL("COPY {} TO STDOUT").format(name)) as out, \
             dst_cur.copy(sql.SQL("COPY {} FROM STDIN").format(name)) as inp:
            for block in out:
                inp.write(block)


def replace_quality_checks(dst: psycopg.Connection, checks: list[tuple]) -> None:
    """Snapshot of verify_pipeline() shown on the dashboard."""
    with dst.cursor() as cur:
        cur.execute("DELETE FROM quality_checks")
        cur.executemany(
            "INSERT INTO quality_checks (check_id, description, passed, detail) "
            "VALUES (%s, %s, %s, %s)",
            checks,
        )


def publish(local_url: str, remote_url: str) -> None:
    started = time.perf_counter()
    # Leaving the with-block commits; an exception rolls back both connections.
    with psycopg.connect(local_url) as src, psycopg.connect(remote_url) as dst:
        checks = read_checks(src)
        failed = [f"{cid}: {detail}" for cid, _desc, passed, detail in checks if not passed]
        if failed:
            raise PublishError(f"GKD: verify_pipeline has failed checks: {failed}")
        logger.info("GKD passed: %s of %s checks", len(checks), len(checks))

        for table in GOLD_TABLES:
            expected = totals(src, table)
            if table in SUM_COLUMNS and expected[0] == 0:
                raise PublishError(f"{table} is empty locally. Run the pipeline first.")
            copy_table(src, dst, table)
            actual = totals(dst, table)
            if actual != expected:
                raise PublishError(f"{table}: local={expected} supabase={actual}")
            logger.info("published table=%s rows=%s sum=%s", table, f"{actual[0]:,}", f"{actual[1]:,}")

        replace_quality_checks(dst, checks)

    logger.info("PUBLISH DONE in %.1fs", time.perf_counter() - started)


def main() -> int:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%H:%M:%S",
    )
    local_url = os.environ.get("LOCAL_DATABASE_URL")
    remote_url = os.environ.get("SUPABASE_DB_URL")
    if not local_url or not remote_url:
        logger.error("LOCAL_DATABASE_URL and SUPABASE_DB_URL must be set (medallion/.env)")
        return 2

    try:
        publish(local_url, remote_url)
    except PublishError as error:
        logger.error("Not published: %s", error)
        return 1
    except Exception:
        logger.exception("Publish failed. Supabase unchanged.")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())