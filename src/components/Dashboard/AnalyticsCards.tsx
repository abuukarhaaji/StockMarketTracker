import React from 'react';
import { Calendar, DollarSign } from 'lucide-react';
import { CompanyWithPayments } from '../../types';

interface AnalyticsCardsProps {
  companies: CompanyWithPayments[];
}

export function AnalyticsCards({ companies }: AnalyticsCardsProps) {
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
  
  // Calculate monthly averages for current year
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-based (0 = January)
  
  const monthlyTotals = Array(12).fill(0);
  companies.forEach(company => {
    company.payments.forEach(payment => {
      const paymentDate = new Date(payment.payment_date);
      if (paymentDate.getFullYear() === currentYear) {
        const month = paymentDate.getMonth();
        monthlyTotals[month] += payment.amount;
      }
    });
  });
  
  // Only consider months up to current month for average calculation
  const monthsUpToCurrent = monthlyTotals.slice(0, currentMonth + 1);
  const monthsWithPayments = monthsUpToCurrent.filter(total => total > 0).length;
  const averagePerMonth = monthsWithPayments > 0 
    ? monthsUpToCurrent.reduce((sum, total) => sum + total, 0) / (currentMonth + 1)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm border border-gray-200 dark:border-navy-700 p-8">
        <div className="text-center">
          <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">Total Income</p>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm border border-gray-200 dark:border-navy-700 p-8">
        <div className="text-center">
          <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">Avg Per Month</p>
          <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(averagePerMonth)}</p>
        </div>
      </div>
    </div>
  );
}