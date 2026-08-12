export type AnimalType = 'SHEEP' | 'COW' | 'GOAT' | 'HORSE' | 'CHICKEN' | 'OTHER';
export type AnimalGender = 'MALE' | 'FEMALE' | 'UNKNOWN';
export type AnimalStatus = 'ACTIVE' | 'SOLD' | 'DEAD' | 'LOST' | 'ARCHIVED';
export type HealthStatus = 'HEALTHY' | 'SICK' | 'TREATMENT' | 'PREGNANT' | 'UNKNOWN';

export interface Farm {
  id: string;
  name: string;
  location?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'OWNER' | 'MANAGER' | 'WORKER';
  createdAt: string;
}

export interface Animal {
  id: string;
  farmId: string;
  tagNumber: string;
  name?: string;
  type: AnimalType;
  gender: AnimalGender;
  breed: string;
  birthDate: string; // ISO String
  weightKg: number;
  status: AnimalStatus;
  healthStatus: HealthStatus;
  groupId?: string;
  purchasePrice?: number; // In minor unit / sum
  purchaseDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnimalGroup {
  id: string;
  farmId: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface HealthRecord {
  id: string;
  animalId: string;
  date: string;
  title: string;
  symptoms?: string;
  diagnosis: string;
  treatment?: string;
  medicineName?: string;
  dosage?: string;
  vetName?: string;
  cost?: number;
  nextCheckDate?: string;
  notes?: string;
}

export interface VaccinationRecord {
  id: string;
  animalId: string;
  vaccineName: string;
  date: string;
  nextDueDate?: string;
  vetName?: string;
  cost?: number;
  notes?: string;
}

export type BreedingResult = 'PREGNANT' | 'NOT_PREGNANT' | 'BIRTH_DONE' | 'FAILED' | 'UNKNOWN';

export interface BreedingRecord {
  id: string;
  animalId: string; // Mother ID
  partnerAnimalId?: string; // Father ID
  breedingDate: string;
  expectedBirthDate: string;
  actualBirthDate?: string;
  result: BreedingResult;
  childrenCount?: number;
  notes?: string;
}

export type FeedUnit = 'KG' | 'TON' | 'BAG' | 'LITER' | 'PIECE' | 'BALE';
export type FeedTransactionType = 'IN' | 'OUT' | 'ADJUSTMENT' | 'WASTE';

export interface FeedItem {
  id: string;
  farmId: string;
  name: string; // Beda, Somon, Arpa, Kepak, Silos, etc.
  category?: string;
  unit: FeedUnit;
  currentQuantity: number;
  minQuantity: number;
  averagePrice?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedTransaction {
  id: string;
  feedItemId: string;
  type: FeedTransactionType;
  quantity: number;
  unit: FeedUnit;
  price?: number;
  date: string;
  relatedAnimalId?: string;
  relatedGroupId?: string;
  notes?: string;
}

export type AreaUnit = 'HECTARE' | 'SOTIX' | 'SQM';
export type CropStatus = 'PLANNED' | 'PLANTED' | 'GROWING' | 'HARVESTED' | 'FAILED' | 'ARCHIVED';
export type HarvestQuality = 'HIGH' | 'MEDIUM' | 'LOW' | 'MIXED';

export interface LandField {
  id: string;
  farmId: string;
  name: string;
  area: number;
  areaUnit: AreaUnit;
  location?: string;
  soilType?: string;
  waterSource?: string;
  notes?: string;
  createdAt: string;
}

export interface CropSeason {
  id: string;
  fieldId: string;
  cropName: string;
  seasonYear: number;
  plantedDate: string;
  expectedHarvestDate?: string;
  expectedYield?: number;
  expectedYieldUnit?: string;
  status: CropStatus;
  seedCost?: number;
  fertilizerCost?: number;
  medicineCost?: number;
  waterCost?: number;
  notes?: string;
  createdAt: string;
}

export interface HarvestRecord {
  id: string;
  cropSeasonId: string;
  date: string;
  quantity: number;
  unit: string;
  quality: HarvestQuality;
  soldQuantity?: number;
  soldAmount?: number;
  notes?: string;
  createdAt: string;
}

export type ExpenseCategory =
  | 'FEED'
  | 'MEDICINE'
  | 'VET'
  | 'WORKER'
  | 'SEED'
  | 'FERTILIZER'
  | 'WATER'
  | 'TRANSPORT'
  | 'EQUIPMENT'
  | 'OTHER';

export type IncomeCategory =
  | 'ANIMAL_SALE'
  | 'MILK'
  | 'MEAT'
  | 'WOOL'
  | 'EGG'
  | 'HARVEST'
  | 'OTHER';

export interface Expense {
  id: string;
  farmId: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  currency: 'UZS';
  date: string;
  relatedAnimalId?: string;
  relatedFeedItemId?: string;
  relatedCropSeasonId?: string;
  notes?: string;
}

export interface Income {
  id: string;
  farmId: string;
  title: string;
  category: IncomeCategory;
  amount: number;
  currency: 'UZS';
  date: string;
  relatedAnimalId?: string;
  relatedCropSeasonId?: string;
  notes?: string;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  isCompleted: boolean;
  relatedEntityName?: string;
  relatedEntityId?: string;
}

export type SyncOperation = 'CREATE' | 'UPDATE' | 'DELETE' | 'ARCHIVE';
export type SyncStatus = 'PENDING' | 'SYNCING' | 'DONE' | 'FAILED';

export interface SyncQueue {
  id: string;
  entityType: string;
  entityId: string;
  operation: SyncOperation;
  payloadJson: string;
  status: SyncStatus;
  retryCount: number;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}
