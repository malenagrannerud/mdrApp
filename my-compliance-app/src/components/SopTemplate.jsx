import React from 'react';
import { X, Printer, FileText } from 'lucide-react';

/**
 * @component SopTemplate
 * @description En universell komponent för att visa formella SOP-mallar.
 * @param {string} title - Dokumentets namn
 * @param {string} docId - Dokument-ID (t.ex. SOP-001)
 * @param {string} version - Nuvarande version
 * @param {string} owner - Processägare
 * @param {string} content - Dokumentets textinnehåll (Markdown-liknande)
 * @param {function} onClose - Funktion för att stänga vyn
 */
const SopTemplate = ({ title, docId, version, owner, content, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <FileText size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Standard Operating Procedure</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-900">
            <X size={32} />
          </button>
        </div>

        {/* Metadata Bar */}
        <div className="grid grid-cols-3 gap-4 px-8 py-4 bg-slate-100/50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          <div>ID: <span className="text-slate-900">{docId}</span></div>
          <div>Version: <span className="text-slate-900">{version}</span></div>
          <div>Ägare: <span className="text-slate-900">{owner}</span></div>
        </div>

        {/* Document Body */}
        <div className="flex-1 overflow-y-auto p-12 bg-white text-slate-700 leading-relaxed">
          <div className="prose prose-slate max-w-none">
            {content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-black mb-6 mt-2 border-b-2 border-slate-100 pb-2">{line.replace('# ', '')}</h1>;
              if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mb-4 mt-8 text-slate-800">{line.replace('## ', '')}</h2>;
              if (line.startsWith('- ')) return <li key={i} className="ml-4 mb-1 list-disc">{line.replace('- ', '')}</li>;
              return <p key={i} className="mb-4">{line}</p>;
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all active:scale-95">
            <Printer size={18} /> Skriv ut som PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default SopTemplate;
