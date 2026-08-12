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
  TrendingUp,
  Sparkles,
  Award,
  DollarSign,
  Droplets,
  Calendar,
  AlertCircle,
  CheckCircle,
  Leaf,
  BarChart2,
} from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { INITIAL_HARVESTS, INITIAL_FIELDS } from '@/services/farmStore';

export default function AnalyticsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const totalYieldKg = INITIAL_HARVESTS.reduce((sum, h) => sum + h.yieldKg, 0);
  const totalRevenue = INITIAL_HARVESTS.reduce((sum, h) => sum + h.revenueEst, 0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Analytics & AI Agronomist</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Harvest yield history, revenue trends & crop intelligence
        </Text>
      </View>

      {/* AI Smart Agronomist Banner */}
      <View
        style={[
          styles.aiCard,
          { backgroundColor: colors.backgroundElement, borderColor: colors.primary },
        ]}>
        <View style={styles.aiHeader}>
          <View style={[styles.aiBadge, { backgroundColor: colors.primaryLight }]}>
            <Sparkles size={16} color={colors.primary} />
            <Text style={[styles.aiBadgeText, { color: colors.primary }]}>AI Smart Advisor</Text>
          </View>
          <Text style={[styles.aiTime, { color: colors.textSecondary }]}>Updated Today</Text>
        </View>

        <Text style={[styles.aiTitle, { color: colors.text }]}>
          Optimal Harvest Window for Sweet Soybeans (South Field C)
        </Text>
        <Text style={[styles.aiText, { color: colors.textSecondary }]}>
          Weather forecasts indicate clear dry days for the next 72 hours. Soil moisture levels are
          at ideal 72%. Harvesting now will minimize pod shattering loss and maximize Grade A+ crop yield.
        </Text>

        <View style={styles.aiTipsRow}>
          <View style={[styles.tipChip, { backgroundColor: colors.backgroundSelected }]}>
            <Leaf size={12} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.text }]}>Rotate Field A to Clover next</Text>
          </View>
          <View style={[styles.tipChip, { backgroundColor: colors.backgroundSelected }]}>
            <Droplets size={12} color="#0284C7" />
            <Text style={[styles.tipText, { color: colors.text }]}>+15% Drip cycle for Tomatoes</Text>
          </View>
        </View>
      </View>

      {/* Financial & Yield Overview */}
      <View style={styles.statsRow}>
        <View
          style={[
            styles.statBox,
            { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder },
          ]}>
          <View style={[styles.statIcon, { backgroundColor: '#DCFCE7' }]}>
            <DollarSign size={20} color="#16A34A" />
          </View>
          <Text style={[styles.statNum, { color: colors.text }]}>
            ${totalRevenue.toLocaleString()}
          </Text>
          <Text style={[styles.statSub, { color: colors.textSecondary }]}>Est. Season Revenue</Text>
        </View>

        <View
          style={[
            styles.statBox,
            { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder },
          ]}>
          <View style={[styles.statIcon, { backgroundColor: '#E0F2FE' }]}>
            <BarChart2 size={20} color="#0284C7" />
          </View>
          <Text style={[styles.statNum, { color: colors.text }]}>
            {totalYieldKg.toLocaleString()} kg
          </Text>
          <Text style={[styles.statSub, { color: colors.textSecondary }]}>Total Produce Harvested</Text>
        </View>
      </View>

      {/* Crop Yield Distribution */}
      <View
        style={[
          styles.sectionBox,
          { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder },
        ]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Field Resource Utilization
        </Text>

        <View style={styles.resRow}>
          <View style={styles.resMeta}>
            <Text style={[styles.resLabel, { color: colors.text }]}>💧 Water Consumption</Text>
            <Text style={[styles.resVal, { color: colors.textSecondary }]}>
              3,450 Gallons (This Month)
            </Text>
          </View>
          <View style={[styles.barBg, { backgroundColor: colors.backgroundSelected }]}>
            <View style={[styles.barFill, { width: '65%', backgroundColor: '#0284C7' }]} />
          </View>
        </View>

        <View style={styles.resRow}>
          <View style={styles.resMeta}>
            <Text style={[styles.resLabel, { color: colors.text }]}>🌱 Bio Fertilizer Applied</Text>
            <Text style={[styles.resVal, { color: colors.textSecondary }]}>480 kg (Organic Nitrogren)</Text>
          </View>
          <View style={[styles.barBg, { backgroundColor: colors.backgroundSelected }]}>
            <View style={[styles.barFill, { width: '45%', backgroundColor: '#16A34A' }]} />
          </View>
        </View>
      </View>

      {/* Recent Harvest History */}
      <View style={styles.historyHeader}>
        <Text style={[styles.historyTitle, { color: colors.text }]}>Recent Harvest Log</Text>
        <Award size={18} color={colors.accentAmber} />
      </View>

      {INITIAL_HARVESTS.map((h) => (
        <View
          key={h.id}
          style={[
            styles.harvestCard,
            { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder },
          ]}>
          <View style={styles.harvestTop}>
            <View>
              <Text style={[styles.cropTitle, { color: colors.text }]}>{h.cropType}</Text>
              <Text style={[styles.fieldName, { color: colors.textSecondary }]}>
                {h.fieldName} • {h.date}
              </Text>
            </View>

            <View style={[styles.gradeBadge, { backgroundColor: '#FEF3C7' }]}>
              <Text style={{ color: '#D97706', fontWeight: '800', fontSize: 12 }}>
                Grade {h.qualityGrade}
              </Text>
            </View>
          </View>

          <View style={styles.harvestStats}>
            <View style={styles.hStatItem}>
              <Text style={[styles.hStatVal, { color: colors.text }]}>{h.yieldKg} kg</Text>
              <Text style={[styles.hStatSub, { color: colors.textSecondary }]}>Harvested Weight</Text>
            </View>

            <View style={styles.hStatItem}>
              <Text style={[styles.hStatVal, { color: colors.primary }]}>${h.revenueEst}</Text>
              <Text style={[styles.hStatSub, { color: colors.textSecondary }]}>Est. Market Value</Text>
            </View>
          </View>
        </View>
      ))}

      <View style={{ height: 100 }} />
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
  },
  header: {
    marginBottom: Spacing.three,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  aiCard: {
    padding: Spacing.three,
    borderRadius: 18,
    borderWidth: 1.5,
    marginBottom: Spacing.three,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  aiTime: {
    fontSize: 11,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  aiText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  aiTipsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tipChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Spacing.three,
  },
  statBox: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: 16,
    borderWidth: 1,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNum: {
    fontSize: 20,
    fontWeight: '800',
  },
  statSub: {
    fontSize: 11,
    marginTop: 2,
  },
  sectionBox: {
    padding: Spacing.three,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  resRow: {
    marginBottom: 12,
  },
  resMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  resLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  resVal: {
    fontSize: 12,
  },
  barBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  harvestCard: {
    padding: Spacing.three,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  harvestTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cropTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  fieldName: {
    fontSize: 12,
    marginTop: 2,
  },
  gradeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  harvestStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#E2E8F022',
  },
  hStatItem: {},
  hStatVal: {
    fontSize: 14,
    fontWeight: '700',
  },
  hStatSub: {
    fontSize: 10,
  },
});
