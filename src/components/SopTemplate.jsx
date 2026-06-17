/**
 * src/components/SopTemplate.jsx 
 */

import React from 'react';
import { X } from 'lucide-react';
import SopRenderer from './SopRenderer'; // Importera ditt nya bibliotek!

const SopTemplate = ({ title, id, version, owner, content, image, onClose }) => {
  return (
    <div className="sop-modal-overlay">
      <div className="sop-container">
        
        {/* Header */}
        <div className="p-6 border-b-2 border-slate-900 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Metadata Bar */}
        <div className="grid grid-cols-3 gap-0 border-b-2 border-slate-900">
          <div className="metadata-box">
            <span className="metadata-label">Document ID</span>
            <span className="metadata-value">{id}</span>
          </div>
          <div className="metadata-box">
            <span className="metadata-label">Revision</span>
            <span className="metadata-value">{version}</span>
          </div>
          <div className="p-4 bg-white">
            <span className="metadata-label">Process Owner</span>
            <span className="metadata-value">{owner}</span>
          </div>
        </div>

        {/* Innehåll */}
        <div className="flex-1 overflow-y-auto p-12 bg-white">
          {/* Använd biblioteket här för att rendera texten och placera bilden rätt */}
          <SopRenderer content={content} image={image} title={title} />
        </div>

      </div>
    </div>
  );
};

export default SopTemplate;
