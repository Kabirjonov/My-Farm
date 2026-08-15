import { dbInstance } from '../database';
import { Expense, Income, Animal, FeedItem, CropSeason, HarvestRecord, HealthRecord } from '@/types/domain';
import { generateUUID } from '@/utils/uuid';

export interface FinanceSummary {
  monthlyExpenses: number;
  monthlyIncomes: number;
  netProfit: number;
}

export interface ReportsData {
  livestockReport: { type: string; count: number }[];
  lowStockReport: FeedItem[];
  cropYieldReport: { cropName: string; expected: number; actual: number; unit: string }[];
  monthlyProfitReport: { month: string; income: number; expense: number; profit: number }[];
  healthCostReport: { totalHealthCost: number; recordCount: number };
}

export const financeRepository = {
  listExpenses(farmId: string = 'farm-001'): Expense[] {
    return dbInstance.getAllSync<Expense>(
      'SELECT * FROM expenses WHERE farmId = ? ORDER BY date DESC',
      [farmId]
    );
  },

  listIncomes(farmId: string = 'farm-001'): Income[] {
    return dbInstance.getAllSync<Income>(
      'SELECT * FROM incomes WHERE farmId = ? ORDER BY date DESC',
      [farmId]
    );
  },

  addExpense(input: Omit<Expense, 'id'>): Expense {
    const id = generateUUID();
    const expense: Expense = { ...input, id, currency: 'UZS' };

    dbInstance.runSync(
      `INSERT INTO expenses (id, farmId, title, category, amount, currency, date, relatedAnimalId, relatedFeedItemId, relatedCropSeasonId, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        expense.id,
        expense.farmId,
        expense.title,
        expense.category,
        expense.amount,
        expense.currency,
        expense.date,
        expense.relatedAnimalId ?? null,
        expense.relatedFeedItemId ?? null,
        expense.relatedCropSeasonId ?? null,
        expense.notes ?? null,
      ]
    );

    return expense;
  },

  addIncome(input: Omit<Income, 'id'>): Income {
    const id = generateUUID();
    const income: Income = { ...input, id, currency: 'UZS' };

    dbInstance.runSync(
      `INSERT INTO incomes (id, farmId, title, category, amount, currency, date, relatedAnimalId, relatedCropSeasonId, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        income.id,
        income.farmId,
        income.title,
        income.category,
        income.amount,
        income.currency,
        income.date,
        income.relatedAnimalId ?? null,
        income.relatedCropSeasonId ?? null,
        income.notes ?? null,
      ]
    );

    // Business Rule: If income category is ANIMAL_SALE and relatedAnimalId exists, set status to SOLD
    if (income.category === 'ANIMAL_SALE' && income.relatedAnimalId) {
      const now = new Date().toISOString();
      dbInstance.runSync("UPDATE animals SET status = 'SOLD', updatedAt = ? WHERE id = ?", [now, income.relatedAnimalId]);
    }

    return income;
  },

  getFinanceSummary(farmId: string = 'farm-001'): FinanceSummary {
    const nowMonth = new Date().toISOString().substring(0, 7); // YYYY-MM

    const expenses = dbInstance.getAllSync<Expense>(
      "SELECT * FROM expenses WHERE farmId = ? AND date LIKE ?",
      [farmId, `${nowMonth}%`]
    );

    const incomes = dbInstance.getAllSync<Income>(
      "SELECT * FROM incomes WHERE farmId = ? AND date LIKE ?",
      [farmId, `${nowMonth}%`]
    );

    const monthlyExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const monthlyIncomes = incomes.reduce((acc, i) => acc + i.amount, 0);

    return {
      monthlyExpenses,
      monthlyIncomes,
      netProfit: monthlyIncomes - monthlyExpenses,
    };
  },

  getReportsData(farmId: string = 'farm-001'): ReportsData {
    // 1. Livestock count report
    const activeAnimals = dbInstance.getAllSync<Animal>(
      "SELECT * FROM animals WHERE status = 'ACTIVE' AND farmId = ?",
      [farmId]
    );
    const typeCounts: Record<string, number> = {};
    activeAnimals.forEach((a) => {
      typeCounts[a.type] = (typeCounts[a.type] || 0) + 1;
    });
    const livestockReport = Object.keys(typeCounts).map((t) => ({ type: t, count: typeCounts[t] }));

    // 2. Feed low stock report
    const lowStockReport = dbInstance.getAllSync<FeedItem>(
      'SELECT * FROM feed_inventory WHERE farmId = ? AND currentQuantity <= minQuantity',
      [farmId]
    );

    // 3. Crop yield report (Expected vs Actual)
    const cropSeasons = dbInstance.getAllSync<CropSeason>('SELECT * FROM crop_seasons');
    const cropYieldReport = cropSeasons.map((c) => {
      const harvests = dbInstance.getAllSync<HarvestRecord>(
        'SELECT * FROM harvest_records WHERE cropSeasonId = ?',
        [c.id]
      );
      const actual = harvests.reduce((acc: number, h: HarvestRecord) => acc + h.quantity, 0);
      return {
        cropName: c.cropName,
        expected: c.expectedYield || 0,
        actual,
        unit: c.expectedYieldUnit || 'TON',
      };
    });

    // 4. Monthly profit report
    const allExpenses = this.listExpenses(farmId);
    const allIncomes = this.listIncomes(farmId);
    const monthsSet = new Set<string>();
    allExpenses.forEach((e) => monthsSet.add(e.date.substring(0, 7)));
    allIncomes.forEach((i) => monthsSet.add(i.date.substring(0, 7)));

    const monthlyProfitReport = Array.from(monthsSet).sort().reverse().map((month) => {
      const exp = allExpenses.filter((e) => e.date.startsWith(month)).reduce((acc: number, e: Expense) => acc + e.amount, 0);
      const inc = allIncomes.filter((i) => i.date.startsWith(month)).reduce((acc: number, i: Income) => acc + i.amount, 0);
      return {
        month,
        income: inc,
        expense: exp,
        profit: inc - exp,
      };
    });

    // 5. Animal health cost report
    const healthRecords = dbInstance.getAllSync<HealthRecord>('SELECT * FROM health_records WHERE cost > 0');
    const totalHealthCost = healthRecords.reduce((acc: number, h: HealthRecord) => acc + (h.cost || 0), 0);

    return {
      livestockReport,
      lowStockReport,
      cropYieldReport,
      monthlyProfitReport,
      healthCostReport: {
        totalHealthCost,
        recordCount: healthRecords.length,
      },
    };
  },
};
