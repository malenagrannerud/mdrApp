"""
batch_writer.py

Delad logik för att skriva rader till Supabase i batchar.
Används av alla tre lagren, men med olika läge:
    - Bronze: ren insert (dubbletter okej, dedup sker i Silver)
    - Silver/Gold: upsert (idempotent, säkert att köra om)
"""


def upload_in_batches(supabase, table_name: str, rows: list[dict],
                       batch_size: int = 1000, on_conflict: str | None = None) -> int:
    """
    Skriver rader till en tabell i batchar om batch_size åt gången.
    Om on_conflict anges körs upsert (skriver över vid krock på den
    kolumnen), annars körs ren insert. Fångar fel per batch så att
    en trasig batch inte kraschar hela körningen — resten fortsätter.
    Returnerar antal rader som faktiskt sparades.
    """
    inserted = 0
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i + batch_size]
        try:
            query = supabase.table(table_name)
            if on_conflict:
                query.upsert(batch, on_conflict=on_conflict).execute()
            else:
                query.insert(batch).execute()
            inserted += len(batch)
        except Exception as exc:  # noqa: BLE001
            print(f"  ❌ Fel vid skrivning till {table_name}: {exc}")
    return inserted