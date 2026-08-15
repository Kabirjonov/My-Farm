import { Platform } from 'react-native';

export interface IDatabaseInstance {
  execSync(sql: string): void;
  getAllSync<T = any>(sql: string, params?: any[]): T[];
  getFirstSync<T = any>(sql: string, params?: any[]): T | null;
  runSync(sql: string, params?: any[]): { lastInsertRowId: number; changes: number };
}

// Web mock database engine for web browser testing
function createWebMockDatabase(): IDatabaseInstance {
  const memoryStore: Record<string, any[]> = {
    animals: [
      {
        id: 'web-anim-1',
        farmId: 'farm-001',
        tagNumber: 'QOY-001',
        name: 'Hisori Qo\'y 1',
        type: 'SHEEP',
        gender: 'FEMALE',
        breed: 'Hisori',
        birthDate: '2024-03-10',
        weightKg: 65,
        status: 'ACTIVE',
        healthStatus: 'HEALTHY',
        purchasePrice: 2500000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'web-anim-2',
        farmId: 'farm-001',
        tagNumber: 'MOL-102',
        name: 'Qora-Ola Sig\'ir',
        type: 'COW',
        gender: 'FEMALE',
        breed: 'Golshtin',
        birthDate: '2023-05-12',
        weightKg: 480,
        status: 'ACTIVE',
        healthStatus: 'PREGNANT',
        purchasePrice: 14000000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'web-anim-3',
        farmId: 'farm-001',
        tagNumber: 'OT-007',
        name: 'Qorabayir',
        type: 'HORSE',
        gender: 'MALE',
        breed: 'Qorabayir',
        birthDate: '2022-01-20',
        weightKg: 390,
        status: 'ACTIVE',
        healthStatus: 'HEALTHY',
        purchasePrice: 18000000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    feed_inventory: [
      { id: 'web-feed-1', farmId: 'farm-001', name: 'Beda (press)', currentQuantity: 250, minQuantity: 50, unit: 'BALE', updatedAt: new Date().toISOString() },
      { id: 'web-feed-2', farmId: 'farm-001', name: 'Somon', currentQuantity: 400, minQuantity: 100, unit: 'BALE', updatedAt: new Date().toISOString() },
      { id: 'web-feed-3', farmId: 'farm-001', name: 'Arpa yem', currentQuantity: 120, minQuantity: 300, unit: 'KG', updatedAt: new Date().toISOString() },
    ],
    feed_transactions: [],
    land_fields: [
      { id: 'web-field-1', farmId: 'farm-001', name: 'Shimoliy 5-Gektar Maydon', area: 5, areaUnit: 'HECTARE', soilType: 'Qora tuproq', waterSource: 'Kanal', createdAt: new Date().toISOString() },
      { id: 'web-field-2', farmId: 'farm-001', name: 'Janubiy Bog\'cha', area: 50, areaUnit: 'SOTIX', soilType: 'Qumloq', waterSource: 'Artezian', createdAt: new Date().toISOString() },
    ],
    crop_seasons: [
      { id: 'web-crop-1', fieldId: 'web-field-1', cropName: 'Kuzgi Bug\'doy', seasonYear: 2026, plantedDate: '2026-03-01', expectedHarvestDate: '2026-07-20', expectedYield: 15, expectedYieldUnit: 'TON', status: 'GROWING', seedCost: 3500000, createdAt: new Date().toISOString() }
    ],
    harvest_records: [],
    expenses: [
      { id: 'web-exp-1', farmId: 'farm-001', title: 'Yem-Xashak xaridi', category: 'FEED', amount: 3200000, currency: 'UZS', date: '2026-08-01', notes: 'Beda bog\'lamlari' },
      { id: 'web-exp-2', farmId: 'farm-001', title: 'Vaksinalar va Dori', category: 'MEDICINE', amount: 850000, currency: 'UZS', date: '2026-08-05', notes: 'Veterinariya' },
    ],
    incomes: [
      { id: 'web-inc-1', farmId: 'farm-001', title: 'Kunlik Sut Sotuvi', category: 'MILK', amount: 8400000, currency: 'UZS', date: '2026-08-10', notes: 'Sut kombinatiga' },
    ],
    reminders: [
      { id: 'web-rem-1', title: 'Mollarni emlash', description: 'Qora-Ola sig\'ir vaksina', dueDate: '2026-08-20', isCompleted: 0 },
      { id: 'web-rem-2', title: 'Yer sug\'orish', description: 'Kuzgi bug\'doy maydoni', dueDate: '2026-08-25', isCompleted: 0 },
    ],
    sync_queue: [],
    animal_groups: [],
    health_records: [],
    vaccination_records: [],
    breeding_records: [],
  };

  return {
    execSync: (_sql: string) => {},
    getAllSync: <T = any>(sql: string, _params: any[] = []): T[] => {
      const lowerSql = sql.toLowerCase();
      if (lowerSql.includes('from animals')) return (memoryStore.animals || []) as unknown as T[];
      if (lowerSql.includes('from feed_inventory')) return (memoryStore.feed_inventory || []) as unknown as T[];
      if (lowerSql.includes('from feed_transactions')) return (memoryStore.feed_transactions || []) as unknown as T[];
      if (lowerSql.includes('from land_fields')) return (memoryStore.land_fields || []) as unknown as T[];
      if (lowerSql.includes('from crop_seasons')) return (memoryStore.crop_seasons || []) as unknown as T[];
      if (lowerSql.includes('from harvest_records')) return (memoryStore.harvest_records || []) as unknown as T[];
      if (lowerSql.includes('from expenses')) return (memoryStore.expenses || []) as unknown as T[];
      if (lowerSql.includes('from incomes')) return (memoryStore.incomes || []) as unknown as T[];
      if (lowerSql.includes('from reminders')) return (memoryStore.reminders || []) as unknown as T[];
      if (lowerSql.includes('from sync_queue')) return (memoryStore.sync_queue || []) as unknown as T[];
      if (lowerSql.includes('from animal_groups')) return (memoryStore.animal_groups || []) as unknown as T[];
      if (lowerSql.includes('from health_records')) return (memoryStore.health_records || []) as unknown as T[];
      if (lowerSql.includes('from vaccination_records')) return (memoryStore.vaccination_records || []) as unknown as T[];
      if (lowerSql.includes('from breeding_records')) return (memoryStore.breeding_records || []) as unknown as T[];
      return [] as T[];
    },
    getFirstSync: <T = any>(sql: string, params: any[] = []): T | null => {
      const lowerSql = sql.toLowerCase();
      if (lowerSql.includes('count(*)')) {
        return { count: 3 } as unknown as T;
      }
      if (lowerSql.includes('from animals where id =')) {
        const found = memoryStore.animals.find((a) => a.id === params[0]);
        return (found || null) as unknown as T;
      }
      if (lowerSql.includes('from feed_inventory where id =')) {
        const found = memoryStore.feed_inventory.find((f) => f.id === params[0]);
        return (found || null) as unknown as T;
      }
      if (lowerSql.includes('from land_fields where id =')) {
        const found = memoryStore.land_fields.find((l) => l.id === params[0]);
        return (found || null) as unknown as T;
      }
      if (lowerSql.includes('from crop_seasons where id =')) {
        const found = memoryStore.crop_seasons.find((c) => c.id === params[0]);
        return (found || null) as unknown as T;
      }
      return null;
    },
    runSync: (_sql: string, _params: any[] = []): { lastInsertRowId: number; changes: number } => {
      return { lastInsertRowId: 1, changes: 1 };
    },
  };
}

function getDatabaseInstance(): IDatabaseInstance {
  if (Platform.OS === 'web') {
    return createWebMockDatabase();
  }
  // Conditionally require expo-sqlite native module only on native mobile platforms
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const SQLite = require('expo-sqlite');
  return SQLite.openDatabaseSync('myfarm.db');
}

export const dbInstance: IDatabaseInstance = getDatabaseInstance();
