import React from 'react';
import * as Lucide from 'lucide-react';
import { THEME } from '../config/theme';

/**
 * StepDetail Component
 * Renderar detaljvyn för ett valt steg (ISO/MDR).
 */
const StepDetail = ({ selected, onOpenSop }) => {
  const { borderRadius, styles, labels } = THEME;

  // 1. Om inget är valt - Visa placeholder
  if (!selected) {
    return (
      <div className={`h-full min-h-[400px] flex flex-col items-center justify-center text-slate-300 border-4 border-dashed border-slate-100 ${borderRadius}`}>
        <Lucide.Search size={64} className="opacity-20 mb-6" />
        <p className="font-black text-lg uppercase tracking-widest opacity-30">
          Select a step to begin
        </p>
      </div>
    );
  }

  // 2. Om ett steg är valt - Visa innehållet
  return (
    <div className={`bg-white border-4 border-slate-900 p-12 animate-in fade-in duration-500 ${borderRadius}`}>
      
      {/* Huvudtitel och beskrivning från temat */}
      <h2 className={styles.mainTitle}>
        {selected.title}
      </h2>
      
      <p className={styles.mainDesc}>
        {selected.desc}
      </p>
      
      {/* Lista med delsteg */}
      <div className="space-y-10">
        {selected.checklist.map((item, i) => (
          <div key={i} className="border-t-2 border-slate-100 pt-8">
            
            {/* Delrubrik - t.ex. "Step 1.1) Validation" */}
            <h3 className={styles.contentHeading1}>
              {item.t}
            </h3>
            
            {/* Brödtext/Instruktion */}
            <p className={styles.sectionText}>
              {item.e}
            </p>

            {/* Dokumentlänk - Visas endast om SOP-objekt finns */}
            {item.sop && (
              <button 
                onClick={() => onOpenSop(item.sop)}
                className={styles.linkButton}
              >
                <Lucide.FileText size={20} />
                <span className="underline decoration-2 underline-offset-4">
                  {labels.viewButton} {item.sop.id}: {item.sop.title}
                </span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepDetail;
