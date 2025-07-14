import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { TabSelector } from './TabSelector';
import { LogOut, TrendingUp, Moon, Sun } from 'lucide-react';
import { TabType } from '../../types';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white dark:bg-navy-900 shadow-sm border-b border-gray-200 dark:border-navy-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-navy-800 w-10 h-10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
              Investment Tracker
            </h1>
          </div>
          
          <TabSelector activeTab={activeTab} onTabChange={onTabChange} />
          
          <div className="flex items-center space-x-4">
            <span className="hidden lg:block text-sm text-gray-600 dark:text-gray-300">
              Welcome, {user?.email}
            </span>
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 bg-gray-100 dark:bg-navy-800 hover:bg-gray-200 dark:hover:bg-navy-700 px-3 py-2 rounded-lg transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 text-gray-600" />
              )}
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 bg-gray-100 dark:bg-navy-800 hover:bg-gray-200 dark:hover:bg-navy-700 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}