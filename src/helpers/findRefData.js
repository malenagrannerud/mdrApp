/**
 * @file src/helpers/findRefData.js
 * @description Slår upp en referens i DOC_DATA och returnerar matchande artikel- eller annex-objekt.
 *
 * @param {string} name - Referensnamn från text, t.ex. "Art.2(1)", "Ax.II", "Ax.II.1.1"
 * @returns {object|null} Objekt från DOC_DATA vid matchning, annars null.
 */

import { DOC_DATA } from '../data/docData';

export function findRefData(name) {
  if (!name) return null;
  
  // Rensa bort extra mellanslag i början/slutet samt efter Art./Ax.
  const clean = name.trim().replace(/^(Art|Ax)\.\s+/i, '$1.');

  // --- Hantering av Artiklar (t.ex. Art.2(1) eller Art.51(1)) ---
  if (clean.toLowerCase().startsWith('art.')) {
    // Omvandlar "Art.2(1)" -> "ART_2_1"
    const key = clean
      .replace(/^Art\./i, 'ART_')
      .replace(/\(/g, '_')
      .replace(/\)/g, '');

    // 1. Direkt matchning (t.ex. ART_2_1)
    if (DOC_DATA[key]) return DOC_DATA[key];

    // 2. Fallback: Klipp vid sista understrecket om det följs av en siffra (t.ex. ART_51_1 -> ART_51)
    const fallbackKey = key.replace(/_\d+$/, '');
    if (DOC_DATA[fallbackKey]) return DOC_DATA[fallbackKey];

    return null;
  }

  // --- Hantering av Annex (t.ex. Ax.II eller Ax.II.1.1) ---
  if (clean.toLowerCase().startsWith('ax.')) {
    // Ta bort "Ax." och extrahera huvud-annexet innan eventuella underpunkter (t.ex. "II.1.1" -> "II")
    const annexMain = clean.replace(/^Ax\./i, '').split('.')[0];
    const key = `AX_${annexMain}`;

    return DOC_DATA[key] || null;
  }

  return null;
}
