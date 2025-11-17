
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import GamificationPage from './components/GamificationPage';
import HistoryPage from './components/HistoryPage';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'gamification':
        return <GamificationPage />;
      case 'history':
        return <HistoryPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {renderPage()}
      </main>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default App;
