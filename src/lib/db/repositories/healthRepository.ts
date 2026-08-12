import { dbInstance } from '../database';
import { HealthRecord } from '@/types/domain';
import { generateUUID } from '@/utils/uuid';
import { reminderRepository } from './reminderRepository';

export const healthRepository = {
  getByAnimalId(animalId: string): HealthRecord[] {
    return dbInstance.getAllSync<HealthRecord>(
      'SELECT * FROM health_records WHERE animalId = ? ORDER BY date DESC',
      [animalId]
    );
  },

  create(recordInput: Omit<HealthRecord, 'id'>): HealthRecord {
    const id = generateUUID();
    const record: HealthRecord = { ...recordInput, id };

    dbInstance.runSync(
      `INSERT INTO health_records (id, animalId, date, title, symptoms, diagnosis, treatment, medicineName, dosage, vetName, cost, nextCheckDate, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        record.id,
        record.animalId,
        record.date,
        record.title,
        record.symptoms ?? null,
        record.diagnosis,
        record.treatment ?? null,
        record.medicineName ?? null,
        record.dosage ?? null,
        record.vetName ?? null,
        record.cost ?? 0,
        record.nextCheckDate ?? null,
        record.notes ?? null,
      ]
    );

    // Auto-create reminder if nextCheckDate is provided
    if (record.nextCheckDate) {
      reminderRepository.create({
        title: `Veterinar ko'rigi: ${record.title}`,
        description: `Qayta ko'rik sanasi. Veterinar: ${record.vetName || 'Ko\'rsatilmagan'}`,
        dueDate: record.nextCheckDate,
        isCompleted: false,
        relatedEntityName: 'HealthRecord',
        relatedEntityId: record.id,
      });
    }

    // Auto-create expense if cost > 0
    if (record.cost && record.cost > 0) {
      dbInstance.runSync(
        `INSERT INTO expenses (id, farmId, category, amount, description, date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [generateUUID(), 'farm-001', 'MEDICINE', record.cost, `Davolash/Dori xarajati: ${record.title}`, record.date]
      );
    }

    return record;
  },
};
