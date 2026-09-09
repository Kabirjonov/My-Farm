import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Backgrounds
    background: '#F4F6F4',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E8F5E9',
    // Text
    text: '#1A2E1A',
    textSecondary: '#6B7B6B',
    textMuted: '#9EAD9E',
    // Primary (Nature Green matching design)
    primary: '#2E7D32',
    primaryLight: '#E8F5E9',
    primaryDark: '#1B5E20',
    primaryGradientStart: '#43A047',
    primaryGradientEnd: '#2E7D32',
    // Accent colors
    accentAmber: '#E65100',
    accentBlue: '#0277BD',
    accentTeal: '#00695C',
    // Status colors
    success: '#2E7D32',
    successLight: '#E8F5E9',
    warning: '#F57C00',
    warningLight: '#FFF3E0',
    danger: '#C62828',
    dangerLight: '#FFEBEE',
    // UI Elements
    cardBorder: '#E8EDEA',
    cardShadow: 'rgba(46, 125, 50, 0.08)',
    divider: '#EDF1ED',
    overlay: 'rgba(0,0,0,0.4)',
    // Tab Bar
    tabBarBg: '#FFFFFF',
    tabBarBorder: '#E8EDEA',
  },
  dark: {
    background: '#0D160D',
    backgroundElement: '#142014',
    backgroundSelected: '#1A2E1A',
    text: '#E8F5E9',
    textSecondary: '#81C784',
    textMuted: '#4CAF50',
    primary: '#4CAF50',
    primaryLight: '#1A2E1A',
    primaryDark: '#388E3C',
    primaryGradientStart: '#388E3C',
    primaryGradientEnd: '#1B5E20',
    accentAmber: '#FFA726',
    accentBlue: '#29B6F6',
    accentTeal: '#26A69A',
    success: '#66BB6A',
    successLight: '#1A2E1A',
    warning: '#FFA726',
    warningLight: '#2C1E0A',
    danger: '#EF5350',
    dangerLight: '#2C0A0A',
    cardBorder: '#1A2E1A',
    cardShadow: 'rgba(0,0,0,0.3)',
    divider: '#1A2E1A',
    overlay: 'rgba(0,0,0,0.6)',
    tabBarBg: '#142014',
    tabBarBorder: '#1A2E1A',
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
