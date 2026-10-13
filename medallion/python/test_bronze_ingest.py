"""medallion/python/test_bronze_ingest.py

Tests for bronze_ingest.py. No database needed: a fake repository keeps
rows in memory.

Run from the repo root:
    cd medallion/python && pytest -v

Naming: test_<RULE ID>_<what it checks>, so rules can be traced to tests.
"""

import logging

import pytest

import bronze_ingest
from bronze_ingest import BRONZE_COLUMNS, COLUMN_MAP, SOURCE_FILE_LABEL, ingest

# Test file: 6 data lines.
#   line 1: Swedish characters in a name            (B1)
#   line 2: key with leading zeros                  (B4)
#   line 3: empty generic_name                      (B2/B4: stays NULL)
#   line 4: too many fields = malformed             (B3: counted, skipped)
#   line 5: normal row
#   line 6: manufacturer "N/A" is a junk VALUE      (B4: must NOT become NULL)
# The extra column EXTRA is not in COLUMN_MAP       (B2: must not be stored)
HEADER = ("MDR_REPORT_KEY|DEVICE_SEQUENCE_NO|GENERIC_NAME|"
          "DEVICE_REPORT_PRODUCT_CODE|MANUFACTURER_D_NAME|EXTRA")
LINES = [
    "1|1|PUMP|DZE|ÅKERBLOM AB|x",
    "00123|1|CATHETER|QBJ|MEDTRONIC, INC.|y",
    "3|1||FRN|NI|z",
    "4|1|A|B|C|D|E|F",
    "5|1|VALVE|LGW|ABBOTT|w",
    "6|1|STENT|ABC|N/A|v",
]
GOOD_ROWS = 5
BAD_ROWS = 1


class FakeRepository:
    """In-memory stand-in for the Postgres repository."""

    def __init__(self):
        self.rows = []

    def count_rows(self, source_file):
        return sum(1 for r in self.rows if r["source_file"] == source_file)

    def append(self, rows):
        self.rows.extend(dict(zip(BRONZE_COLUMNS, row)) for row in rows)


def write_source(tmp_path, header=HEADER, lines=LINES):
    path = tmp_path / "DEVICE_TEST.txt"
    path.write_bytes(("\n".join([header] + lines) + "\n").encode("latin-1"))
    return path


@pytest.fixture
def source_file(tmp_path):
    return write_source(tmp_path)


@pytest.fixture
def loaded(source_file):
    repo = FakeRepository()
    ingest(source_file, repo, chunk_size=2)  # small chunks: row numbering across chunks
    return repo


def by_key(repo, report_key):
    return next(r for r in repo.rows if r["report_key"] == report_key)


def test_B1_latin1_names(loaded):
    assert by_key(loaded, "1")["manufacturer_raw"] == "ÅKERBLOM AB"


def test_B2_only_mapped_columns_are_stored(loaded):
    expected = set(COLUMN_MAP.values()) | {"source_file", "source_row_num"}
    for row in loaded.rows:
        assert set(row) == expected


def test_B2_empty_value_stays_null(loaded):
    assert by_key(loaded, "3")["generic_name"] is None  # not imputed, not ""


def test_B2_missing_source_column_fails_loudly(tmp_path):
    path = write_source(tmp_path, header="GENERIC_NAME|EXTRA", lines=["PUMP|x"])
    with pytest.raises(ValueError, match="MDR_REPORT_KEY"):
        ingest(path, FakeRepository())


def test_B3_every_parsed_row_is_kept(loaded):
    assert len(loaded.rows) == GOOD_ROWS


def test_B3_bad_lines_are_counted_and_logged(source_file, caplog):
    with caplog.at_level(logging.INFO, logger="bronze_ingest"):
        stats = ingest(source_file, FakeRepository())
    assert stats.skipped_lines == BAD_ROWS
    assert f"Skipped (malformed) lines: {BAD_ROWS}" in caplog.text


def test_B4_all_text(loaded):
    assert by_key(loaded, "00123")["report_key"] == "00123"  # zeros kept, not 123
    for row in loaded.rows:
        for column in COLUMN_MAP.values():
            assert row[column] is None or isinstance(row[column], str)


def test_B4_junk_markers_are_not_turned_into_null(loaded):
    assert by_key(loaded, "6")["manufacturer_raw"] == "N/A"


def test_B5_metadata_and_row_numbers(loaded):
    assert {r["source_file"] for r in loaded.rows} == {SOURCE_FILE_LABEL}
    numbers = sorted(r["source_row_num"] for r in loaded.rows)
    assert numbers == list(range(1, GOOD_ROWS + 1))  # no gaps, across chunks


def test_B6_double_run_same_count(source_file):
    repo = FakeRepository()
    ingest(source_file, repo)
    first = len(repo.rows)
    second_run = ingest(source_file, repo)
    assert second_run.already_loaded is True
    assert len(repo.rows) == first == GOOD_ROWS


def test_limit_loads_exactly_n_rows(source_file):
    repo = FakeRepository()
    stats = ingest(source_file, repo, chunk_size=3, limit=2)
    assert stats.rows_loaded == len(repo.rows) == 2
    assert [r["source_row_num"] for r in repo.rows] == [1, 2]


def test_stats_report_what_happened(source_file):
    stats = ingest(source_file, FakeRepository(), chunk_size=2)
    assert stats.rows_loaded == GOOD_ROWS
    assert stats.chunks >= 2
    assert stats.seconds >= 0