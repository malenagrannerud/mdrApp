"""
3_silver_to_gold.py

GOLD LAYER

Mål: Läsa renad data från silver_reports och aggregera den till de
verksamhetsanpassade tabeller Dashboard.jsx faktiskt läser:
    - product_stats       (en rad per produktkod, med representativt varumärke/tillverkare)
    - manufacturer_stats  (totalt antal rapporter per tillverkare)

Input:  silver_reports (Supabase)
Output: product_stats, manufacturer_stats (Supabase)
"""

import os
import time
from collections import Counter, defaultdict

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

PAGE_SIZE = 5000
WRITE_BATCH_SIZE = 1000
SUPABASE_URL = "https://kgoxvplsaceqdvorqsle.supabase.co"

service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
if not service_role_key:
    raise SystemExit("❌ Fel: SUPABASE_SERVICE_ROLE_KEY saknas i din .env-fil!")

supabase = create_client(SUPABASE_URL, service_role_key)


def upload_in_batches(table_name: str, rows: list[dict], on_conflict: str) -> None:
    """Skriver rader batchvis till en Gold-tabell med upsert (idempotent)."""
    print(f"\n📤 Startar bulk-upload för [{table_name}] ({len(rows):,} rader)...")
    for i in range(0, len(rows), WRITE_BATCH_SIZE):
        batch = rows[i:i + WRITE_BATCH_SIZE]
        try:
            supabase.table(table_name).upsert(batch, on_conflict=on_conflict).execute()
            done = min(i + WRITE_BATCH_SIZE, len(rows))
            print(f"  ✅ [{table_name}] Skickat {done:,} rader.")
        except Exception as exc:  # noqa: BLE001
            print(f"  ❌ Fel i batch {i // WRITE_BATCH_SIZE + 1}: {exc}")


def main() -> None:
    print("🚀 [GOLD] Läser Silver-data och aggregerar...")
    start_time = time.time()

    # product_code -> { antal rapporter, samt en Counter per fält som
    # räknar hur ofta varje värde förekommit för just den produktkoden }.
    # defaultdict + lambda: slipper kolla "finns koden redan" manuellt —
    # ett nytt tomt bokförings-objekt skapas automatiskt vid första träffen.
    product_info: dict[str, dict] = defaultdict(lambda: {
        "count": 0,
        "brands": Counter(),
        "generics": Counter(),
        "manufacturers": Counter(),
    })
    # Separat räknare: totalt antal rapporter per tillverkare, oavsett
    # vilken produkt — svarar på en annan fråga än product_info gör.
    manufacturer_totals: Counter = Counter()

    total_read = 0
    offset = 0

    while True:
        response = (
            supabase.table("silver_reports")
            .select("product_code, brand_name, generic_name, manufacturer_name")
            .range(offset, offset + PAGE_SIZE - 1)
            .execute()
        )
        page = response.data
        if not page:
            break

        total_read += len(page)

        # Vi räknar båda dimensionerna (per produkt OCH per tillverkare)
        # i samma genomläsning av Silver, istället för att läsa datan
        # två gånger — en optimering som blir viktig när Silver är stor.
        for row in page:
            code = row["product_code"]
            info = product_info[code]
            info["count"] += 1

            if row["brand_name"]:
                info["brands"][row["brand_name"]] += 1
            if row["generic_name"]:
                info["generics"][row["generic_name"]] += 1
            if row["manufacturer_name"]:
                info["manufacturers"][row["manufacturer_name"]] += 1
                manufacturer_totals[row["manufacturer_name"]] += 1

        offset += PAGE_SIZE
        if len(page) < PAGE_SIZE:
            break

    print(f"  Lästa rader från Silver: {total_read:,}")

    print("\n📦 Transformerar produktdata...")
    all_products = []
    for code, info in product_info.items():
        # most_common(1): väljer det VANLIGAST förekommande värdet, inte
        # bara första bästa. Mer statistiskt robust — en enstaka felstavad
        # eller sen rapport påverkar inte vilket namn som visas i Gold.
        top_brand = info["brands"].most_common(1)
        top_generic = info["generics"].most_common(1)
        top_mfr = info["manufacturers"].most_common(1)
        all_products.append({
            "product_code": code,
            "total_reports": info["count"],
            "brand_name": top_brand[0][0] if top_brand else None,
            "generic_name": top_generic[0][0] if top_generic else None,
            "manufacturer_name": top_mfr[0][0] if top_mfr else None,
        })

    print("📦 Transformerar tillverkardata...")
    all_manufacturers = [{"name": name, "count": count} for name, count in manufacturer_totals.items()]

    upload_in_batches("product_stats", all_products, "product_code")
    upload_in_batches("manufacturer_stats", all_manufacturers, "name")

    elapsed = time.time() - start_time
    print("\n=== 📊 Gold-rapport ===")
    print(f"  Produktkoder aggregerade: {len(all_products):,}")
    print(f"  Tillverkare aggregerade:  {len(all_manufacturers):,}")
    print(f"  ⏱️  Total körtid: {elapsed:.1f} sekunder")
    print("\n🎉 GOLD KLAR. Dashboarden kan nu läsa product_stats / manufacturer_stats direkt.")


if __name__ == "__main__":
    main()