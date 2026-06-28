

// src/helpers/findRefData.js


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