"""medallion/analysis/test_prr.py   Run: cd medallion/analysis && pytest -v"""
import pandas as pd
import pytest

from maude_data import build_analysis_frame
from prr import prr_table


def make_df():
    """100 reports. Product X: 10 reports, 5 serious. All other products: 90 reports, 10 serious."""
    rows = []
    rows += [(f"X{i}", "X", "D") for i in range(5)]
    rows += [(f"X{i}", "X", "M") for i in range(5, 10)]
    rows += [(f"Y{i}", "Y", "IN") for i in range(10)]
    rows += [(f"Y{i}", "Y", "M") for i in range(10, 90)]
    return pd.DataFrame(rows, columns=["report_key", "product_code", "event_type"])


def test_prr_matches_hand_calculation():
    # a=5 b=5 c=10 d=80  ->  PRR = (5/10) / (10/90) = 4.5
    #                        chi2 = 100*(5*80 - 5*10)^2 / (10*90*15*85) = 10.675
    x = prr_table(make_df()).loc["X"]
    assert x["prr"] == pytest.approx(4.5)
    assert x["chi2"] == pytest.approx(10.675, abs=0.01)
    assert bool(x["signal"]) is True


def test_low_share_product_is_not_a_signal():
    y = prr_table(make_df()).loc["Y"]
    assert y["prr"] < 1
    assert bool(y["signal"]) is False


def test_duplicate_rows_are_counted_once():
    df = make_df()
    doubled = pd.concat([df, df.iloc[:1]])          # repeat one X report
    assert prr_table(doubled).loc["X", "n"] == 10


def test_product_with_too_few_serious_cases_is_excluded():
    df = pd.concat([make_df(), pd.DataFrame(
        [("Z1", "Z", "D"), ("Z2", "Z", "D"), ("Z3", "Z", "M")],
        columns=["report_key", "product_code", "event_type"])])
    res = prr_table(df, min_cases=3)
    assert "Z" not in res.index and "X" in res.index


def test_join_drops_unmatched_and_dedupes():
    device = pd.DataFrame({
        "MDR_REPORT_KEY": ["1", "1", "2", "3"],
        "DEVICE_REPORT_PRODUCT_CODE": ["AAA", "AAA", "BBB", "CCC"],
        "GENERIC_NAME": ["a", "a", "b", "c"],
        "MANUFACTURER_D_NAME": ["m", "m", "m", "m"],
    })
    foi = pd.DataFrame({
        "MDR_REPORT_KEY": ["1", "2"],
        "EVENT_TYPE": ["d ", " M"],                 # messy on purpose
        "DATE_RECEIVED": ["2024-01-01", "2024-01-02"],
    })
    df = build_analysis_frame(device, foi)
    assert len(df) == 2                              # report 3 has no event data; report 1 counted once
    assert set(df["event_type"]) == {"D", "M"}       # cleaned
