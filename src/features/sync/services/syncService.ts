import { syncQueueRepository } from '@/lib/db';
import { SyncQueue } from '@/types/domain';
import { apiClient } from '@/lib/api/client';

const ENTITY_TYPE_MAP: Record<string, string> = {
  Animal: 'ANIMAL',
  HealthRecord: 'HEALTH_RECORD',
  VaccinationRecord: 'VACCINATION',
  BreedingRecord: 'BREEDING',
  FeedItem: 'FEED_ITEM',
  FeedTransaction: 'FEED_TRANSACTION',
  LandField: 'FIELD',
  CropSeason: 'CROP_SEASON',
  HarvestRecord: 'HARVEST',
  Expense: 'EXPENSE',
  Income: 'INCOME',
};

export const syncService = {
  async processSyncQueue(): Promise<{ successCount: number; failCount: number }> {
    const queue = syncQueueRepository.getPendingOrFailed();
    if (queue.length === 0) {
      return { successCount: 0, failCount: 0 };
    }

    let successCount = 0;
    let failCount = 0;

    const mutations = queue.map((item) => {
      syncQueueRepository.updateStatus(item.id, 'SYNCING');
      let payload = {};
      try {
        payload = JSON.parse(item.payloadJson);
      } catch {
        payload = {};
      }

      const mappedEntityType = ENTITY_TYPE_MAP[item.entityType] || item.entityType.toUpperCase();
      const mappedAction = item.operation === 'ARCHIVE' ? 'DELETE' : item.operation;

      return {
        clientMutationId: item.id,
        entityType: mappedEntityType,
        action: mappedAction,
        payload,
      };
    });

    try {
      const response = await apiClient.post<{
        results: Array<{
          clientMutationId: string;
          status: 'SYNCED' | 'ALREADY_PROCESSED' | 'ERROR';
          entityType: string;
          error?: string;
        }>;
        syncedAt: string;
      }>('/sync/batch', { mutations });

      const resultMap = new Map(
        (response.data?.results || []).map((r) => [r.clientMutationId, r])
      );

      for (const item of queue) {
        const res = resultMap.get(item.id);
        if (res && (res.status === 'SYNCED' || res.status === 'ALREADY_PROCESSED')) {
          syncQueueRepository.markDone(item.id);
          successCount++;
        } else {
          syncQueueRepository.updateStatus(
            item.id,
            'FAILED',
            res?.error || 'Unknown sync error'
          );
          failCount++;
        }
      }
    } catch (err: any) {
      console.error('[SyncService] Batch sync failed:', err);
      for (const item of queue) {
        syncQueueRepository.updateStatus(item.id, 'FAILED', err?.message || 'Network error');
        failCount++;
      }
    }

    return { successCount, failCount };
  },

  async pullDelta(lastSyncedAt?: string) {
    const endpoint = lastSyncedAt
      ? `/sync/delta?lastSyncedAt=${encodeURIComponent(lastSyncedAt)}`
      : '/sync/delta';
    const response = await apiClient.get<any>(endpoint);
    return response.data;
  },
};
