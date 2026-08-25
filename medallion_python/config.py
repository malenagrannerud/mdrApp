"""
config.py

Delade konfigurationsvärden för hela pipelinen. Ett ställe att ändra
batch-storlekar eller filsökväg istället för att leta igenom tre skript.
"""

SUPABASE_URL = "https://kgoxvplsaceqdvorqsle.supabase.co"

SOURCE_FILE = "src/data/DEVICE2024.txt"

READ_PAGE_SIZE = 5000    # rader per läsning från Supabase (paginering)
WRITE_BATCH_SIZE = 1000  # rader per skrivning till Supabase (batching)