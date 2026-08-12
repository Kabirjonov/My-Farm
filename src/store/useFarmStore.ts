import { create } from 'zustand';

interface FarmState {
  isOffline: boolean;
  setOffline: (offline: boolean) => void;
  syncTime: string | null;
  setSyncTime: (time: string) => void;
}

export const useFarmStore = create<FarmState>((set: (partial: Partial<FarmState>) => void) => ({
  isOffline: false,
  setOffline: (offline: boolean) => set({ isOffline: offline }),
  syncTime: null,
  setSyncTime: (time: string) => set({ syncTime: time }),
}));
