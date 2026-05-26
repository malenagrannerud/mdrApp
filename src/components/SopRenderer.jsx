/**
 * src/components/SopRenderer.jsx
 * Komplett bibliotek med stöd för bilder, dynamiska tabeller och Mermaid-flödesscheman.
 */
import React, { useEffect, useRef } from 'react';

const SopRenderer = ({ content, image, title }) => {
  const containerRef = useRef(null);

  // Trigger för att be Mermaid rita om alla flödesscheman efter att HTML har tryckts ut
  useEffect(() => {
    // Hämta den globala instansen som vi laddade in säkert via index.html
    const globalMermaid = window.mermaid;

    if (containerRef.current && globalMermaid) {
      const hasMermaid = containerRef.current.querySelector('.mermaid');
      if (hasMermaid) {
        try {
          globalMermaid.contentLoaded();
        } catch (error) {
          console.error("Mermaid rendering error:", error);
        }
      }
    }
  }, [content]);

  if (!content) return null;

  const renderedElements = [];
  const lines = content.split('\n');
  
  let inTable = false;
  let currentTableRows = [];

  let inMermaid = false;
  let currentMermaidLines = [];

  // Funktion för att rendera ut den sparade tabellen när den stängs
  const renderAccumulatedTable = (tableKey) => {
    if (currentTableRows.length === 0) return null;

    return (
      <div key={`table-${tableKey}`} className="my-6 overflow-x-auto border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <table className="w-full text-left border-collapse bg-white text-[12px]">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-900">
              {currentTableRows[0].map((cell, idx) => (
                <th key={idx} className="p-3 font-black text-slate-900 uppercase tracking-wider border-r border-slate-300 last:border-0">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentTableRows.slice(1).map((row, rowIdx) => (
              <tr key={rowIdx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors last:border-0">
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="p-3 text-slate-700 font-medium border-r border-slate-200 last:border-0">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Loopa igenom alla rader i texten
  for (let i = 0; i < lines.length; i++) {
    const cleanLine = lines[i].trim();

     // 🧜‍♀️ STARTA MERMAID-BLOCK
    if (cleanLine.includes('mermaid')) {
      inMermaid = true;
      currentMermaidLines = [];
      continue;
    }

    // 🧜‍♀️ AVSLUTA MERMAID-BLOCK
    if (inMermaid && (cleanLine === '```' || cleanLine === '\`\`\`' || cleanLine === '\\`\\`\\`')) {
      inMermaid = false;
      const chartCode = currentMermaidLines.join('\n');
      renderedElements.push(
        <div key={`mermaid-${i}`} className="my-8 flex justify-center w-full">
          <div className="mermaid border-2 border-slate-900 p-6 bg-slate-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] w-full overflow-x-auto">
            {chartCode}
          </div>
        </div>
      );
      continue;
    }

    // 🧜‍♀️ SAMLA RADER INUTI MERMAID
    if (inMermaid) {
      if (lines[i] !== '') {
        currentMermaidLines.push(lines[i]);
      }
      continue;
    }

    // 📊 STARTA TABELL
    if (cleanLine === '[TABLE_START]') {
      inTable = true;
      currentTableRows = [];
      continue;
    }

    // 📊 AVSLUTA TABELL
    if (cleanLine === '[TABLE_END]') {
      inTable = false;
      renderedElements.push(renderAccumulatedTable(i));
      continue;
    }

    // 📊 SAMLA RADER INUTI TABELL
    if (inTable) {
      if (cleanLine.startsWith('|')) {
        const cells = cleanLine.split('|').map(c => c.trim()).filter(c => c !== '');
        if (cells.length > 0) {
          currentTableRows.push(cells);
        }
      }
      continue;
    }

    // 🖼️ BILD-PLATSHÅLLARE
    if (cleanLine === '[IMAGE]') {
      if (image) {
        renderedElements.push(
          <div key={i} className="my-8 flex justify-center">
            <img 
              src={image} 
              alt={title ? `${title} diagram` : 'SOP Diagram'} 
              className="max-w-full h-auto border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
            />
          </div>
        );
      }
      continue;
    }

    // RUBRIKER OCH LISTOR
    if (cleanLine.startsWith('# ')) {
      renderedElements.push(<p key={i} className="sop-h1">{cleanLine.replace('# ', '')}</p>);
    } else if (cleanLine.startsWith('## ')) {
      renderedElements.push(<p key={i} className="sop-h2">{cleanLine.replace('## ', '')}</p>);
    } else if (cleanLine.startsWith('- ')) {
      renderedElements.push(<p key={i} className="sop-list">{cleanLine.replace('- ', '')}</p>);
    } else if (cleanLine !== '') {
      renderedElements.push(<p key={i} className="sop-text">{cleanLine}</p>);
    } else {
      renderedElements.push(<div key={i} className="h-4" />);
    }
  }

  return (
    <div className="sop-content-wrapper" ref={containerRef}>
      {renderedElements}
    </div>
  );
};

export default SopRenderer;
