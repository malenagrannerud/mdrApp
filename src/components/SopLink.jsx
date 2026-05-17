


/**
 * SopLink.jsx Component
 * Renderar en länk till ett extern dokument. Har dox emoji
 */


import React from 'react';
import * as Lucide from 'lucide-react';

export default function SopLink({ sop, onOpen }) {
  if (!sop) return null;

  return (
    <a 
      href="#" 
      onClick={(e) => {
        e.preventDefault(); // Hindrar sidan från att hoppa upp till toppen
        onOpen(sop);        // Öppnar din SOP
      }} 
      className="document-link"
    >
      <Lucide.FileText size={14} />
      <span>
        {sop.id}: {sop.title}
      </span>
    </a>
  );
}
