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
  const [activeDoc, setActiveDoc] = useState(null);  // För både MDCG och DOC
  const [docType, setDocType] = useState(null);      // 'mdcg' eller 'doc'

  const handleOpenDoc = (data, type) => {
    setActiveDoc(data);
    setDocType(type);
  };

  return (
    <>
      {/* 1. Själva sidan */}
      <div className="page-layout">
        <header className="mb-12">
          <h1>MDR PATH</h1>
        </header>

        <div className="grid grid-cols-12 gap-12 max-w-7xl mx-auto">
          {/* Steg-lista */}
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
                <span className={`font-black ${
                  selected?.id === step.id ? 'text-blue-700' : 'text-slate-300'
                }`}>
                  {idx}
                </span>
                <h3 className="font-black text-slate-800 text-md uppercase leading-tight">
                  {step.title}
                </h3>
              </div>
            ))}
          </div>

          {/* Detalj-vy */}
          <div className="col-span-8">
            <StepDetail 
              selected={selected} 
              onOpenMdcg={(mdcg) => handleOpenDoc(mdcg, 'mdcg')}
              onOpenDoc={(doc) => handleOpenDoc(doc, 'doc')}
            />
          </div>
        </div>
      </div>

      {/* 2. POP-UP för dokument */}
      {activeDoc && docType === 'mdcg' && (
        <MdcgTemplate {...activeDoc} onClose={() => setActiveDoc(null)} />
      )}
      
      {activeDoc && docType === 'doc' && (
        <DocTemplate {...activeDoc} onClose={() => setActiveDoc(null)} />
      )}
    </>
  );
}
