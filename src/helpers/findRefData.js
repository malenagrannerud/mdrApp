

/**
 * Slår upp en referens i DOC_DATA och returnerar matchande artikel- eller annex-objekt.
 *
 * @param {string} name - Referensnamn från text, t.ex. "Art.2(1)", "Ax.II", "Ax.II.1.1"
 * @returns {object|null} Objekt från DOC_DATA vid matchning, annars null.
 *
 * @example
 * findRefData('Art.2(1)');   // → DOC_DATA.ART_2_1
 * findRefData('Ax.II.1.1');  // → DOC_DATA.AX_II
 * findRefData('Ax.XIV');     // → DOC_DATA.AX_XIV
 * findRefData('RFC_1234');   // → null
 *
 * Matchning:
 * - "Art.2(1)"  → ART_2_1
 * - "Art. 2(1)" → ART_2_1 (mellanslag efter "Art." tolereras)
 * - "Ax.II"     → AX_II
 * - "Ax.II.1.1" → AX_II (endast annex-delen används)
 * - "Ax. II"    → AX_II (mellanslag efter "Ax." tolereras)
 */


import { DOC_DATA } from '../data/docData';

export function findRefData(name) {
  const clean = name.trim();

  if (clean.toLowerCase().startsWith('art.')) {
    const key = clean
      .replace('Art.', 'ART_')
      .replace(/\(/g, '_')
      .replace(/\)/g, '')
      .replace(/\./g, '_')
      .trim();
    return DOC_DATA[key] || null;
  }

  if (clean.toLowerCase().startsWith('art. ')) {
    const key = clean
      .replace('Art. ', 'ART_')
      .replace(/\(/g, '_')
      .replace(/\)/g, '')
      .replace(/\./g, '_')
      .trim();
    return DOC_DATA[key] || null;
  }

  if (clean.toLowerCase().startsWith('ax.')) {
    const key = clean
      .replace('Ax.', 'AX_')
      .split('.')[0]
      .trim();
    return DOC_DATA[key] || null;
  }

  if (clean.toLowerCase().startsWith('ax. ')) {
    const key = clean
      .replace('Ax. ', 'AX_')
      .split('.')[0]
      .trim();
    return DOC_DATA[key] || null;
  }

  return null;
}