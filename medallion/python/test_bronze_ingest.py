"""
medallion/python/test_bronze_ingest.py

1-Stand in /workspaces/mdrApp: bash cd medallion/python
2-Run testfile: bash  python tests/test_bronze_ingest.py
''' 
"""






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



def main():
   
    print("\n ============= TESTING get_supabase_client =============")



if __name__ == "__main__":
    main()





