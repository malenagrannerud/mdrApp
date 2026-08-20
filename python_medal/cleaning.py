"""
cleaning.py

Datarensningslogik för Silver-lagret: validering av skräpvärden och
normalisering av tillverkarnamn. Utbruten till egen modul (utan
databasberoenden) så den går att testa isolerat med pytest.
"""

import re

INVALID_VALUES = {"NI", "UNK", "*", "N/A", "NA", "UNKNOWN", "NO INFORMATION", "?", "NONE"}

MANUFACTURER_MERGES = {
    "NOBEL BIOCARE GÖTEBORG": "NOBEL BIOCARE",
    "MEDTRONIC MINIMED": "MEDTRONIC",
    "MEDTRONIC PUERTO RICO OPERATIONS": "MEDTRONIC",
    "AIZU OLYMPUS": "OLYMPUS",
    "SHIRAKAWA OLYMPUS": "OLYMPUS",
}

SUFFIX_RE = re.compile(r"\s(inc|llc|ltd|co|corp|corporation|as|ag|gmbh|sa|ab)$", re.IGNORECASE)


def is_invalid_value(name: str | None) -> bool:
    """Avgör om ett fältvärde ska räknas som 'saknas' (skräplista eller för kort)."""
    if not name:
        return True
    cleaned = name.strip()
    return cleaned.upper() in INVALID_VALUES or len(cleaned) < 2


def normalize_manufacturer(name: str | None) -> str:
    """Städar ett tillverkarnamn: skiljetecken, mellanslag, juridiska suffix."""
    if not name:
        return ""
    cleaned = name.replace(",", " ").replace(".", " ")
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    cleaned = SUFFIX_RE.sub("", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


def merge_known_duplicates(name: str) -> str:
    """Slår ihop kända namnvarianter till ett kanoniskt namn."""
    return MANUFACTURER_MERGES.get(name.upper(), name)


def clean_text_field(value: str | None) -> str | None:
    """Versaliserar och kollapsar mellanslag i ett fritextfält (brand/generic name)."""
    if is_invalid_value(value):
        return None
    return re.sub(r"\s+", " ", value).strip().upper()
    