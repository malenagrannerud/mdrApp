"""
tests/unit_tests.py

Author: Malena
Created: 2026-08-02
Description: Unit tests for functions in in the python package. 

bash '''
cd medallion/python
pytest tests/unit_tests.py -v
'''

"""

import os
import tempfile
from supabase import create_client, Client


from bronze_ingest import (
    find_source_file,
    read_source_lines,
    parse_column_index,
    build_raw_row,
    get_field,
    validate_batch_before_upload,
)




def get_supabase_client() -> Client:
    url = os.environ.get("SUPABASE_URL")
    service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url:
        raise SystemExit("Error: SUPABASE_URL is missing from your .env file")
    if not service_role_key:
        raise SystemExit("Error: SUPABASE_SERVICE_ROLE_KEY is missing from your .env file")
    return create_client(url, service_role_key)


def main():
    print("=" * 60)
    print("TESTING get_supabase_client")
    print("=" * 60)
    

if __name__ == "__main__":
    main()