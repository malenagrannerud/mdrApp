
"""
db.py

Mål: Delad Supabase-anslutningslogik för ALLA.
Validerar att hemligheten finns innan den försöker ansluta --> felet blir tydligt och tidigt istället för svårtolkat auth-fel längre in i pipelinen.

Input: .env med SUPABASE_SERVICE_ROLE_KEY
Output: Färdig autentiserad Supabase-klient, används för att läsa och skriva tabeller.
"""

import os 
from dotenv import load_dotenv 
from supabase import create_client 

load_dotenv() 

SUPABASE_URL = "https://kgoxvplsaceqdvorqsle.supabase.co" 
def get_supabase_client():

    """
    Skapar en Supabase-klient med service role-nyckeln från .env.
    Avbryter körningen med felmeddelande om nyckeln saknas, hellre än att krascha längre in i skriptet med svårtolkat auth-fel.
    """

    service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not service_role_key:
        raise SystemExit("❌ Fel: SUPABASE_SERVICE_ROLE_KEY saknas i din .env-fil!")
    return create_client(SUPABASE_URL, service_role_key)