"""medallion/python/test_bronze_ingest.py

1-Stand in /workspaces/mdrApp: 
    ```bash 
    cd medallion/python
    ```
2-Run testfile: 
    ```bash  
    pytest test_bronze_ingest.py
    ```
"""
import pytest

from bronze_ingest import (
    get_supabase_client,
    find_source_file,
    read_source_lines,
    get_column_index,
    BronzeRow,
    build_raw_row,
    get_field,
    validate_batch_before_upload,
    upload_single_batch,
    retry_with_backoff,
    flush_if_full,
    log_ingestion_summary,
)

# --------------------------------- MOCK RAW FILE DEVICE2024.txt --------------------------------------

@pytest.fixture
def mock_source_file(tmp_path):
    """Creates a temp text file with raw pipe-separerad data."""
    
    mock_file = tmp_path / "DEVICE2024.txt"  # 1. Create splace on disc to  save the temp file
    DEVICE2024_txt = (                              # 2. The raw file
        "MDR_REPORT_KEY|DEVICE_REPORT_PRODUCT_CODE|BRAND_NAME|GENERIC_NAME|MANUFACTURER_D_NAME\n"
        "18423065|FDF|EVIS EXERA II COLONOVIDEOSCOPE|COLONOVIDEOSCOPE|AIZU OLYMPUS CO., LTD.\n"
        "18423066|EOQ|EVIS EXERA III BRONCHOVIDEOSCOPE|BRONCHOVIDEOSCOPE|AIZU OLYMPUS CO., LTD.\n"
        "18423068|NAY|ENDOWRIST|FENESTRATED BIPOLAR FORCEPS|INTUITIVE SURGICAL, INC\n"
    )
    mock_file.write_text(DEVICE2024_txt, encoding="utf-8") # 3. Save DEVICE2024_txt to disc
    return str(mock_file)                                  # 4. Return the path 

# ======================================= UNIT TESTS ============================================



# ------------------------------------- TEST get_supabase_client() ------------------------------

def test_get_supabase_klient_happy_path(monkeypatch):
    """HAPPY PATH: Tests that a key is there AND the code can read it without crash ."""

    monkeypatch.setenv("SUPABASE_URL", "https://supabase.co")                # 1. Assign fake environment variable
    monkeypatch.setenv("SUPABASE_SERVICE_ROLE_KEY", "sb_publishable_abc123") # 1. Assign fake environment variable
    klient = get_supabase_client()                        # 2. Run
    assert klient is not None                             # 3. Verify: Check so correct values are picked up

def test_supabase_klient_error_case(monkeypatch):
    """ERROR CASE: Tests that the code raises an error if variables are missing."""

    monkeypatch.delenv("SUPABASE_URL", raising=False)      # 1. Remove fake environment variable
    monkeypatch.delenv("SUPABASE_SERVICE_ROLE_KEY", raising=False) # 1. Remove fake environment variable

    with pytest.raises(SystemExit) as exc_info: # 2. Ensure ValueError
        get_supabase_client()
    assert "SUPABASE_URL is missing" in str(exc_info.value)


# ------------------------------------ TEST find_source_file()------------------------------------

def test_find_source_file_happy_path(mock_source_file, monkeypatch, tmp_path):
    """HAPPY PATH: Tests finding an existing source file."""
    
    monkeypatch.chdir(tmp_path) # 1. Change to the temp directory where mock file exists
    result = find_source_file() # 2. Run the function
    print(f"\n\n📂 [MOCK FIL PATH]: {mock_source_file}") # 3. Verify the file was found
    print("-" * 80)
    assert result == mock_source_file # Compare to actual

    
def test_find_source_file_error_case(monkeypatch, tmp_path):
    """ERROR CASE: Tests when no source file exists."""
    
    monkeypatch.chdir(tmp_path) # 1. Change to empty temp directory (no DEVICE file)
    with pytest.raises(FileNotFoundError, match="No source file found"):  # 2. Verify the function raises an error
        find_source_file()

    
# ------------------------------------ TEST read_source_lines()------------------------------------



