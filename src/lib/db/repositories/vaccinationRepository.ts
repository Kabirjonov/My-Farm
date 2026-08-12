import { dbInstance } from '../database';
import { VaccinationRecord } from '@/types/domain';
import { generateUUID } from '@/utils/uuid';
import { reminderRepository } from './reminderRepository';

export const vaccinationRepository = {
  getByAnimalId(animalId: string): VaccinationRecord[] {
    return dbInstance.getAllSync<VaccinationRecord>(
      'SELECT * FROM vaccination_records WHERE animalId = ? ORDER BY date DESC',
      [animalId]
    );
  },

  create(recordInput: Omit<VaccinationRecord, 'id'>): VaccinationRecord {
    const id = generateUUID();
    const record: VaccinationRecord = { ...recordInput, id };

    dbInstance.runSync(
      `INSERT INTO vaccination_records (id, animalId, vaccineName, date, nextDueDate, vetName, cost, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        record.id,
        record.animalId,
        record.vaccineName,
        record.date,
        record.nextDueDate ?? null,
        record.vetName ?? null,
        record.cost ?? 0,
        record.notes ?? null,
      ]
    );

    // Auto-create reminder if nextDueDate is provided
    if (record.nextDueDate) {
      reminderRepository.create({
        title: `Emlash vaqti bo'ldi: ${record.vaccineName}`,
        description: `Raqamli emlash taqvimi eslatmasi. Vaktsina: ${record.vaccineName}`,
        dueDate: record.nextDueDate,
        isCompleted: false,
        relatedEntityName: 'VaccinationRecord',
        relatedEntityId: record.id,
      });
    }

    // Auto-create expense if cost > 0
    if (record.cost && record.cost > 0) {
      dbInstance.runSync(
        `INSERT INTO expenses (id, farmId, category, amount, description, date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [generateUUID(), 'farm-001', 'MEDICINE', record.cost, `Vaktsina xarajati: ${record.vaccineName}`, record.date]
      );
    }

    return record;
  },
};
