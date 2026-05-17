/**
 * 
 * @file PP.jsx
 * @description Placeholder-sida för PharmaPacket. Innehållet är inte implementerat än.
 * 
 * Denna sida är avsedd att innehålla information och resurser relaterade
*/


import React, { useState } from 'react';
import { PP_DATA } from '../data/ppStepsData';
import SopTemplate from '../components/SopTemplate';
import StepDetail from '../components/StepDetail';

export default function PpPage() {
  // KORRIGERING HÄR: Lägg till [0] så att du väljer det första objektet i arrayen, inte hela listan!
  const [selected, setSelected] = useState(PP_DATA[0]);
  const [activeSop, setActiveSop] = useState(null);

  return (
    <>
      <div className="page-layout">
        <header className="mb-12">
          <h1>PHARMA PACKET</h1>
        </header>

        <div className="grid grid-cols-12 gap-12 max-w-7xl mx-auto">
          <div className="col-span-4 space-y-4">
            {PP_DATA.map((step, idx) => (
              <div 
                key={step.id} 
                onClick={() => setSelected(step)} 
                className={`p-6 border-4 cursor-pointer transition-all flex items-center gap-6 ${
                  selected?.id === step.id 
                    ? 'border-blue-700 bg-white translate-x-2' 
                    : 'border-slate-900 bg-white hover:border-blue-700'
                }`}
              >
                <span className={`font-black ${selected?.id === step.id ? 'text-blue-700' : 'text-slate-300'}`}>
                  {idx + 1}
                </span>
                <h3 className="font-black text-slate-800 text-md uppercase leading-tight">
                  {step.title}
                </h3>
              </div>
            ))}
          </div>
          <div className="col-span-8">
            {/* Nu skickas ett korrekt enskilt objekt in här och map() kommer att fungera */}
            <StepDetail selected={selected} onOpenSop={(sop) => setActiveSop(sop)} />
          </div>
        </div>
      </div>

      {activeSop && (
        <SopTemplate {...activeSop} onClose={() => setActiveSop(null)} />
      )}
    </>
  );
}
