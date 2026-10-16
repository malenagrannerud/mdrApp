#!/usr/bin/env bash
# Runs bronze checks -> silver -> gold -> verification, after bronze_ingest.py.
# Saves every check result in quality_checks (O3), then exits 1 if any check failed.
# Usage: medallion/scripts/db_run.sh <database-url>
set -euo pipefail

DB_URL="${1:?Usage: db_run.sh <database-url>}"
SQL_DIR="$(cd "$(dirname "$0")/../sql" && pwd)"

# Large joins and sorts need memory; no timeout on a local database.
export PGOPTIONS="-c work_mem=256MB -c statement_timeout=0"

run_file() { echo "== $1"; psql "$DB_URL" -v ON_ERROR_STOP=1 -f "${SQL_DIR}/$1"; }
run_sql()  { psql "$DB_URL" -v ON_ERROR_STOP=1 -c "$1"; }

run_file 03_bronze.sql
run_sql "ANALYZE bronze_reports;"
run_file 04_silver.sql
run_file 05_gold.sql
run_file 06_pipeline.sql
run_file 07_verify_silver_gold.sql

echo "== run_pipeline()"
run_sql "SELECT * FROM run_pipeline();"

echo "== verify_pipeline() -> quality_checks (O3)"
psql "$DB_URL" -v ON_ERROR_STOP=1 -q <<'SQL'
BEGIN;
DELETE FROM quality_checks;
INSERT INTO quality_checks (check_id, description, passed, detail)
SELECT check_id, description, passed, detail FROM verify_pipeline();
COMMIT;
SQL
run_sql "SELECT check_id, passed, detail FROM quality_checks ORDER BY check_id;"

failed="$(psql "$DB_URL" -At -c "SELECT COUNT(*) FROM quality_checks WHERE NOT passed;")"
if [ "$failed" != "0" ]; then
  echo "${failed} check(s) failed. See quality_checks." >&2
  exit 1
fi
echo "ALL CHECKS PASSED"