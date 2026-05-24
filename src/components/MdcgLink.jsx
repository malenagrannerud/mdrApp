/**
 * src/components/MdcgLink.jsx 
 * Renderar en länk till ett MDCG-dokument. Har info-emoji (ℹ️)
 */

import React from 'react';
import * as Lucide from 'lucide-react';

export default function MdcgLink({ mdcg, onOpen }) {
  if (!mdcg) return null;

  return (
    <a 
      href="#" 
      onClick={(e) => {
        e.preventDefault(); // Hindrar sidan från att hoppa upp till toppen
        onOpen(mdcg);        // Öppnar ditt MDCG-dokument
      }} 
      className="document-link"
    >
      <Lucide.Info size={10} />
      <span>
        {mdcg.id}: {mdcg.title}
      </span>
    </a>
  );
}