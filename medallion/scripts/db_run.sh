#!/usr/bin/env bash
# Runs bronze checks -> silver -> gold -> verification, after bronze_ingest.py.
# Fails (exit 1) if any verify_pipeline() check fails.
# Usage: medallion/scripts/db_run.sh <database-url>
set -euo pipefail

DB_URL="${1:?Usage: db_run.sh <database-url>}"
SQL_DIR="$(cd "$(dirname "$0")/../sql" && pwd)"

# Large joins and sorts need memory; no timeout on a local database.
export PGOPTIONS="-c work_mem=256MB -c statement_timeout=0"

run_file() { echo "== $1"; psql "$DB_URL" -v ON_ERROR_STOP=1 -f "${SQL_DIR}/$1"; }
run_sql()  { psql "$DB_URL" -v ON_ERROR_STOP=1 -c "$1"; }

run_file 02_bronze.sql                 # GKB: bronze checks
run_sql "ANALYZE bronze_reports;"      # fresh statistics for the big silver joins
run_file 03b_silver.sql
run_file 04_gold.sql
run_file 06_pipeline.sql
run_file 07_verify_silver_gold.sql

echo "== run_pipeline()"
run_sql "SELECT * FROM run_pipeline();"

echo "== verify_pipeline()"
run_sql "SELECT check_id, passed, detail FROM verify_pipeline();"

failed="$(psql "$DB_URL" -At -c "SELECT COUNT(*) FROM verify_pipeline() WHERE NOT passed;")"
if [ "$failed" != "0" ]; then
  echo "VERIFY FAILED: ${failed} check(s). Do not publish." >&2
  exit 1
fi
echo "ALL CHECKS PASSED"