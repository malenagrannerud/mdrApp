"""medallion/analysis/prr.py

WHAT: Proportional Reporting Ratio (PRR) per product code.
WHY:  Answers "which products have an unusually HIGH SHARE of serious
      reports compared with all other products?" This is a standard
      first screening step in post-market surveillance (MDR Art. 83-86).

Definitions (per product code):
    serious = event type D (death) or IN (injury)
    a = serious reports for the product      b = other reports for the product
    c = serious reports for all OTHER products   d = other reports for all OTHER products

    PRR = (a / (a + b)) / (c / (c + d))
    "How many times higher is this product's serious share than everyone else's?"
"""
from pathlib import Path

import numpy as np
import pandas as pd

SERIOUS = {"D", "IN"}


def prr_table(df: pd.DataFrame, min_cases: int = 3) -> pd.DataFrame:
    d = df.drop_duplicates(["report_key", "product_code"]).copy()
    d["serious"] = d["event_type"].isin(SERIOUS)
    total = len(d)
    total_serious = int(d["serious"].sum())

    g = d.groupby("product_code").agg(n=("serious", "size"), a=("serious", "sum"))
    if "generic_name" in d.columns:
        g["generic_name"] = d.groupby("product_code")["generic_name"].agg(
            lambda s: s.mode().iat[0] if not s.mode().empty else None)

    # Products with very few serious reports are too noisy to judge.
    g = g[g["a"] >= min_cases].copy()

    # Floats on purpose: the chi-square below would overflow int64.
    n = g["n"].astype(float)
    a = g["a"].astype(float)
    b = n - a
    c = total_serious - a
    rest = total - n                    # reports for all other products
    dd = rest - c

    with np.errstate(divide="ignore", invalid="ignore"):
        prr = (a / n) / (c / rest)
        se_ln = np.sqrt(1 / a - 1 / n + 1 / c - 1 / rest)      # standard error of ln(PRR)
        g["prr"] = prr
        g["prr_lower95"] = np.exp(np.log(prr) - 1.96 * se_ln)  # lower bound of 95% CI
        g["chi2"] = total * (a * dd - b * c) ** 2 / (
            n * rest * total_serious * (total - total_serious))

    g["a"] = g["a"].astype(int)
    # Evans criteria, the common rule of thumb: PRR >= 2, chi2 >= 4, at least 3 cases
    g["signal"] = (g["prr"] >= 2) & (g["chi2"] >= 4) & (g["a"] >= 3)
    # Stricter: the whole 95% interval must lie above 1 (fewer false alarms)
    g["signal_strict"] = g["signal"] & (g["prr_lower95"] > 1)
    return g.sort_values("prr_lower95", ascending=False)


def main():
    from maude_data import load_maude
    df = load_maude()
    res = prr_table(df)

    out = Path(__file__).parent / "output"
    out.mkdir(exist_ok=True)
    res.to_csv(out / "prr_signals.csv")

    cols = ["generic_name", "n", "a", "prr", "prr_lower95", "chi2"]
    print(f"\nProducts tested: {len(res):,} | signals: {int(res.signal.sum())} "
          f"| strict signals: {int(res.signal_strict.sum())}")
    print(res[res.signal_strict][cols].head(20).round(2).to_string())


if __name__ == "__main__":
    main()
