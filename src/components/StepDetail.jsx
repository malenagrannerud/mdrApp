/**
 * src/components/StepDetail.jsx 
 *
 * StepDetail Component
 * Renderar detaljvyn för ett valt steg 
 */

import React from 'react';
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
            {item.t && <h4 className="headingSubStep">{item.t}</h4>}
            {item.o && <h4 className="headingSubStepOrange">{item.o}</h4>}
            
            {/* Brödtext*/}
            {item.e && <p className="section-text">{item.e}</p>}

            {/* Dokumentlänk - Visas endast om SOP-objekt finns */}
            {item.sop && (
              <SopLink sop={item.sop} onOpen={onOpenSop} />
            )}

            {/* mdr-länk - Visas endast om mdr-objekt finns */}
            {item.mdr && (
              <MdcgLink mdcg={item.mdr} onOpen={onOpenMdcg} />
            )}

            {/* MDCG-länk - Visas endast om mdcg-objekt finns */}
            {item.mdcg && (
              <MdcgLink mdcg={item.mdcg} onOpen={onOpenMdcg} />
            )}

            {/* Nästlad checklista */}
            {item.checklist && (
              <div className="ml-4 mt-3 space-y-2">
                {item.checklist.map((subItem, j) => (
                  <div key={j}>
                    {subItem.t && <h4 className="headingSubStep text-sm">{subItem.t}</h4>}
                    {subItem.e && <p className="section-text text-xs">{subItem.e}</p>}
                    {subItem.sop && (
                      <SopLink sop={subItem.sop} onOpen={onOpenSop} />
                    )}
                    {subItem.mdcg && (
                      <MdcgLink mdcg={subItem.mdcg} onOpen={onOpenMdcg} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepDetail;