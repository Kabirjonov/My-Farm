import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { BarChart2, AlertCircle, TrendingUp, HeartPulse, Sprout } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useFinance } from '@/features/finance';
import { useTranslation } from '@/i18n';
import { LoadingState } from '@/components/ui';

export default function ReportsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { reportsData, isLoading } = useFinance();
  const { t, formatEnum } = useTranslation();

  if (isLoading || !reportsData) {
    return <LoadingState message={`${t('reports')}...`} />;
  }

  const {
    livestockReport,
    lowStockReport,
    cropYieldReport,
    monthlyProfitReport,
    healthCostReport,
  } = reportsData;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <BarChart2 size={28} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>{t('reports')}</Text>
      </View>

      {/* Report 1: Monthly Profit Report */}
      <View style={[styles.reportCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
        <View style={styles.cardHeader}>
          <TrendingUp size={20} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t('netProfit')}</Text>
        </View>
        {monthlyProfitReport.length === 0 ? (
          <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{t('noData')}</Text>
        ) : (
          monthlyProfitReport.map((m) => (
            <View key={m.month} style={styles.rowBetween}>
              <Text style={[styles.labelBold, { color: colors.text }]}>{m.month}</Text>
              <Text style={[styles.valueBold, { color: m.profit >= 0 ? colors.primary : colors.danger }]}>
                {m.profit >= 0 ? '+' : ''}{m.profit.toLocaleString()} so&apos;m
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Report 2: Livestock Count Report */}
      <View style={[styles.reportCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
        <View style={styles.cardHeader}>
          <BarChart2 size={20} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t('totalAnimals')}</Text>
        </View>
        {livestockReport.length === 0 ? (
          <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{t('noData')}</Text>
        ) : (
          livestockReport.map((item) => (
            <View key={item.type} style={styles.rowBetween}>
              <Text style={[styles.bodyText, { color: colors.text }]}>{formatEnum('type', item.type)}</Text>
              <Text style={[styles.labelBold, { color: colors.primary }]}>{item.count}</Text>
            </View>
          ))
        )}
      </View>

      {/* Report 3: Feed Low Stock Report */}
      <View style={[styles.reportCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
        <View style={styles.cardHeader}>
          <AlertCircle size={20} color={colors.danger} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t('lowStockFeed')}</Text>
        </View>
        {lowStockReport.length === 0 ? (
          <Text style={[styles.bodyText, { color: colors.primary }]}>{t('success')}</Text>
        ) : (
          lowStockReport.map((feed) => (
            <View key={feed.id} style={styles.rowBetween}>
              <Text style={[styles.bodyText, { color: colors.text }]}>{feed.name}</Text>
              <Text style={[styles.labelBold, { color: colors.danger }]}>
                {feed.currentQuantity} / min {feed.minQuantity} {feed.unit}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Report 4: Crop Yield Comparison Report */}
      <View style={[styles.reportCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
        <View style={styles.cardHeader}>
          <Sprout size={20} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t('cropHistory')}</Text>
        </View>
        {cropYieldReport.length === 0 ? (
          <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{t('noData')}</Text>
        ) : (
          cropYieldReport.map((c, idx) => (
            <View key={idx} style={styles.rowBetween}>
              <Text style={[styles.bodyText, { color: colors.text }]}>{c.cropName}</Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                {t('expectedHarvest')}: {c.expected} {c.unit} | {t('quantity')}: {c.actual} {c.unit}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Report 5: Animal Health Cost Report */}
      <View style={[styles.reportCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
        <View style={styles.cardHeader}>
          <HeartPulse size={20} color={colors.warning} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t('healthAction')}</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={[styles.bodyText, { color: colors.text }]}>{t('total')}:</Text>
          <Text style={[styles.labelBold, { color: colors.text }]}>{healthCostReport.recordCount}</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={[styles.bodyText, { color: colors.text }]}>{t('amount')}:</Text>
          <Text style={[styles.labelBold, { color: colors.danger }]}>
            {healthCostReport.totalHealthCost.toLocaleString()} so&apos;m
          </Text>
        </View>
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
  reportCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  labelBold: {
    fontSize: 14,
    fontWeight: '700',
  },
  valueBold: {
    fontSize: 15,
    fontWeight: '800',
  },
  bodyText: {
    fontSize: 13,
  },
});
