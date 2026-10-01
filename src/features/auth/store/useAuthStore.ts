import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { UserSession, UserRole } from '../types';
import { apiClient } from '@/lib/api/client';

// Keys for SecureStore
const TOKEN_KEY = 'myfarm_access_token';
const REFRESH_KEY = 'myfarm_refresh_token';
const SESSION_KEY = 'myfarm_user_session';

// Secure helpers — falls back to localStorage on web
async function secureGet(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
  }
  return SecureStore.getItemAsync(key);
}

async function secureSet(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
    return;
  }
  return SecureStore.setItemAsync(key, value);
}

async function secureDel(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.localStorage.removeItem(key);
    return;
  }
  return SecureStore.deleteItemAsync(key);
}

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Initialise from stored token on app launch
  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, farmName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<UserSession, 'fullName' | 'email' | 'currentFarmName'>>) => void;
  switchRole: (role: UserRole) => void;
  switchFarm: (farmId: string, farmName: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Called once in _layout.tsx on app start
  bootstrap: async () => {
    try {
      const token = await secureGet(TOKEN_KEY);
      const sessionRaw = await secureGet(SESSION_KEY);

      if (token && sessionRaw) {
        const user: UserSession = JSON.parse(sessionRaw);
        // Apply token to API client for all future requests
        apiClient.setAuthToken(token);
        apiClient.setFarmId(user.currentFarmId);
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    const res = await apiClient.post<{
      user: {
        id: string;
        email: string;
        fullName: string;
        role: UserRole;
      };
      currentFarm: { id: string; name: string };
      tokens: { accessToken: string; refreshToken: string };
    }>('/auth/login', { email, password });

    const { user: u, currentFarm, tokens } = res.data;

    const session: UserSession = {
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      currentFarmId: currentFarm.id,
      currentFarmName: currentFarm.name,
    };

    await secureSet(TOKEN_KEY, tokens.accessToken);
    await secureSet(REFRESH_KEY, tokens.refreshToken);
    await secureSet(SESSION_KEY, JSON.stringify(session));

    apiClient.setAuthToken(tokens.accessToken);
    apiClient.setFarmId(currentFarm.id);

    set({ user: session, isAuthenticated: true });
  },

  register: async (fullName: string, email: string, password: string, farmName: string) => {
    const res = await apiClient.post<{
      user: {
        id: string;
        email: string;
        fullName: string;
        role: UserRole;
      };
      farm: { id: string; name: string };
      tokens: { accessToken: string; refreshToken: string };
    }>('/auth/register', { fullName, email, password, farmName });

    const { user: u, farm, tokens } = res.data;

    const session: UserSession = {
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      currentFarmId: farm.id,
      currentFarmName: farm.name,
    };

    await secureSet(TOKEN_KEY, tokens.accessToken);
    await secureSet(REFRESH_KEY, tokens.refreshToken);
    await secureSet(SESSION_KEY, JSON.stringify(session));

    apiClient.setAuthToken(tokens.accessToken);
    apiClient.setFarmId(farm.id);

    set({ user: session, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout', {}).catch(() => {});
    } finally {
      await secureDel(TOKEN_KEY);
      await secureDel(REFRESH_KEY);
      await secureDel(SESSION_KEY);
      apiClient.setAuthToken(null);
      apiClient.setFarmId(null);
      set({ user: null, isAuthenticated: false });
    }
  },

  updateProfile: (updates) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    secureSet(SESSION_KEY, JSON.stringify(updated)).catch(() => {});
    set({ user: updated });
  },

  switchRole: (role: UserRole) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updated = { ...currentUser, role };
    secureSet(SESSION_KEY, JSON.stringify(updated)).catch(() => {});
    set({ user: updated });
  },

  switchFarm: (farmId: string, farmName: string) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updated = { ...currentUser, currentFarmId: farmId, currentFarmName: farmName };
    secureSet(SESSION_KEY, JSON.stringify(updated)).catch(() => {});
    apiClient.setFarmId(farmId);
    set({ user: updated });
  },
}));
