"""
config.py

Configuration constants for the ingestion pipeline.
Change batch size, row limits, or the required source columns here
"""

SOURCE_FILE = "data/DEVICE2024.txt"
WRITE_BATCH_SIZE = 1000
MAX_RETRIES = 3
RETRY_BACKOFF_SECONDS = 2  # doubles on each retry: 2s, 4s, 8s
MAX_ROWS_LIMIT = 20000  # keeps free-tier Supabase (500MB) from filling up

REQUIRED_HEADERS = {
    "reportKey": "MDR_REPORT_KEY",
    "productCode": "DEVICE_REPORT_PRODUCT_CODE",
    "brandName": "BRAND_NAME",
    "genericName": "GENERIC_NAME",
    "manufacturerRaw": "MANUFACTURER_D_NAME",
}