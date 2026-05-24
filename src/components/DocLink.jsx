/**
 * src/components/DocLink.jsx
 * Renderar en klickbar länk för att öppna dokument 
 */

import React from 'react';
import { FileText } from 'lucide-react';

export default function DocLink({ doc, onOpen }) {
  if (!doc) return null;

  return (
    <a 
      href="#" 
      onClick={(e) => {
        e.preventDefault();
        onOpen(doc);
      }} 
      className="document-link"
    >
      <FileText size={14} />
      <span>
        {doc.id}: {doc.title}
      </span>
    </a>
  );
}