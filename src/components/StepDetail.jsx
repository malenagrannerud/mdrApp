/**
 * src/components/StepDetail.jsx 
 *
 * StepDetail Component
 * Renderar detaljvyn för ett valt steg.
 * Använder den rekursiva ChecklistItem för att stödja nästlade checklistor
 * och inbäddade dokument (SOP, DOC, MDCG) i filstrukturen.
 */

import React from 'react';
import Link from './Link';

/**
 * Extraherar mappnamn från en rad i filstrukturen.
 * T.ex. "📁 5-RISK MANAGEMENT" -> "5-RISK MANAGEMENT"
 * @param {string} line - En rad från filstruktur-texten
 * @returns {string|null} Mappnamnet utan emoji, eller null
 */
const extractFolderName = (line) => {
  const match = line.match(/📁\s+(.+)/);
  return match ? match[1].trim() : null;
};

/**
 * ChecklistItem – Rekursiv komponent som hanterar ett checklist-objekt.
 */
const ChecklistItem = ({ item, onOpenSop, onOpenMdcg, onOpenDoc }) => {

  /**
   * Bygger upp en visuell filstruktur med inbäddade dokumentlänkar.
   * 
   * HUR INDENTEN FUNGERAR:
   * Tidigare lade vi indent-mellanrum i en separat <span> eller som text före <Link />.
   * Men <Link /> renderar en <a>-tagg (inline), och whitespace före inline-element
   * kollapsar i HTML. Därför syntes aldrig indenten.
   * 
   * LÖSNING: Vi skickar in indenten som prefix i label-prop,
   * så att mellanrummen hamnar INUTI <a>-taggen där whitespace bevaras.
   */
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
              {/* Själva mapp-raden */}
              <div>{line}</div>
              
              {/* Dokument som hör till denna mapp */}
              {hasFiles && fileMap[folderName].map((file, j) => {
                // Räkna ut indentering: mapp-radens mellanrum + 2 extra
                const leadingSpaces = line.match(/^(\s*)/)[1];
                const indent = leadingSpaces + '  ';
                
                // Bygg label med indent som prefix – 
                // detta är nyckeln: indenten hamnar INUTI länken
                const indentedLabel = indent + (file.label || '');
                
                return (
                  <div key={j}>
                    {file.sop && (
                      <Link 
                        type="sop" 
                        data={file.sop} 
                        label={indentedLabel}
                        onOpenSop={onOpenSop} 
                        onOpenDoc={onOpenDoc} 
                        onOpenMdcg={onOpenMdcg} 
                      />
                    )}
                    {file.doc && (
                      <Link 
                        type="doc" 
                        data={file.doc} 
                        label={indentedLabel}
                        onOpenSop={onOpenSop} 
                        onOpenDoc={onOpenDoc} 
                        onOpenMdcg={onOpenMdcg} 
                      />
                    )}
                    {file.mdcg && (
                      <Link 
                        type="mdcg" 
                        data={file.mdcg} 
                        label={indentedLabel}
                        onOpenSop={onOpenSop} 
                        onOpenDoc={onOpenDoc} 
                        onOpenMdcg={onOpenMdcg} 
                      />
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
      
      {/* Steg-rubrik */}
      {item.t && <h4 className="headingSubStep">{item.t}</h4>}
      
      {/* Artikelreferens */}
      {item.r && <p className="article-ref">{item.r}</p>}
      
      {/* Brödtext */}
      {item.e && (
        item.e.includes('📁') && item.files ? (
          renderTreeStructure(item.e, item.files)
        ) : (
          <p className={item.e.includes('📁') ? 'tree-structure' : 'section-text'}>
            {item.e}
          </p>
        )
      )}

      {/* SOP-länk */}
      {item.sop && (
        Array.isArray(item.sop) ? (
          item.sop.map((s, idx) => (
            <Link key={idx} type="sop" data={s} onOpenSop={onOpenSop} onOpenDoc={onOpenDoc} onOpenMdcg={onOpenMdcg} />
          ))
        ) : (
          <Link type="sop" data={item.sop} onOpenSop={onOpenSop} onOpenDoc={onOpenDoc} onOpenMdcg={onOpenMdcg} />
        )
      )}

      {/* DOC-länk */}
      {item.doc && (
        Array.isArray(item.doc) ? (
          item.doc.map((d, idx) => (
            <Link key={idx} type="doc" data={d} onOpenSop={onOpenSop} onOpenDoc={onOpenDoc} onOpenMdcg={onOpenMdcg} />
          ))
        ) : (
          <Link type="doc" data={item.doc} onOpenSop={onOpenSop} onOpenDoc={onOpenDoc} onOpenMdcg={onOpenMdcg} />
        )
      )}  

      {/* MDCG-länk */}
      {item.mdcg && (
        Array.isArray(item.mdcg) ? (
          item.mdcg.map((m, idx) => (
            <Link key={idx} type="mdcg" data={m} onOpenSop={onOpenSop} onOpenDoc={onOpenDoc} onOpenMdcg={onOpenMdcg} />
          ))
        ) : (
          <Link type="mdcg" data={item.mdcg} onOpenSop={onOpenSop} onOpenDoc={onOpenDoc} onOpenMdcg={onOpenMdcg} />
        )
      )}

      {/* Nästlad checklista */}
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

// ==================================================================
// StegDetail – Huvudkomponenten
// ==================================================================
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