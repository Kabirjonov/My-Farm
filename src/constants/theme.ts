import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0f172a',
    background: '#f8fafc',
    backgroundElement: '#ffffff',
    backgroundSelected: '#e2e8f0',
    textSecondary: '#64748b',
    primary: '#16a34a',
    primaryLight: '#dcfce7',
    accentAmber: '#d97706',
    accentBlue: '#0284c7',
    cardBorder: '#e2e8f0',
    success: '#15803d',
    warning: '#b45309',
    danger: '#dc2626',
  },
  dark: {
    text: '#f8fafc',
    background: '#090d16',
    backgroundElement: '#131c2e',
    backgroundSelected: '#1e293b',
    textSecondary: '#94a3b8',
    primary: '#22c55e',
    primaryLight: '#14532d',
    accentAmber: '#f59e0b',
    accentBlue: '#38bdf8',
    cardBorder: '#1e293b',
    success: '#4ade80',
    warning: '#fbbf24',
    danger: '#f87171',
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

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
