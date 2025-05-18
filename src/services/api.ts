import axios from 'axios';
import { Transaction, TransactionInput, DailyBalance } from '../types';

// Importação dos mocks (serão criados a seguir)
import { mockTransactions } from '../mocks/transactions';
import { mockDailyBalance, mockDailyBalancePeriod } from '../mocks/dailyBalance';

// Obtém valores do .env
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';
const USE_MOCKS = process.env.REACT_APP_USE_MOCKS === 'true';

const api = axios.create({
  baseURL: API_URL,
});

export const getTransactions = async (): Promise<Transaction[]> => {
  if (USE_MOCKS) {
    // Simula um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTransactions;
  }
  const response = await api.get('/transaction');
  return response.data;
};

export const getTransactionById = async (id: number): Promise<Transaction> => {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const transaction = mockTransactions.find(t => t.id === id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  }
  const response = await api.get(`/transaction/${id}`);
  return response.data;
};

export const createTransaction = async (data: TransactionInput): Promise<Transaction> => {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Simulando a criação com um novo ID
    const newTransaction: Transaction = {
      id: Math.max(...mockTransactions.map(t => t.id), 0) + 1,
      ...data,
      createdAt: new Date().toISOString(),
      transactionDate: data.transactionDate || new Date().toISOString(),
    };
    mockTransactions.push(newTransaction);
    return newTransaction;
  }
  const response = await api.post('/transaction', data);
  return response.data;
};

export const getDailyBalance = async (date: string): Promise<DailyBalance> => {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDailyBalance(date);
  }
  const response = await api.get(`/daily-balance/${date}`);
  return response.data;
};

export const getDailyBalanceByPeriod = async (startDate: string, endDate: string): Promise<DailyBalance[]> => {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDailyBalancePeriod(startDate, endDate);
  }
  const response = await api.get('/daily-balance/period', {
    params: { startDate, endDate },
  });
  return response.data;
};

export default api; 