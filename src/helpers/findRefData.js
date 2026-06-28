/**
 * @file src/helpers/findRefData.js
 * @description Slår upp en referens i DOC_DATA och returnerar matchande artikel- eller annex-objekt.
 *
 * @param {string} name - Referensnamn från text, t.ex. "Art.2(1)", "Art.10(9)(g)", "Ax.VIII"
 * @returns {object|null} Objekt från DOC_DATA vid matchning, annars null.
 */

import { DOC_DATA } from '../data/docData';

export function findRefData(name) {
  if (!name) return null;
  
  // Rensa bort extra mellanslag i början/slutet samt efter Art./Ax.
  const clean = name.trim().replace(/^(Art|Ax)\.\s+/i, '$1.');

  // --- Hantering av Artiklar (t.ex. Art.2(1) eller Art.10(9)(g)) ---
  if (clean.toLowerCase().startsWith('art.')) {
    // Gör om både ( och ) till understreck, städa upp dubbletter och sluttecken
    const key = clean
      .replace(/^Art\./i, 'ART_')
      .replace(/[\(\)]/g, '_')       // "Art.10(9)(g)" -> "ART_10_9__g_"
      .replace(/_+/g, '_')           // Slå ihop dubbla understreck -> "ART_10_9_g_"
      .replace(/_$/, '');            // Ta bort understreck längst bak -> "ART_10_9_g"

    // 1. Försök med direkt matchning (t.ex. ART_10_9_g)
    if (DOC_DATA[key]) return DOC_DATA[key];

    // 2. Fallback: Backa steg för steg (t.ex. ART_10_9_g -> ART_10_9 -> ART_10)
    let fallbackKey = key;
    while (fallbackKey.includes('_')) {
      fallbackKey = fallbackKey.substring(0, fallbackKey.lastIndexOf('_'));
      if (DOC_DATA[fallbackKey]) return DOC_DATA[fallbackKey];
    }

    return null;
  }

  // --- Hantering av Annex (t.ex. Ax.II eller Ax.II.1.1) ---
  if (clean.toLowerCase().startsWith('ax.')) {
    // Ta bort "Ax." och extrahera huvud-annexet innan eventuella underpunkter (t.ex. "II.1.1" -> "II")
    const annexMain = clean.replace(/^Ax\./i, '').split('.');
    const key = `AX_${annexMain[0]}`;

    return DOC_DATA[key] || null;
  }

  return null;
}
