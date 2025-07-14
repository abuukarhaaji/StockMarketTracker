import React, { useState } from 'react';
import { useCompanies } from '../../hooks/useCompanies';
import { useIsaCompanies } from '../../hooks/useIsaCompanies';
import { Header } from './Header';
import { PaymentTable } from './PaymentTable';
import { AnalyticsCards } from './AnalyticsCards';
import { PaymentTrendsChart } from './PaymentTrendsChart';
import { YearFilter } from './YearFilter';
import { AddCompanyModal } from './AddCompanyModal';
import { RecordPaymentModal } from './RecordPaymentModal';
import { FilterModal } from './FilterModal';
import { AveragePerMonthModal } from './AveragePerMonthModal';
import { MonthlyBreakdownModal } from './MonthlyBreakdownModal';
import { DeleteCompanyModal } from './DeleteCompanyModal';
import { SelectCompanyModal } from './SelectCompanyModal';
import { EditCompanyModal } from './EditCompanyModal';
import { CompanyPaymentHistoryModal } from './CompanyPaymentHistoryModal';
import { EditPaymentModal } from './EditPaymentModal';
import { DeletePaymentModal } from './DeletePaymentModal';
import { Plus, Receipt, Filter, Calendar, TrendingDown, BarChart3, Trash2, Edit3 } from 'lucide-react';
import { CompanyWithPayments, IsaCompanyWithPayments, TabType } from '../../types';

