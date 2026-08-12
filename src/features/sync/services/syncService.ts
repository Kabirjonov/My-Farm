import { syncQueueRepository } from '@/lib/db';
import { SyncQueue } from '@/types/domain';

export const syncService = {
  // Backend Interface Stubs for Cloud Sync Integration
  async syncAnimal(item: SyncQueue): Promise<boolean> {
    console.log('[SyncService] Syncing Animal to Cloud:', item.entityId, item.operation);
    return Promise.resolve(true);
  },

  async syncHealthRecord(item: SyncQueue): Promise<boolean> {
    console.log('[SyncService] Syncing HealthRecord to Cloud:', item.entityId, item.operation);
    return Promise.resolve(true);
  },

  async syncVaccinationRecord(item: SyncQueue): Promise<boolean> {
    console.log('[SyncService] Syncing VaccinationRecord to Cloud:', item.entityId, item.operation);
    return Promise.resolve(true);
  },

  async syncBreedingRecord(item: SyncQueue): Promise<boolean> {
    console.log('[SyncService] Syncing BreedingRecord to Cloud:', item.entityId, item.operation);
    return Promise.resolve(true);
  },

  async syncFeedItem(item: SyncQueue): Promise<boolean> {
    console.log('[SyncService] Syncing FeedItem to Cloud:', item.entityId, item.operation);
    return Promise.resolve(true);
  },

  async syncFeedTransaction(item: SyncQueue): Promise<boolean> {
    console.log('[SyncService] Syncing FeedTransaction to Cloud:', item.entityId, item.operation);
    return Promise.resolve(true);
  },

  async syncLandField(item: SyncQueue): Promise<boolean> {
    console.log('[SyncService] Syncing LandField to Cloud:', item.entityId, item.operation);
    return Promise.resolve(true);
  },

  async syncCropSeason(item: SyncQueue): Promise<boolean> {
    console.log('[SyncService] Syncing CropSeason to Cloud:', item.entityId, item.operation);
    return Promise.resolve(true);
  },

  async syncHarvestRecord(item: SyncQueue): Promise<boolean> {
    console.log('[SyncService] Syncing HarvestRecord to Cloud:', item.entityId, item.operation);
    return Promise.resolve(true);
  },

  async syncExpense(item: SyncQueue): Promise<boolean> {
    console.log('[SyncService] Syncing Expense to Cloud:', item.entityId, item.operation);
    return Promise.resolve(true);
  },

  async syncIncome(item: SyncQueue): Promise<boolean> {
    console.log('[SyncService] Syncing Income to Cloud:', item.entityId, item.operation);
    return Promise.resolve(true);
  },

  async processSyncQueue(): Promise<{ successCount: number; failCount: number }> {
    const queue = syncQueueRepository.getPendingOrFailed();
    let successCount = 0;
    let failCount = 0;

    for (const item of queue) {
      syncQueueRepository.updateStatus(item.id, 'SYNCING');
      try {
        let isSynced = false;
        switch (item.entityType) {
          case 'Animal':
            isSynced = await this.syncAnimal(item);
            break;
          case 'HealthRecord':
            isSynced = await this.syncHealthRecord(item);
            break;
          case 'VaccinationRecord':
            isSynced = await this.syncVaccinationRecord(item);
            break;
          case 'BreedingRecord':
            isSynced = await this.syncBreedingRecord(item);
            break;
          case 'FeedItem':
            isSynced = await this.syncFeedItem(item);
            break;
          case 'FeedTransaction':
            isSynced = await this.syncFeedTransaction(item);
            break;
          case 'LandField':
            isSynced = await this.syncLandField(item);
            break;
          case 'CropSeason':
            isSynced = await this.syncCropSeason(item);
            break;
          case 'HarvestRecord':
            isSynced = await this.syncHarvestRecord(item);
            break;
          case 'Expense':
            isSynced = await this.syncExpense(item);
            break;
          case 'Income':
            isSynced = await this.syncIncome(item);
            break;
          default:
            isSynced = true;
        }

        if (isSynced) {
          syncQueueRepository.markDone(item.id);
          successCount++;
        } else {
          syncQueueRepository.updateStatus(item.id, 'FAILED', 'Server reject');
          failCount++;
        }
      } catch (err: any) {
        syncQueueRepository.updateStatus(item.id, 'FAILED', err?.message || 'Network error');
        failCount++;
      }
    }

    return { successCount, failCount };
  },
};
