// Mock do módulo api
jest.mock('../../services/api', () => require('../../mocks/services/api.mock'));

// Importar serviços depois do mock
import { 
  getTransactions, 
  getTransactionById, 
  createTransaction, 
  getDailyBalance,
  getDailyBalanceByPeriod
} from '../../services/api';
import { mockTransactions } from '../../mocks/transactions';
import { TransactionType } from '../../types';

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getTransactions deve retornar dados mockados', async () => {
    const result = await getTransactions();
    expect(result).toEqual(expect.arrayContaining(mockTransactions));
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

  test('getDailyBalance deve retornar um saldo diário', async () => {
    const result = await getDailyBalance('2025-05-20');
    expect(result).toBeDefined();
    expect(result.balanceDate).toBeDefined();
  });

  test('getDailyBalanceByPeriod deve retornar saldos diários para um período', async () => {
    const result = await getDailyBalanceByPeriod('2025-05-20', '2025-05-21');
    expect(Array.isArray(result)).toBe(true);
  });
}); 