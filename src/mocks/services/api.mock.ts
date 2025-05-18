import { Transaction, TransactionInput, DailyBalance } from '../../types';
import { mockTransactions } from '../../mocks/transactions';
import { mockDailyBalance, mockDailyBalancePeriod } from '../../mocks/dailyBalance';

// Mock de api.ts para testes
export const getTransactions = jest.fn(async (): Promise<Transaction[]> => {
  return [...mockTransactions];
});

export const getTransactionById = jest.fn(async (id: number): Promise<Transaction> => {
  const transaction = mockTransactions.find(t => t.id === id);
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  return transaction;
});

export const createTransaction = jest.fn(async (data: TransactionInput): Promise<Transaction> => {
  const newTransaction: Transaction = {
    id: Math.max(...mockTransactions.map(t => t.id), 0) + 1,
    ...data,
    createdAt: new Date().toISOString(),
    transactionDate: data.transactionDate || new Date().toISOString(),
  };
  return newTransaction;
});

export const getDailyBalance = jest.fn(async (date: string): Promise<DailyBalance> => {
  return mockDailyBalance(date);
});

export const getDailyBalanceByPeriod = jest.fn(async (startDate: string, endDate: string): Promise<DailyBalance[]> => {
  return mockDailyBalancePeriod(startDate, endDate);
});

// Mock do objeto api
const api = {
  get: jest.fn(),
  post: jest.fn()
};

export default api; 