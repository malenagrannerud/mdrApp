"""medallion/python/test_bronze_ingest.py

Verifies the bronze rules in PIPELINE.md:
- B1: No data changed. The archive is immutable.
- B2: Data is saved in original format.
- B3: Each row has a timestamp.
Plus how files are read: encoding, delimiter and the number of rows to load.

Run from the repo root or from medallion/python: pytest -v
"""

import hashlib
from datetime import datetime
from unittest.mock import MagicMock

import logging

import pandas as pd
import pytest
import bronze_ingest
from bronze_ingest import ingest, split_arg


@pytest.fixture
def sample_raw_file(tmp_path):
    """Pipe file with empty fields, 'NA', leading zeros, quotes and an extra column."""
    content = (
        "MDR_REPORT_KEY|DEVICE_SEQUENCE_NO|GENERIC_NAME|EXTRA\n"
        '0012345|01|"STENT, CORONARY"|x\n'
        "|||\n"
        "0099999|02|NA|\n"
    )
    path = tmp_path / "DEVICE2024.txt"
    path.write_text(content, encoding="utf-8")
    return path


@pytest.fixture
def db():
    """Fake client whose store is unique on the on_conflict columns, like bronze_reports."""
    store = {}

    def fake_upsert(rows, on_conflict, ignore_duplicates):
        cols = on_conflict.split(",")
        for row in rows:
            key = tuple(row[c] for c in cols)
            if key in store and ignore_duplicates:
                continue  # existing rows are never overwritten
            store[key] = dict(row)
        return MagicMock()

    client = MagicMock()
    client.table.return_value.upsert.side_effect = fake_upsert
    client.store = store
    return client


def raw_rows(db, name):
    return [v["raw"] for k, v in sorted(db.store.items()) if k[0] == name]


# ============================== B1 ==============================
def test_b1_source_file_is_untouched(sample_raw_file, db):
    """RULE B1: The source file is not changed by the ingest."""
    before = hashlib.sha256(sample_raw_file.read_bytes()).hexdigest()
    ingest(str(sample_raw_file), db)
    assert hashlib.sha256(sample_raw_file.read_bytes()).hexdigest() == before


def test_b1_rerun_adds_nothing_and_changes_nothing(sample_raw_file, db):
    """RULE B1: A second run leaves every stored row exactly as it was."""
    ingest(str(sample_raw_file), db)
    first = {k: dict(v) for k, v in db.store.items()}

    ingest(str(sample_raw_file), db)  # new timestamps are made, but must not be stored

    assert len(db.store) == 3
    assert db.store == first


def test_b1_second_file_is_added_without_touching_the_first(sample_raw_file, tmp_path, db):
    """RULE B1: Any other file can be loaded; its rows never collide with or overwrite existing rows."""
    other = tmp_path / "other.csv"
    other.write_text("a,b\n1,2\n", encoding="utf-8")

    ingest(str(sample_raw_file), db)
    first = {k: dict(v) for k, v in db.store.items()}
    ingest(str(other), db)

    assert len(db.store) == 4
    assert all(db.store[k] == v for k, v in first.items())
    assert db.store[("other.csv", 1)]["raw"] == {"a": "1", "b": "2"}


# ============================== B2 ==============================
def test_b2_data_saved_in_original_format(sample_raw_file, db):
    """RULE B2: Raw strings, empty values, 'NA', quotes, leading zeros and extra columns are preserved."""
    ingest(str(sample_raw_file), db)
    rows = raw_rows(db, "DEVICE2024.txt")

    assert rows[0] == {"MDR_REPORT_KEY": "0012345", "DEVICE_SEQUENCE_NO": "01",
                       "GENERIC_NAME": '"STENT, CORONARY"', "EXTRA": "x"}
    assert rows[1] == {"MDR_REPORT_KEY": "", "DEVICE_SEQUENCE_NO": "", "GENERIC_NAME": "", "EXTRA": ""}
    assert rows[2]["GENERIC_NAME"] == "NA"  # not turned into NaN/None


