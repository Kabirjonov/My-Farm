import {
  healthRepository,
  vaccinationRepository,
  breedingRepository,
  reminderRepository,
} from '@/lib/db';
import { HealthRecord, VaccinationRecord, BreedingRecord, Reminder } from '@/types/domain';

export const healthService = {
  getHealthRecords(animalId: string): HealthRecord[] {
    return healthRepository.getByAnimalId(animalId);
  },

  addHealthRecord(record: Omit<HealthRecord, 'id'>): HealthRecord {
    return healthRepository.create(record);
  },

  getVaccinations(animalId: string): VaccinationRecord[] {
    return vaccinationRepository.getByAnimalId(animalId);
  },

  addVaccination(record: Omit<VaccinationRecord, 'id'>): VaccinationRecord {
    return vaccinationRepository.create(record);
  },

  getBreedingRecords(animalId: string): BreedingRecord[] {
    return breedingRepository.getByAnimalId(animalId);
  },

  addBreedingRecord(record: Omit<BreedingRecord, 'id'>): BreedingRecord {
    return breedingRepository.create(record);
  },

  getReminders(isCompleted?: boolean): Reminder[] {
    return reminderRepository.list(isCompleted);
  },

  toggleReminder(id: string): void {
    reminderRepository.toggleCompleted(id);
  },
};
