"""medallion/analysis/eda.py

Exploratory data analysis of MAUDE 2024. Run from the repo root.
GOAL: understand the data BEFORE modelling. Each cell ends with a question
      to answer in your own words (write the answers in the README).
"""
# %% 1. Load
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

from maude_data import load_maude

OUT = Path("medallion/analysis/output")
OUT.mkdir(parents=True, exist_ok=True)

df = load_maude()
print(f"{len(df):,} rows | {df.report_key.nunique():,} reports | {df.product_code.nunique():,} product codes")

# %% 2. Missing and junk values
# Q: Which columns have many gaps? Do the silver rules (SR3, SR4) match what is really in the data?
JUNK = {"NI", "UNK", "*", "N/A", "NA", "UNKNOWN", "NO INFORMATION", "NO MATCH", "NO DATA", "NONE", "?"}
print((df[["generic_name", "manufacturer", "date_received"]].isna().mean() * 100).round(2).astype(str) + " % missing")
junk_share = df["manufacturer"].str.upper().str.strip().isin(JUNK).mean() * 100
print(f"Junk manufacturer names: {junk_share:.2f} %")

# %% 3. What kinds of events are reported?
# Q: How large is the serious share (D + IN)? This is the baseline PRR compares against.
share = df["event_type"].value_counts(normalize=True) * 100
print(share.round(2))
share.plot.bar(title="Event type share of reports (%)")
plt.tight_layout(); plt.savefig(OUT / "event_types.png"); plt.close()
print(f"Serious share (D + IN): {df.event_type.isin(['D', 'IN']).mean() * 100:.2f} %")

# %% 4. The long tail
# Q: How concentrated is reporting? Why do we need a minimum number of cases (min_cases)?
per_code = df.groupby("product_code").size().sort_values(ascending=False)
print(per_code.head(10))
print(f"Top 10 codes = {per_code.head(10).sum() / per_code.sum() * 100:.1f} % of all reports")
print(f"Codes with fewer than 10 reports: {(per_code < 10).sum()} of {len(per_code)}")
per_code.plot.hist(bins=60, log=True, title="Reports per product code (log scale)")
plt.tight_layout(); plt.savefig(OUT / "long_tail.png"); plt.close()

# %% 5. Time
# Q: Is the volume stable over the year? Any spike or gap that could be a data problem?
parsed = df["date_received"].notna().mean() * 100
print(f"Dates parsed: {parsed:.1f} %  (if ~0 %, check the date format in the file)")
monthly = df.dropna(subset=["date_received"]).set_index("date_received").resample("MS").size()
print(monthly)
monthly.plot(marker="o", title="Reports per month")
plt.tight_layout(); plt.savefig(OUT / "monthly.png"); plt.close()

# %% 6. Serious share per product
# Q: Does the serious share differ a lot between products? (If not, PRR would find nothing.)
tmp = df.assign(serious=df.event_type.isin(["D", "IN"]))
by_code = tmp.groupby("product_code")["serious"].agg(["size", "mean"])
by_code = by_code[by_code["size"] >= 30]
print(by_code["mean"].describe().round(3))
by_code["mean"].plot.hist(bins=40, title="Serious share per product code (codes with >= 30 reports)")
plt.tight_layout(); plt.savefig(OUT / "serious_share.png"); plt.close()

# %% 7. Write your conclusions
print("""
Write 3-5 sentences in the README under 'What I found':
 - the overall serious share and what it means for the PRR baseline
 - how concentrated the reporting is, and why min_cases exists
 - any data-quality problem you found that silver does not handle yet
""")
