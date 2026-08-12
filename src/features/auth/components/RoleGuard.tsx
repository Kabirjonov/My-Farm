import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAuth } from '../hooks/useAuth';
import { PermissionAction } from '../types';
import { ShieldAlert } from 'lucide-react-native';

export interface RoleGuardProps {
  permission: PermissionAction;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showForbiddenBanner?: boolean;
}

export function RoleGuard({
  permission,
  children,
  fallback,
  showForbiddenBanner = false,
}: RoleGuardProps) {
  const { can } = useAuth();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const isAllowed = can(permission);

  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showForbiddenBanner) {
    return (
      <View style={[styles.forbiddenCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
        <ShieldAlert size={36} color={colors.danger} />
        <Text style={[styles.title, { color: colors.text }]}>Ruxsat yo&apos;q</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Ushbu funksiya yoki ma&apos;lumotlarni ko&apos;rish uchun sizning rolingizda ruxsat mavjud emas.
        </Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  forbiddenCard: {
    padding: 24,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    textAlign: 'center',
  },
});
