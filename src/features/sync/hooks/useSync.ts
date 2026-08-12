import { useState, useEffect } from 'react';
import { syncService } from '../services/syncService';
import { syncQueueRepository } from '@/lib/db';

export type SyncStateStatus = 'OFFLINE' | 'SYNCING' | 'SYNCED' | 'FAILED';

export function useSync() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<SyncStateStatus>('SYNCED');
  const [pendingCount, setPendingCount] = useState<number>(0);

  const refreshSyncState = () => {
    const pending = syncQueueRepository.getPendingOrFailed();
    setPendingCount(pending.length);
    if (!isOnline) {
      setSyncStatus('OFFLINE');
    } else if (pending.length > 0) {
      setSyncStatus(pending.some((p) => p.status === 'FAILED') ? 'FAILED' : 'SYNCING');
    } else {
      setSyncStatus('SYNCED');
    }
  };

  useEffect(() => {
    const pending = syncQueueRepository.getPendingOrFailed();
    setPendingCount(pending.length);
    if (!isOnline) {
      setSyncStatus('OFFLINE');
    } else if (pending.length > 0) {
      setSyncStatus(pending.some((p) => p.status === 'FAILED') ? 'FAILED' : 'SYNCING');
    } else {
      setSyncStatus('SYNCED');
    }
  }, [isOnline]);

  const triggerSync = async () => {
    setSyncStatus('SYNCING');
    const { failCount } = await syncService.processSyncQueue();
    const remainingPending = syncQueueRepository.getPendingOrFailed();
    setPendingCount(remainingPending.length);
    if (failCount > 0) {
      setSyncStatus('FAILED');
    } else {
      setSyncStatus('SYNCED');
    }
  };

  return {
    isOnline,
    setIsOnline,
    syncStatus,
    pendingCount,
    triggerSync,
    refreshSyncState,
  };
}
