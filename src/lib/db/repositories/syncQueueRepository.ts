import { dbInstance } from '../database';
import { SyncQueue, SyncOperation, SyncStatus } from '@/types/domain';
import { generateUUID } from '@/utils/uuid';

export const syncQueueRepository = {
  enqueue(entityType: string, entityId: string, operation: SyncOperation, payload: object): SyncQueue {
    const id = generateUUID();
    const now = new Date().toISOString();
    const item: SyncQueue = {
      id,
      entityType,
      entityId,
      operation,
      payloadJson: JSON.stringify(payload),
      status: 'PENDING',
      retryCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    dbInstance.runSync(
      `INSERT INTO sync_queue (id, entityType, entityId, operation, payloadJson, status, retryCount, errorMessage, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.id,
        item.entityType,
        item.entityId,
        item.operation,
        item.payloadJson,
        item.status,
        item.retryCount,
        null,
        item.createdAt,
        item.updatedAt,
      ]
    );

    return item;
  },

  getPendingOrFailed(): SyncQueue[] {
    return dbInstance.getAllSync<SyncQueue>(
      "SELECT * FROM sync_queue WHERE status IN ('PENDING', 'FAILED') ORDER BY createdAt ASC"
    );
  },

  updateStatus(id: string, status: SyncStatus, errorMessage?: string): void {
    const now = new Date().toISOString();
    if (status === 'FAILED') {
      dbInstance.runSync(
        'UPDATE sync_queue SET status = ?, retryCount = retryCount + 1, errorMessage = ?, updatedAt = ? WHERE id = ?',
        [status, errorMessage ?? 'Network error', now, id]
      );
    } else {
      dbInstance.runSync(
        'UPDATE sync_queue SET status = ?, updatedAt = ? WHERE id = ?',
        [status, now, id]
      );
    }
  },

  markDone(id: string): void {
    const now = new Date().toISOString();
    dbInstance.runSync("UPDATE sync_queue SET status = 'DONE', updatedAt = ? WHERE id = ?", [now, id]);
  },
};
