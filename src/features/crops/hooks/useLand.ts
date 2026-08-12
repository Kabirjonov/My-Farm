import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { landService } from '../services/landService';
import { LandField, CropSeason, HarvestRecord } from '@/types/domain';

export function useLand(fieldId?: string, cropSeasonId?: string, farmId: string = 'farm-001') {
  const queryClient = useQueryClient();

  const fieldsQuery = useQuery({
    queryKey: ['land-fields', farmId],
    queryFn: () => landService.getFields(farmId),
  });

  const statsQuery = useQuery({
    queryKey: ['land-stats', farmId],
    queryFn: () => landService.getStats(farmId),
  });

  const cropSeasonsQuery = useQuery({
    queryKey: ['crop-seasons', fieldId],
    queryFn: () => (fieldId ? landService.getCropSeasons(fieldId) : []),
    enabled: Boolean(fieldId),
  });

  const harvestRecordsQuery = useQuery({
    queryKey: ['harvest-records', cropSeasonId],
    queryFn: () => (cropSeasonId ? landService.getHarvestRecords(cropSeasonId) : []),
    enabled: Boolean(cropSeasonId),
  });

  const createFieldMutation = useMutation({
    mutationFn: (field: Omit<LandField, 'id' | 'createdAt'>) => {
      landService.createField(field);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['land-fields'] });
      queryClient.invalidateQueries({ queryKey: ['land-stats'] });
    },
  });

  const createCropSeasonMutation = useMutation({
    mutationFn: (crop: Omit<CropSeason, 'id' | 'createdAt'>) => {
      landService.createCropSeason(crop);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crop-seasons', fieldId] });
      queryClient.invalidateQueries({ queryKey: ['land-stats'] });
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  const addHarvestRecordMutation = useMutation({
    mutationFn: ({ harvest, markHarvested }: { harvest: Omit<HarvestRecord, 'id' | 'createdAt'>; markHarvested?: boolean }) => {
      landService.addHarvestRecord(harvest, markHarvested);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['harvest-records', cropSeasonId] });
      queryClient.invalidateQueries({ queryKey: ['crop-seasons'] });
      queryClient.invalidateQueries({ queryKey: ['land-stats'] });
    },
  });

  return {
    fields: fieldsQuery.data || [],
    stats: statsQuery.data,
    cropSeasons: cropSeasonsQuery.data || [],
    harvestRecords: harvestRecordsQuery.data || [],
    isLoading: fieldsQuery.isLoading || statsQuery.isLoading,
    createField: createFieldMutation.mutate,
    createCropSeason: createCropSeasonMutation.mutate,
    addHarvestRecord: addHarvestRecordMutation.mutate,
  };
}
