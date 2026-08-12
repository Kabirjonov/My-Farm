import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {
  Plus,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Wheat,
  DollarSign,
  HeartPulse,
} from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useLivestock } from '@/features/livestock';
import { useFeed } from '@/features/feed';
import { useLand } from '@/features/crops';
import { useFinance } from '@/features/finance';
import { useHealth } from '@/features/health';
import { useAuth } from '@/features/auth';
import { StatCard, QuickActionButton, LoadingState } from '@/components/ui';

export default function DashboardScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const { user } = useAuth();

  const { stats: livestockStats, isLoading: isLoadingLivestock } = useLivestock();
  const { stats: feedStats, isLoading: isLoadingFeed } = useFeed();
  const { stats: landStats, isLoading: isLoadingLand } = useLand();
  const { summary: financeSummary, isLoading: isLoadingFinance } = useFinance();
  const { reminders, toggleReminder } = useHealth();

  if (isLoadingLivestock || isLoadingFeed || isLoadingLand || isLoadingFinance) {
    return <LoadingState message="Ferma ko'rsatkichlari tayyorlanmoqda..." />;
  }

  const isProfitPositive = (financeSummary?.netProfit || 0) >= 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>
            Xush kelibsiz, {user?.fullName || 'Fermer'} 👋
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>
            {user?.currentFarmName || 'My Farm Boshqaruvi'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.roleBadge, { backgroundColor: colors.primaryLight }]}
          onPress={() => router.push('/settings' as any)}>
          <Text style={[styles.roleBadgeText, { color: colors.primary }]}>{user?.role || 'OWNER'}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Financial & Operational Overview Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Chorva Bosh Soni"
          value={livestockStats?.totalActive || 0}
          accentColor={colors.primary}
        />
        <StatCard
          title="Qo'y / Mol"
          value={`${livestockStats?.byType.SHEEP || 0} / ${livestockStats?.byType.COW || 0}`}
          accentColor={colors.accentAmber}
        />
        <StatCard
          title="Kasal / Homilador"
          value={(livestockStats?.byHealthStatus.SICK || 0) + (livestockStats?.byHealthStatus.PREGNANT || 0)}
          accentColor={colors.warning}
        />
        <StatCard
          title="Kam Qolgan Yemlar"
          value={feedStats?.lowStockCount || 0}
          accentColor={colors.danger}
        />
        <StatCard
          title="Faol Yer Maydoni"
          value={`${landStats?.totalAreaHectares || 0} ga`}
          accentColor={colors.accentBlue}
        />
        <StatCard
          title="Sof Oylik Foyda"
          value={`${(financeSummary?.netProfit || 0).toLocaleString()} so'm`}
          accentColor={isProfitPositive ? colors.primary : colors.danger}
        />
      </View>

      {/* Low Stock Alert Banner */}
      {(feedStats?.lowStockCount || 0) > 0 && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/feed')}
          style={[styles.alertBanner, { backgroundColor: '#FEF2F2', borderColor: colors.danger }]}>
          <AlertTriangle size={20} color={colors.danger} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.alertTitle, { color: colors.danger }]}>
              Ozuqa Ogohlantirishi ({feedStats?.lowStockCount} ta Yem)
            </Text>
            <Text style={styles.alertText}>
              Ombordagi ayrim yemlar minimal miqdordan kam qoldi. Zaxirani to&apos;ldiring.
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Quick Action Buttons Row */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tezkor Amallar</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionsScroll}>
        <QuickActionButton
          title="Hayvon Qo'shish"
          icon={<Plus size={18} color={colors.primary} />}
          onPress={() => router.push('/animals/edit')}
          accentColor={colors.primary}
        />
        <QuickActionButton
          title="Yem Kirim/Chiqim"
          icon={<Wheat size={18} color={colors.accentAmber} />}
          onPress={() => router.push('/feed')}
          accentColor={colors.accentAmber}
        />
        <QuickActionButton
          title="Xarajat / Daromad"
          icon={<DollarSign size={18} color={colors.accentBlue} />}
          onPress={() => router.push('/finance' as any)}
          accentColor={colors.accentBlue}
        />
        <QuickActionButton
          title="Sog'liq Yozish"
          icon={<HeartPulse size={18} color={colors.warning} />}
          onPress={() => router.push('/livestock')}
          accentColor={colors.warning}
        />
      </ScrollView>

      {/* Upcoming Reminders Section */}
      <View style={styles.sectionHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Bell size={18} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Eslatmalar va Taqvim ({reminders.length})</Text>
        </View>
      </View>

      {reminders.length === 0 ? (
        <View style={[styles.emptyBox, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
          <Text style={{ color: colors.textSecondary }}>Yaqin orada rejalashtirilgan eslatmalar yo&apos;q.</Text>
        </View>
      ) : (
        reminders.slice(0, 5).map((rem) => (
          <TouchableOpacity
            key={rem.id}
            activeOpacity={0.8}
            onPress={() => toggleReminder(rem.id)}
            style={[styles.reminderRow, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
            <TouchableOpacity onPress={() => toggleReminder(rem.id)} style={{ padding: 2 }}>
              {rem.isCompleted ? (
                <CheckCircle2 size={20} color={colors.primary} />
              ) : (
                <Circle size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.reminderTitle,
                  {
                    color: colors.text,
                    textDecorationLine: rem.isCompleted ? 'line-through' : 'none',
                    opacity: rem.isCompleted ? 0.6 : 1,
                  },
                ]}>
                {rem.title}
              </Text>
              <Text style={[styles.reminderMeta, { color: colors.textSecondary }]}>
                Muddati: {rem.dueDate} {rem.description ? `• ${rem.description}` : ''}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.three,
    paddingTop: Spacing.five,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 13,
    fontWeight: '500',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  alertText: {
    fontSize: 12,
    color: '#991B1B',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  actionsScroll: {
    marginVertical: 2,
  },
  emptyBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  reminderMeta: {
    fontSize: 12,
    marginTop: 2,
  },
});
