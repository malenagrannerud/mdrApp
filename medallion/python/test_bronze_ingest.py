"""tests/test_bronze_ingest.py

Verifies only the specified rules:
- B1: No data changed. The archive is immutable.
- B2: Data is saved in original format.
- B3: Each row has a timestamp.
"""

import hashlib
from datetime import datetime
from unittest.mock import MagicMock

import pytest
from medallion.python.bronze_ingest import ingest


@pytest.fixture
def sample_raw_file(tmp_path):
    """Creates a sample file including empty fields, 'NA', leading zeros, and quotes."""
    content = (
        "MDR_REPORT_KEY|DEVICE_SEQUENCE_NO|GENERIC_NAME|DEVICE_REPORT_PRODUCT_CODE|MANUFACTURER_D_NAME|EXTRA\n"
        '0012345|01|"STENT, CORONARY"|007|ACME CORP|ignored\n'
        "|||||\n"
        "0099999|02|NA|||\n"
    )
    file_path = tmp_path / "DEVICE2024.txt"
    file_path.write_text(content, encoding="utf-8")
    return file_path


@pytest.fixture
def mock_supabase():
    """Mock Supabase client capturing all records sent to upsert."""
    client = MagicMock()
    captured = {"records": [], "kwargs": []}

    def fake_upsert(records, **kwargs):
        captured["records"].extend(records)
        captured["kwargs"].append(kwargs)
        resp = MagicMock()
        resp.execute.return_value = None
        return resp

    client.table.return_value.upsert.side_effect = fake_upsert
    return client, captured


def test_b1_no_data_changed_and_archive_is_immutable(sample_raw_file, mock_supabase):
    """RULE B1: Source file is untouched and existing archive rows cannot be overwritten."""
    client, captured = mock_supabase
    hash_before = hashlib.sha256(sample_raw_file.read_bytes()).hexdigest()

    ingest(str(sample_raw_file), client)

    hash_after = hashlib.sha256(sample_raw_file.read_bytes()).hexdigest()
    assert hash_before == hash_after
    assert captured["kwargs"][0]["ignore_duplicates"] is True
    assert captured["kwargs"][0]["on_conflict"] == "row_num"


def test_b2_data_saved_in_original_format(sample_raw_file, mock_supabase):
    """RULE B2: Raw strings, empty values, 'NA', quotes, and leading zeros are preserved."""
    client, captured = mock_supabase

    ingest(str(sample_raw_file), client)
    records = captured["records"]

    # All 3 rows are loaded, including the completely empty row
    assert len(records) == 3

    # Row 1: leading zeros and literal quotes intact
    assert records[0]["report_key"] == "0012345"
    assert records[0]["device_sequence_no"] == "01"
    assert records[0]["generic_name"] == '"STENT, CORONARY"'
    assert records[0]["product_code_raw"] == "007"
    assert records[0]["manufacturer_raw"] == "ACME CORP"

    # Row 2: completely empty row is preserved as empty strings
    assert records[1]["report_key"] == ""
    assert records[1]["device_sequence_no"] == ""
    assert records[1]["generic_name"] == ""
    assert records[1]["product_code_raw"] == ""
    assert records[1]["manufacturer_raw"] == ""

    # Row 3: literal 'NA' is not converted to NaN/None
    assert records[2]["generic_name"] == "NA"


def test_b3_each_row_has_timestamp(sample_raw_file, mock_supabase):
    """RULE B3: Every row has a valid timestamp."""
    client, captured = mock_supabase

    ingest(str(sample_raw_file), client)
    records = captured["records"]

    assert len(records) == 3
    for row in records:
        assert "ingested_at" in row
        parsed = datetime.fromisoformat(row["ingested_at"])
        assert parsed.tzinfo is not None
