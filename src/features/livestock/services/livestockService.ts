import { animalRepository, AnimalFilterOptions, LivestockStats } from '@/lib/db/repositories/animalRepository';
import { Animal, AnimalGroup } from '@/types/domain';

export const livestockService = {
  getAnimals(filter?: AnimalFilterOptions): Animal[] {
    return animalRepository.list(filter);
  },

  getAnimalById(id: string): Animal | null {
    return animalRepository.findById(id);
  },

  getStats(farmId?: string): LivestockStats {
    return animalRepository.getStats(farmId);
  },

  isTagUnique(tagNumber: string, farmId: string, excludeId?: string): boolean {
    return animalRepository.isTagNumberUnique(tagNumber, farmId, excludeId);
  },

  addAnimal(animal: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>): Animal {
    return animalRepository.create(animal);
  },

  updateAnimal(id: string, updates: Partial<Omit<Animal, 'id' | 'createdAt'>>): Animal | null {
    return animalRepository.update(id, updates);
  },

  archiveAnimal(id: string): void {
    animalRepository.archive(id);
  },

  getGroups(farmId?: string): AnimalGroup[] {
    return animalRepository.getGroups(farmId);
  },

  createGroup(farmId: string, name: string, description?: string): AnimalGroup {
    return animalRepository.createGroup(farmId, name, description);
  },
};
