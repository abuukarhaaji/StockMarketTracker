import React from 'react';
import { X, Calendar, Building2 } from 'lucide-react';
import { CompanyWithPayments } from '../../types';

interface AveragePerMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: CompanyWithPayments[];
}

export function AveragePerMonthModal({ isOpen, onClose, companies }: AveragePerMonthModalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCompanyAveragePerMonth = (company: CompanyWithPayments) => {
    if (company.payments.length === 0) return 0;
    
    // Get unique months that have payments
    const monthsWithPayments = new Set();
    company.payments.forEach(payment => {
      const date = new Date(payment.payment_date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      monthsWithPayments.add(monthKey);
    });
    
    const uniqueMonths = monthsWithPayments.size;
    return uniqueMonths > 0 ? company.total_amount / uniqueMonths : 0;
  };

  const companiesWithAverages = companies
    .map(company => ({
      ...company,
      averagePerMonth: getCompanyAveragePerMonth(company)
    }))
    .filter(company => company.averagePerMonth > 0)
    .sort((a, b) => b.averagePerMonth - a.averagePerMonth);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-hidden border border-gray-200 dark:border-navy-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 dark:bg-purple-900/30 w-10 h-10 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Average Payment Per Month</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {companiesWithAverages.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gray-100 dark:bg-navy-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No payment data</h3>
              <p className="text-gray-600 dark:text-gray-300">No companies have made payments yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {companiesWithAverages.map((company, index) => (
                <div
                  key={company.id}
                  className={`flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-navy-600 ${
                    index % 2 === 0 ? 'bg-gray-50 dark:bg-navy-800' : 'bg-white dark:bg-navy-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-navy-700 w-8 h-8 rounded-full flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{company.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {company.payments.length} payment{company.payments.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {formatCurrency(company.averagePerMonth)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">per month</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}