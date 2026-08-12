export type AnimalType = 'SHEEP' | 'COW' | 'GOAT' | 'HORSE' | 'CHICKEN' | 'OTHER';
export type AnimalStatus = 'HEALTHY' | 'SICK' | 'TREATMENT' | 'PREGNANT';
export type AnimalGender = 'MALE' | 'FEMALE';

export interface Animal {
  id: string;
  name: string;
  type: AnimalType;
  status: AnimalStatus;
  gender: AnimalGender;
  age: number; // months
  breed: string;
  weight: number; // kg
  milkYield?: number; // liters/day
  notes?: string;
}
