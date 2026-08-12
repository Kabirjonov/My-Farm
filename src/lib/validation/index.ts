import { z } from 'zod';

export const animalSchema = z.object({
  name: z.string().min(1, 'Nom kiritilishi shart'),
  type: z.enum(['SHEEP', 'COW', 'GOAT', 'HORSE', 'CHICKEN', 'OTHER']),
  status: z.enum(['HEALTHY', 'SICK', 'TREATMENT', 'PREGNANT']),
  gender: z.enum(['MALE', 'FEMALE']),
  age: z.number().min(0, "Yosh manfiy bo'lmasligi kerak"),
  breed: z.string().min(1, "Zot kiritilishi shart"),
  weight: z.number().min(0.1, "Vazn to'g'ri kiritilishi shart"),
  milkYield: z.number().optional(),
  notes: z.string().optional(),
});

export type AnimalFormValues = z.infer<typeof animalSchema>;
