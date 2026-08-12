import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthService } from '../services/healthService';
import { HealthRecord, VaccinationRecord, BreedingRecord } from '@/types/domain';

export function useHealth(animalId?: string) {
  const queryClient = useQueryClient();

  const healthQuery = useQuery({
    queryKey: ['health-records', animalId],
    queryFn: () => (animalId ? healthService.getHealthRecords(animalId) : []),
    enabled: Boolean(animalId),
  });

  const vaccinationQuery = useQuery({
    queryKey: ['vaccination-records', animalId],
    queryFn: () => (animalId ? healthService.getVaccinations(animalId) : []),
    enabled: Boolean(animalId),
  });

  const breedingQuery = useQuery({
    queryKey: ['breeding-records', animalId],
    queryFn: () => (animalId ? healthService.getBreedingRecords(animalId) : []),
    enabled: Boolean(animalId),
  });

  const remindersQuery = useQuery({
    queryKey: ['reminders'],
    queryFn: () => healthService.getReminders(),
  });

  const addHealthMutation = useMutation({
    mutationFn: (record: Omit<HealthRecord, 'id'>) => {
      healthService.addHealthRecord(record);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records', animalId] });
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      queryClient.invalidateQueries({ queryKey: ['livestock'] });
    },
  });

  const addVaccinationMutation = useMutation({
    mutationFn: (record: Omit<VaccinationRecord, 'id'>) => {
      healthService.addVaccination(record);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccination-records', animalId] });
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  const addBreedingMutation = useMutation({
    mutationFn: (record: Omit<BreedingRecord, 'id'>) => {
      healthService.addBreedingRecord(record);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breeding-records', animalId] });
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      queryClient.invalidateQueries({ queryKey: ['livestock'] });
    },
  });

  const toggleReminderMutation = useMutation({
    mutationFn: (id: string) => {
      healthService.toggleReminder(id);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  return {
    healthRecords: healthQuery.data || [],
    vaccinations: vaccinationQuery.data || [],
    breedingRecords: breedingQuery.data || [],
    reminders: remindersQuery.data || [],
    isLoading: healthQuery.isLoading || vaccinationQuery.isLoading || breedingQuery.isLoading,
    addHealthRecord: addHealthMutation.mutate,
    addVaccination: addVaccinationMutation.mutate,
    addBreedingRecord: addBreedingMutation.mutate,
    toggleReminder: toggleReminderMutation.mutate,
  };
}
