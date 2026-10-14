"""medallion/analysis/eda_device.py

FIRST STEP, BEFORE CREATING RULES FOR THE SILVER LAYER

EDA of the full DEVICE2024.txt. Run from the repo root.
Each section answers one question. See answers in PIPELINE.md


RUN:    cd /workspaces/mdrApp
        python medallion/analysis/eda_device.py

"""
import csv
import pandas as pd

COLS = ["MDR_REPORT_KEY", "DEVICE_SEQUENCE_NO", "GENERIC_NAME",
        "DEVICE_REPORT_PRODUCT_CODE", "MANUFACTURER_D_NAME"]


JUNK = [ "NI", "UNK", "*", "N/A", "NA", "UNKNOWN", "NO INFORMATION",
        "NO MATCH", "NO DATA", "NONE", "?", "0HP", "000"]



df = pd.read_csv("medallion/data/DEVICE2024.txt", sep="|", usecols=COLS, dtype=str,
                 encoding="latin-1", quoting=csv.QUOTE_NONE, on_bad_lines="skip")
df = df.apply(lambda c: c.str.strip().replace("", pd.NA))

print("\n=== 1. Duplicates on primary key ===")
print(f"rows: {len(df):,}")
print(f"unique MDR_REPORT_KEY: {df.MDR_REPORT_KEY.nunique():,}")
print(f"unique DEVICE_SEQUENCE_NO: {df.DEVICE_SEQUENCE_NO.nunique():,}")
print(f"duplicated (MDR_REPORT_KEY, DEVICE_SEQUENCE_NO): "
      f"{df.duplicated(['MDR_REPORT_KEY','DEVICE_SEQUENCE_NO']).sum():,}")
print(f"duplicated (the whole row): {df.duplicated().sum():,}")

# Q: Is (MDR_REPORT_KEY, DEVICE_SEQUENCE_NO) unique enough to be the PK?
# Q: Are the 31 identical rows real duplicates or legitimate repeats?




print("\n=== 2. Missing values in columns (%) ===")
print((df.isna().mean() * 100).round(2))

# Q: Which columns have gaps? Are any gaps large enough to need imputation?


print("\n=== 3. Junk MANUFACTURER_D_NAME = ===")
m = df.MANUFACTURER_D_NAME.str.upper()
print(f"junk list: {m.isin(JUNK).sum():,} | shorter than 2 chars: {(m.str.len() < 2).sum():,}")
print("Manufacturers with short names:")
print(m[m.str.len() <= 4].value_counts().head(15))
# Q: Which junk values are NOT in JUNK? (e.g. MPRI, BD, SERF)
# Q: Is MPRI (34,885 rows) a real manufacturer or a code that leaked in?


print("\n=== 4. Variants of MANUFACTURER_D_NAME ===")
for word in ["OLYMPUS", "MEDTRONIC", "ALCON", "BOSTON SCIENTIFIC", "ABBOTT"]:
    v = m[m.str.contains(word, na=False)].value_counts()
    print(f"{word}: {len(v)} different spellings, {v.sum():,} rows. Top 5:")
    print(v.head(5).to_string())
# Q: Do the 5 biggest firms cover most of the 5,243 unique names?
# Q: Is keyword matching (LIKE '%MEDTRONIC%') safe, or does it give false positives?


print("\n=== 5. One PRODUCT_CODE, several GENERIC_NAMES? ===")
names = df.groupby("DEVICE_REPORT_PRODUCT_CODE").GENERIC_NAME.nunique()
print(f"codes: {len(names):,} | codes with more than 1 name: {(names > 1).sum():,}")
# Q: What is the max/median number of names per code?
# Q: Which codes have the most names? Can MODE() be trusted as canonical?


print("\n=== 6. Concentration of PRODUCT_CODES ===")
per_code = df.DEVICE_REPORT_PRODUCT_CODE.value_counts()
print(per_code.head(30))
print(f"top 30 codes = {per_code.head(30).sum() / per_code.sum() * 100:.1f} % of rows")
print(f"top 20 manufacturers = {m.value_counts().head(20).sum() / m.notna().sum() * 100:.1f} % of rows")
# Q: How many rows do the top 20 product codes and manufacturers cover? Is it a long tail?
