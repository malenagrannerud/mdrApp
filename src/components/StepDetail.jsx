/**
 * src/components/StepDetail.jsx 
 *
 * 
 * StepDetail Component
 * Renderar detaljvyn för ett valt steg 
 */



import React from 'react';
import * as Lucide from 'lucide-react';
import SopLink from './SopLink';
import MdcgLink from './MdcgLink';

const StepDetail = ({ selected, onOpenSop, onOpenMdcg }) => {

  return (
    <div className="bg-white border-4 border-slate-900 p-12 animate-in fade-in duration-500 rounded-none">
      <h3 className="font-black text-slate-800 text-md uppercase leading-tight">{selected.title}</h3>
      <h3 className="main-desc">{selected.desc}</h3>
      
      {/* Lista med delsteg */}
      <div className="space-y-4">
        {selected.checklist.map((item, i) => (
          <div key={i} className="border-t-2 border-slate-100 pt-8">
            
            {/* Steg X.X) ... */}
            <h4 className="headingSubStep">{item.t}</h4>
            <h4 className="headingSubStepOrange">{item.o}</h4>
            {/* Brödtext*/}
            <p className="section-text">{item.e}</p>

            {/* Dokumentlänk - Visas endast om SOP-objekt finns i din array */}
            {item.sop && (
              <SopLink
                sop={item.sop}
                onOpen={onOpenSop} 
              />
            )}

            {/* MDCG-länk - Visas endast om summary-objekt finns */}
            {item.mdcg && (
              <MdcgLink
                mdcg={item.mdcg}
                onOpen={onOpenMdcg} 
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepDetail;
