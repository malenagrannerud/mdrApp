"""
tests/unit_tests.py

1-Stand in /workspaces/mdrApp: bash cd medallion/python
2-Run testfile: bash  python tests/test_bronze_ingest.py
''' 
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import tempfile
from supabase import create_client, Client


from bronze_ingest import (
    get_supabase_client,
    find_source_file,
    read_source_lines,
    get_column_index,
    BronzeRow,
    build_raw_row,
    get_field,
    validate_batch_before_upload,
    upload_single_batch,
    retry_with_backoff,
    flush_if_full,
    log_ingestion_summary,
)



def main():
   
    print("\n ============= TESTING get_supabase_client =============")

def get_supabase_client() -> Client:

    # os.environ["SUPABASAE_URL"] = ""    # CASE 1: Set the environment var "url" as empty. os.environ.pop also work
    url = os.environ.get("SUPABASE_URL")

    os.environ["SUPABASE_SERVICE_ROLE_KEY"] = ""    # CASE 2: Set the environment var "service_role_key" as empty. os.environ.pop also work
    service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not url:
        raise SystemExit("Error: SUPABASE_URL is missing from your .env file")
    if not service_role_key:
        raise SystemExit("Error: SUPABASE_SERVICE_ROLE_KEY is missing from your .env file")
    return create_client(url, service_role_key)




if __name__ == "__main__":
    main()





