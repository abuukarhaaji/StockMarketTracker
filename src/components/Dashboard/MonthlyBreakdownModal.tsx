import React from 'react';
import { X, Calendar, TrendingUp } from 'lucide-react';
import { CompanyWithPayments } from '../../types';

interface MonthlyBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: CompanyWithPayments[];
  selectedYear: number;
}

export function MonthlyBreakdownModal({ isOpen, onClose, companies, selectedYear }: MonthlyBreakdownModalProps) {
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const isCurrentYear = selectedYear === currentYear;

  // For current year, show up to current month; for other years, show all months
  const monthsToShow = isCurrentYear ? currentMonth + 1 : 12;
  const monthlyData = months.slice(0, monthsToShow).map((month, index) => {
    let totalAmount = 0;
    let paymentCount = 0;

    companies.forEach(company => {
      company.payments.forEach(payment => {
        const paymentDate = new Date(payment.payment_date);
        if (paymentDate.getFullYear() === selectedYear && paymentDate.getMonth() === index) {
          totalAmount += payment.amount;
          paymentCount += 1;
        }
      });
    });

    return {
      month,
      totalAmount,
      paymentCount,
    };
  });

  const totalYearToDate = monthlyData.reduce((sum, data) => sum + data.totalAmount, 0);

  if (!isOpen) {
    return null
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-hidden border border-gray-200 dark:border-navy-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-navy-800 w-10 h-10 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Income Breakdown {selectedYear}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 dark:bg-navy-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-900 dark:text-blue-300">
                {isCurrentYear ? 'Year-to-Date Total' : `${selectedYear} Total`}
              </span>
            </div>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(totalYearToDate)}
            </span>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[50vh]">
          {monthlyData.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gray-100 dark:bg-navy-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No payment data for {selectedYear}</h3>
              <p className="text-gray-600 dark:text-gray-300">No payments have been recorded for {selectedYear}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {monthlyData.map((data, index) => (
                <div
                  key={data.month}
                  className={`flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-navy-600 ${
                    index % 2 === 0 ? 'bg-gray-50 dark:bg-navy-800' : 'bg-white dark:bg-navy-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-navy-700 w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {data.month.slice(0, 3)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{data.month}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {data.paymentCount} payment{data.paymentCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      data.totalAmount > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {data.totalAmount > 0 ? formatCurrency(data.totalAmount) : '$0'}
                    </p>
                    {data.totalAmount > 0 && totalYearToDate > 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {((data.totalAmount / totalYearToDate) * 100).toFixed(1)}% of total
                      </p>
                    )}
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