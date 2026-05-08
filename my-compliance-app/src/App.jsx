import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import SopTemplate from './components/SopTemplate';

const DATA = {
  mdr: [
    { id: 'm1', title: '1. Klassificering (Annex VIII)', desc: 'Fastställ produktens riskklass baserat på dess avsedda ändamål.', checklist: [{ t: 'Klassificeringsrapport', e: 'Produkten är Klass IIa enligt Regel 11 för mjukvara som fattar beslut för diagnostiska syften.' }] },
    { id: 'm2', title: '2. Tekniska kraven (GSPR)', desc: 'Mappa produkten mot de allmänna kraven på säkerhet och prestanda i Annex I.', checklist: [{ t: 'GSPR-checklista', e: 'Krav 17: Mjukvarulivscykeln följer gällande standarder för mjukvara för medicinteknik.' }] },
    { id: 'm3', title: '3. Teknisk dokumentation', desc: 'Sammanställ den tekniska filen enligt Annex II och III.', checklist: [{ t: 'Technical File Index', e: 'Innehåll: Produktbeskrivning, Riskanalys, Klinisk utvärdering och PMS-plan.' }] },
    { id: 'm4', title: '4. Ansvarig person (PRRC)', desc: 'Utse en person ansvarig för regelefterlevnad enligt Artikel 15.', checklist: [{ t: 'Utnämningsbrev PRRC', e: 'PRRC ansvarar för att teknisk dokumentation och EU-försäkran om överensstämmelse upprätthålls.' }] }
  ],
   
  postMarket: [
    { q: 'Q1', title: 'PMS & Datainsamling', tasks: ['Samla in kundfeedback', 'Internrevision del 1', 'Leverantörsutvärdering'] },
    { q: 'Q2', title: 'Ledningens genomgång', tasks: ['Håll Management Review', 'Analysera kvalitetstrender'] },
    { q: 'Q3', title: 'Riskuppdatering', tasks: ['Översyn av riskanalys', 'Internrevision del 2'] },
    { q: 'Q4', title: 'Rapportering', tasks: ['Färdigställ PSUR/PMSR', 'Sätt mål för nästa år'] }
  ]
};

export default function App() {
  const [tab, setTab] = useState('iso');
  const [selected, setSelected] = useState(null);
  const activeSteps = tab === 'mdr' ? DATA.mdr : DATA.iso;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-80 bg-slate-950 text-slate-400 p-8 flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 text-white mb-16 px-2">
          <Lucide.ShieldCheck className="text-blue-500" size={32} />
          <span className="font-black text-xl tracking-tighter uppercase italic text-white">QMS Navigator</span>
        </div>
        <div className="space-y-4 flex-1">
          <button onClick={() => {setTab('iso'); setSelected(null)}} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold ${tab === 'iso' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-900 hover:text-slate-200'}`}><Lucide.ClipboardList size={22}/> QMS (ISO 13485)</button>
          <button onClick={() => {setTab('mdr'); setSelected(null)}} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold ${tab === 'mdr' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-900 hover:text-slate-200'}`}><Lucide.LayoutDashboard size={22}/> MDR Path</button>
          <button onClick={() => {setTab('post'); setSelected(null)}} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold ${tab === 'post' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-900 hover:text-slate-200'}`}><Lucide.RefreshCcw size={22}/> Post-Market Cycle</button>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mt-auto">Compliance Suite v1.0</p>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-16 overflow-y-auto bg-slate-50">
        <header className="mb-16">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-4 uppercase">{tab === 'iso' ? 'QMS Implementation' : tab === 'mdr' ? 'MDR Path' : 'Annual Cycle'}</h1>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Generell Guide för Medicinteknisk Produkt</p>
        </header>

        {tab === 'post' ? (
          <div className="grid grid-cols-2 gap-6 animate-in fade-in duration-700">
            {DATA.postMarket.map(item => (
              <div key={item.q} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black tracking-widest mb-4 inline-block">{item.q}</span>
                <h3 className="text-xl font-bold mb-4 text-slate-800">{item.title}</h3>
                <ul className="space-y-3">
                  {item.tasks.map((t, i) => (<li key={i} className="text-sm text-slate-500 flex items-start gap-3"><Lucide.CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" /><span>{t}</span></li>))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-12">
            {/* Steps List */}
            <div className="col-span-5 space-y-4">
              {activeSteps.map((step, idx) => (
                <div key={step.id} onClick={() => setSelected(step)} className={`p-6 bg-white rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-6 ${selected?.id === step.id ? 'border-blue-600 shadow-2xl translate-x-3' : 'border-transparent hover:border-slate-200 shadow-sm'}`}>
                  <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${selected?.id === step.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{idx + 1}</span>
                  <div className="flex-1">
                    <h3 className="font-black text-slate-800 text-lg leading-tight">{step.title}</h3>
                  </div>
                  <Lucide.ChevronRight size={20} className={selected?.id === step.id ? 'text-blue-600' : 'text-slate-200'} />
                </div>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="col-span-7">
              {selected ? (
                <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-12 sticky top-0 animate-in fade-in duration-500">
                  <h2 className="text-3xl font-black text-slate-900 mb-6">{selected.title}</h2>
                  <p className="text-slate-500 text-lg leading-relaxed mb-12 font-medium">{selected.desc}</p>
                  <div className="space-y-8">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                      <Lucide.FileText size={14} /> Dokumentation & Exempel
                    </h4>
                    {selected.checklist.map((item, i) => (
                      <div key={i} className="p-8 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                        <p className="font-black text-slate-800 italic mb-4">📄 {item.t}</p>
                        <div className="pl-6 border-l-4 border-blue-600/20">
                          <p className="text-[10px] font-black text-blue-600 uppercase mb-2">Beskrivning/Mall-exempel:</p>
                          <p className="text-sm text-slate-600 font-mono italic leading-relaxed bg-white p-4 rounded-xl border">"{item.e}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-300 border-4 border-dashed border-slate-100 rounded-[2.5rem]">
                  <Lucide.Search size={64} className="opacity-20 mb-6" />
                  <p className="font-black text-lg uppercase tracking-widest opacity-30">Välj ett steg till vänster</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
