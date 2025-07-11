import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Company, Payment, CompanyWithPayments } from '../types';

export function useCompanies() {
  const [companies, setCompanies] = useState<CompanyWithPayments[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      
      // Get current year
      const currentYear = new Date().getFullYear();
      const startOfYear = `${currentYear}-01-01`;
      const endOfYear = `${currentYear}-12-31`;

      // Fetch companies with their payments for the current year
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*, payments(*)')
        .gte('payments.payment_date', startOfYear)
        .lte('payments.payment_date', endOfYear)
        .order('name');

      if (companiesError) throw companiesError;

      // Also fetch companies without payments this year
      const { data: allCompanies, error: allCompaniesError } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (allCompaniesError) throw allCompaniesError;

      // Combine and calculate totals
      const companiesWithPayments: CompanyWithPayments[] = allCompanies.map(company => {
        const companyWithPayments = companiesData?.find(c => c.id === company.id);
        const payments = companyWithPayments?.payments || [];
        const total_amount = payments.reduce((sum: number, payment: Payment) => sum + payment.amount, 0);
        
        return {
          ...company,
          payments,
          total_amount,
        };
      });

      setCompanies(companiesWithPayments);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const addCompany = async (name: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('companies')
      .insert([{ name, user_id: user.id }]);

    if (error) throw error;
    await fetchCompanies();
  };

  const addPayment = async (company_id: string, amount: number, payment_date: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('payments')
      .insert([{ company_id, amount, payment_date, user_id: user.id }]);

    if (error) throw error;
    await fetchCompanies();
  };

  const deleteCompany = async (company_id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', company_id)
      .eq('user_id', user.id);

    if (error) throw error;
    await fetchCompanies();
  };

  const updateCompany = async (company_id: string, name: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('companies')
      .update({ name })
      .eq('id', company_id)
      .eq('user_id', user.id);

    if (error) throw error;
    await fetchCompanies();
  };

  return {
    companies,
    loading,
    addCompany,
    addPayment,
    deleteCompany,
    updateCompany,
    refreshCompanies: fetchCompanies,
  };
}