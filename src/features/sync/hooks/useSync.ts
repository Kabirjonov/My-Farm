import { useState, useEffect, useCallback, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { syncService } from '../services/syncService';
import { syncQueueRepository } from '@/lib/db';

export type SyncStateStatus = 'OFFLINE' | 'SYNCING' | 'SYNCED' | 'FAILED';

// Last sync timestamp key
const LAST_SYNCED_KEY = 'myfarm_last_synced_at';

function getLastSyncedAt(): string | undefined {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem(LAST_SYNCED_KEY) ?? undefined;
  }
  return undefined;
}

function saveLastSyncedAt(iso: string) {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(LAST_SYNCED_KEY, iso);
  }
}

export function useSync() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<SyncStateStatus>('SYNCED');
  const [pendingCount, setPendingCount] = useState<number>(0);
  const isSyncing = useRef(false);

  // Track real network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = state.isConnected === true && state.isInternetReachable !== false;
      setIsOnline(online);
      if (!online) setSyncStatus('OFFLINE');
    });
    return () => unsubscribe();
  }, []);

  // Recalculate pending count
  const refreshSyncState = useCallback(() => {
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

  // Full sync: push local queue → backend, then pull delta from backend
  const triggerSync = useCallback(async () => {
    if (!isOnline || isSyncing.current) return;
    isSyncing.current = true;
    setSyncStatus('SYNCING');

    try {
      // 1. Push pending local mutations to backend
      const { failCount } = await syncService.processSyncQueue();

      // 2. Pull delta changes from backend since last sync
      const lastSyncedAt = getLastSyncedAt();
      const deltaResult = await syncService.pullDelta(lastSyncedAt);
      if (deltaResult?.serverTime) {
        saveLastSyncedAt(
          typeof deltaResult.serverTime === 'string'
            ? deltaResult.serverTime
            : new Date(deltaResult.serverTime).toISOString()
        );
      }

      const remaining = syncQueueRepository.getPendingOrFailed();
      setPendingCount(remaining.length);
      setSyncStatus(failCount > 0 || remaining.length > 0 ? 'FAILED' : 'SYNCED');
    } catch (err) {
      console.error('[useSync] Sync failed:', err);
      setSyncStatus('FAILED');
    } finally {
      isSyncing.current = false;
    }
  }, [isOnline]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline) {
      const pending = syncQueueRepository.getPendingOrFailed();
      setPendingCount(pending.length);
      if (pending.length > 0) {
        triggerSync();
      } else {
        setSyncStatus('SYNCED');
      }
    } else {
      setSyncStatus('OFFLINE');
    }
  }, [isOnline, triggerSync]);

  return {
    isOnline,
    syncStatus,
    pendingCount,
    triggerSync,
    refreshSyncState,
  };
}
