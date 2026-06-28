{/* QMS.jsx */}

import React, { useState } from 'react';
import { QMS_DATA } from '../data/qmsStepsData';
import SopTemplate from '../components/SopTemplate';
import DocTemplate from '../components/DocTemplate';  // <-- LÄGG TILL
import StepDetail from '../components/StepDetail';

export default function QmsPage() {
  const [selected, setSelected] = useState(QMS_DATA[0]);
  const [activeSop, setActiveSop] = useState(null);
  const [activeRef, setActiveRef] = useState(null);  // <-- LÄGG TILL

  return (
    <>
      <div className="page-layout">
        <div className="grid grid-cols-12 gap-12 max-w-7xl mx-auto">
          <div className="col-span-4 space-y-4">
            {QMS_DATA.map((step, idx) => (
              <div key={step.id} onClick={() => setSelected(step)} className={`p-6 border-4 cursor-pointer transition-all flex items-center gap-6 ${selected?.id === step.id ? 'border-blue-700 bg-white translate-x-2' : 'border-slate-900 bg-white hover:border-blue-700'}`}>
                <h3 className="font-black text-slate-800 text-md uppercase leading-tight">{step.title}</h3>
              </div>
            ))}
          </div>
          <div className="col-span-8">
            <StepDetail 
              selected={selected} 
              onOpenSop={(sop) => setActiveSop(sop)}
              onOpenRef={(ref) => setActiveRef(ref)}  // <-- LÄGG TILL
            />
          </div>
        </div>
      </div>

      {/* SOP-popup */}
      {activeSop && (
        <SopTemplate {...activeSop} onClose={() => setActiveSop(null)} />
      )}

      {/* Artikel/Annex-popup */}
      {activeRef && (
        <DocTemplate
          title={activeRef.title}
          content={activeRef.content}
          onClose={() => setActiveRef(null)}
        />
      )}
    </>
  );
}