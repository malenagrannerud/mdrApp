



import React from 'react';

export default function TabBar({ currentPage, onPageChange }) {
  return (
    <div className="tab-bar">
      
      {/* Flik 1: Home */}
      <button
        onClick={() => onPageChange('start')}
        className={`px-6 py-2 font-black text-xs uppercase tracking-widest border-4 transition-all ${
          currentPage === 'start' ? 'bg-blue-700 text-white border-blue-700' : 'bg-slate-900 text-slate-400 border-slate-900 hover:border-slate-700'
        }`}
      >
        Home
      </button>



        {/* Flik 3: MDR */}
      <button
        onClick={() => onPageChange('mdr')}
        className={`px-6 py-2 font-black text-xs uppercase tracking-widest border-4 transition-all ${
          currentPage === 'mdr' ? 'bg-blue-700 text-white border-blue-700' : 'bg-slate-900 text-slate-400 border-slate-900 hover:border-slate-700'
        }`}
      >
        MDR Path
      </button>




      {/* Flik 2: QMS */}
      <button
        onClick={() => onPageChange('qms')}
        className={`px-6 py-2 font-black text-xs uppercase tracking-widest border-4 transition-all ${
          currentPage === 'qms' ? 'bg-blue-700 text-white border-blue-700' : 'bg-slate-900 text-slate-400 border-slate-900 hover:border-slate-700'
        }`}
      >
        QMS (ISO 13485)
      </button>

      
      
    </div>
  );
}
