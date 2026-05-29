import React from 'react';
import * as Lucide from 'lucide-react';

export default function StartPage({ onSelectPage }) {
  return (
    <div className="page-layout">
        <header className="mb-24 text-center">
            <h1> Medical Device Compliance </h1>
            <h2>Select a tab to navigate steps</h2>
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
          <span style={{ fontSize: '20px' }}>📋</span>
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
              href="https://github.com/malenagrannerud/mdrApp/blob/main/README.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#DC2626',
                textDecoration: 'underline',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Read more on GitHub →
            </a>
          </div>
        </div>
        {/* ----- SLUT RÖD BOX ----- */}

    </div>
  );
}
