import { Platform } from 'react-native';

export interface IDatabaseInstance {
  execSync(sql: string): void;
  getAllSync<T = any>(sql: string, params?: any[]): T[];
  getFirstSync<T = any>(sql: string, params?: any[]): T | null;
  runSync(sql: string, params?: any[]): { lastInsertRowId: number; changes: number };
}

// Initial seed data for web mock environment
const INITIAL_WEB_STORE = {
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

// Web mock database engine with localStorage persistence for local device testing
function createWebMockDatabase(): IDatabaseInstance {
  const loadStore = (): Record<string, any[]> => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = window.localStorage.getItem('myfarm_local_db');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {
        // Fallback to initial store on parse error
      }
    }
    return JSON.parse(JSON.stringify(INITIAL_WEB_STORE));
  };

  const memoryStore: Record<string, any[]> = loadStore();

  const saveStore = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem('myfarm_local_db', JSON.stringify(memoryStore));
      } catch {
        // Ignore localStorage quota errors
      }
    }
  };

  return {
    execSync: (_sql: string) => {},

    getAllSync: <T = any>(sql: string, params: any[] = []): T[] => {
      const lowerSql = sql.toLowerCase();

      // --- ANIMALS FILTERING ---
      if (lowerSql.includes('from animals')) {
        let list = memoryStore.animals || [];

        // Base status filtering
        if (lowerSql.includes("status = 'archived'")) {
          list = list.filter((a) => a.status === 'ARCHIVED');
        } else if (lowerSql.includes("status = 'active'")) {
          list = list.filter((a) => a.status === 'ACTIVE');
        }

        let paramIdx = 0;

        // Dynamic status param
        if (lowerSql.includes('status = ?')) {
          const sVal = params[paramIdx++];
          if (sVal) list = list.filter((a) => a.status === sVal);
        }

        // Dynamic type param
        if (lowerSql.includes('type = ?')) {
          const tVal = params[paramIdx++];
          if (tVal) list = list.filter((a) => a.type === tVal);
        }

        // Dynamic healthStatus param
        if (lowerSql.includes('healthstatus = ?')) {
          const hVal = params[paramIdx++];
          if (hVal) list = list.filter((a) => a.healthStatus === hVal);
        }

        // Dynamic groupId param
        if (lowerSql.includes('groupid = ?')) {
          const gVal = params[paramIdx++];
          if (gVal) list = list.filter((a) => a.groupId === gVal);
        }

        // Dynamic searchQuery param (name LIKE ? OR tagNumber LIKE ? OR breed LIKE ?)
        if (lowerSql.includes('like ?')) {
          const qVal = params[paramIdx];
          if (typeof qVal === 'string') {
            const query = qVal.replace(/%/g, '').toLowerCase().trim();
            if (query) {
              list = list.filter(
                (a) =>
                  (a.name && a.name.toLowerCase().includes(query)) ||
                  (a.tagNumber && a.tagNumber.toLowerCase().includes(query)) ||
                  (a.breed && a.breed.toLowerCase().includes(query))
              );
            }
          }
        }

        return list as unknown as T[];
      }

      // --- FEED INVENTORY FILTERING ---
      if (lowerSql.includes('from feed_inventory')) {
        let list = memoryStore.feed_inventory || [];
        if (params.length > 0 && lowerSql.includes('id = ?')) {
          list = list.filter((f) => f.id === params[0]);
        }
        return list as unknown as T[];
      }

      // --- FEED TRANSACTIONS FILTERING ---
      if (lowerSql.includes('from feed_transactions')) {
        let list = memoryStore.feed_transactions || [];
        if (params.length > 0 && lowerSql.includes('feeditemid = ?')) {
          list = list.filter((t) => t.feedItemId === params[0]);
        }
        return list as unknown as T[];
      }

      // --- LAND FIELDS FILTERING ---
      if (lowerSql.includes('from land_fields')) {
        let list = memoryStore.land_fields || [];
        if (params.length > 0 && lowerSql.includes('id = ?')) {
          list = list.filter((l) => l.id === params[0]);
        }
        return list as unknown as T[];
      }

      // --- CROP SEASONS FILTERING ---
      if (lowerSql.includes('from crop_seasons')) {
        let list = memoryStore.crop_seasons || [];
        if (params.length > 0 && lowerSql.includes('fieldid = ?')) {
          list = list.filter((c) => c.fieldId === params[0]);
        }
        return list as unknown as T[];
      }

      // --- OTHER TABLES ---
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

      // Handle unique tag validation: SELECT COUNT(*) as count FROM animals WHERE tagNumber = ? AND farmId = ?
      if (lowerSql.includes('from animals') && lowerSql.includes('tagnumber =')) {
        const tag = params[0];
        const farmId = params[1];
        const excludeId = params[2];
        const existing = (memoryStore.animals || []).filter(
          (a) => a.tagNumber === tag && a.farmId === farmId && a.id !== excludeId
        );
        return { count: existing.length } as unknown as T;
      }

      if (lowerSql.includes('count(*)')) {
        return { count: 0 } as unknown as T;
      }

      if (lowerSql.includes('from animals where id =')) {
        const found = (memoryStore.animals || []).find((a) => a.id === params[0]);
        return (found || null) as unknown as T;
      }
      if (lowerSql.includes('from feed_inventory where id =')) {
        const found = (memoryStore.feed_inventory || []).find((f) => f.id === params[0]);
        return (found || null) as unknown as T;
      }
      if (lowerSql.includes('from land_fields where id =')) {
        const found = (memoryStore.land_fields || []).find((l) => l.id === params[0]);
        return (found || null) as unknown as T;
      }
      if (lowerSql.includes('from crop_seasons where id =')) {
        const found = (memoryStore.crop_seasons || []).find((c) => c.id === params[0]);
        return (found || null) as unknown as T;
      }
      return null;
    },

    runSync: (sql: string, params: any[] = []): { lastInsertRowId: number; changes: number } => {
      const lowerSql = sql.toLowerCase();

      // --- ANIMALS ---
      if (lowerSql.includes('insert into animals')) {
        const newAnimal = {
          id: params[0],
          farmId: params[1],
          tagNumber: params[2],
          name: params[3],
          type: params[4],
          gender: params[5],
          breed: params[6],
          birthDate: params[7],
          weightKg: params[8],
          status: params[9],
          healthStatus: params[10],
          groupId: params[11],
          purchasePrice: params[12],
          purchaseDate: params[13],
          notes: params[14],
          createdAt: params[15],
          updatedAt: params[16],
        };
        memoryStore.animals = memoryStore.animals || [];
        memoryStore.animals.unshift(newAnimal);
        saveStore();
      } else if (lowerSql.includes('update animals') && lowerSql.includes("status = 'archived'")) {
        const id = params[1];
        const found = memoryStore.animals?.find((a) => a.id === id);
        if (found) {
          found.status = 'ARCHIVED';
          saveStore();
        }
      } else if (lowerSql.includes('update animals')) {
        const id = params[params.length - 1];
        const found = memoryStore.animals?.find((a) => a.id === id);
        if (found) {
          found.farmId = params[0];
          found.tagNumber = params[1];
          found.name = params[2];
          found.type = params[3];
          found.gender = params[4];
          found.breed = params[5];
          found.birthDate = params[6];
          found.weightKg = params[7];
          found.status = params[8];
          found.healthStatus = params[9];
          found.groupId = params[10];
          found.purchasePrice = params[11];
          found.purchaseDate = params[12];
          found.notes = params[13];
          found.updatedAt = params[14];
          saveStore();
        }
      }

      // --- LAND FIELDS ---
      if (lowerSql.includes('insert into land_fields')) {
        const newField = {
          id: params[0],
          farmId: params[1],
          name: params[2],
          area: params[3],
          areaUnit: params[4],
          location: params[5],
          soilType: params[6],
          waterSource: params[7],
          notes: params[8],
          createdAt: params[9],
        };
        memoryStore.land_fields = memoryStore.land_fields || [];
        memoryStore.land_fields.unshift(newField);
        saveStore();
      }

      // --- CROP SEASONS ---
      if (lowerSql.includes('insert into crop_seasons')) {
        const newCrop = {
          id: params[0],
          fieldId: params[1],
          cropName: params[2],
          seasonYear: params[3],
          plantedDate: params[4],
          expectedHarvestDate: params[5],
          expectedYield: params[6],
          expectedYieldUnit: params[7],
          status: params[8],
          seedCost: params[9],
          fertilizerCost: params[10],
          medicineCost: params[11],
          waterCost: params[12],
          notes: params[13],
          createdAt: params[14],
        };
        memoryStore.crop_seasons = memoryStore.crop_seasons || [];
        memoryStore.crop_seasons.unshift(newCrop);
        saveStore();
      }

      // --- FEED INVENTORY ---
      if (lowerSql.includes('insert into feed_inventory')) {
        const newFeed = {
          id: params[0],
          farmId: params[1],
          name: params[2],
          category: params[3],
          unit: params[4],
          currentQuantity: params[5],
          minQuantity: params[6],
          averagePrice: params[7],
          notes: params[8],
          createdAt: params[9],
          updatedAt: params[10],
        };
        memoryStore.feed_inventory = memoryStore.feed_inventory || [];
        memoryStore.feed_inventory.unshift(newFeed);
        saveStore();
      }

      // --- FEED TRANSACTIONS ---
      if (lowerSql.includes('insert into feed_transactions')) {
        const newTx = {
          id: params[0],
          feedItemId: params[1],
          type: params[2],
          quantity: params[3],
          unit: params[4],
          price: params[5],
          date: params[6],
          relatedAnimalId: params[7],
          relatedGroupId: params[8],
          notes: params[9],
        };
        memoryStore.feed_transactions = memoryStore.feed_transactions || [];
        memoryStore.feed_transactions.unshift(newTx);
        saveStore();
      }

      // --- EXPENSES ---
      if (lowerSql.includes('insert into expenses')) {
        const newExp = {
          id: params[0],
          farmId: params[1],
          title: params[2],
          category: params[3],
          amount: params[4],
          currency: params[5],
          date: params[6],
          notes: params[7],
          createdAt: params[11],
        };
        memoryStore.expenses = memoryStore.expenses || [];
        memoryStore.expenses.unshift(newExp);
        saveStore();
      }

      // --- INCOMES ---
      if (lowerSql.includes('insert into incomes')) {
        const newInc = {
          id: params[0],
          farmId: params[1],
          title: params[2],
          category: params[3],
          amount: params[4],
          currency: params[5],
          date: params[6],
          notes: params[7],
          createdAt: params[10],
        };
        memoryStore.incomes = memoryStore.incomes || [];
        memoryStore.incomes.unshift(newInc);
        saveStore();
      }

      // --- REMINDERS ---
      if (lowerSql.includes('insert into reminders')) {
        const newRem = {
          id: params[0],
          title: params[1],
          description: params[2],
          dueDate: params[3],
          isCompleted: params[4] ? 1 : 0,
          createdAt: params[5],
        };
        memoryStore.reminders = memoryStore.reminders || [];
        memoryStore.reminders.unshift(newRem);
        saveStore();
      }

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
