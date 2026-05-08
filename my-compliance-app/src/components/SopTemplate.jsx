


import React from 'react';
import { X, FileText } from 'lucide-react';
import { THEME } from '../config/theme';

const SopTemplate = ({ title, docId, version, owner, content, onClose }) => {
  const { labels, styles, borderRadius } = THEME;

  return (
    <div className={styles.sopModalOverlay}>
      <div className={`${styles.sopContainer} ${borderRadius}`}>
        
        {/* Header */}
        <div className={`p-6 border-b-2 border-slate-900 ${THEME.colors.headerBg} flex justify-between items-center`}>
          <div>
            <div className="flex items-center gap-2 text-slate-900 mb-1">
              <FileText size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{labels.qmsHeader}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Metadata Bar */}
        <div className="grid grid-cols-3 gap-0 border-b-2 border-slate-900">
          <div className={styles.metadataBox}>
            <span className={styles.metadataLabel}>{labels.docId}</span>
            <span className="text-sm text-slate-900">{docId}</span>
          </div>
          <div className={styles.metadataBox}>
            <span className={styles.metadataLabel}>{labels.revision}</span>
            <span className="text-sm text-slate-900">{version}</span>
          </div>
          <div className="p-4 bg-white">
            <span className={styles.metadataLabel}>{labels.processOwner}</span>
            <span className="text-sm text-slate-900">{owner}</span>
          </div>
        </div>

        {/* Innehållshantering */}
        <div className="flex-1 overflow-y-auto p-12 bg-white">
          <div className="max-w-none prose">
            {content && content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className={styles.contentHeading1}>{line.replace('# ', '')}</h1>;
              if (line.startsWith('## ')) return <h2 key={i} className={styles.contentHeading2}>{line.replace('## ', '')}</h2>;
              if (line.startsWith('- ')) return <li key={i} className="ml-4 mb-2 border-l-4 border-slate-200 pl-4 font-bold italic">{line.replace('- ', '')}</li>;
              return line.trim() !== '' ? <p key={i} className="mb-4 text-sm font-medium">{line}</p> : <div key={i} className="h-4" />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SopTemplate;
