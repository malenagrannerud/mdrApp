#!/usr/bin/env bash
# Creates roles and tables in a (local) Postgres database. Safe to rerun.
# Usage: medallion/scripts/db_setup.sh <database-url>
set -euo pipefail

DB_URL="${1:?Usage: db_setup.sh <database-url>}"
SQL_DIR="$(cd "$(dirname "$0")/../sql" && pwd)"

psql_run() { psql "$DB_URL" -v ON_ERROR_STOP=1 -q "$@"; }

# Supabase has these roles; plain Postgres does not. The GRANT/RLS lines need them.
psql_run -c "DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN CREATE ROLE anon NOLOGIN; END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'service_role') THEN CREATE ROLE service_role NOLOGIN; END IF;
END \$\$;"

for file in 01_create_tables 03a_seed_manufacturers 08_quality_checks; do
  echo "== applying ${file}.sql"
  psql_run -f "${SQL_DIR}/${file}.sql"
done
echo "SETUP DONE"