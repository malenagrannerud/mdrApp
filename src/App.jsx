


import React, { useState } from 'react';
import StartPage from './pages/startPage';
import QmsPage from './pages/qms';
import MdrPage from './pages/mdr';

import SurveillanceDashboard from './components/Dashboard';
import TabBar from './components/tab'; 
import './style.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('start');

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TabBar currentPage={currentPage} onPageChange={(page) => setCurrentPage(page)} />

      <div className="flex-1 overflow-y-auto">
        {currentPage === 'start' && <StartPage onSelectPage={(page) => setCurrentPage(page)} />}
        {currentPage === 'mdr' && <MdrPage />}
        {currentPage === 'qms' && <QmsPage />}
        {currentPage === 'surveillance' && <SurveillanceDashboard />}
       
      </div>
    </div>
  );
}
