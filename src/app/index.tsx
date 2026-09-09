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
  Bell,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Wheat,
  DollarSign,
  HeartPulse,
  Plus,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react-native';
import { Colors, Spacing, Radius, Shadow } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useLivestock } from '@/features/livestock';
import { useFeed } from '@/features/feed';
import { useLand } from '@/features/crops';
import { useFinance } from '@/features/finance';
import { useHealth } from '@/features/health';
import { useAuth } from '@/features/auth';
import { useTranslation } from '@/i18n';
import { LoadingState } from '@/components/ui';

export default function DashboardScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();

  const { stats: livestockStats, isLoading: isLoadingLivestock } = useLivestock();
  const { stats: feedStats, isLoading: isLoadingFeed } = useFeed();
  const { stats: landStats, isLoading: isLoadingLand } = useLand();
  const { summary: financeSummary, isLoading: isLoadingFinance } = useFinance();
  const { reminders, toggleReminder } = useHealth();

  if (isLoadingLivestock || isLoadingFeed || isLoadingLand || isLoadingFinance) {
    return <LoadingState message={`${t('appName')}...`} />;
  }

  const isProfitPositive = (financeSummary?.netProfit || 0) >= 0;
  const totalAnimals = livestockStats?.totalActive || 0;
  const sheepCount = livestockStats?.byType?.SHEEP || 0;
  const cowCount = livestockStats?.byType?.COW || 0;
  const sickCount = (livestockStats?.byHealthStatus?.SICK || 0) + (livestockStats?.byHealthStatus?.PREGNANT || 0);
  const lowFeed = feedStats?.lowStockCount || 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: C.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>

      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerGreeting}>
              {t('welcome')}, {user?.fullName?.split(' ')[0] || 'Fermer'} 👋
            </Text>
            <Text style={styles.headerFarmName}>
              {user?.currentFarmName || t('appName')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => router.push('/settings' as any)}>
            <Bell size={22} color="#fff" />
            {(reminders.filter((r) => !r.isCompleted).length > 0) && (
              <View style={styles.bellDot} />
            )}
          </TouchableOpacity>
        </View>

        {/* Stats Row inside header */}
        <View style={styles.headerStatsRow}>
          <View style={[styles.headerStatCard, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <Text style={styles.headerStatValue}>{totalAnimals}</Text>
            <Text style={styles.headerStatLabel}>{t('totalAnimals')}</Text>
          </View>
          <View style={[styles.headerStatCard, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <Text style={styles.headerStatValue}>{sheepCount}</Text>
            <Text style={styles.headerStatLabel}>{t('typeSHEEP')}</Text>
          </View>
          <View style={[styles.headerStatCard, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <Text style={styles.headerStatValue}>{cowCount}</Text>
            <Text style={styles.headerStatLabel}>{t('typeCOW')}</Text>
          </View>
          <View style={[styles.headerStatCard, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <Text style={[styles.headerStatValue, sickCount > 0 && { color: '#FFCDD2' }]}>{sickCount}</Text>
            <Text style={styles.headerStatLabel}>{t('healthSICK')}</Text>
          </View>
        </View>
      </View>

      {/* ── Low Stock Alert ── */}
      {lowFeed > 0 && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/feed')}
          style={[styles.alertBanner, { backgroundColor: C.warningLight, borderColor: C.warning }]}>
          <View style={[styles.alertIcon, { backgroundColor: C.warning }]}>
            <AlertTriangle size={16} color="#fff" />
          </View>
          <Text style={[styles.alertText, { color: C.warning }]}>
            {t('lowStockFeed')}: {lowFeed} ta yem kam qoldi
          </Text>
          <ChevronRight size={16} color={C.warning} />
        </TouchableOpacity>
      )}

      {/* ── Income / Expense Cards ── */}
      <View style={styles.financeRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/finance' as any)}
          style={[styles.financeCard, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>
          <View style={[styles.financeIconBg, { backgroundColor: C.successLight }]}>
            <TrendingUp size={18} color={C.success} />
          </View>
          <Text style={[styles.financeLabel, { color: C.textSecondary }]}>{t('incomesList')}</Text>
          <Text style={[styles.financeValue, { color: C.success }]}>
            {((financeSummary?.monthlyIncomes || 0) / 1_000_000).toFixed(1)} mln
          </Text>
          <Text style={[styles.financeSub, { color: C.textMuted }]}>+12% {t('date')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/finance' as any)}
          style={[styles.financeCard, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>
          <View style={[styles.financeIconBg, { backgroundColor: C.dangerLight }]}>
            <TrendingDown size={18} color={C.danger} />
          </View>
          <Text style={[styles.financeLabel, { color: C.textSecondary }]}>{t('expensesList')}</Text>
          <Text style={[styles.financeValue, { color: C.danger }]}>
            {((financeSummary?.monthlyExpenses || 0) / 1_000_000).toFixed(1)} mln
          </Text>
          <Text style={[styles.financeSub, { color: C.textMuted }]}>-5% {t('date')}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Quick Actions ── */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: C.text }]}>{t('quickActions')}</Text>
      </View>

      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: C.backgroundElement, ...Shadow.card }]}
          onPress={() => router.push('/animals/edit')}>
          <View style={[styles.actionIcon, { backgroundColor: C.successLight }]}>
            <Plus size={20} color={C.primary} />
          </View>
          <Text style={[styles.actionLabel, { color: C.text }]}>{t('addAnimal')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: C.backgroundElement, ...Shadow.card }]}
          onPress={() => router.push('/feed')}>
          <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
            <Wheat size={20} color={C.accentAmber} />
          </View>
          <Text style={[styles.actionLabel, { color: C.text }]}>{t('feedKirimChiqim')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: C.backgroundElement, ...Shadow.card }]}
          onPress={() => router.push('/finance' as any)}>
          <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
            <DollarSign size={20} color={C.accentBlue} />
          </View>
          <Text style={[styles.actionLabel, { color: C.text }]}>{t('financeAction')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: C.backgroundElement, ...Shadow.card }]}
          onPress={() => router.push('/livestock')}>
          <View style={[styles.actionIcon, { backgroundColor: '#FCE4EC' }]}>
            <HeartPulse size={20} color="#C62828" />
          </View>
          <Text style={[styles.actionLabel, { color: C.text }]}>{t('healthAction')}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Reminders ── */}
      <View style={styles.sectionHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Bell size={16} color={C.primary} />
          <Text style={[styles.sectionTitle, { color: C.text }]}>
            {t('reminders')} ({reminders.filter((r) => !r.isCompleted).length})
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={[styles.seeAll, { color: C.primary }]}>{t('all')}</Text>
        </TouchableOpacity>
      </View>

      {reminders.length === 0 ? (
        <View style={[styles.emptyBox, { backgroundColor: C.backgroundElement, borderColor: C.cardBorder }]}>
          <Text style={[styles.emptyText, { color: C.textSecondary }]}>
            Yaqin orada eslatmalar yo'q.
          </Text>
        </View>
      ) : (
        reminders.slice(0, 4).map((rem) => (
          <TouchableOpacity
            key={rem.id}
            activeOpacity={0.8}
            onPress={() => toggleReminder(rem.id)}
            style={[styles.reminderRow, {
              backgroundColor: C.backgroundElement,
              borderColor: C.cardBorder,
              ...Shadow.card,
            }]}>
            {rem.isCompleted ? (
              <CheckCircle2 size={22} color={C.primary} />
            ) : (
              <Circle size={22} color={C.textMuted} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={[styles.reminderTitle, {
                color: C.text,
                textDecorationLine: rem.isCompleted ? 'line-through' : 'none',
                opacity: rem.isCompleted ? 0.5 : 1,
              }]}>
                {rem.title}
              </Text>
              <Text style={[styles.reminderDate, { color: C.textSecondary }]}>
                📅 {rem.dueDate}
              </Text>
            </View>
            {!rem.isCompleted && (
              <View style={[styles.reminderDot, { backgroundColor: C.primary }]} />
            )}
          </TouchableOpacity>
        ))
      )}

      <View style={{ height: 48 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { paddingBottom: 40 },

  // Header
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeft: { flex: 1 },
  headerGreeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  headerFarmName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginTop: 2,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5252',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  headerStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  headerStatCard: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  headerStatValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  headerStatLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
    fontWeight: '600',
  },

  // Alert Banner
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  alertIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },

  // Finance cards
  financeRow: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 14,
  },
  financeCard: {
    flex: 1,
    padding: 14,
    borderRadius: Radius.lg,
  },
  financeIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  financeLabel: { fontSize: 12, fontWeight: '500' },
  financeValue: { fontSize: 18, fontWeight: '800', marginTop: 2 },
  financeSub: { fontSize: 11, marginTop: 2 },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  seeAll: { fontSize: 13, fontWeight: '600' },

  // Quick Actions
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginHorizontal: 16,
  },
  actionCard: {
    width: '47%',
    padding: 14,
    borderRadius: Radius.lg,
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontSize: 12, fontWeight: '700', textAlign: 'center' },

  // Reminders
  emptyBox: {
    marginHorizontal: 16,
    padding: 20,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyText: { fontSize: 14 },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  reminderTitle: { fontSize: 14, fontWeight: '600' },
  reminderDate: { fontSize: 12, marginTop: 2 },
  reminderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
