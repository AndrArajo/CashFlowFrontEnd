import axios from 'axios';
import { Transaction, TransactionInput, DailyBalance } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get('/transaction');
  return response.data;
};

export const getTransactionById = async (id: number): Promise<Transaction> => {
  const response = await api.get(`/transaction/${id}`);
  return response.data;
};

export const createTransaction = async (data: TransactionInput): Promise<Transaction> => {
  const response = await api.post('/transaction', data);
  return response.data;
};

export const getDailyBalance = async (date: string): Promise<DailyBalance> => {
  const response = await api.get(`/daily-balance/${date}`);
  return response.data;
};

export const getDailyBalanceByPeriod = async (startDate: string, endDate: string): Promise<DailyBalance[]> => {
  const response = await api.get('/daily-balance/period', {
    params: { startDate, endDate },
  });
  return response.data;
};

export default api; 