import React, { useState } from 'react';
import { X, Building2 } from 'lucide-react';
import { CompanyWithPayments } from '../../types';

interface SelectCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCompany: (company: CompanyWithPayments) => void;
  companies: CompanyWithPayments[];
  title: string;
  description: string;
  actionButtonText: string;
  actionButtonColor?: 'red' | 'blue';
}

export function SelectCompanyModal({ 
  isOpen, 
  onClose, 
  onSelectCompany, 
  companies, 
  title, 
  description,
  actionButtonText,
  actionButtonColor = 'blue'
}: SelectCompanyModalProps) {
  const [selectedCompany, setSelectedCompany] = useState<CompanyWithPayments | null>(null);

  const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  };

  const handleSubmit = () => {
    if (selectedCompany) {
      onSelectCompany(selectedCompany);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedCompany(null);
    onClose();
  };

  if (!isOpen) return null;

  const buttonColorClasses = actionButtonColor === 'red' 
    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[80vh] overflow-hidden border border-gray-200 dark:border-navy-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-navy-800 w-10 h-10 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>

        <div className="overflow-y-auto max-h-[50vh] mb-6">
          {companies.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gray-100 dark:bg-navy-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No companies available</h3>
              <p className="text-gray-600 dark:text-gray-300">Add some companies first</p>
            </div>
          ) : (
            <div className="space-y-2">
              {companies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => setSelectedCompany(company)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedCompany?.id === company.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-navy-800 dark:border-blue-400'
                      : 'border-gray-200 dark:border-navy-600 hover:bg-gray-50 dark:hover:bg-navy-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
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
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(company.total_amount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedCompany}
            className={`flex-1 px-4 py-3 text-white rounded-lg font-medium focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${buttonColorClasses}`}
          >
            {actionButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}