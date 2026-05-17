/**
 * src/components/StepDetail.jsx 
 */



import React from 'react';
import * as Lucide from 'lucide-react';
import SopLink from './SopLink';

/**
 * StepDetail Component
 * Renderar detaljvyn för ett valt steg (ISO/MDR/Pharma).
 */
// ÄNDRING HÄR: Vi ser till att komponenten tar emot onOpenSop korrekt från föräldern
const StepDetail = ({ selected, onOpenSop }) => {

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

            {/* Dokumentlänk - Visas endast om SOP-objekt finns i din array */}
            {item.sop && (
              <SopLink
                sop={item.sop}
                /* 
                  KORRIGERING HÄR: 
                  Vi skickar vidare onOpenSop-funktionen till SopLink:s onOpen-prop.
                  Detta gör att klicket i SopLink faktiskt bubblar upp till ditt state!
                */
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
