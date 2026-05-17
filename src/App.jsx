import React, { useState } from 'react';
import StartPage from './pages/StartPage';
import QmsPage from './pages/QMS';
import MdrPage from './pages/MDR';
import TabBar from './components/Tab'; // Importera din nya flik-komponent
import './style.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('start');

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      
      {/* Din nya rena flik-meny */}
      <TabBar currentPage={currentPage} onPageChange={(page) => setCurrentPage(page)} />

      {/* Sidorna visas här under */}
      <div className="flex-1 overflow-hidden">
        {currentPage === 'start' && <StartPage onSelectPage={(page) => setCurrentPage(page)} />}
        {currentPage === 'mdr' && <MdrPage />}
        {currentPage === 'qms' && <QmsPage />}
      </div>

    </div>
  );
}
