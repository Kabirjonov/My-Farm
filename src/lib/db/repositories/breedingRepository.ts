import { dbInstance } from '../database';
import { BreedingRecord } from '@/types/domain';
import { generateUUID } from '@/utils/uuid';
import { reminderRepository } from './reminderRepository';

export const breedingRepository = {
  getByAnimalId(animalId: string): BreedingRecord[] {
    return dbInstance.getAllSync<BreedingRecord>(
      'SELECT * FROM breeding_records WHERE animalId = ? ORDER BY breedingDate DESC',
      [animalId]
    );
  },

  create(recordInput: Omit<BreedingRecord, 'id'>): BreedingRecord {
    const id = generateUUID();
    const record: BreedingRecord = { ...recordInput, id };

    dbInstance.runSync(
      `INSERT INTO breeding_records (id, animalId, partnerAnimalId, breedingDate, expectedBirthDate, actualBirthDate, result, childrenCount, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        record.id,
        record.animalId,
        record.partnerAnimalId ?? null,
        record.breedingDate,
        record.expectedBirthDate,
        record.actualBirthDate ?? null,
        record.result,
        record.childrenCount ?? 0,
        record.notes ?? null,
      ]
    );

    // Auto-create reminder for expected birth date
    if (record.expectedBirthDate) {
      reminderRepository.create({
        title: `Kutilayotgan tug'ish kuni`,
        description: `Ona hayvon ID: ${record.animalId}. Taxminiy tug'ish sanasi kirdi.`,
        dueDate: record.expectedBirthDate,
        isCompleted: false,
        relatedEntityName: 'BreedingRecord',
        relatedEntityId: record.id,
      });
    }

    // Auto update animal healthStatus to PREGNANT if result is PREGNANT
    if (record.result === 'PREGNANT') {
      const now = new Date().toISOString();
      dbInstance.runSync("UPDATE animals SET healthStatus = 'PREGNANT', updatedAt = ? WHERE id = ?", [now, record.animalId]);
    }

    return record;
  },
};
