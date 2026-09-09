"""

medallion/python/test_bronze_ingest.py

1-Stand in /workspaces/mdrApp: 
    ```bash 
    cd medallion/python
    ```
2-Run testfile: 
    ```bash  
    python test_bronze_ingest.py
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


def test_enkelt_strang_test():
    """Ett superenkelt test som bara kollar en textsträng."""
    text = "brons data"
    
    # Vi kollar om ordet "brons" finns inuti vår text
    assert "brons" in text






