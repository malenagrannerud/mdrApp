
"""

supabase_client.py
Author: Malena
Date: 2026-09-04
Description: Creates the Supabase client 

"""

import os
from supabase import create_client, Client


def get_supabase_client() -> Client:
    """Initializes and returns a Supabase client using environment variables.

    Returns:
        Client: An authenticated Supabase client instance.

    Raises:
        SystemExit: If either SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY 
            is missing from the environment variables.
    """
    supabase_url = os.environ.get("SUPABASE_URL")
    service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url:
        raise SystemExit("Error: SUPABASE_URL is missing from your .env file")
    if not service_role_key:
        raise SystemExit("Error: SUPABASE_SERVICE_ROLE_KEY is missing from your .env file")

    return create_client(supabase_url, service_role_key)