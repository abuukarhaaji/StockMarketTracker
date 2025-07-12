import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { X, Filter } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (minAmount: number | undefined) => void;
  currentMinAmount?: number;
}

export function FilterModal({ isOpen, onClose, onApplyFilter, currentMinAmount }: FilterModalProps) {
  const [minAmount, setMinAmount] = useState(currentMinAmount?.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = minAmount ? parseFloat(minAmount) : undefined;
    onApplyFilter(amount);
    
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}.format(amount);
      };
      toast.success(`Filter applied: Showing companies that paid more than ${formatCurrency(amount)}`);
    }
    onClose();
  };

  const handleClear = () => {
    setMinAmount('');
    onApplyFilter(undefined);
    toast.success('Filter cleared: Showing all companies');
    onClose();
  };

  const handleClose = () => {
    setMinAmount(currentMinAmount?.toString() || '');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-navy-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-navy-800 w-10 h-10 rounded-full flex items-center justify-center">
              <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filter Companies</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="min-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Total Amount ($)
            </label>
            <input
              id="min-amount"
              type="number"
              step="0.01"
              min="0"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
              placeholder="Enter minimum amount (e.g., 500)"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Show only companies that have paid more than this amount in total
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors"
            >
              Clear Filter
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Apply Filter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}