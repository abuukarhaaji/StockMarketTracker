import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { X, Trash2, Calendar, DollarSign } from 'lucide-react';
import { CompanyWithPayments, Payment } from '../../types';

interface DeletePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentId: string) => Promise<void>;
  companies: CompanyWithPayments[];
  selectedYear: number;
}

export function DeletePaymentModal({ isOpen, onClose, onSubmit, companies, selectedYear }: DeletePaymentModalProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedPaymentId, setSelectedPaymentId] = useState('');
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
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

  if (!isOpen) return null;

  // Get selected company
  const selectedCompany = companies.find(c => c.id === selectedCompanyId);
  
  // Filter payments for the selected year
  const yearPayments = selectedCompany ? selectedCompany.payments
    .filter(payment => {
      const paymentDate = new Date(payment.payment_date);
      return paymentDate.getFullYear() === selectedYear;
    })
    .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()) : [];

  const selectedPayment = yearPayments.find(p => p.id === selectedPaymentId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCompanyId) {
      toast.error('Please select a company');
      return;
    }
    
    if (!selectedPaymentId) {
      toast.error('Please select a payment to delete');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(selectedPaymentId);
      toast.success('Payment deleted successfully!');
      handleClose();
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast.error('Failed to delete payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedCompanyId('');
    setSelectedPaymentId('');
    onClose();
  };

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setSelectedPaymentId(''); // Reset payment selection when company changes
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[80vh] overflow-hidden border border-gray-200 dark:border-navy-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 dark:bg-red-900/30 w-10 h-10 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Payment</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Select a payment to delete - {selectedYear}</p>
            </div>
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
            <label htmlFor="company-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Company
            </label>
            <select
              id="company-select"
              value={selectedCompanyId}
              onChange={(e) => handleCompanySelect(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
              disabled={loading}
            >
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="payment-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Payment to Delete
            </label>
            <select
              id="payment-select"
              value={selectedPaymentId}
              onChange={(e) => setSelectedPaymentId(e.target.value)}
              required
              disabled={!selectedCompanyId || yearPayments.length === 0 || loading}
              className="w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white dark:bg-navy-800 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {!selectedCompanyId 
                  ? "Select a company first" 
                  : yearPayments.length === 0 
                    ? `No payments in ${selectedYear}` 
                    : "Select a payment"}
              </option>
              {yearPayments.map((payment) => (
                <option key={payment.id} value={payment.id}>
                  {formatDate(payment.payment_date)} - {formatCurrency(payment.amount)}
                </option>
              ))}
            </select>
          </div>

          {selectedPayment && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-medium text-red-900 dark:text-red-300 mb-2 flex items-center">
                <Trash2 className="w-4 h-4 mr-2" />
                Payment to be deleted:
              </h4>
              <div className="space-y-1 text-sm">
                <p className="text-red-700 dark:text-red-400">
                  <span className="font-medium">Company:</span> {selectedCompany?.name}
                </p>
                <p className="text-red-700 dark:text-red-400">
                  <span className="font-medium">Date:</span> {formatDate(selectedPayment.payment_date)}
                </p>
                <p className="text-red-700 dark:text-red-400">
                  <span className="font-medium">Amount:</span> {formatCurrency(selectedPayment.amount)}
                </p>
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">
                ⚠️ This action cannot be undone
              </p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors"
              disabled={loading}
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading || !selectedCompanyId || !selectedPaymentId}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Deleting...' : 'Delete Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}