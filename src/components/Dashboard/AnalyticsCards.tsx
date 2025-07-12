import React, { useState } from 'react';
import { Calendar, DollarSign, Receipt, X } from 'lucide-react';
import { CompanyWithPayments } from '../../types';

interface AnalyticsCardsProps {
  companies: CompanyWithPayments[];
  selectedYear: number;
}

export function AnalyticsCards({ companies, selectedYear }: AnalyticsCardsProps) {
  const [taxRate, setTaxRate] = useState(7.5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaxRate, setNewTaxRate] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate analytics
  const totalIncome = companies.reduce((sum, company) => sum + company.total_amount, 0);
  const taxPaid = totalIncome * (taxRate / 100);
  const totalIncomeAfterTax = totalIncome - taxPaid;
  
  // Calculate monthly averages for selected year
  const currentMonth = new Date().getMonth(); // 0-based (0 = January)
  const isCurrentYear = selectedYear === new Date().getFullYear();
  
  const monthlyTotals = Array(12).fill(0);
  companies.forEach(company => {
    company.payments.forEach(payment => {
      const paymentDate = new Date(payment.payment_date);
      if (paymentDate.getFullYear() === selectedYear) {
        const month = paymentDate.getMonth();
        monthlyTotals[month] += payment.amount;
      }
    });
  });
  
  // For current year, only consider months up to current month
  // For past/future years, consider all 12 months
  const monthsToConsider = isCurrentYear ? currentMonth + 1 : 12;
  const monthsUpToCurrent = monthlyTotals.slice(0, monthsToConsider);
  const monthsWithPayments = monthsUpToCurrent.filter(total => total > 0).length;
  const averagePerMonth = monthsWithPayments > 0 
    ? monthsUpToCurrent.reduce((sum, total) => sum + total, 0) / monthsToConsider
    : 0;

  const handleOpenModal = () => {
    setNewTaxRate(taxRate.toString());
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const rate = parseFloat(newTaxRate);
    if (!isNaN(rate) && rate >= 0 && rate <= 100) {
      setTaxRate(rate);
      setIsModalOpen(false);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setNewTaxRate('');
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Income Card */}
        <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm border border-gray-200 dark:border-navy-700 p-8">
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">Total Income ({selectedYear})</p>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</p>
          </div>
        </div>

        {/* Total Income After Tax Card */}
        <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm border border-gray-200 dark:border-navy-700 p-8 relative">
          {/* Tax Rate Button - Top Right */}
          <button
            onClick={handleOpenModal}
            className="absolute top-4 right-4 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            {taxRate}%
          </button>
          
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">Total Income After Tax ({selectedYear})</p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalIncomeAfterTax)}</p>
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Tax Paid: {formatCurrency(taxPaid)}</p>
            </div>
          </div>
        </div>
        
        {/* Average Per Month Card */}
        <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm border border-gray-200 dark:border-navy-700 p-8">
          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">Avg Per Month ({selectedYear})</p>
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(averagePerMonth)}</p>
          </div>
        </div>
      </div>

      {/* Tax Rate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-navy-900 rounded-xl shadow-lg max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Tax Rate</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Tax Rate
                </label>
                <input
                  type="text"
                  value={`£{taxRate}%`}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-md bg-gray-100 dark:bg-navy-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={newTaxRate}
                  onChange={(e) => setNewTaxRate(e.target.value)}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-md bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new tax rate"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-navy-700 border border-gray-300 dark:border-navy-600 rounded-md hover:bg-gray-200 dark:hover:bg-navy-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}