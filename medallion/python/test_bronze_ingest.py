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

HEADER_DICTIONARY = {                           # Maps FDA column names to internal names
    "reportKey": "MDR_REPORT_KEY",              # ID number for each report
    "productCode": "DEVICE_REPORT_PRODUCT_CODE",  # Letter code for device type. EX: CBK = Ventilator, FPA = Catheter, MDS = Infusion pump, LZW = Pacemaker
    "brandName": "BRAND_NAME",                  # Commerial name of the device. EX: "Servo Air"
    "genericName": "GENERIC_NAME",              # Clinical name. EX: "Ventilator"
    "manufacturerRaw": "MANUFACTURER_D_NAME",   # Name of manufacturer as reported. EX: "Getinge", "Medtronic Inc" etc
}


# --------------------------------- MOCK RAW FILE DEVICE2024.txt --------------------------------------
@pytest.fixture
def mock_sf():
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

def test_get_column_index_with_exact_mock(mock_sf): # sf = SOURCE_FILE
    """Tests how the function maps the top row of your mock file to index numbers."""

    # 1. Grab the very first row (the headers) from the mock string
    sf_lines = mock_sf.splitlines()     # .splitlines() 
    sf_header_line = sf_lines[0]        #     # sf_header_line is now: "MDR_REPORT_KEY|DEVICE_REPORT_PRODUCT_CODE|BRAND_NAME|GENERIC_NAME|MANUFACTURER_D_NAME"

    # 2. Split the row into a clean list of words by separating at each "|"
    sf_header_cols = sf_header_line.split("|") # sf_header_cols is now: ["MDR_REPORT_KEY", "DEVICE_REPORT_PRODUCT_CODE", "BRAND_NAME", "GENERIC_NAME", "MANUFACTURER_D_NAME"]

    result = get_column_index(sf_header_cols) # 3. Run your function!

    # 4. Verify that each internal key got mapped to its exact position (0 to 4)
    assert result["reportKey"] == 0         # "MDR_REPORT_KEY" is at position 0
    assert result["productCode"] == 1       # "DEVICE_REPORT_PRODUCT_CODE" is at position 1
    assert result["brandName"] == 2         # "BRAND_NAME" is at position 2
    assert result["genericName"] == 3       # "GENERIC_NAME" is at position 3
    assert result["manufacturerRaw"] == 4   # "MANUFACTURER_D_NAME" is at position 4