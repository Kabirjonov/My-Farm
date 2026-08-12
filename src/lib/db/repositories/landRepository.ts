import { dbInstance } from '../database';
import { LandField, CropSeason, HarvestRecord, CropStatus } from '@/types/domain';
import { generateUUID } from '@/utils/uuid';
import { reminderRepository } from './reminderRepository';

export interface LandStats {
  totalAreaHectares: number;
  activeCropsCount: number;
  upcomingHarvestsCount: number;
}

export const landRepository = {
  listFields(farmId: string = 'farm-001'): LandField[] {
    return dbInstance.getAllSync<LandField>(
      'SELECT * FROM land_fields WHERE farmId = ? ORDER BY name ASC',
      [farmId]
    );
  },

  findFieldById(id: string): LandField | null {
    return dbInstance.getFirstSync<LandField>('SELECT * FROM land_fields WHERE id = ?', [id]);
  },

  createField(input: Omit<LandField, 'id' | 'createdAt'>): LandField {
    const id = generateUUID();
    const now = new Date().toISOString();
    const field: LandField = { ...input, id, createdAt: now };

    dbInstance.runSync(
      `INSERT INTO land_fields (id, farmId, name, area, areaUnit, location, soilType, waterSource, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        field.id,
        field.farmId,
        field.name,
        field.area,
        field.areaUnit,
        field.location ?? null,
        field.soilType ?? null,
        field.waterSource ?? null,
        field.notes ?? null,
        field.createdAt,
      ]
    );

    return field;
  },

  listCropSeasons(fieldId: string): CropSeason[] {
    return dbInstance.getAllSync<CropSeason>(
      'SELECT * FROM crop_seasons WHERE fieldId = ? ORDER BY plantedDate DESC',
      [fieldId]
    );
  },

  findCropSeasonById(id: string): CropSeason | null {
    return dbInstance.getFirstSync<CropSeason>('SELECT * FROM crop_seasons WHERE id = ?', [id]);
  },

  createCropSeason(input: Omit<CropSeason, 'id' | 'createdAt'>): CropSeason {
    const id = generateUUID();
    const now = new Date().toISOString();
    const crop: CropSeason = { ...input, id, createdAt: now };

    dbInstance.runSync(
      `INSERT INTO crop_seasons (id, fieldId, cropName, seasonYear, plantedDate, expectedHarvestDate, expectedYield, expectedYieldUnit, status, seedCost, fertilizerCost, medicineCost, waterCost, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        crop.id,
        crop.fieldId,
        crop.cropName,
        crop.seasonYear,
        crop.plantedDate,
        crop.expectedHarvestDate ?? null,
        crop.expectedYield ?? 0,
        crop.expectedYieldUnit ?? null,
        crop.status,
        crop.seedCost ?? 0,
        crop.fertilizerCost ?? 0,
        crop.medicineCost ?? 0,
        crop.waterCost ?? 0,
        crop.notes ?? null,
        crop.createdAt,
      ]
    );

    // Auto-create reminder for expected harvest date
    if (crop.expectedHarvestDate) {
      reminderRepository.create({
        title: `Hosil yig'imi vaqti: ${crop.cropName}`,
        description: `Maydonda kutilayotgan hosil yig'imi sanasi kirdi.`,
        dueDate: crop.expectedHarvestDate,
        isCompleted: false,
        relatedEntityName: 'CropSeason',
        relatedEntityId: crop.id,
      });
    }

    // Auto-create finance expenses if costs > 0
    const totalCost = (crop.seedCost || 0) + (crop.fertilizerCost || 0) + (crop.medicineCost || 0) + (crop.waterCost || 0);
    if (totalCost > 0) {
      dbInstance.runSync(
        `INSERT INTO expenses (id, farmId, category, amount, description, date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          generateUUID(),
          'farm-001',
          'EQUIPMENT',
          totalCost,
          `Ekin ekish va o'g'it xarajatlari: ${crop.cropName}`,
          crop.plantedDate,
        ]
      );
    }

    return crop;
  },

  updateCropStatus(id: string, status: CropStatus): void {
    dbInstance.runSync('UPDATE crop_seasons SET status = ? WHERE id = ?', [status, id]);
  },

  listHarvestRecords(cropSeasonId: string): HarvestRecord[] {
    return dbInstance.getAllSync<HarvestRecord>(
      'SELECT * FROM harvest_records WHERE cropSeasonId = ? ORDER BY date DESC',
      [cropSeasonId]
    );
  },

  addHarvestRecord(input: Omit<HarvestRecord, 'id' | 'createdAt'>, markHarvested: boolean = true): HarvestRecord {
    const id = generateUUID();
    const now = new Date().toISOString();
    const harvest: HarvestRecord = { ...input, id, createdAt: now };

    dbInstance.runSync(
      `INSERT INTO harvest_records (id, cropSeasonId, date, quantity, unit, quality, soldQuantity, soldAmount, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        harvest.id,
        harvest.cropSeasonId,
        harvest.date,
        harvest.quantity,
        harvest.unit,
        harvest.quality,
        harvest.soldQuantity ?? 0,
        harvest.soldAmount ?? 0,
        harvest.notes ?? null,
        harvest.createdAt,
      ]
    );

    if (markHarvested) {
      this.updateCropStatus(harvest.cropSeasonId, 'HARVESTED');
    }

    // Auto-create income if soldAmount > 0
    if (harvest.soldAmount && harvest.soldAmount > 0) {
      dbInstance.runSync(
        `INSERT INTO incomes (id, farmId, category, amount, description, date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          generateUUID(),
          'farm-001',
          'CROP_SALE',
          harvest.soldAmount,
          `Hosil sotuv daromadi (${harvest.soldQuantity || harvest.quantity} ${harvest.unit})`,
          harvest.date,
        ]
      );
    }

    return harvest;
  },

  getStats(farmId: string = 'farm-001'): LandStats {
    const fields = this.listFields(farmId);
    let totalAreaHectares = 0;
    fields.forEach((f) => {
      if (f.areaUnit === 'HECTARE') totalAreaHectares += f.area;
      else if (f.areaUnit === 'SOTIX') totalAreaHectares += f.area * 0.01;
      else if (f.areaUnit === 'SQM') totalAreaHectares += f.area * 0.0001;
    });

    const activeCrops = dbInstance.getAllSync<CropSeason>(
      "SELECT * FROM crop_seasons WHERE status IN ('PLANTED', 'GROWING')"
    );

    const upcomingHarvests = dbInstance.getAllSync<CropSeason>(
      "SELECT * FROM crop_seasons WHERE status IN ('PLANTED', 'GROWING') AND expectedHarvestDate IS NOT NULL"
    );

    return {
      totalAreaHectares: Math.round(totalAreaHectares * 100) / 100,
      activeCropsCount: activeCrops.length,
      upcomingHarvestsCount: upcomingHarvests.length,
    };
  },
};
