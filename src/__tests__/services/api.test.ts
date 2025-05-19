// Mock do módulo api
jest.mock('../../services/api', () => require('../../mocks/services/api.mock'));

// Importar serviços depois do mock
import { 
  getTransactions, 
  getTransactionById, 
  createTransaction, 
  getDailyBalance,
  getDailyBalanceByPeriod,
  getPaginatedTransactions,
  getPaginatedDailyBalances,
  getDailyBalanceSummary,
  processDailyBalance,
  processDailyBalanceRange
} from '../../services/api';
import { mockTransactions } from '../../mocks/transactions';
import { TransactionType } from '../../types';

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Testes para Transações
  describe('Transações', () => {
    test('getTransactions deve retornar dados mockados', async () => {
      const result = await getTransactions();
      expect(result).toEqual(expect.arrayContaining(mockTransactions));
    });

    test('getPaginatedTransactions deve retornar transações paginadas', async () => {
      const result = await getPaginatedTransactions(1, 2);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockTransactions[0]);
      expect(result[1]).toEqual(mockTransactions[1]);
    });

    test('getTransactionById deve retornar uma transação mockada', async () => {
      const result = await getTransactionById(1);
      expect(result).toEqual(mockTransactions[0]);
    });

    test('getTransactionById deve lançar erro quando o ID não existe', async () => {
      await expect(getTransactionById(999)).rejects.toThrow('Transaction not found');
    });

    test('createTransaction deve criar uma nova transação mockada', async () => {
      const mockInput = { 
        amount: 100,
        type: TransactionType.Credit,
        description: 'Nova Transação'
      };
      
      const result = await createTransaction(mockInput);
      
      expect(result.id).toBeDefined();
      expect(result.description).toBe('Nova Transação');
      expect(result.amount).toBe(100);
      expect(result.type).toBe(TransactionType.Credit);
    });
  });

  // Testes para Balanços Diários
  describe('Balanços Diários', () => {
    test('getDailyBalance deve retornar um saldo diário', async () => {
      const result = await getDailyBalance('2025-05-20');
      expect(result).toBeDefined();
      expect(result.balanceDate).toBeDefined();
      expect(result.finalBalance).toBeDefined();
      expect(result.previousBalance).toBeDefined();
    });

    test('getDailyBalanceByPeriod deve retornar saldos diários para um período', async () => {
      const result = await getDailyBalanceByPeriod('2025-05-20', '2025-05-21');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    test('getPaginatedDailyBalances deve retornar balanços paginados', async () => {
      const result = await getPaginatedDailyBalances(1, 3);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      expect(result[0].balanceDate).toBeDefined();
    });

    test('getDailyBalanceSummary deve retornar um resumo de saldo diário', async () => {
      const result = await getDailyBalanceSummary('2025-05-20');
      expect(result).toBeDefined();
      expect(result.balanceDate).toBeDefined();
      expect(result.totalCredits).toBeDefined();
      expect(result.totalDebits).toBeDefined();
    });

    test('processDailyBalance deve processar e retornar um balanço diário', async () => {
      const result = await processDailyBalance('2025-05-20');
      expect(result).toBeDefined();
      expect(result.balanceDate).toBeDefined();
      expect(result.finalBalance).toBeDefined();
    });

    test('processDailyBalanceRange deve processar e retornar balanços de um período', async () => {
      const startDate = '2025-05-20';
      const endDate = '2025-05-22';
      const result = await processDailyBalanceRange(startDate, endDate);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
    });
  });
}); 