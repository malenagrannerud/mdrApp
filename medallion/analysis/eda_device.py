"""medallion/analysis/eda_device.py
EDA of DEVICE2024.txt. Run from the repo root.
Each section answers one question. See answers in PIPELINE.md

"""
import csv
import pandas as pd

COLS = ["MDR_REPORT_KEY", "DEVICE_SEQUENCE_NO", "GENERIC_NAME",
        "DEVICE_REPORT_PRODUCT_CODE", "MANUFACTURER_D_NAME"]


df = pd.read_csv("medallion/data/DEVICE2024.txt", sep="|", usecols=COLS, dtype=str,
                 encoding="latin-1", quoting=csv.QUOTE_NONE, on_bad_lines="skip")
df = df.apply(lambda c: c.str.strip().replace("", pd.NA))

print("\n=== 1. What is a row? ===")
print(f"rows: {len(df):,}")
print(f"unique MDR_REPORT_KEY: {df.MDR_REPORT_KEY.nunique():,}")
print(f"duplicated (MDR_REPORT_KEY, DEVICE_SEQUENCE_NO): "
      f"{df.duplicated(['MDR_REPORT_KEY','DEVICE_SEQUENCE_NO']).sum():,}")
print(f"duplicated (hela raden): {df.duplicated().sum():,}")
# Q: Is device_event_key really unique? Silver rule SR2 assumes duplicates exist.


print("\n=== 2. Missing values (%) ===")
print((df.isna().mean() * 100).round(2))
# Q: Which columns have gaps? Does it match SR3 (missing manufacturer)?

print("\n=== 3. Junk manufacturer names ===")
JUNK = {"NI", "UNK", "*", "N/A", "NA", "UNKNOWN", "NO INFORMATION",
        "NO MATCH", "NO DATA", "NONE", "?", "0HP", "000"}
m = df.MANUFACTURER_D_NAME.str.upper()
print(f"junk list: {m.isin(JUNK).sum():,} | shorter than 2 chars: {(m.str.len() < 2).sum():,}")
print("Most common values that look suspicious (short names):")
print(m[m.str.len() <= 4].value_counts().head(15))
# Q: Are there junk values that are NOT in the SR4 list?

print("\n=== 4. Same company, many spellings ===")
for word in ["OLYMPUS", "MEDTRONIC", "ALCON", "BOSTON SCIENTIFIC", "ABBOTT"]:
    v = m[m.str.contains(word, na=False)].value_counts()
    print(f"{word}: {len(v)} different spellings, {v.sum():,} rows. Top 5:")
    print(v.head(5).to_string())
# Q: Is the SR5 normalisation (and the manual merge list) enough?

print("\n=== 5. One product code, several names? ===")
names = df.groupby("DEVICE_REPORT_PRODUCT_CODE").GENERIC_NAME.nunique()
print(f"codes: {len(names):,} | codes with more than 1 name: {(names > 1).sum():,}")
# Q: Is MODE() in gold needed? (This number is the evidence.)

print("\n=== 6. Concentration ===")
per_code = df.DEVICE_REPORT_PRODUCT_CODE.value_counts()
print(per_code.head(10))
print(f"top 10 codes = {per_code.head(10).sum() / per_code.sum() * 100:.1f} % of rows")
print(f"top 10 manufacturers = {m.value_counts().head(10).sum() / m.notna().sum() * 100:.1f} % of rows")
# Q: How many row does the top 10 product codes and manufacturers cover? Is it a long tail?
