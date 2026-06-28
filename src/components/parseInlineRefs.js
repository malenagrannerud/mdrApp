// src/utils/parseInlineRefs.js
import React from 'react';
import { findRefData } from './findRefData';

export function parseInlineRefs(text, onOpenRef) {
  if (!text) return null;
  if (typeof text !== 'string') return text;

  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const refName = part.replace(/\*\*/g, '');
      const refData = findRefData(refName);

      if (refData) {
        return (
          <a
            key={idx}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onOpenRef?.(refData);
            }}
            className="inline-ref-link"
          >
            {refName}
          </a>
        );
      }

      return <span key={idx}>{refName}</span>;
    }

    return <span key={idx}>{part}</span>;
  });
}