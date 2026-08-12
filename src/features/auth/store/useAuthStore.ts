import { create } from 'zustand';
import { UserSession, UserRole } from '../types';

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (session: UserSession) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  switchFarm: (farmId: string, farmName: string) => void;
}

const DEFAULT_MOCK_USER: UserSession = {
  id: 'user-owner-001',
  email: 'fermer@myfarm.uz',
  fullName: 'Alihantaev Alisher',
  role: 'OWNER',
  currentFarmId: 'farm-001',
  currentFarmName: 'Chorvador Ferma',
};

export const useAuthStore = create<AuthState>((set: (partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>)) => void) => ({
  user: DEFAULT_MOCK_USER,
  isAuthenticated: true,
  login: (session: UserSession) =>
    set({ user: session, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  switchRole: (role: UserRole) =>
    set((state: AuthState) => ({
      user: state.user ? { ...state.user, role } : null,
    })),
  switchFarm: (farmId: string, farmName: string) =>
    set((state: AuthState) => ({
      user: state.user ? { ...state.user, currentFarmId: farmId, currentFarmName: farmName } : null,
    })),
}));
