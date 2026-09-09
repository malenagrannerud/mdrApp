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
import os 

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
def mock_source_file():
    """Returns your exact raw file content as a string."""
    return (                              
        "MDR_REPORT_KEY|DEVICE_REPORT_PRODUCT_CODE|BRAND_NAME|GENERIC_NAME|MANUFACTURER_D_NAME\n"
        "18423065|FDF|EVIS EXERA II COLONOVIDEOSCOPE|COLONOVIDEOSCOPE|AIZU OLYMPUS CO., LTD.\n"
        "18423066|EOQ|EVIS EXERA III BRONCHOVIDEOSCOPE|BRONCHOVIDEOSCOPE|AIZU OLYMPUS CO., LTD.\n"
        "18423067|EOQ|EVIS LUCERA ELITE BRONCHOVIDEOSCOPE|BRONCHOVIDEOSCOPE|AIZU OLYMPUS CO., LTD.\n"
        "18423068|NAY|ENDOWRIST|FENESTRATED BIPOLAR FORCEPS|INTUITIVE SURGICAL, INC\n"
        "18423069|EOQ|ION|VISION PROBE|INTUITIVE SURGICAL, INC\n"
        "18423070|NAY|ENDOWRIST|TENACULUM FORCEPS|INTUITIVE SURGICAL, INC\n"
        "18423071|LRO|CONSTELLATION SURGICAL PROCEDURE PACK|GENERAL SURGERY TRAY (KIT)|ALCON RESEARCH, LLC - HOUSTON\n"
        "18423072|DZE|DYMIC|DYNAMIC IMPLANT SP 3.75X10|PALTOP ADVANCED DENTAL SOLUTIONS INC.\n"
        "18423073|FHW|AMS INFLATABLE PENILE PROSTHESIS|DEVICE IMPOTENCE MECHANICAL/HYDRAULIC|BOSTON SCIENTIFIC CORPORATION\n"
        "18423074|FHW|AMS INFLATABLE PENILE PROSTHESIS|DEVICE IMPOTENCE MECHANICAL/HYDRAULIC|BOSTON SCIENTIFIC CORPORATION\n"
    )


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
# pytest test_bronze_ingest.py::test_find_source_file_in_root -v -s

def test_find_source_file_in_root(tmp_path, monkeypatch):
    """Test so the function finds the file when located root directory."""
    monkeypatch.chdir(tmp_path) # 1. Move the test environment into a temp folder (removed later)
    
    file_name = "DEVICE2024.txt" # 2. Create a dummy file 
    dummy_file = tmp_path / file_name
    dummy_file.write_text("dummy data")
    
    result = find_source_file(file_name)     # 3. Run the function and verify it returns just the file name
    assert result == file_name


def test_find_source_file_in_medallion_folder(tmp_path, monkeypatch):
    """Test that the function finds a file when it is located inside the 'medallion/' folder."""
    monkeypatch.chdir(tmp_path) # 1. Move into the temporary folder
    
    medallion_dir = tmp_path / "medallion" # 2. Create the 'medallion' folder and put the dummy file there
    medallion_dir.mkdir()
    
    file_name = "DEVICE2024.txt"
    dummy_file = medallion_dir / file_name
    dummy_file.write_text("dummy data")
    
    result = find_source_file(file_name) # 3. Run the function, verify it returns subfolder path right
    assert result == f"medallion/{file_name}"


def test_find_source_file_raises_system_exit(tmp_path, monkeypatch):
    """Test that the function crashes with SystemExit if the file doesn't exist anywhere."""
    monkeypatch.chdir(tmp_path) # 1. Move into a completely empty folder
    
    with pytest.raises(SystemExit) as exc_info: # 2. Verify that searching for a missing file triggers 'raise SystemExit'
        find_source_file("MISSING_FILE.txt")
        
    assert "Error: source file not found at MISSING_FILE.txt" in str(exc_info.value) # 3. Double check error message is returned

# ------------------------------------ TEST read_source_lines()------------------------------------



