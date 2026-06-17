import React from 'react';
// Ändrat från * as Lucide till specifik import för att förhindra krasch på Vercel:
import { ClipboardList, ArrowRight } from 'lucide-react';

export default function StartPage({ onSelectPage }) {
  return (
    <div className="page-layout">
        <header className="mb-24 text-center">
            <h1 className="text-3xl font-bold text-slate-900"> Medical Device Compliance </h1>
            <h2 className="text-xl text-slate-600 mt-2">Select a tab to navigate steps</h2>
        </header>

        {/* ----- RÖD INFO-BOX ----- */}
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '2px solid #DC2626',
          borderRadius: '8px',
          padding: '16px 20px',
          marginBottom: '24px',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* Använder en standard-ikon direkt istället för Lucide-objektet */}
          <ClipboardList className="text-red-600 w-6 h-6" />
          <div>
            <p style={{ 
              color: '#991B1B', 
              fontWeight: 600, 
              margin: 0,
              fontSize: '15px'
            }}>
              Product Description & Plan
            </p>
            <a 
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#DC2626',
                textDecoration: 'underline',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Read more on GitHub <ArrowRight className="inline-block w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
        {/* ----- SLUT RÖD BOX ----- */}
    </div>
  );
}
