import axios from 'axios';
import { Transaction, TransactionInput, DailyBalance, PaginatedResponse } from '../types';
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
export const getPaginatedTransactions = async (page: number, size: number): Promise<PaginatedResponse<Transaction>> => {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const start = (page - 1) * size;
    const end = start + size;
    const paginatedData = mockTransactions.slice(start, end);
    
    // Cria uma resposta paginada simulada
    return {
      data: paginatedData,
      page: page,
      pageSize: size,
      totalItems: mockTransactions.length,
      totalPages: Math.ceil(mockTransactions.length / size)
    };
  }
  
  try {
    const response = await api.get('/transaction/paginated', {
      params: { page, size }
    });
    
    // A estrutura da resposta da API é:
    // { success: true, message: string, data: { items: [], pageNumber: number, pageSize: number, totalCount: number, totalPages: number } }
    if (response.data && 
        response.data.data && 
        response.data.data.items && 
        Array.isArray(response.data.data.items)) {
      
      const transactions = response.data.data.items as Transaction[];
      
      return {
        data: transactions,
        page: response.data.data.pageNumber || page,
        pageSize: response.data.data.pageSize || size,
        totalItems: response.data.data.totalCount || transactions.length,
        totalPages: response.data.data.totalPages || Math.ceil((response.data.data.totalCount || transactions.length) / size)
      };
    }
    
    // Tentativa secundária - verifica se existe response.data.items diretamente
    if (response.data && 
        response.data.items && 
        Array.isArray(response.data.items)) {
      
      const transactions = response.data.items as Transaction[];
      
      return {
        data: transactions,
        page: response.data.pageNumber || page,
        pageSize: response.data.pageSize || size,
        totalItems: response.data.totalCount || transactions.length,
        totalPages: response.data.totalPages || Math.ceil((response.data.totalCount || transactions.length) / size)
      };
    }
    
    // Fallback - tenta extrair qualquer array disponível ou retorna vazio
    const transactions: Transaction[] = [];
    return {
      data: transactions,
      page: page,
      pageSize: size,
      totalItems: 0,
      totalPages: 0
    };
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Error in getPaginatedTransactions:', error);
    }
    // Em caso de erro, retorna um array vazio
    return {
      data: [],
      page: page,
      pageSize: size,
      totalItems: 0,
      totalPages: 0
    };
  }
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
  
  // Verifica se tem a estrutura aninhada completa
  if (response.data && 
      response.data.data && 
      response.data.data.items && 
      Array.isArray(response.data.data.items)) {
    return response.data.data.items as DailyBalance[];
  }
  
  // Fallback para estrutura alternativa
  if (response.data && 
      response.data.items && 
      Array.isArray(response.data.items)) {
    return response.data.items as DailyBalance[];
  }
  
  // Último recurso
  return extractData<DailyBalance[]>(response.data) || [];
};

/**
 * Obtém balanços com paginação
 */
export const getPaginatedDailyBalances = async (page: number, size: number): Promise<PaginatedResponse<DailyBalance>> => {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Mock simplificado para balanços paginados
    const mockBalances = Array.from({ length: size }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (page - 1) * size - i);
      return mockDailyBalance(date.toISOString().split('T')[0]);
    });
    
    return {
      data: mockBalances,
      page: page,
      pageSize: size,
      totalItems: 100, // valor arbitrário para simulação
      totalPages: Math.ceil(100 / size)
    };
  }
  
  try {
    const response = await api.get('/daily-balance/paginated', {
      params: { page, size }
    });
    
    // Verifica se tem a estrutura aninhada completa
    if (response.data && 
        response.data.data && 
        response.data.data.items && 
        Array.isArray(response.data.data.items)) {
      
      const balances = response.data.data.items as DailyBalance[];
      
      return {
        data: balances,
        page: response.data.data.pageNumber || page,
        pageSize: response.data.data.pageSize || size,
        totalItems: response.data.data.totalCount || balances.length,
        totalPages: response.data.data.totalPages || Math.ceil((response.data.data.totalCount || balances.length) / size)
      };
    }
    
    // Fallback para estrutura alternativa
    if (response.data && 
        response.data.items && 
        Array.isArray(response.data.items)) {
      
      const balances = response.data.items as DailyBalance[];
      
      return {
        data: balances,
        page: response.data.pageNumber || page,
        pageSize: response.data.pageSize || size,
        totalItems: response.data.totalCount || balances.length,
        totalPages: response.data.totalPages || Math.ceil((response.data.totalCount || balances.length) / size)
      };
    }
    
    // Último recurso
    const balances = extractData<DailyBalance[]>(response.data) || [];
    
    return {
      data: balances,
      page: page,
      pageSize: size,
      totalItems: balances.length,
      totalPages: Math.ceil(balances.length / size)
    };
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Error in getPaginatedDailyBalances:', error);
    }
    
    return {
      data: [],
      page: page,
      pageSize: size,
      totalItems: 0,
      totalPages: 0
    };
  }
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