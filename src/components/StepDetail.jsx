/**
 * src/components/StepDetail.jsx 
 *
 * StepDetail Component
 * Renderar detaljvyn för ett valt steg 
 */

import React from 'react';
import SopLink from './SopLink';
import MdcgLink from './MdcgLink';
import DocLink from './DocLink';

const StepDetail = ({ selected, onOpenSop, onOpenMdcg, onOpenDoc }) => {

  return (
    <div className="bg-white border-4 border-slate-900 p-12 animate-in fade-in duration-500 rounded-none">
      <h3 className="font-black text-slate-800 text-md uppercase leading-tight">{selected.title}</h3>
      <h3 className="main-desc">{selected.desc}</h3>
      
      {/* Lista med delsteg */}
      <div className="space-y-0">
        {selected.checklist.map((item, i) => (
          <div key={i} className={item.t ? 'pt-8' : 'pt-0'}>
            
            {/* Steg X.X) ... */}
            {item.t && <h4 className="headingSubStep">{item.t}</h4>}
            
            {/* Artikelreferens */}
            {item.r && <p className="article-ref">{item.r}</p>}
            
            {/* Brödtext */}
            {item.e && (
              <p className={item.e && item.e.includes('📁') ? 'tree-structure' : 'section-text'}>
                {item.e}
              </p>
            )}

            {/* SOP-länk */}
            {item.sop && (
              <SopLink sop={item.sop} onOpen={onOpenSop} />
            )}

            {/* DOC-länk */}
            {item.doc && (
              <DocLink doc={item.doc} onOpen={onOpenDoc} />
            )}  

            {/* MDCG-länk */}
            {item.mdcg && (
              <MdcgLink mdcg={item.mdcg} onOpen={onOpenMdcg} />
            )}

            {/* Nästlad checklista */}
            {item.checklist && (
              <div className="space-y-0">
                {item.checklist.map((subItem, j) => (
                  <div key={j}>
                    {subItem.t && <h4 className="headingSubStep text-sm">{subItem.t}</h4>}
                    {subItem.r && <p className="article-ref text-xs">{subItem.r}</p>}
                    {subItem.e && <p className="section-text text-xs">{subItem.e}</p>}
                    {subItem.sop && (
                      <SopLink sop={subItem.sop} onOpen={onOpenSop} />
                    )}
                    {subItem.doc && (
                      <DocLink doc={subItem.doc} onOpen={onOpenDoc} />
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