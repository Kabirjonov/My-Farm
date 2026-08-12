export interface VaccinationRecord {
  id: string;
  animalId: string;
  vaccineName: string;
  date: string;
  nextDueDate?: string;
  veterinarian?: string;
  notes?: string;
}
