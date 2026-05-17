import React, { useState } from 'react';
import StartPage from './pages/StartPage';
import QmsPage from './pages/QMS';
import MdrPage from './pages/MDR';
import PharmaPacketPage from './pages/PharmaPacket';
import TabBar from './components/Tab'; 
import './style.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('start');

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TabBar currentPage={currentPage} onPageChange={(page) => setCurrentPage(page)} />

      <div className="flex-1 overflow-hidden">
        {currentPage === 'start' && <StartPage onSelectPage={(page) => setCurrentPage(page)} />}
        {currentPage === 'mdr' && <MdrPage />}
        {currentPage === 'qms' && <QmsPage />}
        {currentPage === 'pharma' && <PharmaPacketPage />}
      </div>

    </div>
  );
}
