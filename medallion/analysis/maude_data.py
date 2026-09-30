"""medallion/analysis/maude_data.py

WHAT: Loads the MAUDE device file and the event file, joins them on
      report key, and returns ONE row per (report, product code).
WHY:  A report can list several devices, and a report can appear twice.
      Counting such rows twice would inflate the numbers, so we
      deduplicate here, once, before any analysis.
"""
import csv
import glob

import pandas as pd

DEVICE_COLS = ["MDR_REPORT_KEY", "DEVICE_REPORT_PRODUCT_CODE",
               "GENERIC_NAME", "MANUFACTURER_D_NAME"]
FOI_COLS = ["MDR_REPORT_KEY", "EVENT_TYPE", "DATE_RECEIVED"]


def _read(path, cols, chunksize=None):
    # QUOTE_NONE: FDA files contain stray quote characters that break normal parsing.
    # on_bad_lines="skip": drop rows that cannot be parsed (the old error_bad_lines is removed).
    return pd.read_csv(path, sep="|", usecols=cols, dtype=str, encoding="latin-1",
                       quoting=csv.QUOTE_NONE, on_bad_lines="skip",
                       chunksize=chunksize)


def build_analysis_frame(device: pd.DataFrame, foi: pd.DataFrame) -> pd.DataFrame:
    """Pure function (no files), so it can be unit tested."""
    device = device.rename(columns={
        "MDR_REPORT_KEY": "report_key",
        "DEVICE_REPORT_PRODUCT_CODE": "product_code",
        "GENERIC_NAME": "generic_name",
        "MANUFACTURER_D_NAME": "manufacturer",
    })
    foi = foi.rename(columns={
        "MDR_REPORT_KEY": "report_key",
        "EVENT_TYPE": "event_type",
        "DATE_RECEIVED": "date_received",
    })
    foi = foi.drop_duplicates("report_key")          # one event type per report
    df = device.merge(foi, on="report_key", how="inner", validate="many_to_one")

    df["event_type"] = df["event_type"].str.strip().str.upper()
    df["product_code"] = df["product_code"].str.strip()
    df = df.dropna(subset=["product_code", "event_type"])
    df = df[df["product_code"] != ""]
    df["date_received"] = pd.to_datetime(df["date_received"], errors="coerce")
    return df.drop_duplicates(["report_key", "product_code"]).reset_index(drop=True)


def load_maude(device_path="medallion/data/DEVICE2024.txt",
               foi_glob="medallion/data/mdrfoi*.txt") -> pd.DataFrame:
    """Run from the repo root."""
    device = _read(device_path, DEVICE_COLS)
    keys = set(device["MDR_REPORT_KEY"].dropna())

    foi_paths = sorted(glob.glob(foi_glob))
    if not foi_paths:
        raise SystemExit(f"No event file found matching {foi_glob}")

    parts = []
    for path in foi_paths:
        for chunk in _read(path, FOI_COLS, chunksize=500_000):
            parts.append(chunk[chunk["MDR_REPORT_KEY"].isin(keys)])
    foi = pd.concat(parts, ignore_index=True)

    df = build_analysis_frame(device, foi)

    # Traceability: say how many reports could not be matched.
    lost = len(keys) - df["report_key"].nunique()
    print(f"Device reports: {len(keys):,} | matched: {df['report_key'].nunique():,} "
          f"| without event data (dropped): {lost:,}")
    return df
