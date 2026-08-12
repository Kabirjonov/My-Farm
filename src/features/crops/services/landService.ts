import { landRepository, LandStats } from '@/lib/db';
import { LandField, CropSeason, HarvestRecord } from '@/types/domain';

export const landService = {
  getFields(farmId?: string): LandField[] {
    return landRepository.listFields(farmId);
  },

  getFieldById(id: string): LandField | null {
    return landRepository.findFieldById(id);
  },

  getStats(farmId?: string): LandStats {
    return landRepository.getStats(farmId);
  },

  createField(field: Omit<LandField, 'id' | 'createdAt'>): LandField {
    return landRepository.createField(field);
  },

  getCropSeasons(fieldId: string): CropSeason[] {
    return landRepository.listCropSeasons(fieldId);
  },

  getCropSeasonById(id: string): CropSeason | null {
    return landRepository.findCropSeasonById(id);
  },

  createCropSeason(crop: Omit<CropSeason, 'id' | 'createdAt'>): CropSeason {
    return landRepository.createCropSeason(crop);
  },

  getHarvestRecords(cropSeasonId: string): HarvestRecord[] {
    return landRepository.listHarvestRecords(cropSeasonId);
  },

  addHarvestRecord(harvest: Omit<HarvestRecord, 'id' | 'createdAt'>, markHarvested?: boolean): HarvestRecord {
    return landRepository.addHarvestRecord(harvest, markHarvested);
  },
};
