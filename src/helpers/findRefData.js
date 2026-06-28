/**
 * @file src/helpers/findRefData.js
 * @description Slår upp en referens i DOC_DATA och returnerar matchande artikel- eller annex-objekt.
 *
 * @param {string} name - Referensnamn från text, t.ex. "Art.2(1)", "Ax.II", "Ax.II.1.1"
 * @returns {object|null} Objekt från DOC_DATA vid matchning, annars null.
 *
 * @example
 * findRefData('Art.2(1)');   // → DOC_DATA.ART_2_1
 * findRefData('Art.51(1)');  // → DOC_DATA.ART_51
 * findRefData('Ax.II.1.1');  // → DOC_DATA.AX_II
 * findRefData('Ax.XIV');     // → DOC_DATA.AX_XIV
 * findRefData('RFC_1234');   // → null
 *
 * Matchning:
 * - "Art.2(1)"  → ART_2_1
 * - "Art. 2(1)" → ART_2_1
 * - "Ax.II"     → AX_II
 * - "Ax.II.1.1" → AX_II (endast annex-delen används)
 * - "Ax. II"    → AX_II
 */
import { DOC_DATA } from '../data/docData';

export function findRefData(name) {
  const clean = name.trim();

  if (clean.toLowerCase().startsWith('art.')) {
    const key = clean
      .replace(/^Art\.\s?/i, 'ART_')
      .replace(/\(/g, '_')
      .replace(/\)/g, '');

    if (DOC_DATA[key]) return DOC_DATA[key];

    const keyWithoutPoint = key.replace(/_\d+$/, '');
    return DOC_DATA[keyWithoutPoint] || null;
  }

  if (clean.toLowerCase().startsWith('ax.')) {
    const key = clean
      .replace(/^Ax\.\s?/i, 'AX_')
      .split('.')[0];

    return DOC_DATA[key] || null;
  }

  return null;
}