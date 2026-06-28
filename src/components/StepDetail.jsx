/**
 * @file src/components/StepDetail.jsx
 * @description Detaljvy för ett valt MDR- eller QMS-steg.
 * 
 * ChecklistItem — renderar t, r, e, sop, doc, mdcg, filstruktur och under-checklistor rekursivt.
 * parseInlineRefs används för att göra **Art.2(1)** och **Ax.II** klickbara inline.
 * 
 * @param {object} selected - Det valda steget från MDR_DATA eller QMS_DATA
 * @param {function} onOpenSop - Öppnar SOP-popup
 * @param {function} onOpenMdcg - Öppnar MDCG-popup
 * @param {function} onOpenDoc - Öppnar dokument-popup
 * @param {function} onOpenRef - Öppnar artikel/annex-popup från inline-referenser
 */

import React from 'react';
import Link from './Link';
import { parseInlineRefs } from '../helpers/parseInlineRefs.jsx';

const extractFolderName = (line) => {
  const match = line.match(/📁\s+(.+)/);
  return match ? match[1].trim() : null;
};

const ChecklistItem = ({ item, onOpenSop, onOpenMdcg, onOpenDoc, onOpenRef }) => {

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
                
                if (file.sop) {
                  const modifiedSop = { ...file.sop, title: `${indent}${file.sop.title}` };
                  return <Link key={j} type="sop" data={modifiedSop} onOpenSop={onOpenSop} onOpenDoc={onOpenDoc} onOpenMdcg={onOpenMdcg} />;
                }
                if (file.doc) {
                  const modifiedDoc = { ...file.doc, title: `${indent}${file.doc.title}` };
                  return <Link key={j} type="doc" data={modifiedDoc} onOpenSop={onOpenSop} onOpenDoc={onOpenDoc} onOpenMdcg={onOpenMdcg} />;
                }
                if (file.mdcg) {
                  const modifiedMdcg = { ...file.mdcg, title: `${indent}${file.mdcg.title}` };
                  return <Link key={j} type="mdcg" data={modifiedMdcg} onOpenSop={onOpenSop} onOpenDoc={onOpenDoc} onOpenMdcg={onOpenMdcg} />;
                }
                return null;
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={item.t ? 'pt-8' : 'pt-0'}>
      
      {item.t && <h4 className="headingSubStep">{parseInlineRefs(item.t, onOpenRef)}</h4>}
      {item.r && <p className="article-ref section-text whitespace-pre-line">{parseInlineRefs(item.r, onOpenRef)}</p>}
      
      {item.e && (
        item.e.includes('📁') && item.files ? (
          renderTreeStructure(item.e, item.files)
        ) : (
          <p className={item.e.includes('📁') ? 'tree-structure font-mono text-sm whitespace-pre-wrap' : 'section-text whitespace-pre-line'}>
            {parseInlineRefs(item.e, onOpenRef)}
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
              onOpenRef={onOpenRef}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const StepDetail = ({ selected, onOpenSop, onOpenMdcg, onOpenDoc, onOpenRef }) => {

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
            onOpenRef={onOpenRef}
          />
        ))}
      </div>
    </div>
  );
};

export default StepDetail;