export function Dashboard() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<TabType>('all');
  
  // Regular stocks data
  const { 
    companies: allCompanies, 
    loading: allLoading, 
    addCompany: addAllCompany, 
    addPayment: addAllPayment, 
    deleteCompany: deleteAllCompany, 
    updateCompany: updateAllCompany, 
    updatePayment: updateAllPayment, 
    deletePayment: deleteAllPayment 
  } = useCompanies(selectedYear);
  
  // ISA stocks data
  const { 
    companies: isaCompanies, 
    loading: isaLoading, 
    addCompany: addIsaCompany, 
    addPayment: addIsaPayment, 
    deleteCompany: deleteIsaCompany, 
    updateCompany: updateIsaCompany, 
    updatePayment: updateIsaPayment, 
    deletePayment: deleteIsaPayment 
  } = useIsaCompanies(selectedYear);
  
  // Current data based on active tab
  const companies = activeTab === 'all' ? allCompanies : isaCompanies;
  const loading = activeTab === 'all' ? allLoading : isaLoading;
  const addCompany = activeTab === 'all' ? addAllCompany : addIsaCompany;
  const addPayment = activeTab === 'all' ? addAllPayment : addIsaPayment;
  const deleteCompany = activeTab === 'all' ? deleteAllCompany : deleteIsaCompany;
  const updateCompany = activeTab === 'all' ? updateAllCompany : updateIsaCompany;
  const updatePayment = activeTab === 'all' ? updateAllPayment : updateIsaPayment;
  const deletePayment = activeTab === 'all' ? deleteAllPayment : deleteIsaPayment;
  
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAverageModal, setShowAverageModal] = useState(false);
  const [showMonthlyBreakdownModal, setShowMonthlyBreakdownModal] = useState(false);
  const [showSelectDeleteModal, setShowSelectDeleteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSelectEditModal, setShowSelectEditModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
  const [showDeletePaymentModal, setShowDeletePaymentModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<CompanyWithPayments | IsaCompanyWithPayments | null>(null);
  const [companyToEdit, setCompanyToEdit] = useState<CompanyWithPayments | IsaCompanyWithPayments | null>(null);
  const [selectedCompanyForHistory, setSelectedCompanyForHistory] = useState<CompanyWithPayments | IsaCompanyWithPayments | null>(null);
  const [minAmount, setMinAmount] = useState<number | undefined>(undefined);
  const [sortByTopPaid, setSortByTopPaid] = useState(false);

  // Apply filters and sorting
  const getFilteredAndSortedCompanies = () => {
    let filtered = [...companies];
    
    // Only show companies that have made payments in the selected year
    filtered = filtered.filter(company => company.total_amount > 0);
    
    // Apply minimum amount filter
    if (minAmount !== undefined) {
      filtered = filtered.filter(company => company.total_amount >= minAmount);
    }
    
    // Apply sorting
    if (sortByTopPaid) {
      filtered.sort((a, b) => b.total_amount - a.total_amount);
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return filtered;
  };

  const filteredCompanies = getFilteredAndSortedCompanies();

  const handleApplyFilter = (amount: number | undefined) => {
    setMinAmount(amount);
  };

  const toggleSortByTopPaid = () => {
    setSortByTopPaid(!sortByTopPaid);
  };

  const handleSelectDeleteCompany = (company: CompanyWithPayments | IsaCompanyWithPayments) => {
    setCompanyToDelete(company);
    setShowDeleteModal(true);
  };

  const confirmDeleteCompany = async (companyId: string) => {
    await deleteCompany(companyId);
  };

  const handleSelectEditCompany = (company: CompanyWithPayments | IsaCompanyWithPayments) => {
    setCompanyToEdit(company);
    setShowEditModal(true);
  };

  const confirmEditCompany = async (companyId: string, name: string) => {
    await updateCompany(companyId, name);
  };

  const handleCompanyClick = (company: CompanyWithPayments | IsaCompanyWithPayments) => {
    setSelectedCompanyForHistory(company);
    setShowPaymentHistoryModal(true);
  };

  const handleEditPayment = () => {
    setShowEditPaymentModal(true);
  };

  const confirmEditPayment = async (paymentId: string, amount: number) => {
    await updatePayment(paymentId, amount);
  };

  const handleDeletePayment = () => {
    setShowDeletePaymentModal(true);
  };

  const confirmDeletePayment = async (paymentId: string) => {
    await deletePayment(paymentId);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    // Reset filters when year changes
    setMinAmount(undefined);
    setSortByTopPaid(false);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Reset filters when tab changes
    setMinAmount(undefined);
    setSortByTopPaid(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        <AnalyticsCards companies={companies} selectedYear={selectedYear} />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowAddCompanyModal(true)}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Company</span>
          </button>
          
          <button
            onClick={() => setShowRecordPaymentModal(true)}
            disabled={companies.length === 0}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Receipt className="w-5 h-5" />
            <span>Record Payment</span>
          </button>
          
          <button
            onClick={() => setShowSelectDeleteModal(true)}
            disabled={companies.length === 0}
            className="flex items-center justify-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete Company</span>
          </button>

          <button
            onClick={() => setShowSelectEditModal(true)}
            disabled={companies.length === 0}
            className="flex items-center justify-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit3 className="w-5 h-5" />
            <span>Edit Company Name</span>
          </button>

          <button
            onClick={handleEditPayment}
            disabled={companies.length === 0}
            className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit3 className="w-5 h-5" />
            <span>Edit Payment</span>
          </button>

          <button
            onClick={handleDeletePayment}
            disabled={companies.length === 0}
            className="flex items-center justify-center space-x-2 bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete Payment</span>
          </button>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <YearFilter selectedYear={selectedYear} onYearChange={handleYearChange} />
          
          <button
            onClick={() => setShowFilterModal(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              minAmount !== undefined
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
            {minAmount !== undefined && (
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                ≥${minAmount}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowMonthlyBreakdownModal(true)}
            className="flex items-center space-x-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Passive Income</span>
          </button>

          <button
            onClick={() => setShowAverageModal(true)}
            className="flex items-center space-x-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Average Monthly Income by Company</span>
          </button>

          <button
            onClick={toggleSortByTopPaid}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              sortByTopPaid
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span>Sort by Top Paid Companies</span>
          </button>
        </div>

        {/* Companies Table */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first company</p>
            <button
              onClick={() => setShowAddCompanyModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Add Your First Company
            </button>
          </div>
        ) : (
          <PaymentTable 
            companies={filteredCompanies} 
            selectedYear={selectedYear}
            onCompanyClick={handleCompanyClick}
          />
        )}

        {/* Analytics Section at Bottom */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-green-600 mb-8">
            Analytics & Trends - {activeTab === 'all' ? 'All Stocks' : 'ISA Stocks'} ({selectedYear})
          </h2>
          
          {/* Payment Trends Chart */}
          <PaymentTrendsChart companies={companies} selectedYear={selectedYear} />
        </div>
      </main>

      {/* Modals */}
      <AddCompanyModal
        isOpen={showAddCompanyModal}
        onClose={() => setShowAddCompanyModal(false)}
        onSubmit={addCompany}
      />
      
      <RecordPaymentModal
        isOpen={showRecordPaymentModal}
        onClose={() => setShowRecordPaymentModal(false)}
        onSubmit={addPayment}
        companies={companies}
      />

      <MonthlyBreakdownModal
        isOpen={showMonthlyBreakdownModal}
        onClose={() => setShowMonthlyBreakdownModal(false)}
        companies={companies}
        selectedYear={selectedYear}
      />
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilter={handleApplyFilter}
        currentMinAmount={minAmount}
      />

      <AveragePerMonthModal
        isOpen={showAverageModal}
        onClose={() => setShowAverageModal(false)}
        companies={companies}
        selectedYear={selectedYear}
      />

      <SelectCompanyModal
        isOpen={showSelectDeleteModal}
        onClose={() => setShowSelectDeleteModal(false)}
        onSelectCompany={handleSelectDeleteCompany}
        companies={companies}
        title="Delete Company"
        description="Select a company to delete. This action will permanently remove the company and all its payment records."
        actionButtonText="Delete Company"
        actionButtonColor="red"
      />

      <DeleteCompanyModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCompanyToDelete(null);
        }}
        onConfirm={confirmDeleteCompany}
        company={companyToDelete}
      />

      <SelectCompanyModal
        isOpen={showSelectEditModal}
        onClose={() => setShowSelectEditModal(false)}
        onSelectCompany={handleSelectEditCompany}
        companies={companies}
        title="Edit Company Name"
        description="Select a company to edit its name."
        actionButtonText="Edit Name"
        actionButtonColor="blue"
      />

      <EditCompanyModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setCompanyToEdit(null);
        }}
        onSubmit={confirmEditCompany}
        company={companyToEdit}
      />

      <CompanyPaymentHistoryModal
        isOpen={showPaymentHistoryModal}
        onClose={() => {
          setShowPaymentHistoryModal(false);
          setSelectedCompanyForHistory(null);
        }}
        company={selectedCompanyForHistory}
        selectedYear={selectedYear}
      />

      <EditPaymentModal
        isOpen={showEditPaymentModal}
        onClose={() => {
          setShowEditPaymentModal(false);
        }}
        onSubmit={confirmEditPayment}
        companies={companies}
        selectedYear={selectedYear}
      />
            <DeletePaymentModal
        isOpen={showDeletePaymentModal}
        onClose={() => setShowDeletePaymentModal(false)}
        onSubmit={confirmDeletePayment}
        companies={companies}
        selectedYear={selectedYear}
      />
    </div>

  );
}