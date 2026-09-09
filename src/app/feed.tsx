import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Warehouse, Plus, ChevronRight, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react-native';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useFeed } from '@/features/feed';
import { RoleGuard } from '@/features/auth';
import { useTranslation } from '@/i18n';
import { LoadingState } from '@/components/ui';

const FEED_EMOJI: Record<string, string> = {
  KG: '🌾',
  TON: '🌿',
  BALE: '🍀',
  LITRE: '💧',
  PIECE: '📦',
};

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(Math.max(value / max, 0), 1);
  return (
    <View style={progressStyles.track}>
      <View style={[progressStyles.fill, { width: `${pct * 100}%` as any, backgroundColor: color }]} />
    </View>
  );
}
const progressStyles = StyleSheet.create({
  track: { height: 6, borderRadius: 3, backgroundColor: '#E8EDE8', overflow: 'hidden', flex: 1 },
  fill: { height: 6, borderRadius: 3 },
});

export default function FeedScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const { t, formatEnum } = useTranslation();
  const [activeTab, setActiveTab] = useState<'inventory' | 'transactions'>('inventory');

  const { items: inventory, transactions, stats, isLoading } = useFeed();

  if (isLoading) {
    return <LoadingState message={`${t('feedStorage')}...`} />;
  }

  const getStockStatus = (current: number, min: number) => {
    const pct = (current / min) * 100;
    if (pct <= 0) return { label: t('feedStatusCritical'), color: C.danger, bg: C.dangerLight };
    if (pct < 100) return { label: t('feedStatusLow'), color: C.warning, bg: C.warningLight };
    return { label: t('feedStatusOk'), color: C.success, bg: C.successLight };
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.backgroundElement, borderBottomColor: C.divider }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={[styles.headerIconBg, { backgroundColor: C.successLight }]}>
              <Warehouse size={20} color={C.primary} />
            </View>
            <View>
              <Text style={[styles.headerSub, { color: C.textSecondary }]}>{t('feedStorage')}</Text>
              <Text style={[styles.headerTitle, { color: C.text }]}>{t('yemOmbori')}</Text>
            </View>
          </View>
          <RoleGuard permission="FEED_MANAGE">
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: C.primary }]}
              onPress={() => router.push('/feed/edit' as any)}>
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          </RoleGuard>
        </View>

        {/* Stats Summary */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: C.successLight }]}>
            <TrendingUp size={14} color={C.success} />
            <Text style={[styles.summaryLabel, { color: C.success }]}>{t('feedIn')}</Text>
            <Text style={[styles.summaryValue, { color: C.success }]}>
              {inventory.filter(item => item.currentQuantity > item.minQuantity).length} ta
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: C.dangerLight }]}>
            <TrendingDown size={14} color={C.danger} />
            <Text style={[styles.summaryLabel, { color: C.danger }]}>{t('feedOut')}</Text>
            <Text style={[styles.summaryValue, { color: C.danger }]}>
              {((stats?.totalOutToday || 0)).toFixed(0)} kg
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: C.warningLight }]}>
            <AlertTriangle size={14} color={C.warning} />
            <Text style={[styles.summaryLabel, { color: C.warning }]}>{t('lowStockFeed')}</Text>
            <Text style={[styles.summaryValue, { color: C.warning }]}>
              {stats?.lowStockCount || 0} ta
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabRow, { backgroundColor: C.background }]}>
          {(['inventory', 'transactions'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                activeTab === tab && { backgroundColor: C.primary },
              ]}>
              <Text style={[
                styles.tabText,
                { color: activeTab === tab ? '#fff' : C.textSecondary },
              ]}>
                {tab === 'inventory' ? t('feedInventory') : t('feedTransactions')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {activeTab === 'inventory' ? (
          <>
            {inventory.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: C.backgroundElement, borderColor: C.cardBorder }]}>
                <Text style={{ fontSize: 40 }}>🌾</Text>
                <Text style={[styles.emptyTitle, { color: C.text }]}>{t('noData')}</Text>
              </View>
            ) : inventory.map((item) => {
              const status = getStockStatus(item.currentQuantity, item.minQuantity);
              const pct = Math.min(item.currentQuantity / Math.max(item.minQuantity * 2, 1), 1);
              const progressColor = item.currentQuantity < item.minQuantity ? C.danger : C.primary;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  onPress={() => router.push({ pathname: '/feed/[id]', params: { id: item.id } } as any)}
                  style={[styles.feedCard, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>

                  <View style={styles.feedCardTop}>
                    <View style={[styles.feedIconBox, { backgroundColor: C.successLight }]}>
                      <Text style={styles.feedEmoji}>{FEED_EMOJI[item.unit] || '🌾'}</Text>
                    </View>
                    <View style={styles.feedInfo}>
                      <View style={styles.feedTopRow}>
                        <Text style={[styles.feedName, { color: C.text }]}>{item.name}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                        </View>
                      </View>
                      <View style={styles.feedQuantityRow}>
                        <Text style={[styles.feedQty, { color: C.text }]}>
                          {item.currentQuantity.toLocaleString()} {formatEnum('unit', item.unit)}
                        </Text>
                        <Text style={[styles.feedMin, { color: C.textSecondary }]}>
                          Min: {item.minQuantity} {item.unit}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.progressRow}>
                    <ProgressBar value={item.currentQuantity} max={item.minQuantity * 2} color={progressColor} />
                    <Text style={[styles.progressPct, { color: status.color }]}>
                      {Math.round(pct * 100)}%
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        ) : (
          <>
            {transactions.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: C.backgroundElement, borderColor: C.cardBorder }]}>
                <Text style={{ fontSize: 40 }}>📋</Text>
                <Text style={[styles.emptyTitle, { color: C.text }]}>{t('noData')}</Text>
              </View>
            ) : transactions.slice(0, 30).map((tx) => {
              const isIn = tx.type === 'IN';
              return (
                <View
                  key={tx.id}
                  style={[styles.txCard, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>
                  <View style={[styles.txIcon, { backgroundColor: isIn ? C.successLight : C.dangerLight }]}>
                    {isIn ? (
                      <TrendingUp size={16} color={C.success} />
                    ) : (
                      <TrendingDown size={16} color={C.danger} />
                    )}
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={[styles.txType, { color: C.text }]}>
                      {isIn ? t('feedIn') : t('feedOut')}
                    </Text>
                    <Text style={[styles.txDate, { color: C.textSecondary }]}>{tx.date}</Text>
                  </View>
                  <View style={styles.txRight}>
                    <Text style={[styles.txQty, { color: isIn ? C.success : C.danger }]}>
                      {isIn ? '+' : '-'}{tx.quantity}
                    </Text>
                    <Text style={[styles.txUnit, { color: C.textMuted }]}>{tx.unit}</Text>
                  </View>
                </View>
              );
            })}

          </>
        )}

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingTop: 56,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSub: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  headerTitle: { fontSize: 20, fontWeight: '800', marginTop: 1 },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    padding: 10,
    borderRadius: Radius.md,
    alignItems: 'center',
    gap: 4,
  },
  summaryLabel: { fontSize: 10, fontWeight: '600' },
  summaryValue: { fontSize: 14, fontWeight: '800' },

  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    padding: 4,
    borderRadius: Radius.md,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  tabText: { fontSize: 13, fontWeight: '700' },

  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 10,
  },

  emptyBox: {
    padding: 40,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700' },

  feedCard: {
    padding: 14,
    borderRadius: Radius.lg,
    gap: 12,
  },
  feedCardTop: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  feedIconBox: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedEmoji: { fontSize: 26 },
  feedInfo: { flex: 1 },
  feedTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  feedName: { fontSize: 15, fontWeight: '700', flex: 1 },
  feedQuantityRow: { flexDirection: 'row', justifyContent: 'space-between' },
  feedQty: { fontSize: 16, fontWeight: '800' },
  feedMin: { fontSize: 12 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressPct: { fontSize: 12, fontWeight: '700', width: 36, textAlign: 'right' },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  statusText: { fontSize: 11, fontWeight: '700' },

  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: Radius.lg,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txInfo: { flex: 1 },
  txType: { fontSize: 13, fontWeight: '700' },
  txDate: { fontSize: 12, marginTop: 2 },
  txRight: { alignItems: 'flex-end' },
  txQty: { fontSize: 15, fontWeight: '800' },
  txUnit: { fontSize: 11 },
});
