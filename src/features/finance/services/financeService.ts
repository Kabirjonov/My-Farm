import { financeRepository, FinanceSummary, ReportsData } from '@/lib/db';
import { Expense, Income } from '@/types/domain';

export const financeService = {
  getExpenses(farmId?: string): Expense[] {
    return financeRepository.listExpenses(farmId);
  },

  getIncomes(farmId?: string): Income[] {
    return financeRepository.listIncomes(farmId);
  },

  getSummary(farmId?: string): FinanceSummary {
    return financeRepository.getFinanceSummary(farmId);
  },

  getReportsData(farmId?: string): ReportsData {
    return financeRepository.getReportsData(farmId);
  },

  addExpense(expense: Omit<Expense, 'id'>): Expense {
    return financeRepository.addExpense(expense);
  },

  addIncome(income: Omit<Income, 'id'>): Income {
    return financeRepository.addIncome(income);
  },
};
