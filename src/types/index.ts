export interface Company {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export interface Payment {
  id: string;
  company_id: string;
  amount: number;
  payment_date: string;
  user_id: string;
  created_at: string;
}

export interface CompanyWithPayments extends Company {
  payments: Payment[];
  total_amount: number;
}

export interface IsaCompany {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export interface IsaPayment {
  id: string;
  company_id: string;
  amount: number;
  payment_date: string;
  user_id: string;
  created_at: string;
}

export interface IsaCompanyWithPayments extends IsaCompany {
  payments: IsaPayment[];
  total_amount: number;
}

export type TabType = 'all' | 'isa';

export interface User {
  id: string;
  email: string;
}