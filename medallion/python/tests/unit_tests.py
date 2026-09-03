"""
unit_tests.py

Author: Malena
Created: 2026-08-02
Description: Unit tests for functions in in the python package. 
Since get_supabase_client() now lives in its own file and is only
called inside main() (never at import time), importing bronze_ingest.py
is fully safe here — no network connection, no real credentials needed.

bash '''
cd medallion/python
pytest tests/unit_tests.py -v
'''

"""
import sys
from pathlib import Path

import pytest
from pydantic import ValidationError

sys.path.insert(0, str(Path(__file__).parent.parent))

from models import BronzeRow
from config import REQUIRED_HEADERS
from bronze_ingest import (
    get_field,
    parse_column_index,
    build_raw_row,
    validate_batch_before_upload,
)


# ============================================================
# GROUP 1 - BronzeRow shape validation (models.py)
# ============================================================

def test_bronze_row_accepts_fully_populated_row():
    row = BronzeRow(
        report_key="12345",
        product_code_raw="ABC",
        brand_name_raw="Some Brand",
        generic_name_raw="Some Generic Device",
        manufacturer_raw="Acme Inc",
        _source_file="DEVICE2024.txt",
    )
    assert row.report_key == "12345"


def test_bronze_row_accepts_missing_optional_fields():
    row = BronzeRow(report_key=None, product_code_raw=None, _source_file="DEVICE2024.txt")
    assert row.product_code_raw is None


def test_bronze_row_rejects_missing_source_file():
    with pytest.raises(ValidationError):
        BronzeRow(report_key="12345")


def test_bronze_row_does_not_reject_junk_manufacturer_values():
    row = BronzeRow(manufacturer_raw="UNKNOWN", _source_file="DEVICE2024.txt")
    assert row.manufacturer_raw == "UNKNOWN"


# ============================================================
# GROUP 2 - get_field() (bronze_ingest.py)
# ============================================================

def test_get_field_returns_value_for_valid_index():
    assert get_field(1, ["a", "b", "c"]) == "b"


def test_get_field_returns_none_for_out_of_range_index():
    assert get_field(10, ["a", "b"]) is None


def test_get_field_returns_none_for_negative_index():
    assert get_field(-1, ["a", "b"]) is None


def test_get_field_strips_whitespace():
    assert get_field(0, ["  padded value  "]) == "padded value"


def test_get_field_returns_none_for_empty_string_after_strip():
    assert get_field(0, ["   "]) is None


# ============================================================
# GROUP 3 - parse_column_index() / schema drift detection
# (bronze_ingest.py, using REQUIRED_HEADERS from config.py)
# ============================================================

def test_parse_column_index_maps_all_present_headers():
    headers = ["MDR_REPORT_KEY", "DEVICE_REPORT_PRODUCT_CODE", "BRAND_NAME", "GENERIC_NAME", "MANUFACTURER_D_NAME"]
    idx = parse_column_index(headers)
    assert idx["reportKey"] == 0
    assert idx["productCode"] == 1
    assert idx["manufacturerRaw"] == 4


def test_parse_column_index_returns_minus_one_for_missing_column():
    # Simulates schema drift: a column the pipeline depends on is gone.
    headers = ["MDR_REPORT_KEY", "BRAND_NAME", "GENERIC_NAME", "MANUFACTURER_D_NAME"]  # product code missing
    idx = parse_column_index(headers)
    assert idx["productCode"] == -1


def test_parse_column_index_covers_all_required_headers():
    headers = list(REQUIRED_HEADERS.values())
    idx = parse_column_index(headers)
    assert all(v != -1 for v in idx.values())


# ============================================================
# GROUP 4 - build_raw_row() (bronze_ingest.py)
# ============================================================

def test_build_raw_row_assembles_correct_dict():
    headers = ["MDR_REPORT_KEY", "DEVICE_REPORT_PRODUCT_CODE", "BRAND_NAME", "GENERIC_NAME", "MANUFACTURER_D_NAME"]
    col_idx = parse_column_index(headers)
    fields = ["1001", "ABC", "SomeBrand", "SomeDevice", "Acme Inc"]

    row = build_raw_row(fields, col_idx, "DEVICE2024.txt")

    assert row["report_key"] == "1001"
    assert row["product_code_raw"] == "ABC"
    assert row["_source_file"] == "DEVICE2024.txt"


def test_build_raw_row_handles_missing_column_gracefully():
    headers = ["MDR_REPORT_KEY", "BRAND_NAME", "GENERIC_NAME", "MANUFACTURER_D_NAME"]  # no product code
    col_idx = parse_column_index(headers)
    fields = ["1001", "SomeBrand", "SomeDevice", "Acme Inc"]

    row = build_raw_row(fields, col_idx, "DEVICE2024.txt")

    assert row["product_code_raw"] is None  # missing column -> None, not a crash


# ============================================================
# GROUP 5 - validate_batch_before_upload() (bronze_ingest.py)
# Pre-SQL check: unique + not null
# ============================================================

def _row(report_key=None, source_file="DEVICE2024.txt"):
    return {"report_key": report_key, "_source_file": source_file}


def test_validate_batch_passes_for_clean_batch():
    batch = [_row("A1"), _row("A2"), _row("A3")]
    validate_batch_before_upload(batch)


def test_validate_batch_passes_when_report_key_is_none():
    batch = [_row(None), _row(None), _row("A1")]
    validate_batch_before_upload(batch)


def test_validate_batch_rejects_missing_source_file():
    batch = [_row("A1"), _row("A2", source_file=None)]
    with pytest.raises(ValueError, match="_source_file"):
        validate_batch_before_upload(batch)


def test_validate_batch_rejects_duplicate_report_key():
    batch = [_row("A1"), _row("A2"), _row("A1")]
    with pytest.raises(ValueError, match="Duplicate report_key"):
        validate_batch_before_upload(batch)