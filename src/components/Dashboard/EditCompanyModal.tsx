import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { X, Edit3 } from 'lucide-react';
import { CompanyWithPayments, IsaCompanyWithPayments } from '../../types';

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (companyId: string, name: string) => Promise<void>;
  company: CompanyWithPayments | IsaCompanyWithPayments | null;
}

export function EditCompanyModal({ isOpen, onClose, onSubmit, company }: EditCompanyModalProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (company) {
      setName(company.name);
    }
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    
    if (!name.trim()) {
      toast.error('Company name is required');
      return;
    }

    if (name.trim() === company.name) {
      toast.error('Please enter a different name');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(company.id, name.trim());
      toast.success(`Company name updated to "${name.trim()}" successfully!`);
      onClose();
    } catch (error) {
      console.error('Error updating company:', error);
      if (error instanceof Error) {
        if (error.message.includes('duplicate') || error.message.includes('unique')) {
          toast.error('A company with this name already exists');
        } else {
          toast.error('Failed to update company name. Please try again.');
        }
      } else {
        toast.error('Failed to update company name. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (company) {
      setName(company.name);
    }
    onClose();
  };

  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-navy-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-navy-800 w-10 h-10 rounded-full flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Company Name</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4 p-4 bg-gray-50 dark:bg-navy-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">Current name:</p>
          <p className="font-medium text-gray-900 dark:text-white">{company.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Company Name
            </label>
            <input
              id="company-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
              placeholder="Enter new company name"
              disabled={loading}
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
              disabled={loading || !name.trim() || name.trim() === company.name}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Name'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}