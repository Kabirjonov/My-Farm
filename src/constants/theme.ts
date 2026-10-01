import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Backgrounds
    background: '#F8F9FA',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E6F4EA',
    // Text
    text: '#111827',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    // Primary (Deep Forest Nature Green matching design)
    primary: '#05603A',
    primaryLight: '#E6F4EA',
    primaryDark: '#034228',
    primaryGradientStart: '#05603A',
    primaryGradientEnd: '#034228',
    // Accent colors
    accentAmber: '#D97706',
    accentBlue: '#2563EB',
    accentTeal: '#0D9488',
    // Status colors
    success: '#16A34A',
    successLight: '#DCFCE7',
    warning: '#D97706',
    warningLight: '#FEF3C7',
    danger: '#DC2626',
    dangerLight: '#FEE2E2',
    // UI Elements
    cardBorder: '#E5E7EB',
    cardShadow: 'rgba(0, 0, 0, 0.05)',
    divider: '#F3F4F6',
    overlay: 'rgba(0,0,0,0.4)',
    // Tab Bar
    tabBarBg: '#FFFFFF',
    tabBarBorder: '#E5E7EB',
  },
  dark: {
    background: '#0F172A',
    backgroundElement: '#1E293B',
    backgroundSelected: '#064E3B',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    primary: '#10B981',
    primaryLight: '#064E3B',
    primaryDark: '#047857',
    primaryGradientStart: '#10B981',
    primaryGradientEnd: '#047857',
    accentAmber: '#F59E0B',
    accentBlue: '#3B82F6',
    accentTeal: '#14B8A6',
    success: '#10B981',
    successLight: '#064E3B',
    warning: '#F59E0B',
    warningLight: '#451A03',
    danger: '#EF4444',
    dangerLight: '#450A0A',
    cardBorder: '#334155',
    cardShadow: 'rgba(0,0,0,0.25)',
    divider: '#334155',
    overlay: 'rgba(0,0,0,0.6)',
    tabBarBg: '#1E293B',
    tabBarBorder: '#334155',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

// Design tokens matching the reference design
export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export const Shadow = {
  card: {
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
