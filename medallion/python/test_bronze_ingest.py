"""medallion/python/test_bronze_ingest.py

Tests for bronze_ingest.py. No database needed: a fake Supabase client
stores rows in memory and enforces UNIQUE (source_file, source_row_num).

Run: cd medallion/python && pytest -v
Naming: test_<RULE ID>_<what it checks>, so rules can be traced to tests.
"""
import logging

import pytest

import bronze_ingest

# Test file: 5 data lines.
#   line 1: Swedish characters in a name         (B1)
#   line 2: key with leading zeros               (B4)
#   line 3: empty generic_name                   (B2/B4: stays NULL)
#   line 4: too many fields = malformed          (B3: counted, skipped)
#   line 5: normal row
# The extra column EXTRA is not in COLUMN_MAP    (B2: must not be stored)
HEADER = ("MDR_REPORT_KEY|DEVICE_SEQUENCE_NO|GENERIC_NAME|"
          "DEVICE_REPORT_PRODUCT_CODE|MANUFACTURER_D_NAME|EXTRA")
LINES = [
    "1|1|PUMP|DZE|ÅKERBLOM AB|x",
    "00123|1|CATHETER|QBJ|MEDTRONIC, INC.|y",
    "3|1||FRN|NI|z",
    "4|1|A|B|C|D|E|F",
    "5|1|VALVE|LGW|ABBOTT|w",
]
GOOD_ROWS = 4
BAD_ROWS = 1


class FakeSupabase:
    """Minimal stand-in for the Supabase client (upsert with ignore_duplicates)."""

    def __init__(self):
        self.rows = {}  # (source_file, source_row_num) -> record

    def table(self, name):
        assert name == "bronze_reports"
        return self

    def upsert(self, records, on_conflict, ignore_duplicates):
        assert on_conflict == "source_file,source_row_num"
        assert ignore_duplicates is True
        self._records = records
        return self

    def execute(self):
        for r in self._records:
            self.rows.setdefault((r["source_file"], r["source_row_num"]), r)


@pytest.fixture
def source_file(tmp_path):
    path = tmp_path / "DEVICE_TEST.txt"
    path.write_bytes(("\n".join([HEADER] + LINES) + "\n").encode("latin-1"))
    return str(path)


@pytest.fixture(autouse=True)
def small_batches(monkeypatch):
    # Batch size 2 forces several chunks, so row numbering across chunks is tested.
    monkeypatch.setattr(bronze_ingest, "BATCH_SIZE", 2)
    monkeypatch.setattr(bronze_ingest, "DEV_SAMPLE_LIMIT", None)


@pytest.fixture
def loaded(source_file):
    client = FakeSupabase()
    bronze_ingest.ingest(source_file, client)
    return client


def by_key(client, report_key):
    return next(r for r in client.rows.values() if r["report_key"] == report_key)


def test_B1_latin1_names(loaded):
    assert by_key(loaded, "1")["manufacturer_raw"] == "ÅKERBLOM AB"


def test_B2_only_mapped_columns_are_stored(loaded):
    expected = set(bronze_ingest.COLUMN_MAP.values()) | {"source_file", "source_row_num"}
    for row in loaded.rows.values():
        assert set(row.keys()) == expected


def test_B2_empty_value_stays_null(loaded):
    assert by_key(loaded, "3")["generic_name"] is None  # not imputed, not ""


def test_B3_every_parsed_row_is_kept(loaded):
    assert len(loaded.rows) == GOOD_ROWS


def test_B3_bad_lines_are_counted_and_logged(source_file, caplog):
    with caplog.at_level(logging.INFO):
        bronze_ingest.ingest(source_file, FakeSupabase())
    assert f"Skipped (malformed) lines: {BAD_ROWS}" in caplog.text


def test_B4_all_text(loaded):
    assert by_key(loaded, "00123")["report_key"] == "00123"  # zeros kept, not 123
    for row in loaded.rows.values():
        for column in bronze_ingest.COLUMN_MAP.values():
            assert row[column] is None or isinstance(row[column], str)


def test_B5_metadata_and_row_numbers(loaded):
    assert {r["source_file"] for r in loaded.rows.values()} == {bronze_ingest.SOURCE_FILE_LABEL}
    numbers = sorted(r["source_row_num"] for r in loaded.rows.values())
    assert numbers == list(range(1, GOOD_ROWS + 1))  # 1..4, no gaps, across chunks


def test_B6_double_run_same_count(source_file):
    client = FakeSupabase()
    bronze_ingest.ingest(source_file, client)
    first = len(client.rows)
    bronze_ingest.ingest(source_file, client)
    assert len(client.rows) == first == GOOD_ROWS