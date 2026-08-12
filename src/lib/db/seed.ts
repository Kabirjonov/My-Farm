import { dbInstance } from './database';
import { generateUUID } from '@/utils/uuid';

export function seedDatabaseIfEmpty(): void {
  const animalCountResult = dbInstance.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM animals');
  if (animalCountResult && animalCountResult.count > 0) {
    return; // Already populated
  }

  const now = new Date().toISOString();
  const farmId = 'farm-001';

  // Seed Animals
  const initialAnimals = [
    {
      id: generateUUID(),
      farmId,
      tagNumber: 'QOY-001',
      name: 'Hisori Qo’y 1',
      type: 'SHEEP',
      gender: 'FEMALE',
      breed: 'Hisori',
      birthDate: '2024-03-10',
      weightKg: 65,
      status: 'ACTIVE',
      healthStatus: 'HEALTHY',
      purchasePrice: 2500000,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateUUID(),
      farmId,
      tagNumber: 'MOL-102',
      name: 'Qora-Ola Sig’ir',
      type: 'COW',
      gender: 'FEMALE',
      breed: 'Golshtin',
      birthDate: '2023-05-12',
      weightKg: 480,
      status: 'ACTIVE',
      healthStatus: 'PREGNANT',
      purchasePrice: 14000000,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateUUID(),
      farmId,
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
      createdAt: now,
      updatedAt: now,
    },
  ];

  initialAnimals.forEach((a) => {
    dbInstance.runSync(
      `INSERT INTO animals (id, farmId, tagNumber, name, type, gender, breed, birthDate, weightKg, status, healthStatus, purchasePrice, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [a.id, a.farmId, a.tagNumber, a.name, a.type, a.gender, a.breed, a.birthDate, a.weightKg, a.status, a.healthStatus, a.purchasePrice, a.createdAt, a.updatedAt]
    );
  });

  // Seed Feed Inventory
  const initialFeed = [
    { id: generateUUID(), farmId, name: 'Beda (press)', quantity: 250, unit: 'BALE', minThreshold: 50, updatedAt: now },
    { id: generateUUID(), farmId, name: 'Somon', quantity: 400, unit: 'BALE', minThreshold: 100, updatedAt: now },
    { id: generateUUID(), farmId, name: 'Arpa yem', quantity: 1200, unit: 'KG', minThreshold: 300, updatedAt: now },
    { id: generateUUID(), farmId, name: 'Silos', quantity: 5, unit: 'TON', minThreshold: 1, updatedAt: now },
  ];

  initialFeed.forEach((f) => {
    dbInstance.runSync(
      `INSERT INTO feed_inventory (id, farmId, name, quantity, unit, minThreshold, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [f.id, f.farmId, f.name, f.quantity, f.unit, f.minThreshold, f.updatedAt]
    );
  });
}
