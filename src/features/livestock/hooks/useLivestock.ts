import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { livestockService } from '../services/livestockService';
import { AnimalFilterOptions } from '@/lib/db/repositories/animalRepository';
import { Animal } from '@/types/domain';

export function useLivestock(filter?: AnimalFilterOptions, farmId: string = 'farm-001') {
  const queryClient = useQueryClient();

  const animalsQuery = useQuery({
    queryKey: ['livestock', filter],
    queryFn: () => livestockService.getAnimals(filter),
  });

  const statsQuery = useQuery({
    queryKey: ['livestock-stats', farmId],
    queryFn: () => livestockService.getStats(farmId),
  });

  const groupsQuery = useQuery({
    queryKey: ['livestock-groups', farmId],
    queryFn: () => livestockService.getGroups(farmId),
  });

  const addAnimalMutation = useMutation({
    mutationFn: (newAnimal: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>) => {
      livestockService.addAnimal(newAnimal);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livestock'] });
      queryClient.invalidateQueries({ queryKey: ['livestock-stats'] });
    },
  });

  const updateAnimalMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<Animal, 'id' | 'createdAt'>> }) => {
      livestockService.updateAnimal(id, updates);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livestock'] });
      queryClient.invalidateQueries({ queryKey: ['livestock-stats'] });
    },
  });

  const archiveAnimalMutation = useMutation({
    mutationFn: (id: string) => {
      livestockService.archiveAnimal(id);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livestock'] });
      queryClient.invalidateQueries({ queryKey: ['livestock-stats'] });
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: ({ name, description }: { name: string; description?: string }) => {
      livestockService.createGroup(farmId, name, description);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livestock-groups'] });
    },
  });

  return {
    animals: animalsQuery.data || [],
    stats: statsQuery.data,
    groups: groupsQuery.data || [],
    isLoading: animalsQuery.isLoading || statsQuery.isLoading,
    isError: animalsQuery.isError,
    addAnimal: addAnimalMutation.mutate,
    updateAnimal: updateAnimalMutation.mutate,
    archiveAnimal: archiveAnimalMutation.mutate,
    createGroup: createGroupMutation.mutate,
  };
}
