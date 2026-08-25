"""
3_silver_to_gold.py - GOLD LAYER


Mål: Läser renad data från silver_reports, aggregerar till
product_stats och manufacturer_stats.

Input:  silver_reports
Output: product_stats, manufacturer_stats (till Supabase/Postgres)
"""

from collections import Counter, defaultdict

from db import get_supabase_client
from batch_writer import upload_in_batches
from pagination import fetch_all_paginated
from timing import timed_run
from pipeline_logging import get_logger

logger = get_logger(__name__)
supabase = get_supabase_client()


def main() -> None:
    logger.info("[GOLD] Läser Silver-data och aggregerar...")

    product_info: dict[str, dict] = defaultdict(lambda: {
        "count": 0, "brands": Counter(), "generics": Counter(), "manufacturers": Counter(),
    })
    manufacturer_totals: Counter = Counter()

    def process_page(page: list[dict]) -> None:
        for row in page:
            info = product_info[row["product_code"]]
            info["count"] += 1
            if row["brand_name"]:
                info["brands"][row["brand_name"]] += 1
            if row["generic_name"]:
                info["generics"][row["generic_name"]] += 1
            if row["manufacturer_name"]:
                info["manufacturers"][row["manufacturer_name"]] += 1
                manufacturer_totals[row["manufacturer_name"]] += 1

    with timed_run("GOLD"):
        total_read = fetch_all_paginated(
            supabase, "silver_reports",
            "product_code, brand_name, generic_name, manufacturer_name",
            on_page=process_page,
        )

        all_products = []
        for code, info in product_info.items():
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

        all_manufacturers = [{"name": name, "count": count} for name, count in manufacturer_totals.items()]

        upload_in_batches(supabase, "product_stats", all_products, on_conflict="product_code")
        upload_in_batches(supabase, "manufacturer_stats", all_manufacturers, on_conflict="name")

    logger.info("GOLD KLAR — %s produkter, %s tillverkare aggregerade (från %s rader).",
                f"{len(all_products):,}", f"{len(all_manufacturers):,}", f"{total_read:,}")


if __name__ == "__main__":
    main()