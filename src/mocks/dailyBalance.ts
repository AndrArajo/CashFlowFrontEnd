import { DailyBalance } from '../types';
import { mockTransactions } from './transactions';

// Função auxiliar para criar um objeto de saldo diário
const createDailyBalance = (date: string, previousBalance: number): DailyBalance => {
  const dateTransactions = mockTransactions.filter(
    t => t.transactionDate.substring(0, 10) === date.substring(0, 10)
  );
  
  const totalCredits = dateTransactions
    .filter(t => t.type === 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalDebits = dateTransactions
    .filter(t => t.type === 1)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const finalBalance = previousBalance + totalCredits - totalDebits;
  
  return {
    id: Date.now(),
    balanceDate: date,
    previousBalance,
    finalBalance,
    totalCredits,
    totalDebits,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const mockDailyBalance = (date: string): DailyBalance => {
  const initialBalance = 3000;
  return createDailyBalance(date, initialBalance);
};

// Função para obter saldos de um período
export const mockDailyBalancePeriod = (startDate: string, endDate: string): DailyBalance[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const result: DailyBalance[] = [];
  
  let currentBalance = 3000; // Saldo inicial
  let currentDate = new Date(start);
  
  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().substring(0, 10);
    const dailyBalance = createDailyBalance(dateStr, currentBalance);
    
    result.push(dailyBalance);
    currentBalance = dailyBalance.finalBalance;
    
    // Avança para o próximo dia
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return result;
}; 