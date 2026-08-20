"""
3_silver_to_gold.py - GOLD LAYER

Mål: Läser renad data från silver_reports, aggregerar till
product_stats och manufacturer_stats.

Input: silver_reports
Output: product_stats, manufacturer_stats (till Supabase/Postgres)
"""

from db import get_supabase_client
from batch_writer import upload_in_batches
from pagination import fetch_all_paginated
from timing import timed_run
from pipeline_logging import get_logger
from cleaning import is_invalid_value, normalize_manufacturer, merge_known_duplicates, clean_text_field

logger = get_logger(__name__)
supabase = get_supabase_client()


def main() -> None:
    logger.info("[SILVER] Läser rådata från bronze_reports och rensar...")

    seen_keys: set[str] = set()
    silver_rows: list[dict] = []
    stats = {"no_product_code": 0, "bad_manufacturer": 0, "duplicate": 0}

    def process_page(page: list[dict]) -> None:
        for row in page:
            if not row["product_code_raw"]:
                stats["no_product_code"] += 1
                continue
            if is_invalid_value(row["manufacturer_raw"]):
                stats["bad_manufacturer"] += 1
                continue
            if row["report_key"] in seen_keys:
                stats["duplicate"] += 1
                continue
            seen_keys.add(row["report_key"])

            silver_rows.append({
                "report_key": row["report_key"],
                "product_code": row["product_code_raw"],
                "brand_name": clean_text_field(row["brand_name_raw"]),
                "generic_name": clean_text_field(row["generic_name_raw"]),
                "manufacturer_name": merge_known_duplicates(normalize_manufacturer(row["manufacturer_raw"])) or None,
            })

    with timed_run("SILVER"):
        total_read = fetch_all_paginated(
            supabase, "bronze_reports",
            "report_key, product_code_raw, brand_name_raw, generic_name_raw, manufacturer_raw",
            on_page=process_page,
        )

        logger.info("Skriver %s rensade rader till silver_reports...", f"{len(silver_rows):,}")
        upload_in_batches(supabase, "silver_reports", silver_rows, on_conflict="report_key")

    pct = (len(silver_rows) / total_read * 100) if total_read else 0
    logger.info("SILVER KLAR — %s lästa, %s borttagna (kod: %s, tillverkare: %s, dubblett: %s), %s kvar (%.1f%%).",
                f"{total_read:,}", f"{sum(stats.values()):,}",
                stats["no_product_code"], stats["bad_manufacturer"], stats["duplicate"],
                f"{len(silver_rows):,}", pct)


if __name__ == "__main__":
    main()