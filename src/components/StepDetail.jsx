import React from 'react';
import * as Lucide from 'lucide-react';
import SopLink from './SopLink';


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
      <h3 className="font-black text-slate-800 text-md uppercase leading-tight">{selected.title}</h3>
      <h3 className="main-desc">{selected.desc}</h3>
      
      {/* Lista med delsteg */}
      <div className="space-y-10">
        {selected.checklist.map((item, i) => (
          <div key={i} className="border-t-2 border-slate-100 pt-8">
            
            {/* Steg X.X) ... */}
            <h4 className="headingSubStep">{item.t}</h4>
            
            {/* Brödtext*/}
            <p className="section-text">{item.e}</p>

            {/* Dokumentlänk - Visas endast om SOP-objekt finns */}
            {item.sop && (
              
              <SopLink
                sop={item.sop} 
                onOpen={onOpenSop} 
              />

            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepDetail;
