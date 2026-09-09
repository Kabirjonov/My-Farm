import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { BarChart3, Download, Calendar } from 'lucide-react-native';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { useFinance } from '@/features/finance';
import { useLivestock } from '@/features/livestock';
import { useLand } from '@/features/crops';
import { useTranslation } from '@/i18n';
import { LoadingState } from '@/components/ui';

type PeriodKey = '7' | '30' | '90' | '365';

export default function ReportsScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { t } = useTranslation();
  const [period, setPeriod] = useState<PeriodKey>('30');

  const { summary: finance, isLoading: financeLoading } = useFinance();
  const { stats: livestock } = useLivestock();
  const { stats: landStats, fields } = useLand();

  if (financeLoading) return <LoadingState message={`${t('reports')}...`} />;

  const periods: { label: string; value: PeriodKey }[] = [
    { label: '7 kun', value: '7' },
    { label: '30 kun', value: '30' },
    { label: '3 oy', value: '90' },
    { label: '1 yil', value: '365' },
  ];

  const periodDays = parseInt(period, 10);
  const factor = periodDays / 30;

  const rawIncome = finance?.monthlyIncomes || 8400000;
  const rawExpense = finance?.monthlyExpenses || 4050000;

  const income = rawIncome * factor;
  const expense = rawExpense * factor;
  const profit = income - expense;
  const profitPositive = profit >= 0;

  // Dynamic bar chart data according to selected period
  const getBarData = () => {
    const incM = (income / 1_000_000) / 5;
    const expM = (expense / 1_000_000) / 5;
    if (period === '7') {
      return [
        { label: 'Dush', income: incM * 0.8, expense: expM * 0.9 },
        { label: 'Sesh', income: incM * 1.1, expense: expM * 0.7 },
        { label: 'Chor', income: incM * 0.9, expense: expM * 1.2 },
        { label: 'Pay',  income: incM * 1.3, expense: expM * 0.8 },
        { label: 'Jum',  income: incM * 1.0, expense: expM * 1.0 },
      ];
    }
    if (period === '90') {
      return [
        { label: '1-oy', income: incM * 4, expense: expM * 3.5 },
        { label: '2-oy', income: incM * 5.2, expense: expM * 4.1 },
        { label: '3-oy', income: incM * 5.8, expense: expM * 4.4 },
      ];
    }
    if (period === '365') {
      return [
        { label: '1-chor', income: incM * 14, expense: expM * 12 },
        { label: '2-chor', income: incM * 18, expense: expM * 14 },
        { label: '3-chor', income: incM * 15, expense: expM * 11 },
        { label: '4-chor', income: incM * 20, expense: expM * 13 },
      ];
    }
    // Default 30 days
    return [
      { label: '1-hafta', income: incM * 1.1, expense: expM * 0.9 },
      { label: '2-hafta', income: incM * 1.4, expense: expM * 1.1 },
      { label: '3-hafta', income: incM * 1.2, expense: expM * 1.3 },
      { label: '4-hafta', income: incM * 1.6, expense: expM * 1.0 },
    ];
  };

  const barData = getBarData();
  const maxBar = Math.max(...barData.flatMap(d => [d.income, d.expense]), 1);


  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.backgroundElement, borderBottomColor: C.divider }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={[styles.headerIconBg, { backgroundColor: C.successLight }]}>
              <BarChart3 size={20} color={C.primary} />
            </View>
            <View>
              <Text style={[styles.headerSub, { color: C.textSecondary }]}>{t('analytics')}</Text>
              <Text style={[styles.headerTitle, { color: C.text }]}>{t('reports')}</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.exportBtn, { backgroundColor: C.successLight }]}>
            <Download size={16} color={C.primary} />
            <Text style={[styles.exportText, { color: C.primary }]}>PDF</Text>
          </TouchableOpacity>
        </View>

        {/* Period filter */}
        <View style={[styles.periodRow, { backgroundColor: C.background }]}>
          {periods.map((p) => (
            <TouchableOpacity
              key={p.value}
              onPress={() => setPeriod(p.value)}
              style={[
                styles.periodBtn,
                period === p.value && { backgroundColor: C.primary },
              ]}>
              <Text style={[
                styles.periodText,
                { color: period === p.value ? '#fff' : C.textSecondary },
              ]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Finance Summary Cards */}
        <Text style={[styles.sectionTitle, { color: C.text }]}>{t('financeReport')}</Text>
        <View style={styles.financeCards}>
          <View style={[styles.financeCard, { backgroundColor: C.successLight }]}>
            <Text style={[styles.financeCardLabel, { color: C.success }]}>{t('incomesList')}</Text>
            <Text style={[styles.financeCardValue, { color: C.success }]}>
              {(income / 1_000_000).toFixed(1)} mln
            </Text>
          </View>
          <View style={[styles.financeCard, { backgroundColor: C.dangerLight }]}>
            <Text style={[styles.financeCardLabel, { color: C.danger }]}>{t('expensesList')}</Text>
            <Text style={[styles.financeCardValue, { color: C.danger }]}>
              {(expense / 1_000_000).toFixed(1)} mln
            </Text>
          </View>
          <View style={[styles.financeCard, {
            backgroundColor: profitPositive ? C.successLight : C.dangerLight,
            width: '100%',
          }]}>
            <Text style={[styles.financeCardLabel, { color: profitPositive ? C.success : C.danger }]}>
              {t('netProfit')}
            </Text>
            <Text style={[styles.financeCardValue, { color: profitPositive ? C.success : C.danger, fontSize: 22 }]}>
              {profitPositive ? '+' : ''}{(profit / 1_000_000).toFixed(1)} mln
            </Text>
          </View>
        </View>

        {/* Bar Chart */}
        <View style={[styles.chartCard, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>
          <Text style={[styles.chartTitle, { color: C.text }]}>{t('incomeExpenseChart')}</Text>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: C.primary }]} />
              <Text style={[styles.legendText, { color: C.textSecondary }]}>{t('incomesList')}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: C.danger }]} />
              <Text style={[styles.legendText, { color: C.textSecondary }]}>{t('expensesList')}</Text>
            </View>
          </View>

          {/* Bar chart */}
          <View style={styles.barChart}>
            {barData.map((d, i) => (
              <View key={i} style={styles.barGroup}>
                <View style={styles.bars}>
                  <View style={[styles.bar, {
                    height: Math.max((d.income / maxBar) * 100, 4),
                    backgroundColor: C.primary,
                    opacity: 0.9,
                  }]} />
                  <View style={[styles.bar, {
                    height: Math.max((d.expense / maxBar) * 100, 4),
                    backgroundColor: C.danger,
                    opacity: 0.85,
                  }]} />
                </View>
                <Text style={[styles.barLabel, { color: C.textMuted }]}>{d.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Harvest Summary */}
        <Text style={[styles.sectionTitle, { color: C.text }]}>{t('harvestReport')}</Text>
        <View style={styles.harvestGrid}>
          {fields.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: C.backgroundElement, borderColor: C.cardBorder }]}>
              <Text style={{ fontSize: 36 }}>📊</Text>
              <Text style={[styles.emptyText, { color: C.textSecondary }]}>{t('noData')}</Text>
            </View>
          ) : fields.slice(0, 4).map((field) => (
            <View key={field.id} style={[styles.harvestCard, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>
              <Text style={styles.harvestEmoji}>🌾</Text>
              <Text style={[styles.harvestCrop, { color: C.text }]}>{field.name}</Text>
              <Text style={[styles.harvestYield, { color: C.primary }]}>
                {field.area} {field.areaUnit === 'HECTARE' ? 'ga' : field.areaUnit}
              </Text>
              <Text style={[styles.harvestField, { color: C.textSecondary }]}>{field.soilType || '—'}</Text>
            </View>
          ))}

        </View>

        {/* Livestock Summary */}
        <Text style={[styles.sectionTitle, { color: C.text }]}>{t('livestockReport')}</Text>
        <View style={[styles.livestockSummary, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>
          {[
            { label: t('typeSHEEP'), value: livestock?.byType?.SHEEP || 0, emoji: '🐑' },
            { label: t('typeCOW'), value: livestock?.byType?.COW || 0, emoji: '🐄' },
            { label: t('typeGOAT'), value: livestock?.byType?.GOAT || 0, emoji: '🐐' },
            { label: t('typeHORSE'), value: livestock?.byType?.HORSE || 0, emoji: '🐎' },
          ].map((item, i) => (
            <View key={i} style={[styles.livestockRow, i < 3 && { borderBottomWidth: 1, borderBottomColor: C.divider }]}>
              <Text style={styles.livestockEmoji}>{item.emoji}</Text>
              <Text style={[styles.livestockLabel, { color: C.text }]}>{item.label}</Text>
              <Text style={[styles.livestockValue, { color: C.primary }]}>
                {item.value} ta
              </Text>
            </View>
          ))}
          <View style={[styles.livestockTotal, { borderTopColor: C.cardBorder }]}>
            <Text style={[styles.livestockTotalLabel, { color: C.text }]}>{t('totalAnimals')}</Text>
            <Text style={[styles.livestockTotalValue, { color: C.primary }]}>
              {livestock?.totalActive || 0} ta
            </Text>
          </View>
        </View>

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
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.md,
  },
  exportText: { fontSize: 13, fontWeight: '700' },

  periodRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    padding: 4,
    borderRadius: Radius.md,
    marginBottom: 8,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  periodText: { fontSize: 12, fontWeight: '700' },

  content: { padding: 16, gap: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 0 },

  // Finance cards
  financeCards: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  financeCard: {
    flex: 1,
    minWidth: '45%',
    padding: 14,
    borderRadius: Radius.lg,
  },
  financeCardLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  financeCardValue: { fontSize: 18, fontWeight: '800' },

  // Chart
  chartCard: {
    padding: 16,
    borderRadius: Radius.lg,
  },
  chartTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10 },
  chartLegend: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, fontWeight: '500' },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
  },
  barGroup: { alignItems: 'center', gap: 4 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  bar: { width: 14, borderRadius: 4 },
  barLabel: { fontSize: 9, fontWeight: '500' },

  // Harvest
  harvestGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  harvestCard: {
    flex: 1,
    minWidth: '45%',
    padding: 14,
    borderRadius: Radius.lg,
    alignItems: 'center',
    gap: 4,
  },
  harvestEmoji: { fontSize: 30 },
  harvestCrop: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  harvestYield: { fontSize: 16, fontWeight: '800' },
  harvestField: { fontSize: 11, textAlign: 'center' },

  emptyBox: {
    flex: 1,
    padding: 30,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: { fontSize: 13 },

  // Livestock summary
  livestockSummary: { borderRadius: Radius.lg, overflow: 'hidden' },
  livestockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  livestockEmoji: { fontSize: 22 },
  livestockLabel: { flex: 1, fontSize: 14, fontWeight: '600' },
  livestockValue: { fontSize: 16, fontWeight: '800' },
  livestockTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderTopWidth: 1,
  },
  livestockTotalLabel: { flex: 1, fontSize: 15, fontWeight: '800' },
  livestockTotalValue: { fontSize: 20, fontWeight: '900' },
});
