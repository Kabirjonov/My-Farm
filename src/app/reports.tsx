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
import { LoadingState } from '@/components/ui';

export default function ReportsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { reportsData, isLoading } = useFinance();

  if (isLoading || !reportsData) {
    return <LoadingState message="Ferma hisobotlari shakllantirilmoqda..." />;
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
        <Text style={[styles.title, { color: colors.text }]}>Ferma Tahlili va Hisobotlar</Text>
      </View>

      {/* Report 1: Monthly Profit Report */}
      <View style={[styles.reportCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
        <View style={styles.cardHeader}>
          <TrendingUp size={20} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Oylik Sof Foyda Hisoboti</Text>
        </View>
        {monthlyProfitReport.length === 0 ? (
          <Text style={[styles.bodyText, { color: colors.textSecondary }]}>Tranzaksiyalar mavjud emas.</Text>
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
          <Text style={[styles.cardTitle, { color: colors.text }]}>Chorva Bosh Soni Tahlili (Turlar bo&apos;yicha)</Text>
        </View>
        {livestockReport.length === 0 ? (
          <Text style={[styles.bodyText, { color: colors.textSecondary }]}>Faol chorvalar yo&apos;q.</Text>
        ) : (
          livestockReport.map((item) => (
            <View key={item.type} style={styles.rowBetween}>
              <Text style={[styles.bodyText, { color: colors.text }]}>{item.type}</Text>
              <Text style={[styles.labelBold, { color: colors.primary }]}>{item.count} bosh</Text>
            </View>
          ))
        )}
      </View>

      {/* Report 3: Feed Low Stock Report */}
      <View style={[styles.reportCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
        <View style={styles.cardHeader}>
          <AlertCircle size={20} color={colors.danger} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Kam Qolgan Ozuqalar Hisoboti</Text>
        </View>
        {lowStockReport.length === 0 ? (
          <Text style={[styles.bodyText, { color: colors.primary }]}>Barcha yem turlari zaxirada yetarli!</Text>
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
          <Text style={[styles.cardTitle, { color: colors.text }]}>Ekin Hosildorligi (Kutilgan vs Haqiqiy)</Text>
        </View>
        {cropYieldReport.length === 0 ? (
          <Text style={[styles.bodyText, { color: colors.textSecondary }]}>Ekin mavsumlari yaratilmagan.</Text>
        ) : (
          cropYieldReport.map((c, idx) => (
            <View key={idx} style={styles.rowBetween}>
              <Text style={[styles.bodyText, { color: colors.text }]}>{c.cropName}</Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                Kutilgan: {c.expected} {c.unit} | Haqiqiy: {c.actual} {c.unit}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Report 5: Animal Health Cost Report */}
      <View style={[styles.reportCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
        <View style={styles.cardHeader}>
          <HeartPulse size={20} color={colors.warning} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Veterinariya va Davolash Xarajatlari</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={[styles.bodyText, { color: colors.text }]}>Jami Davolash Yozuvlari:</Text>
          <Text style={[styles.labelBold, { color: colors.text }]}>{healthCostReport.recordCount} ta</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={[styles.bodyText, { color: colors.text }]}>Umumiy Tibbiy Xarajat:</Text>
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
