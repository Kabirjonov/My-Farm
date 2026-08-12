export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionCategory = 'FEED' | 'MEDICINE' | 'SALE' | 'WAGES' | 'EQUIPMENT' | 'OTHER';

export interface FinancialRecord {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description?: string;
  date: string;
}
