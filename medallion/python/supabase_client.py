# supabase_client.py

"""
supabase_client.py

Creates the Supabase client from .env credentials. Kept separate from
bronze_ingest.py so connection setup isn't tangled with ingestion logic,
and so other scripts (future ingestion pipelines, ad-hoc queries) can
reuse the same connection function.
"""

import os
from supabase import create_client, Client


def get_supabase_client() -> Client:
    supabase_url = os.environ.get("SUPABASE_URL")
    service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url:
        raise SystemExit("Error: SUPABASE_URL is missing from your .env file")
    if not service_role_key:
        raise SystemExit("Error: SUPABASE_SERVICE_ROLE_KEY is missing from your .env file")

    return create_client(supabase_url, service_role_key)