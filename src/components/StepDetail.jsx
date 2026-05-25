/**
 * src/components/StepDetail.jsx 
 *
 * StepDetail Component
 * Renderar detaljvyn för ett valt steg.
 */

import React from 'react';
import Link from './Link';

const extractFolderName = (line) => {
  const match = line.match(/📁\s+(.+)/);
  return match ? match[1].trim() : null;
};

const ChecklistItem = ({ item, onOpenSop, onOpenMdcg, onOpenDoc }) => {

  const renderTreeStructure = (text, files) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    const fileMap = files || {};
    
    return (
      <div className="tree-structure font-mono text-sm">
        {lines.map((line, i) => {
          const folderName = extractFolderName(line);
          const hasFiles = folderName && fileMap[folderName];
          
          return (
            <div key={i}>
              <div>{line}</div>
              {hasFiles && fileMap[folderName].map((file, j) => {
                const indent = file.indent || '  ';
                const label = file.label || file.sop?.title || file.doc?.title || file.mdcg?.title || '';
                
                return (
                  <div key={j} style={{ whiteSpace: 'pre' }}>
                    {file.sop && (
                      <a href="#" onClick={(e) => { e.preventDefault(); onOpenSop(file.sop); }}>
                        {indent}{label}
                      </a>
                    )}
                    {file.doc && (
                      <a href="#" onClick={(e) => { e.preventDefault(); onOpenDoc(file.doc); }}>
                        {indent}{label}
                      </a>
                    )}
                    {file.mdcg && (
                      <a href="#" onClick={(e) => { e.preventDefault(); onOpenMdcg(file.mdcg); }}>
                        {indent}{label}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={item.t ? 'pt-8' : 'pt-0'}>
      
      {item.t && <h4 className="headingSubStep">{item.t}</h4>}
      {item.r && <p className="article-ref">{item.r}</p>}
      
      {item.e && (
        item.e.includes('📁') && item.files ? (
          renderTreeStructure(item.e, item.files)
        ) : (
          <p className={item.e.includes('📁') ? 'tree-structure' : 'section-text'}>
            {item.e}
          </p>
        )
      )}

      {item.sop && (
        Array.isArray(item.sop) ? (
          item.sop.map((s, idx) => (
            <Link key={idx} type="sop" data={s} onOpenSop={onOpenSop} onOpenDoc={onOpenDoc} onOpenMdcg={onOpenMdcg} />
          ))
        ) : (
          <Link type="sop" data={item.sop} onOpenSop={onOpenSop} onOpenDoc={onOpenDoc} onOpenMdcg={onOpenMdcg} />
        )
      )}

      {item.doc && (
        Array.isArray(item.doc) ? (
          item.doc.map((d, idx) => (
            <Link key={idx} type="doc" data={d} onOpenSop={onOpenSop} onOpenDoc={onOpenDoc} onOpenMdcg={onOpenMdcg} />
          ))
        ) : (
          <Link type="doc" data={item.doc} onOpenSop={onOpenSop} onOpenDoc={onOpenDoc} onOpenMdcg={onOpenMdcg} />
        )
      )}  

      {item.mdcg && (
        Array.isArray(item.mdcg) ? (
          item.mdcg.map((m, idx) => (
            <Link key={idx} type="mdcg" data={m} onOpenSop={onOpenSop} onOpenDoc={onOpenDoc} onOpenMdcg={onOpenMdcg} />
          ))
        ) : (
          <Link type="mdcg" data={item.mdcg} onOpenSop={onOpenSop} onOpenDoc={onOpenDoc} onOpenMdcg={onOpenMdcg} />
        )
      )}

      {item.checklist && (
        <div className="space-y-0 ml-4 border-l-2 border-slate-200 pl-4">
          {item.checklist.map((subItem, j) => (
            <ChecklistItem 
              key={j} 
              item={subItem} 
              onOpenSop={onOpenSop} 
              onOpenMdcg={onOpenMdcg} 
              onOpenDoc={onOpenDoc} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const StepDetail = ({ selected, onOpenSop, onOpenMdcg, onOpenDoc }) => {

  return (
    <div className="bg-white border-4 border-slate-900 p-12 animate-in fade-in duration-500 rounded-none">
      
      <h3 className="font-black text-slate-800 text-md uppercase leading-tight">
        {selected.title}
      </h3>
      
      <h3 className="main-desc">{selected.desc}</h3>
      
      <div className="space-y-0">
        {selected.checklist.map((item, i) => (
          <ChecklistItem 
            key={i} 
            item={item} 
            onOpenSop={onOpenSop} 
            onOpenMdcg={onOpenMdcg} 
            onOpenDoc={onOpenDoc} 
          />
        ))}
      </div>
    </div>
  );
};

export default StepDetail;