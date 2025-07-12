import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { CompanyWithPayments } from '../../types';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

interface PaymentTrendsChartProps {
  companies: CompanyWithPayments[];
  selectedYear: number;
}

export function PaymentTrendsChart({ companies, selectedYear }: PaymentTrendsChartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Generate bar chart data
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const barChartData = months.map((month, index) => {
    let totalAmount = 0;

    companies.forEach(company => {
      company.payments.forEach(payment => {
        const paymentDate = new Date(payment.payment_date);
        if (paymentDate.getFullYear() === selectedYear && paymentDate.getMonth() === index) {
          totalAmount += payment.amount;
        }
      });
    });

    return {
      month,
      totalAmount,
    };
  });

  // Generate pie chart data
  const pieChartData = companies
    .filter(company => company.total_amount > 0)
    .map(company => ({
      name: company.name,
      value: company.total_amount,
    }))
    .sort((a, b) => b.value - a.value);

  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1',
    '#14b8a6', '#eab308', '#dc2626', '#9333ea', '#0891b2'
  ];

  const hasData = barChartData.some(data => data.totalAmount > 0);

  if (!hasData) {
    return (
      <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm border border-gray-200 dark:border-navy-700 p-8">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Trends ({selectedYear})</h3>
        </div>
        <div className="text-center py-12">
          <div className="bg-gray-100 dark:bg-navy-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No payment data for {selectedYear}</h4>
          <p className="text-gray-600 dark:text-gray-300">No payments were recorded during {selectedYear}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Bar Chart */}
      <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm border border-gray-200 dark:border-navy-700 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Payment Trends ({selectedYear})</h3>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                tick={{ fill: '#6b7280' }}
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                tick={{ fill: '#6b7280' }}
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Total Amount']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="totalAmount" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      {pieChartData.length > 0 && (
        <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm border border-gray-200 dark:border-navy-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <PieChartIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Income Distribution by Company ({selectedYear})</h3>
          </div>
          
          <div className="h-96 lg:h-96 md:h-80 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={window.innerWidth > 768}
                  label={window.innerWidth > 768 ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%` : false}
                  outerRadius={window.innerWidth > 768 ? 120 : window.innerWidth > 640 ? 100 : 80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Total Income']}
                  contentStyle={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    fontSize: window.innerWidth > 640 ? '14px' : '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    fontSize: window.innerWidth > 640 ? '14px' : '12px',
                    paddingTop: '20px'
                  }}
                  layout={window.innerWidth > 768 ? 'horizontal' : 'vertical'}
                  align={window.innerWidth > 768 ? 'center' : 'left'}
                  verticalAlign={window.innerWidth > 768 ? 'bottom' : 'middle'}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}