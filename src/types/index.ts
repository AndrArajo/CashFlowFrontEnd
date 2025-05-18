export enum TransactionType {
  Credit = 0,
  Debit = 1
}

export interface TransactionInput {
  description?: string;
  amount: number;
  type: TransactionType;
  origin?: string;
  transactionDate?: string;
}

export interface Transaction {
  id: number;
  description?: string;
  amount: number;
  type: TransactionType;
  origin?: string;
  transactionDate: string;
  createdAt: string;
}

export interface DailyBalance {
  id: number;
  balanceDate: string;
  finalBalance: number;
  previousBalance: number;
  totalCredits: number;
  totalDebits: number;
  createdAt: string;
  updatedAt: string;
} 