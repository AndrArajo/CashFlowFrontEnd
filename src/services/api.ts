import axios from 'axios';
import { Transaction, TransactionInput, DailyBalance } from '../types';
import { getToken } from './auth';

// Importação dos mocks
import { mockTransactions } from '../mocks/transactions';
import { mockDailyBalance, mockDailyBalancePeriod } from '../mocks/dailyBalance';

// Obtém valores do .env
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';
const USE_MOCKS = process.env.REACT_APP_USE_MOCKS === 'true';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

const extractData = <T>(response: any): T => {
  // Verifica se a resposta está no formato { data: [...] } da API ou diretamente como array
  if (response && response.data && Array.isArray(response.data)) {
    return response.data as T;
  }
  // Retorna a resposta original para compatibilidade com o formato anterior
  return response as T;
};

// ===== TRANSAÇÕES =====

/**
 * Obtém todas as transações
 */
export const getTransactions = async (): Promise<Transaction[]> => {
  if (USE_MOCKS) {
    // Simula um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTransactions;
  }
  const response = await api.get('/transaction');
  return extractData<Transaction[]>(response.data);
};

/**
 * Obtém transações com paginação
 */
export const getPaginatedTransactions = async (page: number, size: number): Promise<Transaction[]> => {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const start = (page - 1) * size;
    const end = start + size;
    return mockTransactions.slice(start, end);
  }
  const response = await api.get('/transaction/paginated', {
    params: { page, size }
  });
  return extractData<Transaction[]>(response.data);
};

/**
 * Obtém uma transação pelo ID
 */
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

/**
 * Cria uma nova transação
 */
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

// ===== BALANÇOS DIÁRIOS =====

/**
 * Obtém o balanço para uma data específica
 */
export const getDailyBalance = async (date: string): Promise<DailyBalance> => {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDailyBalance(date);
  }
  const response = await api.get(`/daily-balance/${date}`);
  return response.data;
};

/**
 * Obtém os balanços para um período
 */
export const getDailyBalanceByPeriod = async (startDate: string, endDate: string): Promise<DailyBalance[]> => {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDailyBalancePeriod(startDate, endDate);
  }
  const response = await api.get('/daily-balance/period', {
    params: { startDate, endDate },
  });
  return extractData<DailyBalance[]>(response.data);
};

/**
 * Obtém balanços com paginação
 */
export const getPaginatedDailyBalances = async (page: number, size: number): Promise<DailyBalance[]> => {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Mock simplificado para balanços paginados
    const mockBalances = Array.from({ length: size }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (page - 1) * size - i);
      return mockDailyBalance(date.toISOString().split('T')[0]);
    });
    return mockBalances;
  }
  const response = await api.get('/daily-balance/paginated', {
    params: { page, size }
  });
  return extractData<DailyBalance[]>(response.data);
};

/**
 * Obtém resumo do balanço para uma data específica
 */
export const getDailyBalanceSummary = async (date: string): Promise<DailyBalance> => {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDailyBalance(date);
  }
  const response = await api.get(`/daily-balance/summary/${date}`);
  return response.data;
};

/**
 * Processa o balanço para uma data específica
 */
export const processDailyBalance = async (date: string): Promise<DailyBalance> => {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDailyBalance(date);
  }
  const response = await api.post(`/daily-balance/process/${date}`);
  return response.data;
};

/**
 * Processa os balanços para um período
 */
export const processDailyBalanceRange = async (startDate: string, endDate: string): Promise<DailyBalance[]> => {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDailyBalancePeriod(startDate, endDate);
  }
  const response = await api.post('/daily-balance/process-range', null, {
    params: { startDate, endDate }
  });
  return extractData<DailyBalance[]>(response.data);
};

export default api; 