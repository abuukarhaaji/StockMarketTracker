import React from 'react';
import { TrendingUp, PiggyBank } from 'lucide-react';
import { TabType } from '../../types';

interface TabSelectorProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabSelector({ activeTab, onTabChange }: TabSelectorProps) {
  return (
    <div className="flex items-center bg-gray-100 dark:bg-navy-800 rounded-lg p-1">
      <button
        onClick={() => onTabChange('all')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeTab === 'all'
            ? 'bg-white dark:bg-navy-700 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
        }`}
        title="All Stocks"
      >
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4" />
          <span className="hidden sm:inline">ALL STOCKS</span>
        </div>
      </button>
      <button
        onClick={() => onTabChange('isa')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeTab === 'isa'
            ? 'bg-white dark:bg-navy-700 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
        }`}
        title="ISA Stocks and Shares"
      >
        <div className="flex items-center space-x-2">
          <PiggyBank className="w-4 h-4" />
          <span className="hidden sm:inline">ISA STOCKS AND SHARES</span>
        </div>
      </button>
    </div>
  );
}