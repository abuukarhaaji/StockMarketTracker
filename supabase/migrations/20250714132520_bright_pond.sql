/*
  # Create ISA companies and payments tables

  1. New Tables
    - `isa_companies`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
    - `isa_payments`
      - `id` (uuid, primary key)
      - `company_id` (uuid, foreign key to isa_companies)
      - `amount` (numeric, not null)
      - `payment_date` (date, not null)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Users can only see and modify their own ISA companies and payments

  3. Relationships
    - Foreign key constraint between isa_payments.company_id and isa_companies.id
    - Both tables linked to auth.users via user_id
*/

-- Create ISA companies table
CREATE TABLE IF NOT EXISTS isa_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create ISA payments table
CREATE TABLE IF NOT EXISTS isa_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES isa_companies(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  payment_date date NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE isa_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE isa_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for isa_companies table
CREATE POLICY "Users can view their own ISA companies"
  ON isa_companies
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ISA companies"
  ON isa_companies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ISA companies"
  ON isa_companies
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ISA companies"
  ON isa_companies
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for isa_payments table
CREATE POLICY "Users can view their own ISA payments"
  ON isa_payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ISA payments"
  ON isa_payments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ISA payments"
  ON isa_payments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ISA payments"
  ON isa_payments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS isa_companies_user_id_idx ON isa_companies(user_id);
CREATE INDEX IF NOT EXISTS isa_payments_user_id_idx ON isa_payments(user_id);
CREATE INDEX IF NOT EXISTS isa_payments_company_id_idx ON isa_payments(company_id);
CREATE INDEX IF NOT EXISTS isa_payments_payment_date_idx ON isa_payments(payment_date);

-- Add unique constraint for company names per user (same as regular companies)
CREATE UNIQUE INDEX IF NOT EXISTS isa_companies_name_user_id_unique ON isa_companies(name, user_id);