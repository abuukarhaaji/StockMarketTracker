import React, { useState, useEffect } from 'react';
import { X, BarChart3, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { TabType } from '../../types';

interface CompareYearsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tabType: 'all' | 'isa';
}

interface YearlyData {
  [year: number]: {
    [month: number]: number;
  };
}

interface Payment {
  amount: number;
  payment_date: string;
}

export function CompareYearsModal({ isOpen, onClose, tabType }: CompareYearsModalProps) {
  const currentYear = new Date().getFullYear();
  const [year1, setYear1] = useState(currentYear - 1);
  const [year2, setYear2] = useState(currentYear);
  const [loading, setLoading] = useState(false);
  const [yearlyData, setYearlyData] = useState<YearlyData>({});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    if (!isFinite(percentage) || isNaN(percentage)) return 'N/A';
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  };

  // Generate years from 2024 to 2100
  const years = Array.from({ length: 77 }, (_, i) => 2024 + i);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Fetch payment data for both selected years
  const fetchYearlyData = async () => {
    if (!isOpen) return;
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Determine which table to query based on tab type
      const paymentsTable = tabType === 'all' ? 'payments' : 'isa_payments';
      
      // Get start and end dates for both years
      const year1Start = `${year1}-01-01`;
      const year1End = `${year1}-12-31`;
      const year2Start = `${year2}-01-01`;
      const year2End = `${year2}-12-31`;

      // Fetch payments for both years in parallel
      const [year1Response, year2Response] = await Promise.all([
        supabase
          .from(paymentsTable)
          .select('amount, payment_date')
          .eq('user_id', user.id)
          .gte('payment_date', year1Start)
          .lte('payment_date', year1End),
        supabase
          .from(paymentsTable)
          .select('amount, payment_date')
          .eq('user_id', user.id)
          .gte('payment_date', year2Start)
          .lte('payment_date', year2End)
      ]);

      if (year1Response.error) throw year1Response.error;
      if (year2Response.error) throw year2Response.error;

      // Initialize yearly data structure
      const newYearlyData: YearlyData = {
        [year1]: {},
        [year2]: {}
      };

      // Initialize months with 0
      [year1, year2].forEach(year => {
        for (let month = 0; month < 12; month++) {
          newYearlyData[year][month] = 0;
        }
      });

      // Process year 1 payments
      year1Response.data?.forEach((payment: Payment) => {
        const paymentDate = new Date(payment.payment_date);
        const paymentMonth = paymentDate.getMonth();
        newYearlyData[year1][paymentMonth] += payment.amount;
      });

      // Process year 2 payments
      year2Response.data?.forEach((payment: Payment) => {
        const paymentDate = new Date(payment.payment_date);
        const paymentMonth = paymentDate.getMonth();
        newYearlyData[year2][paymentMonth] += payment.amount;
      });

      setYearlyData(newYearlyData);
    } catch (error) {
      console.error('Error fetching yearly data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when modal opens or years change
  useEffect(() => {
    fetchYearlyData();
  }, [isOpen, year1, year2, tabType]);

  // Calculate totals
  const year1Total = yearlyData[year1] ? Object.values(yearlyData[year1]).reduce((sum, amount) => sum + amount, 0) : 0;
  const year2Total = yearlyData[year2] ? Object.values(yearlyData[year2]).reduce((sum, amount) => sum + amount, 0) : 0;
  const totalDifference = year2Total - year1Total;
  const totalPercentageChange = year1Total > 0 ? ((totalDifference / year1Total) * 100) : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-hidden border border-gray-200 dark:border-navy-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-navy-800 w-10 h-10 rounded-full flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Compare Two Years</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {tabType === 'all' ? 'All Stocks' : 'ISA Stocks and Shares'} - Earnings Comparison
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Year Selection */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 dark:bg-navy-800 rounded-lg">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Year 1
            </label>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <select
                value={year1}
                onChange={(e) => setYear1(parseInt(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-navy-700 text-gray-900 dark:text-white"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Year 2
            </label>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <select
                value={year2}
                onChange={(e) => setYear2(parseInt(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-navy-700 text-gray-900 dark:text-white"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">Loading comparison data...</span>
            </div>
          ) : (
          <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm border border-gray-200 dark:border-navy-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-navy-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Month
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      {year1} Earnings
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      {year2} Earnings
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Difference
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      % Change
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-navy-900 divide-y divide-gray-200 dark:divide-navy-700">
                  {months.map((month, index) => {
                    const year1Amount = yearlyData[year1]?.[index] || 0;
                    const year2Amount = yearlyData[year2]?.[index] || 0;
                    const difference = year2Amount - year1Amount;
                    const percentageChange = year1Amount > 0 ? ((difference / year1Amount) * 100) : 
                      (year1Amount === 0 && year2Amount > 0) ? 100 : 0;

                    return (
                      <tr key={month} className={index % 2 === 0 ? 'bg-white dark:bg-navy-900' : 'bg-gray-50 dark:bg-navy-800'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {month}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                          {year1Amount > 0 ? formatCurrency(year1Amount) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                          {year2Amount > 0 ? formatCurrency(year2Amount) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                          {difference !== 0 ? (
                            <div className={`flex items-center justify-center space-x-1 ${
                              difference > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {difference > 0 ? (
                                <TrendingUp className="w-4 h-4" />
                              ) : (
                                <TrendingDown className="w-4 h-4" />
                              )}
                              <span>{formatCurrency(Math.abs(difference))}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                          {(year1Amount > 0 || (year1Amount === 0 && year2Amount > 0)) && difference !== 0 ? (
                            <span className={`font-medium ${
                              percentageChange > 0 ? 'text-green-600 dark:text-green-400' : 
                              percentageChange < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {formatPercentage(percentageChange)}
                            </span>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-blue-50 dark:bg-navy-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(year1Total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(year2Total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold">
                      <div className={`flex items-center justify-center space-x-1 ${
                        totalDifference > 0 ? 'text-green-600 dark:text-green-400' : 
                        totalDifference < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {totalDifference > 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : totalDifference < 0 ? (
                          <TrendingDown className="w-4 h-4" />
                        ) : null}
                        <span>{formatCurrency(Math.abs(totalDifference))}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold">
                      <span className={`${
                        totalPercentageChange > 0 ? 'text-green-600 dark:text-green-400' : 
                        totalPercentageChange < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {formatPercentage(totalPercentageChange)}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}