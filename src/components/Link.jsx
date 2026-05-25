/**
 * src/components/Link.jsx 
 * Renderar en klickbar dokumentlänk med emoji.
 * Typ avgör emoji och vilken onOpen som anropas.
 */

import React from 'react';

const EMOJI_MAP = {
  sop: '📄',
  doc: '📋',
  mdcg: '🔗'
};

export default function Link({ type, data, label, onOpenSop, onOpenDoc, onOpenMdcg }) {
  if (!data) return null;

  const emoji = EMOJI_MAP[type] || '📎';
  
  const handleClick = (e) => {
    e.preventDefault();
    if (type === 'sop') onOpenSop?.(data);
    else if (type === 'doc') onOpenDoc?.(data);
    else if (type === 'mdcg') onOpenMdcg?.(data);
  };

  return (
    <a href="#" onClick={handleClick} className="document-link">
      <span>{emoji}</span>
      <span>{label || data.title}</span>
    </a>
  );
}