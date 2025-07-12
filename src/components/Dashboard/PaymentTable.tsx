import React from 'react';
import { CompanyWithPayments } from '../../types';
import { Building2, Edit3 } from 'lucide-react';

interface PaymentTableProps {
  companies: CompanyWithPayments[];
  selectedYear: number;
  onCompanyClick: (company: CompanyWithPayments) => void;
  onEditPayment: (company: CompanyWithPayments) => void;
}

export function PaymentTable({ companies, selectedYear, onCompanyClick, onEditPayment }: PaymentTableProps) {
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

  // Get all months for current year
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get payment amount for a specific company and month
  const getPaymentForMonth = (company: CompanyWithPayments, monthIndex: number): number | null => {
    const monthPayments = company.payments.filter(payment => {
      const paymentDate = new Date(payment.payment_date);
      return paymentDate.getFullYear() === selectedYear && paymentDate.getMonth() === monthIndex;
    });

    if (monthPayments.length === 0) return null;
    
    // Sum all payments for this month
    const totalAmount = monthPayments.reduce((sum, payment) => sum + payment.amount, 0);
    return totalAmount;
  };

  if (companies.length === 0) {
    return (
      <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm border border-gray-200 dark:border-navy-700 p-8">
        <div className="text-center">
          <div className="bg-gray-100 dark:bg-navy-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No companies yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Add your first company to start tracking payments
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm border border-gray-200 dark:border-navy-700 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 dark:bg-navy-800 border-b border-gray-200 dark:border-navy-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Overview - {selectedYear}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-navy-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-navy-600 sticky left-0 bg-gray-50 dark:bg-navy-800 z-10">
                Company
              </th>
              {months.map((month) => (
                <th key={month} className="px-4 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-navy-600 min-w-[100px]">
                  {month}
                </th>
              ))}
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white bg-blue-50 dark:bg-navy-700">
                Total
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white bg-blue-50 dark:bg-navy-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-navy-900 divide-y divide-gray-200 dark:divide-navy-700">
            {companies.map((company, index) => (
              <tr key={company.id} className={index % 2 === 0 ? 'bg-white dark:bg-navy-900' : 'bg-gray-50 dark:bg-navy-800'}>
                <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200 dark:border-navy-600 sticky left-0 bg-inherit z-10">
                  <div 
                    className="flex items-center cursor-pointer hover:bg-blue-50 dark:hover:bg-navy-700 p-2 rounded-lg transition-colors"
                    onClick={() => onCompanyClick(company)}
                    title="Click to view payment history"
                  >
                    <div className="bg-blue-100 dark:bg-navy-700 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                      {company.name}
                    </div>
                  </div>
                </td>
                {months.map((month, monthIndex) => {
                  const amount = getPaymentForMonth(company, monthIndex);
                  return (
                    <td key={month} className="px-4 py-4 text-center border-r border-gray-200 dark:border-navy-600">
                      {amount ? (
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {formatCurrency(amount)}
                        </span>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600">-</span>
                      )}
                    </td>
                  );
                })}
                <td className="px-6 py-4 text-center bg-blue-50 dark:bg-navy-700">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(company.total_amount)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center bg-blue-50 dark:bg-navy-700">
                  <button
                    onClick={() => onEditPayment(company)}
                    className="inline-flex items-center space-x-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-lg text-sm font-medium hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                    title="Edit payments for this company"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}