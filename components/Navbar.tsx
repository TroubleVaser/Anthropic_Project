
import React from 'react';
import { Page } from '../types';
import { DashboardIcon, TrophiesIcon, HistoryIcon } from './icons/NavIcons';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const navItems: { page: Page; label: string; icon: React.ElementType }[] = [
    { page: 'dashboard', label: 'Orb', icon: DashboardIcon },
    { page: 'gamification', label: 'Growth', icon: TrophiesIcon },
    { page: 'history', label: 'History', icon: HistoryIcon },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-lg border-t border-gray-700 md:hidden">
      <div className="container mx-auto flex justify-around p-2">
        {navItems.map(({ page, label, icon: Icon }) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`flex flex-col items-center justify-center space-y-1 w-20 h-16 rounded-lg transition-colors duration-200 ${
              currentPage === page ? 'text-purple-400 bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
