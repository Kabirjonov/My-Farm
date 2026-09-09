import React, { useEffect } from 'react';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { LayoutDashboard, Sprout, Wheat, PawPrint, BarChart2 } from 'lucide-react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Colors } from '@/constants/theme';
import { initDatabase } from '@/lib/db/db';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/features/auth';

const queryClient = new QueryClient();

// Prevent splash screen from auto-hiding until ready
SplashScreen.preventAutoHideAsync().catch(() => {});

function TabsNavigator() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const { t } = useTranslation();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const isAuthScreen = !isAuthenticated || pathname === '/login' || pathname === '/register';

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/login' && pathname !== '/register') {
      router.replace('/login' as any);
    }
  }, [isAuthenticated, pathname, router]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: isAuthScreen
          ? { display: 'none' }
          : {
              backgroundColor: colors.backgroundElement,
              borderTopColor: colors.cardBorder,
              borderTopWidth: 1,
              height: Platform.OS === 'ios' ? 84 : 68,
              paddingBottom: Platform.OS === 'ios' ? 24 : 10,
              paddingTop: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 8,
            },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.2,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}>
      {/* 1. Primary Tab: Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('dashboard'),
          tabBarIcon: ({ color }) => <LayoutDashboard size={22} color={color} />,
        }}
      />

      {/* 2. Primary Tab: Livestock */}
      <Tabs.Screen
        name="livestock"
        options={{
          title: t('livestock'),
          tabBarIcon: ({ color }) => <PawPrint size={22} color={color} />,
        }}
      />

      {/* 3. Primary Tab: Feed */}
      <Tabs.Screen
        name="feed"
        options={{
          title: t('feed'),
          tabBarIcon: ({ color }) => <Wheat size={22} color={color} />,
        }}
      />

      {/* 4. Primary Tab: Fields */}
      <Tabs.Screen
        name="fields"
        options={{
          title: t('fields'),
          tabBarIcon: ({ color }) => <Sprout size={22} color={color} />,
        }}
      />

      {/* 5. Primary Tab: Reports */}
      <Tabs.Screen
        name="reports"
        options={{
          title: t('reports'),
          tabBarIcon: ({ color }) => <BarChart2 size={22} color={color} />,
        }}
      />

      {/* Hide all sub-screens & auxiliary routes from bottom tab bar */}
      <Tabs.Screen name="login" options={{ href: null }} />
      <Tabs.Screen name="register" options={{ href: null }} />
      <Tabs.Screen name="profile-edit" options={{ href: null }} />
      <Tabs.Screen name="finance" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="tasks" options={{ href: null }} />
      <Tabs.Screen name="analytics" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="animals/[id]" options={{ href: null }} />
      <Tabs.Screen name="animals/edit" options={{ href: null }} />
      <Tabs.Screen name="animals/add-health" options={{ href: null }} />
      <Tabs.Screen name="animals/add-vaccination" options={{ href: null }} />
      <Tabs.Screen name="animals/add-breeding" options={{ href: null }} />
      <Tabs.Screen name="feed/[id]" options={{ href: null }} />
      <Tabs.Screen name="feed/edit" options={{ href: null }} />
      <Tabs.Screen name="feed/add-transaction" options={{ href: null }} />
      <Tabs.Screen name="crops/[id]" options={{ href: null }} />
      <Tabs.Screen name="fields/edit" options={{ href: null }} />
      <Tabs.Screen name="fields/add-crop" options={{ href: null }} />
      <Tabs.Screen name="fields/add-harvest" options={{ href: null }} />
      <Tabs.Screen name="finance/add-expense" options={{ href: null }} />
      <Tabs.Screen name="finance/add-income" options={{ href: null }} />
    </Tabs>
  );
}

export default function RootLayout() {
  useEffect(() => {
    // Initialize local SQLite database
    try {
      initDatabase();
    } catch {
      // Ignore DB init errors
    }

    // Safely hide splash screen on mount
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch {
        // Ignore splash errors
      }
    };
    hideSplash();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TabsNavigator />
    </QueryClientProvider>
  );
}
