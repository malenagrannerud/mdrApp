"""
pagination.py

Delad logik för att läsa en hel Supabase-tabell sida för sida, utan att
hämta allt i minnet på en gång. Används av Silver (läser Bronze) och
Gold (läser Silver) — båda hade tidigare identisk while-loop-kod.
"""

from typing import Callable
from config import READ_PAGE_SIZE


def fetch_all_paginated(supabase, table_name: str, columns: str,
                          page_size: int = READ_PAGE_SIZE,
                          on_page: Callable[[list[dict]], None] | None = None) -> int:
    """
    Läser hela table_name i sidor om page_size rader.

    on_page anropas med varje sida av rader, så anroparen kan processa
    datan direkt istället för att hålla hela tabellen i minnet samtidigt.

    Returnerar totalt antal lästa rader.
    """
    total_read = 0
    offset = 0
    while True:
        response = (
            supabase.table(table_name)
            .select(columns)
            .range(offset, offset + page_size - 1)
            .execute()
        )
        page = response.data
        if not page:
            break

        total_read += len(page)
        if on_page:
            on_page(page)

        offset += page_size
        if len(page) < page_size:
            break

    return total_read