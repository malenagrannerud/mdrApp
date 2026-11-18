"""medallion/python/test_bronze_ingest.py

Verifies the bronze rules in PIPELINE.md:
- B1: No data changed. The archive is immutable.
- B2: Data is saved in original format.
- B3: Each row has a timestamp.
Plus the number of rows to load, the log and the command line.

Run from the repo root or from medallion/python: pytest -v
"""

import hashlib
import logging
from datetime import datetime
from unittest.mock import MagicMock

import pytest
import bronze_ingest
from bronze_ingest import ingest, split_arg


@pytest.fixture
def sample_raw_file(tmp_path):
    """Pipe file with quotes, empty fields, 'NA', leading zeros, a blank line and a repeated column name."""
    content = (
        "MDR_REPORT_KEY|GENERIC_NAME|GENERIC_NAME|EXTRA\n"
        '0012345|"STENT, CORONARY"|NA|x\n'
        "|||\n"
        "\n"
        " 0099999 |a;b,c\td|too|many|fields\n"
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


def lines(db, name):
    """The stored lines of one file, in line order."""
    return [v["raw_line"] for k, v in sorted(db.store.items()) if k[0] == name]


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

    assert len(db.store) == 5
    assert db.store == first


def test_b1_second_file_is_added_without_touching_the_first(sample_raw_file, tmp_path, db):
    """RULE B1: Any other file can be loaded; its rows never collide with or overwrite existing rows."""
    other = tmp_path / "other.csv"
    other.write_text("a,b\n1,2\n", encoding="utf-8")

    ingest(str(sample_raw_file), db)
    first = {k: dict(v) for k, v in db.store.items()}
    ingest(str(other), db)

    assert len(db.store) == 7
    assert all(db.store[k] == v for k, v in first.items())
    assert lines(db, "other.csv") == ["a,b", "1,2"]


def test_b1_a_later_higher_limit_adds_only_the_new_lines(tmp_path, db):
    """RULE B1: Raising the number of rows adds the rest and leaves the earlier rows unchanged."""
    path = tmp_path / "f.csv"
    path.write_text("a\n" + "\n".join(str(n) for n in range(1, 6)) + "\n", encoding="utf-8")

    ingest(str(path), db, limit=2)
    after_two = {k: dict(v) for k, v in db.store.items()}
    assert len(db.store) == 3  # header + 2 data rows

    ingest(str(path), db, limit=4)

    assert len(db.store) == 5
    assert all(db.store[k] == v for k, v in after_two.items())


# ============================== B2 ==============================
def test_b2_every_line_is_stored_exactly_as_it_is_in_the_file(sample_raw_file, db):
    """RULE B2: Quotes, empty fields, 'NA', leading zeros, spaces, any delimiter, blank lines,
    repeated column names and lines with too many fields are all stored character for character."""
    ingest(str(sample_raw_file), db)

    assert lines(db, "DEVICE2024.txt") == [
        "MDR_REPORT_KEY|GENERIC_NAME|GENERIC_NAME|EXTRA",
        '0012345|"STENT, CORONARY"|NA|x',
        "|||",
        "",
        " 0099999 |a;b,c\td|too|many|fields",
    ]


def test_b2_row_num_is_the_line_number_and_the_header_is_line_1(sample_raw_file, db):
    ingest(str(sample_raw_file), db)

    assert db.store[("DEVICE2024.txt", 1)]["raw_line"].startswith("MDR_REPORT_KEY")
    assert db.store[("DEVICE2024.txt", 4)]["raw_line"] == ""  # the blank line is line 4


@pytest.mark.parametrize("terminator", ["\n", "\r\n", "\r"])
def test_b2_only_the_line_terminator_is_left_out(tmp_path, db, terminator):
    """RULE B2: LF, CRLF and CR end a line; nothing else is removed."""
    path = tmp_path / "f.txt"
    path.write_bytes(f"a|b{terminator} x |y {terminator}".encode("utf-8"))

    ingest(str(path), db)

    assert lines(db, "f.txt") == ["a|b", " x |y "]


@pytest.mark.parametrize("encoding", ["utf-8", "utf-8-sig", "utf-16", "cp1252"])
def test_b2_any_encoding_gives_the_same_characters(tmp_path, db, encoding):
    """RULE B2: UTF-8 (with/without BOM), UTF-16 and Windows-1252 files are read without altered characters."""
    path = tmp_path / "f.txt"
    path.write_bytes("NAME|MFR\nCATHÉTER €|GMBH Ä\n".encode(encoding))

    ingest(str(path), db)

    assert lines(db, "f.txt") == ["NAME|MFR", "CATHÉTER €|GMBH Ä"]


def test_b2_file_that_is_neither_utf8_nor_cp1252_is_read_byte_for_byte(tmp_path, db):
    """RULE B2: Latin-1 accepts every byte, so such a file is still read without loss."""
    path = tmp_path / "f.txt"
    path.write_bytes(b"NAME|MFR\nA\x81B|C\n")  # 0x81 is undefined in cp1252

    ingest(str(path), db)

    assert lines(db, "f.txt") == ["NAME|MFR", "A\x81B|C"]


def test_b2_encoding_can_be_given(tmp_path, db):
    path = tmp_path / "f.txt"
    path.write_bytes("a\nÄ\n".encode("cp1252"))

    ingest(str(path), db, encoding="latin-1")

    assert lines(db, "f.txt") == ["a", "Ä"]


# ============================== B3 ==============================
def test_b3_each_row_has_timestamp(sample_raw_file, db):
    """RULE B3: Every row has a valid, timezone-aware timestamp."""
    ingest(str(sample_raw_file), db)

    assert len(db.store) == 5
    for row in db.store.values():
        assert datetime.fromisoformat(row["ingested_at"]).tzinfo is not None


# ============================== number of rows ==============================
def test_limit_loads_the_header_and_exactly_that_many_data_rows(tmp_path, db):
    path = tmp_path / "f.csv"
    path.write_text("a\n1\n2\n3\n4\n", encoding="utf-8")

    assert ingest(str(path), db, limit=2) == 3

    assert lines(db, "f.csv") == ["a", "1", "2"]


def test_no_limit_loads_every_line(tmp_path, db):
    path = tmp_path / "f.csv"
    path.write_text("a\n" + "\n".join(str(n) for n in range(2500)) + "\n", encoding="utf-8")

    assert ingest(str(path), db) == 2501  # more than one batch


# ============================== log and command line ==============================
def test_o1_summary_logs_lines_duration_and_speed(sample_raw_file, db, caplog):
    """O1: Every file ends with the number of lines, duration and lines per second in the log."""
    with caplog.at_level(logging.INFO, logger="bronze_ingest"):
        ingest(str(sample_raw_file), db)

    assert "DEVICE2024.txt: done, 5 lines in" in caplog.text
    assert "lines/s" in caplog.text


def test_upload_error_is_logged_with_lines_loaded_so_far(sample_raw_file, caplog):
    client = MagicMock()
    client.table.return_value.upsert.return_value.execute.side_effect = RuntimeError("network down")

    with caplog.at_level(logging.ERROR, logger="bronze_ingest"):
        with pytest.raises(RuntimeError):
            ingest(str(sample_raw_file), client)

    assert "load stopped after 0 lines" in caplog.text


def test_lines_loaded_before_an_error_stay(tmp_path, db, monkeypatch):
    monkeypatch.setattr(bronze_ingest, "BATCH_SIZE", 2)
    path = tmp_path / "f.csv"
    path.write_text("a\n1\n2\n3\n4\n", encoding="utf-8")
    real_upsert = db.table.return_value.upsert.side_effect
    calls = []

    def fail_on_second_batch(rows, **kwargs):
        calls.append(rows)
        if len(calls) == 2:
            raise RuntimeError("network down")
        return real_upsert(rows, **kwargs)

    db.table.return_value.upsert.side_effect = fail_on_second_batch

    with pytest.raises(RuntimeError):
        ingest(str(path), db)

    assert lines(db, "f.csv") == ["a", "1"]  # the first batch stays


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

    assert lines(db, "a.csv") == ["x", "1", "2"]  # =2 wins over --limit
    assert lines(db, "b.csv") == ["x", "1"]       # --limit applies to files without =ROWS


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