import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { IsaCompany, IsaPayment, IsaCompanyWithPayments } from '../types';

export function useIsaCompanies(selectedYear?: number) {
  const [companies, setCompanies] = useState<IsaCompanyWithPayments[]>([]);
  const [loading, setLoading] = useState(true);

  const currentYear = selectedYear || new Date().getFullYear();

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      
      // Get selected year range
      const startOfYear = `${currentYear}-01-01`;
      const endOfYear = `${currentYear}-12-31`;

      // Fetch ISA companies with their payments for the current year
      const { data: companiesData, error: companiesError } = await supabase
        .from('isa_companies')
        .select('*, isa_payments(*)')
        .gte('isa_payments.payment_date', startOfYear)
        .lte('isa_payments.payment_date', endOfYear)
        .order('name');

      if (companiesError) throw companiesError;

      // Also fetch ISA companies without payments this year
      const { data: allCompanies, error: allCompaniesError } = await supabase
        .from('isa_companies')
        .select('*')
        .order('name');

      if (allCompaniesError) throw allCompaniesError;

      // Combine and calculate totals
      const companiesWithPayments: IsaCompanyWithPayments[] = allCompanies.map(company => {
        const companyWithPayments = companiesData?.find(c => c.id === company.id);
        const payments = companyWithPayments?.isa_payments || [];
        const total_amount = payments.reduce((sum: number, payment: IsaPayment) => sum + payment.amount, 0);
        
        return {
          ...company,
          payments,
          total_amount,
        };
      });

      setCompanies(companiesWithPayments);
    } catch (error) {
      console.error('Error fetching ISA companies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [currentYear]);

  const addCompany = async (name: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('isa_companies')
      .insert([{ name, user_id: user.id }]);

    if (error) throw error;
    await fetchCompanies();
  };

  const addPayment = async (company_id: string, amount: number, payment_date: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('isa_payments')
      .insert([{ company_id, amount, payment_date, user_id: user.id }]);

    if (error) throw error;
    await fetchCompanies();
  };

  const deleteCompany = async (company_id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('isa_companies')
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
      .from('isa_companies')
      .update({ name })
      .eq('id', company_id)
      .eq('user_id', user.id);

    if (error) throw error;
    await fetchCompanies();
  };

  const updatePayment = async (payment_id: string, amount: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('isa_payments')
      .update({ amount })
      .eq('id', payment_id)
      .eq('user_id', user.id);

    if (error) throw error;
    await fetchCompanies();
  };

  const deletePayment = async (payment_id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('isa_payments')
      .delete()
      .eq('id', payment_id)
      .eq('user_id', user.id);

    if (error) throw error;
    await fetchCompanies();
  };

  return {
    companies,
    loading,
    selectedYear: currentYear,
    addCompany,
    addPayment,
    deleteCompany,
    updateCompany,
    updatePayment,
    deletePayment,
    refreshCompanies: fetchCompanies,
  };
}