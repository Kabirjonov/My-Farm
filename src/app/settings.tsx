import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import {
  Settings as SettingsIcon,
  User as UserIcon,
  Shield,
  Home,
  RefreshCw,
  Wifi,
  WifiOff,
  Globe,
  ChevronRight,
  Info,
  LogOut,
  LogIn,
} from 'lucide-react-native';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { useAuth, UserRole } from '@/features/auth';
import { useSync } from '@/features/sync';
import { useTranslation, Language } from '@/i18n';
import { AppSelect, AppButton } from '@/components/ui';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const { user, isAuthenticated, logout, switchRole, switchFarm } = useAuth();
  const { isOnline, syncStatus, pendingCount, triggerSync } = useSync();
  const { t, language, setLanguage } = useTranslation();

  const languageOptions: { label: string; value: Language }[] = [
    { label: '🇺🇿  O\'zbekcha', value: 'uz' },
    { label: '🇷🇺  Русский', value: 'ru' },
  ];

  const roleOptions: { label: string; value: UserRole }[] = [
    { label: t('roleOWNER'), value: 'OWNER' },
    { label: t('roleMANAGER'), value: 'MANAGER' },
    { label: t('roleWORKER'), value: 'WORKER' },
    { label: t('roleVET'), value: 'VET' },
    { label: t('roleVIEWER'), value: 'VIEWER' },
  ];

  const farmOptions = [
    { label: user?.currentFarmName || 'Chorvador Ferma', value: user?.currentFarmId || 'farm-001' },
    { label: 'Vodiy Dehqonchilik', value: 'farm-002' },
  ];

  const syncBadgeColor = () => {
    switch (syncStatus) {
      case 'SYNCED': return { bg: C.successLight, text: C.success };
      case 'SYNCING': return { bg: C.warningLight, text: C.warning };
      default: return { bg: C.dangerLight, text: C.danger };
    }
  };
  const syncBadge = syncBadgeColor();

  const handleLogout = () => {
    Alert.alert(
      t('logoutBtn'),
      'Rostdan ham tizimdan chiqmoqchimisiz?',
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('logoutBtn'),
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login' as any);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.backgroundElement, borderBottomColor: C.divider }]}>
        <View style={[styles.headerIconBg, { backgroundColor: C.successLight }]}>
          <SettingsIcon size={20} color={C.primary} />
        </View>
        <Text style={[styles.headerTitle, { color: C.text }]}>{t('settings')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Profile Card */}
        {isAuthenticated && user ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push('/profile-edit' as any)}
            style={[styles.profileCard, { backgroundColor: C.primary, ...Shadow.card }]}>
            <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
              <Text style={styles.avatarText}>
                {(user.fullName || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.fullName}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
              <View style={[styles.roleBadge]}>
                <Text style={styles.roleBadgeText}>{t(`role${user.role}` as any)}</Text>
              </View>
            </View>
            <View style={styles.editBtn}>
              <ChevronRight size={20} color="rgba(255,255,255,0.85)" />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={[styles.unauthCard, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>
            <Text style={[styles.unauthTitle, { color: C.text }]}>Tizimga kirmagansiz</Text>
            <AppButton
              title={t('loginBtn')}
              onPress={() => router.push('/login' as any)}
            />
          </View>
        )}

        {/* Language Card */}
        <View style={[styles.section, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBox, { backgroundColor: C.successLight }]}>
              <Globe size={18} color={C.primary} />
            </View>
            <Text style={[styles.sectionTitle, { color: C.text }]}>{t('language')}</Text>
          </View>
          <View style={styles.langRow}>
            {languageOptions.map((lang) => (
              <TouchableOpacity
                key={lang.value}
                onPress={() => setLanguage(lang.value)}
                style={[
                  styles.langBtn,
                  {
                    backgroundColor: language === lang.value ? C.primary : C.background,
                    borderColor: language === lang.value ? C.primary : C.cardBorder,
                  },
                ]}>
                <Text style={[
                  styles.langBtnText,
                  { color: language === lang.value ? '#fff' : C.text },
                ]}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sync Status Card */}
        <View style={[styles.section, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                <RefreshCw size={18} color={C.accentBlue} />
              </View>
              <Text style={[styles.sectionTitle, { color: C.text }]}>Offline Sync</Text>
            </View>
            <View
              style={[styles.networkBadge, { backgroundColor: isOnline ? C.successLight : C.dangerLight }]}>
              {isOnline
                ? <Wifi size={13} color={C.success} />
                : <WifiOff size={13} color={C.danger} />}
              <Text style={[styles.networkText, { color: isOnline ? C.success : C.danger }]}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>

          <View style={styles.syncInfoRow}>
            <Text style={[styles.syncLabel, { color: C.textSecondary }]}>{t('status')}:</Text>
            <View style={[styles.statusBadge, { backgroundColor: syncBadge.bg }]}>
              <Text style={[styles.statusBadgeText, { color: syncBadge.text }]}>
                {t(`sync${syncStatus}` as any)}
              </Text>
            </View>
          </View>

          <View style={styles.syncInfoRow}>
            <Text style={[styles.syncLabel, { color: C.textSecondary }]}>Kutayotgan:</Text>
            <Text style={[styles.syncValue, { color: C.text }]}>{pendingCount} ta</Text>
          </View>

          <AppButton
            title={t('retry')}
            onPress={triggerSync}
            style={{ marginTop: 4 }}
          />
        </View>

        {/* Farm Switcher */}
        <View style={[styles.section, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBox, { backgroundColor: C.warningLight }]}>
              <Home size={18} color={C.accentAmber} />
            </View>
            <Text style={[styles.sectionTitle, { color: C.text }]}>{t('activeFarm')}</Text>
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

        {/* Role Switcher */}
        <View style={[styles.section, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBox, { backgroundColor: '#EDE7F6' }]}>
              <Shield size={18} color="#7B1FA2" />
            </View>
            <Text style={[styles.sectionTitle, { color: C.text }]}>{t('role')} (RBAC)</Text>
          </View>
          <AppSelect
            options={roleOptions}
            selectedValue={user?.role || 'OWNER'}
            onValueChange={(val) => switchRole(val as UserRole)}
          />
        </View>

        {/* App Info */}
        <View style={[styles.section, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBox, { backgroundColor: C.successLight }]}>
              <Info size={18} color={C.primary} />
            </View>
            <Text style={[styles.sectionTitle, { color: C.text }]}>{t('appName')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: C.textSecondary }]}>{t('version')}</Text>
            <Text style={[styles.infoValue, { color: C.text }]}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: C.textSecondary }]}>Platform</Text>
            <Text style={[styles.infoValue, { color: C.text }]}>Expo SDK 57</Text>
          </View>
        </View>

        {/* Logout Button */}
        {isAuthenticated && (
          <AppButton
            title={t('logoutBtn')}
            variant="danger"
            onPress={handleLogout}
            style={{ marginTop: 6 }}
          />
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
  },
  headerIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: '800' },

  content: { padding: 16, gap: 14 },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    borderRadius: Radius.lg,
  },
  unauthCard: {
    padding: 20,
    borderRadius: Radius.lg,
    alignItems: 'center',
    gap: 12,
  },
  unauthTitle: { fontSize: 16, fontWeight: '700' },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  profileInfo: { flex: 1, gap: 3 },
  profileName: { fontSize: 17, fontWeight: '800', color: '#fff' },
  profileEmail: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginTop: 2,
  },
  roleBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  section: {
    padding: 16,
    borderRadius: Radius.lg,
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 15, fontWeight: '700' },

  langRow: { flexDirection: 'row', gap: 10 },
  langBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  langBtnText: { fontSize: 13, fontWeight: '700' },

  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  networkText: { fontSize: 12, fontWeight: '700' },

  syncInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  syncLabel: { fontSize: 13 },
  syncValue: { fontSize: 13, fontWeight: '700' },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  statusBadgeText: { fontSize: 11, fontWeight: '800' },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  infoLabel: { fontSize: 13 },
  infoValue: { fontSize: 13, fontWeight: '600' },
});
