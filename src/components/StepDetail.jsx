import React from 'react';
import * as Lucide from 'lucide-react';

/**
 * StepDetail Component
 * Renderar detaljvyn för ett valt steg (ISO/MDR).
 */
const StepDetail = ({ selected, onOpenSop }) => {

  // 1. Inget är valt - Visa placeholder
  if (!selected) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-300 border-4 border-dashed border-slate-100 rounded-none">
        <Lucide.Search size={64} className="opacity-20 mb-6" />
        <p className="font-black text-lg uppercase tracking-widest opacity-30">
          Select a step to begin
        </p>
      </div>
    );
  }

  // 2. Om ett steg är valt - Visa innehållet
  return (
    <div className="bg-white border-4 border-slate-900 p-12 animate-in fade-in duration-500 rounded-none">
            <h3 className="headingStep">
        {selected.title}
      </h3>
      
      <h3 className="main-desc">
        {selected.desc}
      </h3>
      
      {/* Lista med delsteg */}
      <div className="space-y-10">
        {selected.checklist.map((item, i) => (
          <div key={i} className="border-t-2 border-slate-100 pt-8">
            
            {/* Steg X.X) ... */}
            <h3 className="headingStep">
              {item.t}
            </h3>
            
            {/* Brödtext*/}
            <p className="section-text">
              {item.e}
            </p>

            {/* Dokumentlänk - Visas endast om SOP-objekt finns */}
            {item.sop && (
              
              <button 
                onClick={() => onOpenSop(item.sop)}
                className="link-button"
              >
                <Lucide.FileText size={14} />
                <span className="underline decoration-2 underline-offset-4"> {item.sop.id}: {item.sop.title}
                </span>
              </button>

            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepDetail;
