/**
 * src/components/StepDetail.jsx 
 * Skapar detaljvyn för ett valt steg.
 * 
 */

import React from 'react';
import Link from './Link';

/**
 * Hjälpfunktion som visar SOPar osv i filstrukturen
 * 
 */
const extractFolderName = (line) => {
  const match = line.match(/📁\s+(.+)/);
  return match ? match[1].trim() : null;
};


/**
 * ChecklistItem: komponent som renderar en punkt i en checklista.
 * Den hanterar allt innehåll för ett specifikt delsteg (sub-step) och fattar beslut baserat på datan:
 * - Om texten har (emoji (📁) && 'files'-objekt) --> interaktivt filträd .
 * - Om det finns länkdata för 'sop', 'doc' eller 'mdcg' (som sträng eller array) --> <Link />-komponenter.
 * - Om punkten har en egen under-checklista ('checklist'), anropar komponenten sig själv rekursivt.
 * 
 */

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
                
                // Vi skapar ett modifierat data-objekt där vi lägger till indraget direkt på titeln
                // så att din existerande <Link /> kan rendera det identiskt.
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
      
      {item.t && <h4 className="headingSubStep">{item.t}</h4>}
      {item.r && <p className="article-ref">{item.r}</p>}
      
      {item.e && (
        item.e.includes('📁') && item.files ? (
          renderTreeStructure(item.e, item.files)
        ) : (

          /**
           *  Visar text så som jag skriver med whitespace och radbrytningar 
           * 
          */
          <p className={item.e.includes('📁') ? 'tree-structure font-mono text-sm whitespace-pre-wrap' : 'section-text whitespace-pre-line'}>
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