@pytest.mark.parametrize("encoding", ["utf-8", "utf-8-sig", "utf-16", "cp1252"])
def test_b2_any_encoding_gives_the_same_characters(tmp_path, db, encoding):
    """RULE B2: UTF-8 (with/without BOM), UTF-16 and Windows-1252 files are read without altered characters."""
    path = tmp_path / "f.txt"
    path.write_bytes("NAME|MFR\nCATHÉTER €|GMBH Ä\n".encode(encoding))

    ingest(str(path), db)

    assert raw_rows(db, "f.txt") == [{"NAME": "CATHÉTER €", "MFR": "GMBH Ä"}]


def test_b2_latin1_file_with_bytes_undefined_in_cp1252(tmp_path, db):
    """RULE B2: A file that is neither UTF-8 nor Windows-1252 is still read, byte for byte (Latin-1)."""
    path = tmp_path / "f.txt"
    path.write_bytes(b"NAME|MFR\nA\x81B|C\n")  # 0x81 is undefined in cp1252

    ingest(str(path), db)

    assert raw_rows(db, "f.txt") == [{"NAME": "A\x81B", "MFR": "C"}]


@pytest.mark.parametrize("sep", ["|", ",", ";", "\t"])
def test_b2_delimiter_is_detected(tmp_path, db, sep):
    """Delimiter detection: | , ; and tab, also when the text contains the other delimiters."""
    others = "".join(d for d in "|,;\t" if d != sep)  # the text contains every other delimiter
    path = tmp_path / "f.txt"
    path.write_text(
        sep.join(["id", "name", "note"]) + "\n"
        + sep.join(["1", "a" + others + "b", "x"]) + "\n"
        + sep.join(["2", "c", "y"]) + "\n",
        encoding="utf-8",
    )

    ingest(str(path), db)

    assert raw_rows(db, "f.txt") == [{"id": "1", "name": "a" + others + "b", "note": "x"},
                                     {"id": "2", "name": "c", "note": "y"}]


def test_b2_comma_file_with_quoted_commas_keeps_fields_together(tmp_path, db):
    """Delimiter detection: a quoted field that contains the delimiter is not split."""
    path = tmp_path / "f.csv"
    path.write_text('id,name,city\n1,"Smith, John",Oslo\n2,"Doe, Jane",Rome\n', encoding="utf-8")

    ingest(str(path), db)

    assert raw_rows(db, "f.csv") == [{"id": "1", "name": "Smith, John", "city": "Oslo"},
                                     {"id": "2", "name": "Doe, Jane", "city": "Rome"}]


def test_b2_stray_quotes_in_a_pipe_file_are_kept(tmp_path, db):
    """RULE B2: Inch marks and stray quotes in a pipe file are data, not quoting."""
    path = tmp_path / "f.txt"
    path.write_text('id|name|size\n1|5" pipe|6" cable\n', encoding="utf-8")

    ingest(str(path), db)

    assert raw_rows(db, "f.txt") == [{"id": "1", "name": '5" pipe', "size": '6" cable'}]


# ============================== B3 ==============================
def test_b3_each_row_has_timestamp(sample_raw_file, db):
    """RULE B3: Every row has a valid, timezone-aware timestamp."""
    ingest(str(sample_raw_file), db)

    assert len(db.store) == 3
    for row in db.store.values():
        assert datetime.fromisoformat(row["ingested_at"]).tzinfo is not None


# ============================== number of rows ==============================
def test_limit_loads_exactly_that_many_rows_and_a_later_higher_limit_adds_the_rest(tmp_path, db):
    """Per-file row limit: exact, and raising it later adds only the new rows (B1: old rows unchanged)."""
    path = tmp_path / "f.csv"
    path.write_text("a\n" + "\n".join(str(n) for n in range(1, 6)) + "\n", encoding="utf-8")

    assert ingest(str(path), db, limit=2) == 2
    after_two = {k: dict(v) for k, v in db.store.items()}
    assert len(db.store) == 2

    ingest(str(path), db, limit=4)

    assert len(db.store) == 4
    assert all(db.store[k] == v for k, v in after_two.items())


# ============================== nothing is dropped silently ==============================
def test_b2_blank_lines_are_kept_as_empty_rows(tmp_path, db):
    """RULE B2: Blank lines are data rows too, so row_num = line number - 1."""
    path = tmp_path / "f.txt"
    path.write_text("a|b\n1|2\n\n3|4\n", encoding="utf-8")

    ingest(str(path), db)

    assert raw_rows(db, "f.txt") == [{"a": "1", "b": "2"}, {"a": "", "b": ""}, {"a": "3", "b": "4"}]


