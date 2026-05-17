/**
 * 
 * @file PharmaPacket.jsx
 * @description Placeholder-sida för PharmaPacket. Innehållet är inte implementerat än.
 * 
 * Denna sida är avsedd att innehålla information och resurser relaterade
*/


import React, { useState } from 'react';
import { MDR_DATA } from '../data/mdrStepsData';
import SopTemplate from '../components/SopTemplate';
import StepDetail from '../components/StepDetail';

export default function PharmaPacketPage() {
  const [selected, setSelected] = useState(null);
  const [activeSop, setActiveSop] = useState(null);

  return (
    <>
      {/* 1. Själva sidan som går att skrolla i */}
      <div className="page-layout">
        <header className="mb-12">
          <h1>PHARMA PACKET</h1>
        </header>

        <div className="grid grid-cols-12 gap-12 max-w-7xl mx-auto">
          <div className="col-span-4 space-y-4">
            {MDR_DATA.map((step, idx) => (
              <div key={step.id} onClick={() => setSelected(step)} className={`p-6 border-4 cursor-pointer transition-all flex items-center gap-6 ${selected?.id === step.id ? 'border-blue-700 bg-white translate-x-2' : 'border-slate-900 bg-white hover:border-blue-700'}`}>
                <span className={`font-black ${selected?.id === step.id ? 'text-blue-700' : 'text-slate-300'}`}>{idx + 1}</span>
                <h3 className="font-black text-slate-800 text-md uppercase leading-tight">{step.title}</h3>
              </div>
            ))}
          </div>
          <div className="col-span-8">
            <StepDetail selected={selected} onOpenSop={(sop) => setActiveSop(sop)} />
          </div>
        </div>
      </div>

      {/* 2. POP-UPEN: Ligger nu UTANFÖR page-layout så den lägger sig fritt överst på skärmen! */}
      {activeSop && (
        <SopTemplate {...activeSop} onClose={() => setActiveSop(null)} />
      )}
    </>
  );
}
