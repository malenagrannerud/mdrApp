"""medallion/python/test_bronze_ingest.py

Run:  cd medallion/python && pytest -v
No network or database needed: everything external is faked.
"""
import pytest
import bronze_ingest
from bronze_ingest import (
    get_supabase_client,
    find_source_file,
    build_header_mapping,
    BronzeRow,
    build_raw_row,
    write_batch_with_retry,
)

HEADER = "MDR_REPORT_KEY|DEVICE_EVENT_KEY|DEVICE_REPORT_PRODUCT_CODE|BRAND_NAME|GENERIC_NAME|MANUFACTURER_D_NAME"


@pytest.fixture
def mock_sf():
    """A tiny fake source file: header + 2 data rows."""
    return (
        f"{HEADER}\n"
        "18423065|E1|FDF|EVIS EXERA II|COLONOVIDEOSCOPE|AIZU OLYMPUS CO., LTD.\n"
        "18423066|E2|EOQ|EVIS EXERA III|BRONCHOVIDEOSCOPE|AIZU OLYMPUS CO., LTD.\n"
    )


# ---------------- build_header_mapping ----------------
def test_build_header_mapping(mock_sf):
    cols = mock_sf.splitlines()[0].split("|")
    assert build_header_mapping(cols) == {
        "reportKey": 0,
        "deviceEventKey": 1,
        "productCode": 2,
        "genericName": 4,
        "manufacturerRaw": 5,
    }


def test_header_mapping_missing_column_gives_minus_one():
    result = build_header_mapping(["MDR_REPORT_KEY"])
    assert result["reportKey"] == 0
    assert result["deviceEventKey"] == -1


# ---------------- build_raw_row ----------------
def test_build_raw_row_reads_fields(mock_sf):
    lines = mock_sf.splitlines()
    col_idx = build_header_mapping(lines[0].split("|"))
    row = build_raw_row(lines[1].split("|"), col_idx, "f.txt")
    assert row["reportKey"] == "18423065"
    assert row["deviceEventKey"] == "E1"
    assert row["productCode"] == "FDF"
    assert row["genericName"] == "COLONOVIDEOSCOPE"


def test_build_raw_row_missing_column_gives_none():
    col_idx = {"reportKey": 0, "deviceEventKey": -1, "genericName": -1,
               "productCode": -1, "manufacturerRaw": -1}
    row = build_raw_row(["123"], col_idx, "f.txt")
    assert row["reportKey"] == "123"
    assert row["deviceEventKey"] is None


def test_build_raw_row_empty_string_becomes_none():
    col_idx = {"reportKey": 0, "deviceEventKey": 1, "genericName": -1,
               "productCode": -1, "manufacturerRaw": -1}
    row = build_raw_row(["123", "   "], col_idx, "f.txt")
    assert row["deviceEventKey"] is None


def test_build_raw_row_short_line_does_not_crash():
    col_idx = {"reportKey": 0, "deviceEventKey": 5, "genericName": -1,
               "productCode": -1, "manufacturerRaw": -1}
    row = build_raw_row(["123"], col_idx, "f.txt")
    assert row["deviceEventKey"] is None


# ---------------- BronzeRow (regression test for the model_dump bug) ----------------
def test_bronze_row_dump_matches_table_columns():
    """The keys must equal the bronze_reports column names, or the insert fails."""
    row = BronzeRow(reportKey="1", deviceEventKey="2", genericName="X",
                    productCode="ABC", manufacturerRaw="M", source_file="f")
    assert set(row.model_dump()) == {
        "report_key", "device_event_key", "generic_name",
        "product_code_raw", "manufacturer_raw", "source_file",
    }


def test_bronze_row_requires_source_file():
    with pytest.raises(Exception):
        BronzeRow(reportKey="1")


# ---------------- write_batch_with_retry ----------------
class FakeClient:
    """Fails `fail_times` times, then succeeds. Counts the attempts."""
    def __init__(self, fail_times):
        self.fail_times = fail_times
        self.calls = 0

    def table(self, name):
        assert name == "bronze_reports"
        return self

    def insert(self, batch):
        return self

    def execute(self):
        self.calls += 1
        if self.calls <= self.fail_times:
            raise RuntimeError("boom")


def test_write_batch_retries_then_succeeds(monkeypatch):
    monkeypatch.setattr(bronze_ingest.time, "sleep", lambda s: None)  # no real waiting
    client = FakeClient(fail_times=2)
    write_batch_with_retry(client, [{"a": 1}])
    assert client.calls == 3


def test_write_batch_gives_up_after_max_retries(monkeypatch):
    monkeypatch.setattr(bronze_ingest.time, "sleep", lambda s: None)
    client = FakeClient(fail_times=99)
    with pytest.raises(RuntimeError):
        write_batch_with_retry(client, [{"a": 1}])
    assert client.calls == bronze_ingest.MAX_RETRIES


# ---------------- find_source_file ----------------
def test_find_source_file_in_root(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    (tmp_path / "DEVICE2024.txt").write_text("x")
    assert find_source_file("DEVICE2024.txt") == "DEVICE2024.txt"


def test_find_source_file_in_medallion_folder(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    (tmp_path / "medallion").mkdir()
    (tmp_path / "medallion" / "DEVICE2024.txt").write_text("x")
    assert find_source_file("DEVICE2024.txt") == "medallion/DEVICE2024.txt"


def test_find_source_file_raises_system_exit(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    with pytest.raises(SystemExit) as exc:
        find_source_file("MISSING.txt")
    assert "source file not found" in str(exc.value)


# ---------------- get_supabase_client ----------------
def test_get_supabase_client_happy_path(monkeypatch):
    monkeypatch.setenv("SUPABASE_URL", "https://x.supabase.co")
    monkeypatch.setenv("SUPABASE_SERVICE_ROLE_KEY", "dummy")

    class FakeSupabase:
        @staticmethod
        def create_client(url, key):
            return (url, key)

    monkeypatch.setattr(bronze_ingest, "import_module", lambda name: FakeSupabase)
    assert get_supabase_client() == ("https://x.supabase.co", "dummy")


def test_get_supabase_client_missing_url(monkeypatch):
    monkeypatch.delenv("SUPABASE_URL", raising=False)
    monkeypatch.delenv("SUPABASE_SERVICE_ROLE_KEY", raising=False)
    with pytest.raises(SystemExit) as exc:
        get_supabase_client()
    assert "SUPABASE_URL is missing" in str(exc.value)
