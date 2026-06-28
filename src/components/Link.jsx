/**
 * src/components/Link.jsx 
 * Renderar en klickbar dokumentlänk.
 * Typ avgör vilken onOpen som anropas.
 */

import React from 'react';

export default function Link({ type, data, label, onOpenSop, onOpenDoc, onOpenMdcg, onOpenRef }) {
  if (!data) return null;
  
  const handleClick = (e) => {
    e.preventDefault();
    if (type === 'sop') onOpenSop?.(data);
    else if (type === 'doc') onOpenDoc?.(data);
    else if (type === 'mdcg') onOpenMdcg?.(data);
    else if (type === 'ref') onOpenRef?.(data);  // <-- LÄGG TILL DENNA

  };

  return (
    <a href="#" onClick={handleClick} className="document-link">
      {label || data.title_short|| data.title }
    </a>
  );
}