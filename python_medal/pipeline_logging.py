"""
pipeline_logging.py

Central loggningskonfiguration för hela pipelinen. Ersätter print()
med riktig logging: loggnivåer (INFO/WARNING/ERROR), tidsstämplar
automatiskt, och lätt att senare skicka output till fil istället för
bara terminalen.
"""

import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)


def get_logger(name: str) -> logging.Logger:
    """Returnerar en namngiven logger, så loggmeddelanden kan spåras till rätt modul."""
    return logging.getLogger(name)