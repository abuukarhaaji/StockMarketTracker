import React from 'react';
import { X, Building2, Calendar, DollarSign } from 'lucide-react';
import { CompanyWithPayments } from '../../types';

interface CompanyPaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyWithPayments | null;
  selectedYear: number;
}

export function CompanyPaymentHistoryModal({ isOpen, onClose, company, selectedYear }: CompanyPaymentHistoryModalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isOpen || !company) return null;

  // Filter payments for the selected year and sort by date
  const yearPayments = company.payments
    .filter(payment => {
      const paymentDate = new Date(payment.payment_date);
      return paymentDate.getFullYear() === selectedYear;
    })
    .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());

  const totalAmount = yearPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-hidden border border-gray-200 dark:border-navy-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-navy-800 w-10 h-10 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{company.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Payment History - {selectedYear}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Summary Card */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-navy-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-900 dark:text-blue-300">
                Total for {selectedYear}
              </span>
            </div>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(totalAmount)}
            </span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            {yearPayments.length} payment{yearPayments.length !== 1 ? 's' : ''} received
          </p>
        </div>

        {/* Payment List */}
        <div className="overflow-y-auto max-h-[50vh]">
          {yearPayments.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gray-100 dark:bg-navy-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No payments in {selectedYear}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                No payments were recorded for {company.name} in {selectedYear}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {yearPayments.map((payment, index) => (
                <div
                  key={payment.id}
                  className={`flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-navy-600 ${
                    index % 2 === 0 ? 'bg-gray-50 dark:bg-navy-800' : 'bg-white dark:bg-navy-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 dark:bg-green-900/30 w-8 h-8 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {formatDate(payment.payment_date)}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Payment #{yearPayments.length - index}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(payment.amount)}
                    </p>
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