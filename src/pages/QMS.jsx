
{/* QMS.jsx */}




import React, { useState } from 'react';
import { QMS_DATA } from '../data/qmsStepsData';
import SopTemplate from '../components/SopTemplate';
import StepDetail from '../components/StepDetail';

export default function QmsPage() {
  const [selected, setSelected] = useState(QMS_DATA[0]);
  const [activeSop, setActiveSop] = useState(null);

  return (
    <>
      {/* 1. Själva sidan som går att skrolla i */}
      <div className="page-layout">
        <header className="mb-12">
          <h1>QMS Implementation</h1>
        </header>

        <div className="grid grid-cols-12 gap-12 max-w-7xl mx-auto">
          <div className="col-span-4 space-y-4">
            {QMS_DATA.map((step, idx) => (
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

      {/* 2. POP-UPEN som visar SOP: */}
      {activeSop && (
        <SopTemplate {...activeSop} onClose={() => setActiveSop(null)} />
      )}
    </>



  );
}
