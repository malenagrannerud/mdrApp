/**
 * MDR.jsx
 * MDR Implementation Path
 */

import React, { useState } from 'react';
import { MDR_DATA } from '../data/mdrStepsData';
import MdcgTemplate from '../components/MdcgTemplate';
import DocTemplate from '../components/DocTemplate';
import StepDetail from '../components/StepDetail';

export default function MdrPage() {
  const [selected, setSelected] = useState(MDR_DATA[0]);
  const [activeDoc, setActiveDoc] = useState(null);
  const [docType, setDocType] = useState(null);

  const handleOpenDoc = (data, type) => {
    setActiveDoc(data);
    setDocType(type);
  };

  return (
    <>
      <div className="page-layout">
        <div className="grid grid-cols-12 gap-12 max-w-7xl mx-auto">
          <div className="col-span-4 space-y-4">
            {MDR_DATA.map((step, idx) => (
              <div 
                key={step.id} 
                onClick={() => setSelected(step)} 
                className={`p-6 border-4 cursor-pointer transition-all flex items-center gap-6 ${
                  selected?.id === step.id 
                    ? 'border-blue-700 bg-white translate-x-2' 
                    : 'border-slate-900 bg-white hover:border-blue-700'
                }`}
              >
                <h3 className="font-black text-slate-800 text-md uppercase leading-tight">
                  {step.title}
                </h3>
              </div>
            ))}
          </div>

          <div className="col-span-8">
            <StepDetail 
              selected={selected} 
              onOpenMdcg={(mdcg) => handleOpenDoc(mdcg, 'mdcg')}
              onOpenDoc={(doc) => handleOpenDoc(doc, 'doc')}
              onOpenRef={(ref) => handleOpenDoc(ref, 'doc')}  // <-- LÄGG TILL
            />
          </div>
        </div>
      </div>

      {activeDoc && docType === 'mdcg' && (
        <MdcgTemplate {...activeDoc} onClose={() => setActiveDoc(null)} />
      )}
      
      {activeDoc && docType === 'doc' && (
        <DocTemplate {...activeDoc} onClose={() => setActiveDoc(null)} />
      )}
    </>
  );
}