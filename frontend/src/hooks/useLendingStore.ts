import { useState, useCallback } from 'react';
import { 
  Customer, 
  Loan, 
  Payment, 
  LoanCreateRequest, 
  PaymentRequest, 
  LoanLedger, 
  CustomerOverview 
} from '@/types/lending';
import axios from "axios";

const API_BASE = "http://localhost:3001";

export const useLendingStore = () => {
  const [customers] = useState<Customer[]>([
    { customer_id: 'CUST001', name: 'John Doe', created_at: '2024-01-15T10:00:00Z' },
    { customer_id: 'CUST002', name: 'Jane Smith', created_at: '2024-01-20T10:00:00Z' },
    { customer_id: 'CUST003', name: 'Robert Johnson', created_at: '2024-02-01T10:00:00Z' },
  ]);

  const [loans, setLoans] = useState<Loan[]>([
    {
      loan_id: 'LOAN001',
      customer_id: 'CUST001',
      principal_amount: 100000,
      total_amount: 120000,
      interest_rate: 10,
      loan_period_years: 2,
      monthly_emi: 5000,
      status: 'ACTIVE',
      created_at: '2024-01-15T10:30:00Z'
    }
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    {
      payment_id: 'PAY001',
      loan_id: 'LOAN001',
      amount: 5000,
      payment_type: 'EMI',
      payment_date: '2024-02-15T10:00:00Z'
    }
  ]);

  const calculateLoanDetails = useCallback((
    principal: number,
    years: number,
    rate: number
  ) => {
    const totalInterest = principal * years * (rate / 100);
    const totalAmount = principal + totalInterest;
    const monthlyEmi = totalAmount / (years * 12);
    
    return {
      total_interest: totalInterest,
      total_amount: totalAmount,
      monthly_emi: monthlyEmi
    };
  }, []);

  const createLoan = useCallback(async (loanData: LoanCreateRequest) => {
  const res = await axios.post(`${API_BASE}/loans`, loanData);
  return res.data;
  }, []);

  const recordPayment = useCallback(async (loanId: string, paymentData: PaymentRequest) => {
  const res = await axios.post(`${API_BASE}/loans/${loanId}/payments`, paymentData);
  return res.data; 
  }, []);


  const getLoanLedger = useCallback(async (loanId: string): Promise<LoanLedger> => {
  const res = await axios.get(`${API_BASE}/loans/${loanId}/ledger`);
  return res.data;
  }, []);


  const getCustomerOverview = useCallback(async (customerId: string): Promise<CustomerOverview> => {
  const res = await axios.get(`${API_BASE}/customers/${customerId}/overview`);
  return res.data;
  }, []);


  return {
    customers,
    loans,
    payments,
    createLoan,
    recordPayment,
    getLoanLedger,
    getCustomerOverview,
    calculateLoanDetails
  };
};