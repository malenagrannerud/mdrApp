"""
timing.py

Enkel context manager för att mäta och skriva ut körtid för ett
pipeline-steg. Samma print-format i alla tre skripten tidigare
skrevs ut manuellt tre gånger — nu finns det på ett ställe.
"""

import time
from contextlib import contextmanager


@contextmanager
def timed_run(label: str):
    """
    Mäter tiden ett kodblock tar att köra.

    Användning:
        with timed_run("BRONZE"):
            ... gör jobbet ...
    Skriver ut körtiden automatiskt när blocket är klart, även om
    ett undantag kastas inuti (finally-liknande beteende).
    """
    start = time.time()
    try:
        yield
    finally:
        elapsed = time.time() - start
        print(f"  ⏱️  [{label}] Total körtid: {elapsed:.1f} sekunder")