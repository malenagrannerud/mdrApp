/**
 * src/components/DocTemplate.jsx
 * Enkel dokumentvisning - utan metadata-board
 */

import React from 'react';
import { X } from 'lucide-react';
import SopRenderer from './SopRenderer';

const DocTemplate = ({ title, content, image, onClose }) => {
  return (
    <div className="sop-modal-overlay">
      <div className="sop-container">
        
        {/* Header - bara titel och stäng-knapp */}
        <div className="p-6 border-b-2 border-slate-900 bg-slate-50 flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-900 uppercase">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-2 border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Innehåll - utan metadata */}
        <div className="flex-1 overflow-y-auto p-12 bg-white">
          <SopRenderer content={content} image={image} title={title} />
        </div>

      </div>
    </div>
  );
};

export default DocTemplate;