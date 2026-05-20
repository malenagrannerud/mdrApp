

/**
 * src/components/DocTemplate.jsx 
 */

import React from 'react';
import { X, FileText } from 'lucide-react';

const DocTemplate = ({ title, content, onClose }) => {
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

        {/* Innehåll */}
        <div className="flex-1 overflow-y-auto p-12 bg-white">
          <div className="max-w-none">
            {content && content.split('\n').map((line, i) => {
              const cleanLine = line.trim();




              // Bild: ![alt-text](url)
              if (cleanLine.startsWith('![') && cleanLine.includes('](')) {
                const altMatch = cleanLine.match(/^!\[(.*?)\]\((.*?)\)$/);
                if (altMatch) {
                  const [, alt, src] = altMatch;
                  return (
                    <figure key={i} className="my-6 border-2 border-slate-300">
                      <img 
                        src={src} 
                        alt={alt} 
                        className="w-full h-auto"
                        loading="lazy"
                      />
                      {alt && (
                        <figcaption className="p-3 bg-slate-50 text-sm text-slate-600 border-t-2 border-slate-300">
                          {alt}
                        </figcaption>
                      )}
                    </figure>
                  );
                }
              }








              // Rubrik 1: # Text
              if (cleanLine.startsWith('# ')) { 
                return (
                  <p key={i} className="sop-h1">
                    {cleanLine.replace('# ', '')}
                  </p>
                );
              }

              // Rubrik 2: ## Text
              if (cleanLine.startsWith('## ')) { 
                return (
                  <p key={i} className="sop-h2">
                    {cleanLine.replace('## ', '')}
                  </p>
                );
              }

              // Lista: - Text
              if (cleanLine.startsWith('- ')) {
                return (
                  <p key={i} className="sop-list">
                    {cleanLine.replace('- ', '')}
                  </p>
                );
              }

              // Vanlig text
              return cleanLine !== '' ? (
                <p key={i} className="sop-text">{cleanLine}</p>
              ) : (
                <div key={i} className="h-4" />
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DocTemplate;