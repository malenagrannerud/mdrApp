import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { MDR_DATA } from './config/mdrData';
import { QMS_DATA } from './config/qmsData';
import { PMS_DATA } from './config/pmsData';

// Nya importer
import SopTemplate from './components/SopTemplate';
import StepDetail from './components/StepDetail';

export default function App() {
  const [tab, setTab] = useState('iso');
  const [selected, setSelected] = useState(null);
  const [activeSop, setActiveSop] = useState(null);

  const activeSteps = tab === 'mdr' ? MDR_DATA : tab === 'iso' ? QMS_DATA : [];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar - Samma som förut */}
      <nav className="w-80 bg-slate-950 text-slate-400 p-8 flex flex-col shadow-2xl border-r-4 border-slate-900">
        <div className="flex items-center gap-3 text-white mb-16 px-2">
          <Lucide.ShieldCheck className="text-blue-500" size={32} />
          <span className="font-black text-xl tracking-tighter uppercase italic">Navigator</span>
        </div>
        <div className="space-y-4 flex-1">
          {['iso', 'mdr', 'post'].map((t) => (
            <button 
              key={t}
              onClick={() => {setTab(t); setSelected(null)}} 
              className={`w-full flex items-center gap-4 p-4 font-bold transition-all ${tab === t ? 'bg-blue-700 text-white' : 'hover:bg-slate-900'}`}
            >
              {t === 'iso' && <Lucide.ClipboardList size={22}/>}
              {t === 'mdr' && <Lucide.LayoutDashboard size={22}/>}
              {t === 'post' && <Lucide.RefreshCcw size={22}/>}
              <span className="uppercase tracking-widest text-sm">
                {t === 'iso' ? 'QMS Implementation' : t === 'mdr' ? 'MDR Path' : 'Post-Market'}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-16 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-4 uppercase">
            {tab === 'iso' ? 'QMS' : tab === 'mdr' ? 'MDR' : 'PMS'}
          </h1>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em]">Medical Device Compliance Navigator</p>
        </header>

        {tab === 'post' ? (
          /* Årshjulet - flytta gärna ut denna också senare */
          <div className="grid grid-cols-2 gap-6">
            {PMS_DATA.map(item => (
              <div key={item.q} className="p-8 bg-white border-4 border-slate-900 shadow-none">
                <span className="bg-slate-900 text-white px-4 py-1 text-xs font-black mb-4 inline-block">{item.q}</span>
                <h3 className="text-xl font-bold mb-4 uppercase">{item.title}</h3>
                <ul className="space-y-3">
                  {item.tasks.map((t, i) => (
                    <li key={i} className="text-sm text-slate-500 flex items-start gap-3">
                      <Lucide.CheckCircle2 size={16} className="text-blue-600 mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-12">
            {/* Steps List (Left) */}
            <div className="col-span-4 space-y-4">
              {activeSteps.map((step, idx) => (
                <div 
                  key={step.id} 
                  onClick={() => setSelected(step)} 
                  className={`p-6 border-4 cursor-pointer transition-all flex items-center gap-6 ${selected?.id === step.id ? 'border-blue-700 bg-white translate-x-2' : 'border-slate-900 bg-white hover:border-blue-700'}`}
                >
                  <span className={`w-10 h-10 flex items-center justify-center font-black ${selected?.id === step.id ? 'text-blue-700' : 'text-slate-300'}`}>
                    {idx + 1}
                  </span>
                  <h3 className="font-black text-slate-800 text-md uppercase leading-tight">{step.title}</h3>
                </div>
              ))}
            </div>

            {/* Detail Panel (Right) - NU SOM EGEN KOMPONENT */}
            <div className="col-span-8">
              <StepDetail 
                selected={selected} 
                onOpenSop={(sop) => setActiveSop(sop)} 
              />
            </div>
          </div>
        )}
      </main>

      {/* Modal - Samma som förut */}
      {activeSop && (
        <SopTemplate {...activeSop} onClose={() => setActiveSop(null)} />
      )}
    </div>
  );
}
