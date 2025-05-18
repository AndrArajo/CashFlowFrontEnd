import { Transaction, TransactionType } from '../types';

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    description: 'Salário',
    amount: 5000,
    type: TransactionType.Credit,
    origin: 'Empresa',
    transactionDate: '2025-05-10T00:00:00',
    createdAt: '2025-05-10T10:30:00',
  },
  {
    id: 2,
    description: 'Aluguel',
    amount: 1200,
    type: TransactionType.Debit,
    origin: 'Imobiliária',
    transactionDate: '2025-05-05T00:00:00',
    createdAt: '2025-05-05T14:45:00',
  },
  {
    id: 3,
    description: 'Supermercado',
    amount: 350.75,
    type: TransactionType.Debit,
    origin: 'Mercado ABC',
    transactionDate: '2025-05-08T00:00:00',
    createdAt: '2025-05-08T18:20:00',
  },
  {
    id: 4,
    description: 'Freelance',
    amount: 1500,
    type: TransactionType.Credit,
    origin: 'Cliente XYZ',
    transactionDate: '2025-05-12T00:00:00',
    createdAt: '2025-05-12T09:15:00',
  },
  {
    id: 5,
    description: 'Conta de luz',
    amount: 120.30,
    type: TransactionType.Debit,
    origin: 'Companhia Elétrica',
    transactionDate: '2025-05-15T00:00:00',
    createdAt: '2025-05-15T16:00:00',
  }
]; 