import { z } from 'zod';

export const animalFormSchema = z.object({
  tagNumber: z.string().min(1, 'Teg raqami kiritilishi shart'),
  name: z.string().optional(),
  type: z.enum(['SHEEP', 'COW', 'GOAT', 'HORSE', 'CHICKEN', 'OTHER']),
  status: z.enum(['HEALTHY', 'SICK', 'TREATMENT', 'PREGNANT']),
  gender: z.enum(['MALE', 'FEMALE', 'UNKNOWN']),
  breed: z.string().min(1, 'Zot kiritilishi shart'),
  weight: z.number().min(0.1, "Vazn to'g'ri kiritilishi shart"),
  age: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export type AnimalFormInputs = z.infer<typeof animalFormSchema>;
