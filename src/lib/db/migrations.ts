import { dbInstance } from './database';

export function runMigrations(): void {
  dbInstance.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS farms (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      location TEXT,
      ownerId TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT NOT NULL,
      fullName TEXT NOT NULL,
      role TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS animals (
      id TEXT PRIMARY KEY NOT NULL,
      farmId TEXT NOT NULL,
      tagNumber TEXT NOT NULL,
      name TEXT,
      type TEXT NOT NULL,
      gender TEXT NOT NULL,
      breed TEXT NOT NULL,
      birthDate TEXT NOT NULL,
      weightKg REAL NOT NULL,
      status TEXT NOT NULL,
      healthStatus TEXT NOT NULL,
      groupId TEXT,
      purchasePrice INTEGER DEFAULT 0,
      purchaseDate TEXT,
      notes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS animal_groups (
      id TEXT PRIMARY KEY NOT NULL,
      farmId TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS health_records (
      id TEXT PRIMARY KEY NOT NULL,
      animalId TEXT NOT NULL,
      date TEXT NOT NULL,
      title TEXT NOT NULL,
      symptoms TEXT,
      diagnosis TEXT NOT NULL,
      treatment TEXT,
      medicineName TEXT,
      dosage TEXT,
      vetName TEXT,
      cost INTEGER DEFAULT 0,
      nextCheckDate TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS vaccination_records (
      id TEXT PRIMARY KEY NOT NULL,
      animalId TEXT NOT NULL,
      vaccineName TEXT NOT NULL,
      date TEXT NOT NULL,
      nextDueDate TEXT,
      vetName TEXT,
      cost INTEGER DEFAULT 0,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS breeding_records (
      id TEXT PRIMARY KEY NOT NULL,
      animalId TEXT NOT NULL,
      partnerAnimalId TEXT,
      breedingDate TEXT NOT NULL,
      expectedBirthDate TEXT NOT NULL,
      actualBirthDate TEXT,
      result TEXT NOT NULL,
      childrenCount INTEGER DEFAULT 0,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS feed_inventory (
      id TEXT PRIMARY KEY NOT NULL,
      farmId TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT,
      unit TEXT NOT NULL,
      currentQuantity REAL NOT NULL DEFAULT 0,
      minQuantity REAL NOT NULL DEFAULT 0,
      averagePrice INTEGER DEFAULT 0,
      notes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS feed_transactions (
      id TEXT PRIMARY KEY NOT NULL,
      feedItemId TEXT NOT NULL,
      type TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit TEXT NOT NULL,
      price INTEGER DEFAULT 0,
      date TEXT NOT NULL,
      relatedAnimalId TEXT,
      relatedGroupId TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS land_fields (
      id TEXT PRIMARY KEY NOT NULL,
      farmId TEXT NOT NULL,
      name TEXT NOT NULL,
      area REAL NOT NULL,
      areaUnit TEXT NOT NULL,
      location TEXT,
      soilType TEXT,
      waterSource TEXT,
      notes TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS crop_seasons (
      id TEXT PRIMARY KEY NOT NULL,
      fieldId TEXT NOT NULL,
      cropName TEXT NOT NULL,
      seasonYear INTEGER NOT NULL,
      plantedDate TEXT NOT NULL,
      expectedHarvestDate TEXT,
      expectedYield REAL DEFAULT 0,
      expectedYieldUnit TEXT,
      status TEXT NOT NULL,
      seedCost INTEGER DEFAULT 0,
      fertilizerCost INTEGER DEFAULT 0,
      medicineCost INTEGER DEFAULT 0,
      waterCost INTEGER DEFAULT 0,
      notes TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS harvest_records (
      id TEXT PRIMARY KEY NOT NULL,
      cropSeasonId TEXT NOT NULL,
      date TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit TEXT NOT NULL,
      quality TEXT NOT NULL,
      soldQuantity REAL DEFAULT 0,
      soldAmount INTEGER DEFAULT 0,
      notes TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY NOT NULL,
      farmId TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'UZS',
      date TEXT NOT NULL,
      relatedAnimalId TEXT,
      relatedFeedItemId TEXT,
      relatedCropSeasonId TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS incomes (
      id TEXT PRIMARY KEY NOT NULL,
      farmId TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'UZS',
      date TEXT NOT NULL,
      relatedAnimalId TEXT,
      relatedCropSeasonId TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      dueDate TEXT NOT NULL,
      isCompleted INTEGER DEFAULT 0,
      relatedEntityName TEXT,
      relatedEntityId TEXT
    );

    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY NOT NULL,
      entityType TEXT NOT NULL,
      entityId TEXT NOT NULL,
      operation TEXT NOT NULL,
      payloadJson TEXT NOT NULL,
      status TEXT NOT NULL,
      retryCount INTEGER DEFAULT 0,
      errorMessage TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);
}