def test_b2_duplicate_column_names_stop_the_load(tmp_path, db):
    """RULE B2: Duplicate headers cannot be stored unchanged, so the load stops before anything is stored."""
    path = tmp_path / "f.txt"
    path.write_text("a|a|b\n1|2|3\n", encoding="utf-8")

    with pytest.raises(ValueError, match="duplicate column names"):
        ingest(str(path), db)

    assert db.store == {}


def test_malformed_line_stops_the_load_and_keeps_earlier_rows(tmp_path, db, monkeypatch, caplog):
    """A line with too many fields stops the load loudly; rows loaded before it stay."""
    monkeypatch.setattr(bronze_ingest, "BATCH_SIZE", 2)
    path = tmp_path / "f.txt"
    path.write_text("a|b\n1|2\n3|4\n5|6\n7|8|9\n", encoding="utf-8")

    with caplog.at_level(logging.ERROR, logger="bronze_ingest"):
        with pytest.raises(pd.errors.ParserError):
            ingest(str(path), db)

    assert len(db.store) == 2  # the first batch was loaded
    assert "load stopped after 2 rows" in caplog.text


def test_upload_error_is_logged_with_rows_loaded_so_far(sample_raw_file, caplog):
    client = MagicMock()
    client.table.return_value.upsert.return_value.execute.side_effect = RuntimeError("network down")

    with caplog.at_level(logging.ERROR, logger="bronze_ingest"):
        with pytest.raises(RuntimeError):
            ingest(str(sample_raw_file), client)

    assert "load stopped after 0 rows" in caplog.text


# ============================== observability and command line ==============================
def test_o1_summary_logs_rows_duration_and_speed(sample_raw_file, db, caplog):
    """O1: Every file ends with rows, duration and rows per second in the log."""
    with caplog.at_level(logging.INFO, logger="bronze_ingest"):
        ingest(str(sample_raw_file), db)

    assert "DEVICE2024.txt: done, 3 rows in" in caplog.text
    assert "rows/s" in caplog.text


def test_missing_environment_variables_give_a_clear_message(monkeypatch):
    monkeypatch.delenv("SUPABASE_URL", raising=False)
    with pytest.raises(SystemExit, match="SUPABASE_URL"):
        bronze_ingest.get_client()

    monkeypatch.setenv("SUPABASE_URL", "http://localhost")
    monkeypatch.delenv("SUPABASE_SERVICE_ROLE_KEY", raising=False)
    with pytest.raises(SystemExit, match="SUPABASE_SERVICE_ROLE_KEY"):
        bronze_ingest.get_client()


def test_main_loads_each_file_with_its_own_row_count(tmp_path, db, monkeypatch):
    first, second = tmp_path / "a.csv", tmp_path / "b.csv"
    first.write_text("x\n1\n2\n3\n", encoding="utf-8")
    second.write_text("x\n1\n2\n3\n", encoding="utf-8")
    monkeypatch.setattr(bronze_ingest, "get_client", lambda: db)

    bronze_ingest.main([f"{first}=2", str(second), "--limit", "1"])

    assert len(raw_rows(db, "a.csv")) == 2  # =2 wins over --limit
    assert len(raw_rows(db, "b.csv")) == 1  # --limit applies to files without =ROWS


def test_main_stops_before_loading_anything_if_a_file_is_missing(tmp_path, db, monkeypatch):
    good = tmp_path / "a.csv"
    good.write_text("x\n1\n", encoding="utf-8")
    monkeypatch.setattr(bronze_ingest, "get_client", lambda: db)

    with pytest.raises(SystemExit, match="not found"):
        bronze_ingest.main([str(good), str(tmp_path / "missing.csv")])

    assert db.store == {}


def test_split_arg_reads_rows_per_file():
    assert split_arg("data/a.txt=5000") == ("data/a.txt", 5000)
    assert split_arg("data/a.txt", 100) == ("data/a.txt", 100)
    assert split_arg("data/a.txt") == ("data/a.txt", None)
    assert split_arg("2024") == ("2024", None)  # a bare number is a file name, not a row count