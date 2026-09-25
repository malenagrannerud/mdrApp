

# foitext.2024
# ostrukturerad data
# I Bronze och Silver-layer: läs in textdatan, rensar trasiga rader, och i Gold-layer: skapa tabell redo för ML genom att köra TEXT_TYPE_CODE = 'D' för att bara analysera de råa felbeskrivningarna.

# 2948102|1048291|D|1|2024-03-14|THE PATIENT WAS IN THE OPERATING ROOM WHEN THE INFUSION PUMP SUDDENLY DISPLAYED AN ERROR CODE 'ERR-04' AND STOPPED DELIVERING MEDICATION. THE NURSE REPLACED THE PUMP IMMEDIATELY. NO PATIENT INJURY REPORTED.


# python/simple_nlp.py
import pandas as pd
from collections import Counter

print("Laddar in textdata från FDA...")
# Vi fokuserar på kolumnen som heter 'TEXT'
df = pd.read_csv("medallion/data/TEXT2024.txt", sep="|", error_bad_lines=False)

print("Rensar texten...")
# Gör all text till små bokstäver för att underlätta räkningen
all_text = " ".join(df['TEXT'].astype(str)).lower()

# Dela upp all text i enskilda ord
words = all_text.split()

# Sortera bort vanliga engelska småord (stoppord) som inte betyder något
stop_words = {"the", "a", "and", "was", "to", "in", "of", "for", "on", "with", "an"}
filtered_words = [w for w in words if w not in stop_words]

# Räkna de vanligaste orden!
word_counts = Counter(filtered_words)

print("\n--- DE 5 VANLIGASTE ORDEN I FELRAPPORTERNA ---")
for word, count in word_counts.most_common(5):
    print(f"Ordet '{word}' förekommer {count} gånger.")
