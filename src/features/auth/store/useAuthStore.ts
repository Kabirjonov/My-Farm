import { create } from 'zustand';
import { UserSession, UserRole } from '../types';

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (email?: string, password?: string) => boolean;
  register: (fullName: string, email: string, farmName: string, role?: UserRole) => UserSession;
  updateProfile: (updates: Partial<Pick<UserSession, 'fullName' | 'email' | 'currentFarmName'>>) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  switchFarm: (farmId: string, farmName: string) => void;
}

const DEFAULT_MOCK_USER: UserSession = {
  id: 'user-owner-001',
  email: 'fermer@myfarm.uz',
  fullName: 'Alisher Oxunjonov',
  role: 'OWNER',
  currentFarmId: 'farm-001',
  currentFarmName: 'Chorvador Ferma',
};

const getInitialSession = (): { user: UserSession | null; isAuthenticated: boolean } => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem('myfarm_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.user) {
          return { user: parsed.user, isAuthenticated: true };
        } else if (parsed === null) {
          return { user: null, isAuthenticated: false };
        }
      }
    } catch {
      // Ignore
    }
  }
  return { user: DEFAULT_MOCK_USER, isAuthenticated: true };
};

const persistSession = (user: UserSession | null) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      if (user) {
        window.localStorage.setItem('myfarm_auth_session', JSON.stringify({ user }));
      } else {
        window.localStorage.removeItem('myfarm_auth_session');
      }
    } catch {
      // Ignore
    }
  }
};

const initial = getInitialSession();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initial.user,
  isAuthenticated: initial.isAuthenticated,

  login: (email?: string, password?: string) => {
    const session: UserSession = {
      id: `user-${Date.now()}`,
      email: email || 'fermer@myfarm.uz',
      fullName: email ? email.split('@')[0].toUpperCase() : 'Alisher Oxunjonov',
      role: 'OWNER',
      currentFarmId: 'farm-001',
      currentFarmName: 'Chorvador Ferma',
    };
    persistSession(session);
    set({ user: session, isAuthenticated: true });
    return true;
  },

  register: (fullName: string, email: string, farmName: string, role: UserRole = 'OWNER') => {
    const session: UserSession = {
      id: `user-${Date.now()}`,
      email,
      fullName,
      role,
      currentFarmId: `farm-${Date.now()}`,
      currentFarmName: farmName || 'Mening Fermam',
    };
    persistSession(session);
    set({ user: session, isAuthenticated: true });
    return session;
  },

  updateProfile: (updates) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    persistSession(updated);
    set({ user: updated });
  },

  logout: () => {
    persistSession(null);
    set({ user: null, isAuthenticated: false });
  },

  switchRole: (role: UserRole) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updated = { ...currentUser, role };
    persistSession(updated);
    set({ user: updated });
  },

  switchFarm: (farmId: string, farmName: string) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updated = { ...currentUser, currentFarmId: farmId, currentFarmName: farmName };
    persistSession(updated);
    set({ user: updated });
  },
}));
