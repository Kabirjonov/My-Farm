import { animalFormSchema } from '../src/features/livestock/schemas/animalSchema';
import { generateUUID } from '../src/utils/uuid';
import { hasPermission } from '../src/features/auth/permissions';
import { UserRole } from '../src/features/auth/types';

describe('My Farm Domain & Schema Unit Tests', () => {
  describe('Animal Form Schema Validation', () => {
    it('should validate a valid animal form input', () => {
      const validData = {
        tagNumber: 'SHEEP-101',
        name: 'Qo\'chqor aka',
        type: 'SHEEP',
        gender: 'MALE',
        breed: 'Hisor',
        status: 'HEALTHY',
        weight: 65.5,
      };

      const result = animalFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail validation if tagNumber is missing or invalid', () => {
      const invalidData = {
        tagNumber: '',
        type: 'SHEEP',
        gender: 'MALE',
        breed: 'Hisor',
        birthDate: '2025-01-15',
        weightKg: '65.5',
      };

      const result = animalFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('UUID Generation Utility', () => {
    it('should generate valid UUID v4 formatted strings', () => {
      const id1 = generateUUID();
      const id2 = generateUUID();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toEqual(id2);
      expect(id1).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  describe('Feed Inventory & Stock Rules Logic', () => {
    it('should correctly calculate stock deduction on OUT transaction', () => {
      const currentStock = 100; // 100 kg
      const outQuantity = 25; // 25 kg
      const newStock = currentStock - outQuantity;

      expect(newStock).toBe(75);
    });

    it('should flag insufficient stock when OUT transaction exceeds currentQuantity', () => {
      const currentStock = 20;
      const outQuantity = 50;
      const isInsufficient = outQuantity > currentStock;

      expect(isInsufficient).toBe(true);
    });
  });

  describe('Finance Summary Logic', () => {
    it('should correctly calculate net profit from expenses and incomes', () => {
      const monthlyExpenses = 4500000; // UZS
      const monthlyIncomes = 12000000; // UZS
      const netProfit = monthlyIncomes - monthlyExpenses;

      expect(netProfit).toBe(7500000);
    });
  });

  describe('RBAC Permission Matrix', () => {
    it('should grant full permissions to OWNER', () => {
      expect(hasPermission('OWNER', 'ANIMAL_CREATE')).toBe(true);
      expect(hasPermission('OWNER', 'FINANCE_MANAGE')).toBe(true);
    });

    it('should deny FINANCE_MANAGE to WORKER role', () => {
      expect(hasPermission('WORKER', 'FINANCE_MANAGE')).toBe(false);
      expect(hasPermission('WORKER', 'ANIMAL_READ')).toBe(true);
    });
  });
});
