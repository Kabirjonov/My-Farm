import { dbInstance } from '../database';
import { Animal, AnimalGroup } from '@/types/domain';
import { generateUUID } from '@/utils/uuid';
import { syncQueueRepository } from './syncQueueRepository';

export interface AnimalFilterOptions {
  type?: string;
  status?: string;
  healthStatus?: string;
  groupId?: string;
  searchQuery?: string;
  sortBy?: 'createdAt' | 'birthDate' | 'weightKg';
  sortOrder?: 'ASC' | 'DESC';
}

export interface LivestockStats {
  totalActive: number;
  byType: {
    SHEEP: number;
    COW: number;
    GOAT: number;
    HORSE: number;
    CHICKEN: number;
    OTHER: number;
  };
  byHealthStatus: {
    HEALTHY: number;
    SICK: number;
    TREATMENT: number;
    PREGNANT: number;
    UNKNOWN: number;
  };
}

export const animalRepository = {
  list(filter?: AnimalFilterOptions): Animal[] {
    let sql = "SELECT * FROM animals WHERE status = 'ACTIVE'";
    const params: (string | number)[] = [];

    if (filter?.status && filter.status !== 'ACTIVE') {
      sql = 'SELECT * FROM animals WHERE status = ?';
      params.push(filter.status);
    }

    if (filter?.type) {
      sql += ' AND type = ?';
      params.push(filter.type);
    }
    if (filter?.healthStatus) {
      sql += ' AND healthStatus = ?';
      params.push(filter.healthStatus);
    }
    if (filter?.groupId) {
      sql += ' AND groupId = ?';
      params.push(filter.groupId);
    }
    if (filter?.searchQuery) {
      sql += ' AND (name LIKE ? OR tagNumber LIKE ? OR breed LIKE ?)';
      const queryParam = `%${filter.searchQuery}%`;
      params.push(queryParam, queryParam, queryParam);
    }

    const sortBy = filter?.sortBy || 'createdAt';
    const sortOrder = filter?.sortOrder || 'DESC';
    sql += ` ORDER BY ${sortBy} ${sortOrder}`;

    return dbInstance.getAllSync<Animal>(sql, params);
  },

  findById(id: string): Animal | null {
    return dbInstance.getFirstSync<Animal>('SELECT * FROM animals WHERE id = ?', [id]);
  },

  isTagNumberUnique(tagNumber: string, farmId: string, excludeId?: string): boolean {
    let sql = 'SELECT COUNT(*) as count FROM animals WHERE tagNumber = ? AND farmId = ?';
    const params: string[] = [tagNumber, farmId];
    if (excludeId) {
      sql += ' AND id != ?';
      params.push(excludeId);
    }
    const result = dbInstance.getFirstSync<{ count: number }>(sql, params);
    return !result || result.count === 0;
  },

  getStats(farmId: string = 'farm-001'): LivestockStats {
    const activeAnimals = dbInstance.getAllSync<Animal>(
      "SELECT * FROM animals WHERE status = 'ACTIVE' AND farmId = ?",
      [farmId]
    );

    const stats: LivestockStats = {
      totalActive: activeAnimals.length,
      byType: { SHEEP: 0, COW: 0, GOAT: 0, HORSE: 0, CHICKEN: 0, OTHER: 0 },
      byHealthStatus: { HEALTHY: 0, SICK: 0, TREATMENT: 0, PREGNANT: 0, UNKNOWN: 0 },
    };

    activeAnimals.forEach((a) => {
      if (stats.byType[a.type] !== undefined) {
        stats.byType[a.type]++;
      } else {
        stats.byType.OTHER++;
      }

      if (stats.byHealthStatus[a.healthStatus] !== undefined) {
        stats.byHealthStatus[a.healthStatus]++;
      } else {
        stats.byHealthStatus.UNKNOWN++;
      }
    });

    return stats;
  },

  create(animalInput: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>): Animal {
    const id = generateUUID();
    const now = new Date().toISOString();
    const animal: Animal = {
      ...animalInput,
      id,
      createdAt: now,
      updatedAt: now,
    };

    dbInstance.runSync(
      `INSERT INTO animals (id, farmId, tagNumber, name, type, gender, breed, birthDate, weightKg, status, healthStatus, groupId, purchasePrice, purchaseDate, notes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        animal.id,
        animal.farmId,
        animal.tagNumber,
        animal.name ?? null,
        animal.type,
        animal.gender,
        animal.breed,
        animal.birthDate,
        animal.weightKg,
        animal.status,
        animal.healthStatus,
        animal.groupId ?? null,
        animal.purchasePrice ?? 0,
        animal.purchaseDate ?? null,
        animal.notes ?? null,
        animal.createdAt,
        animal.updatedAt,
      ]
    );

    syncQueueRepository.enqueue('Animal', animal.id, 'CREATE', animal);

    return animal;
  },

  update(id: string, updates: Partial<Omit<Animal, 'id' | 'createdAt'>>): Animal | null {
    const existing = this.findById(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const updated: Animal = {
      ...existing,
      ...updates,
      updatedAt: now,
    };

    dbInstance.runSync(
      `UPDATE animals 
       SET farmId = ?, tagNumber = ?, name = ?, type = ?, gender = ?, breed = ?, birthDate = ?, weightKg = ?, status = ?, healthStatus = ?, groupId = ?, purchasePrice = ?, purchaseDate = ?, notes = ?, updatedAt = ?
       WHERE id = ?`,
      [
        updated.farmId,
        updated.tagNumber,
        updated.name ?? null,
        updated.type,
        updated.gender,
        updated.breed,
        updated.birthDate,
        updated.weightKg,
        updated.status,
        updated.healthStatus,
        updated.groupId ?? null,
        updated.purchasePrice ?? 0,
        updated.purchaseDate ?? null,
        updated.notes ?? null,
        updated.updatedAt,
        id,
      ]
    );

    syncQueueRepository.enqueue('Animal', id, 'UPDATE', updated);

    return updated;
  },

  archive(id: string): void {
    const now = new Date().toISOString();
    dbInstance.runSync("UPDATE animals SET status = 'ARCHIVED', updatedAt = ? WHERE id = ?", [now, id]);
    syncQueueRepository.enqueue('Animal', id, 'ARCHIVE', { id, status: 'ARCHIVED', updatedAt: now });
  },

  hardDelete(id: string): void {
    dbInstance.runSync('DELETE FROM animals WHERE id = ?', [id]);
  },

  getGroups(farmId: string = 'farm-001'): AnimalGroup[] {
    return dbInstance.getAllSync<AnimalGroup>('SELECT * FROM animal_groups WHERE farmId = ? ORDER BY name ASC', [farmId]);
  },

  createGroup(farmId: string, name: string, description?: string): AnimalGroup {
    const id = generateUUID();
    const now = new Date().toISOString();
    const group: AnimalGroup = { id, farmId, name, description, createdAt: now };

    dbInstance.runSync(
      'INSERT INTO animal_groups (id, farmId, name, description, createdAt) VALUES (?, ?, ?, ?, ?)',
      [group.id, group.farmId, group.name, group.description ?? null, group.createdAt]
    );

    return group;
  },
};
