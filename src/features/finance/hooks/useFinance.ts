import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeService } from '../services/financeService';
import { Expense, Income } from '@/types/domain';

export function useFinance(farmId: string = 'farm-001') {
  const queryClient = useQueryClient();

  const expensesQuery = useQuery({
    queryKey: ['expenses', farmId],
    queryFn: () => financeService.getExpenses(farmId),
  });

  const incomesQuery = useQuery({
    queryKey: ['incomes', farmId],
    queryFn: () => financeService.getIncomes(farmId),
  });

  const summaryQuery = useQuery({
    queryKey: ['finance-summary', farmId],
    queryFn: () => financeService.getSummary(farmId),
  });

  const reportsQuery = useQuery({
    queryKey: ['reports-data', farmId],
    queryFn: () => financeService.getReportsData(farmId),
  });

  const addExpenseMutation = useMutation({
    mutationFn: (expense: Omit<Expense, 'id'>) => {
      financeService.addExpense(expense);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['finance-summary'] });
      queryClient.invalidateQueries({ queryKey: ['reports-data'] });
    },
  });

  const addIncomeMutation = useMutation({
    mutationFn: (income: Omit<Income, 'id'>) => {
      financeService.addIncome(income);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['finance-summary'] });
      queryClient.invalidateQueries({ queryKey: ['reports-data'] });
      queryClient.invalidateQueries({ queryKey: ['livestock'] });
    },
  });

  return {
    expenses: expensesQuery.data || [],
    incomes: incomesQuery.data || [],
    summary: summaryQuery.data,
    reportsData: reportsQuery.data,
    isLoading: expensesQuery.isLoading || incomesQuery.isLoading || summaryQuery.isLoading,
    addExpense: addExpenseMutation.mutate,
    addIncome: addIncomeMutation.mutate,
  };
}
