import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { X, Edit3, Calendar, DollarSign } from 'lucide-react';
import { CompanyWithPayments, IsaCompanyWithPayments, Payment, IsaPayment } from '../../types';

interface EditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentId: string, amount: number) => Promise<void>;
  companies: (CompanyWithPayments | IsaCompanyWithPayments)[];
  selectedYear: number;
}

export function EditPaymentModal({ isOpen, onClose, onSubmit, companies, selectedYear }: EditPaymentModalProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedPaymentId, setSelectedPaymentId] = useState('');
  const [newAmount, setNewAmount] = useState('');
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
      toast.error('Please select a payment to edit');
      return;
    }
    
    if (!newAmount) {
      toast.error('Please enter a new payment amount');
      return;
    }
    
    const amountValue = parseFloat(newAmount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    if (selectedPayment && amountValue === selectedPayment.amount) {
      toast.error('Please enter a different amount');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(selectedPaymentId, amountValue);
      toast.success(`Payment amount updated to ${formatCurrency(amountValue)} successfully!`);
      handleClose();
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Failed to update payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedCompanyId('');
    setSelectedPaymentId('');
    setNewAmount('');
    onClose();
  };

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setSelectedPaymentId(''); // Reset payment selection when company changes
    setNewAmount(''); // Reset amount when company changes
  };

  const handlePaymentSelect = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    const payment = yearPayments.find(p => p.id === paymentId);
    if (payment) {
      setNewAmount(payment.amount.toString());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[80vh] overflow-hidden border border-gray-200 dark:border-navy-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 dark:bg-orange-900/30 w-10 h-10 rounded-full flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Payment</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Select payment to edit - {selectedYear}</p>
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
              Company Name
            </label>
            <select
              id="company-select"
              value={selectedCompanyId}
              onChange={(e) => handleCompanySelect(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
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
              Payments from Selected Company
            </label>
            <select
              id="payment-select"
              value={selectedPaymentId}
              onChange={(e) => handlePaymentSelect(e.target.value)}
              required
              disabled={!selectedCompanyId || yearPayments.length === 0 || loading}
              className="w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white dark:bg-navy-800 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="p-4 bg-gray-50 dark:bg-navy-800 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Payment Details
              </h4>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Company:</span> {selectedCompany?.name}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Payment Date:</span> {formatDate(selectedPayment.payment_date)}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Current Amount:</span> {formatCurrency(selectedPayment.amount)}
                </p>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="new-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Payment Amount
            </label>
            <input
              id="new-amount"
              type="number"
              step="0.01"
              min="0"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
              placeholder="0.00"
              disabled={loading || !selectedPaymentId}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedCompanyId || !selectedPaymentId || !newAmount}
              className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}