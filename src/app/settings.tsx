import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { Settings as SettingsIcon, User as UserIcon, Shield, Home, RefreshCw, Wifi, WifiOff } from 'lucide-react-native';
import { useAuth, UserRole } from '@/features/auth';
import { useSync } from '@/features/sync';
import { AppSelect, AppButton } from '@/components/ui';

export default function SettingsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { user, switchRole, switchFarm } = useAuth();
  const { isOnline, setIsOnline, syncStatus, pendingCount, triggerSync } = useSync();

  const roleOptions: { label: string; value: UserRole }[] = [
    { label: 'Ega (Owner)', value: 'OWNER' },
    { label: 'Boshqaruvchi (Manager)', value: 'MANAGER' },
    { label: 'Ishchi (Worker)', value: 'WORKER' },
    { label: 'Veterinar (Vet)', value: 'VET' },
    { label: 'Kuzatuvchi (Viewer)', value: 'VIEWER' },
  ];

  const farmOptions = [
    { label: 'Chorvador Ferma', value: 'farm-001' },
    { label: 'Vodiy Dehqonchilik', value: 'farm-002' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <SettingsIcon size={28} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>Sozlamalar & Profil</Text>
      </View>

      {/* User Profile Card */}
      {user && (
        <View style={[styles.card, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
          <View style={styles.userRow}>
            <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
              <UserIcon size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.userName, { color: colors.text }]}>{user.fullName}</Text>
              <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user.email}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Offline Sync Status & Queue Card */}
      <View style={[styles.card, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
        <View style={styles.rowBetween}>
          <View style={styles.cardHeader}>
            <RefreshCw size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Offline Sync & Tarmoq Holati</Text>
          </View>
          <TouchableOpacity
            style={[styles.networkBadge, { backgroundColor: isOnline ? colors.primaryLight : '#FEE2E2' }]}
            onPress={() => setIsOnline(!isOnline)}>
            {isOnline ? <Wifi size={14} color={colors.primary} /> : <WifiOff size={14} color={colors.danger} />}
            <Text style={[styles.networkText, { color: isOnline ? colors.primary : colors.danger }]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rowBetween}>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Sinxronizatsiya holati:</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  syncStatus === 'SYNCED'
                    ? colors.primaryLight
                    : syncStatus === 'SYNCING'
                    ? '#FEF3C7'
                    : '#FEE2E2',
              },
            ]}>
            <Text
              style={[
                styles.statusBadgeText,
                {
                  color:
                    syncStatus === 'SYNCED'
                      ? colors.primary
                      : syncStatus === 'SYNCING'
                      ? colors.warning
                      : colors.danger,
                },
              ]}>
              {syncStatus}
            </Text>
          </View>
        </View>

        <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
          Kutish navbatidagi o&apos;zgarishlar (SyncQueue): {pendingCount} ta
        </Text>

        <AppButton
          title="Qayta Sinxronlash (Retry Sync)"
          onPress={triggerSync}
          style={{ marginTop: 4 }}
        />
      </View>

      {/* Active Farm Switcher Card */}
      <View style={[styles.card, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
        <View style={styles.cardHeader}>
          <Home size={20} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Faol Ferma</Text>
        </View>
        <AppSelect
          options={farmOptions}
          selectedValue={user?.currentFarmId || 'farm-001'}
          onValueChange={(val) => {
            const found = farmOptions.find((f) => f.value === val);
            if (found) switchFarm(found.value, found.label);
          }}
        />
      </View>

      {/* Role Switcher (Permission Demo) */}
      <View style={[styles.card, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
        <View style={styles.cardHeader}>
          <Shield size={20} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Foydalanuvchi Roli (Test / Demo)</Text>
        </View>
        <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
          Rolni o&apos;zgartiring va ruxsatlarni (Permission Matrix) tekshiring:
        </Text>
        <AppSelect
          options={roleOptions}
          selectedValue={user?.role || 'OWNER'}
          onValueChange={(val) => switchRole(val as UserRole)}
        />
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 60,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  card: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 13,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 13,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  networkText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
