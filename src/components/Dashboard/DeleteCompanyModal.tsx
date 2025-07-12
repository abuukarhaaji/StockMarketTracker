import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { CompanyWithPayments } from '../../types';

interface DeleteCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (companyId: string) => Promise<void>;
  company: CompanyWithPayments | null;
}

export function DeleteCompanyModal({ isOpen, onClose, onConfirm, company }: DeleteCompanyModalProps) {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};
  const handleConfirm = async () => {
    if (!company) return;
    
    if (confirmText.toLowerCase() !== 'delete') {
      toast.error('Please type "delete" to confirm');
      return;
    }

    setLoading(true);
    try {
      await onConfirm(company.id);
      toast.success(`Company "${company.name}" has been deleted successfully`);
      handleClose();
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Failed to delete company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  if (!isOpen || !company) return null;

  const hasPayments = company.payments.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-navy-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 dark:bg-red-900/30 w-10 h-10 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Company</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span className="font-medium text-gray-900 dark:text-white">Warning: This action cannot be undone</span>
          </div>
          
          <div className="bg-gray-50 dark:bg-navy-800 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Company to be deleted:</h3>
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">{company.name}</p>
            
            {hasPayments && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-navy-600">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  This company has <span className="font-medium">{company.payments.length}</span> payment record{company.payments.length !== 1 ? 's' : ''} 
                  totaling <span className="font-medium text-green-600 dark:text-green-400">{formatCurrency(company.total_amount)}</span>
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                  All payment records will also be permanently deleted.
                </p>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            To confirm deletion, please type <span className="font-mono bg-gray-100 dark:bg-navy-800 px-2 py-1 rounded text-red-600 dark:text-red-400">delete</span> below:
          </p>

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type 'delete' to confirm"
            className="w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
            disabled={loading}
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || confirmText.toLowerCase() !== 'delete'}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Deleting...' : 'Delete Company'}
          </button>
        </div>
      </div>
    </div>
  );
}