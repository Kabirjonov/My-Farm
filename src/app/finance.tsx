import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useFinance } from '@/features/finance';
import { RoleGuard } from '@/features/auth';
import { useTranslation } from '@/i18n';
import { StatCard, LoadingState, AppTextInput } from '@/components/ui';

export default function FinanceScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const { t, formatEnum } = useTranslation();

  const [activeTab, setActiveTab] = useState<'expenses' | 'incomes'>('expenses');
  const [searchQuery, setSearchQuery] = useState('');

  const { expenses, incomes, summary, isLoading } = useFinance();

  if (isLoading && !summary) {
    return <LoadingState message={`${t('finance')}...`} />;
  }

  const isProfitPositive = (summary?.netProfit || 0) >= 0;

  const filteredExpenses = expenses.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIncomes = incomes.filter(
    (i) =>
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.subTitle, { color: colors.textSecondary }]}>{t('finance')}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{t('finance')}</Text>
        </View>
        <RoleGuard permission="FINANCE_MANAGE">
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() =>
              router.push(
                activeTab === 'expenses'
                  ? ('/finance/add-expense' as any)
                  : ('/finance/add-income' as any)
              )
            }>
            <Plus size={22} color="white" />
          </TouchableOpacity>
        </RoleGuard>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Monthly Summary Cards Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title={t('expensesList')}
            value={`${(summary?.monthlyExpenses || 0).toLocaleString()} so'm`}
            accentColor={colors.danger}
          />
          <StatCard
            title={t('incomesList')}
            value={`${(summary?.monthlyIncomes || 0).toLocaleString()} so'm`}
            accentColor={colors.primary}
          />
          <StatCard
            title={t('netProfit')}
            value={`${(summary?.netProfit || 0).toLocaleString()} so'm`}
            accentColor={isProfitPositive ? colors.primary : colors.danger}
          />
        </View>

        {/* Tab Buttons & Add Shortcuts */}
        <View style={styles.tabHeaderRow}>
          <View style={styles.tabButtonsGroup}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === 'expenses' && { backgroundColor: colors.primaryLight },
              ]}
              onPress={() => setActiveTab('expenses')}>
              <TrendingDown size={16} color={activeTab === 'expenses' ? colors.primary : colors.textSecondary} />
              <Text style={[styles.tabBtnText, { color: activeTab === 'expenses' ? colors.primary : colors.textSecondary }]}>
                {t('expensesList')} ({expenses.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === 'incomes' && { backgroundColor: colors.primaryLight },
              ]}
              onPress={() => setActiveTab('incomes')}>
              <TrendingUp size={16} color={activeTab === 'incomes' ? colors.primary : colors.textSecondary} />
              <Text style={[styles.tabBtnText, { color: activeTab === 'incomes' ? colors.primary : colors.textSecondary }]}>
                {t('incomesList')} ({incomes.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Input */}
        <AppTextInput
          placeholder={t('search')}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* List Section */}
        {activeTab === 'expenses' ? (
          filteredExpenses.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
              <Text style={{ color: colors.textSecondary }}>{t('noData')}</Text>
            </View>
          ) : (
            filteredExpenses.map((exp) => (
              <View key={exp.id} style={[styles.itemCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
                <View style={styles.itemRow}>
                  <View>
                    <Text style={[styles.itemTitle, { color: colors.text }]}>{exp.title}</Text>
                    <Text style={[styles.itemMeta, { color: colors.textSecondary }]}>
                      {formatEnum('exp', exp.category)} • {exp.date}
                    </Text>
                  </View>
                  <Text style={[styles.itemAmount, { color: colors.danger }]}>
                    -{exp.amount.toLocaleString()} so&apos;m
                  </Text>
                </View>
              </View>
            ))
          )
        ) : filteredIncomes.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
            <Text style={{ color: colors.textSecondary }}>{t('noData')}</Text>
          </View>
        ) : (
          filteredIncomes.map((inc) => (
            <View key={inc.id} style={[styles.itemCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
              <View style={styles.itemRow}>
                <View>
                  <Text style={[styles.itemTitle, { color: colors.text }]}>{inc.title}</Text>
                  <Text style={[styles.itemMeta, { color: colors.textSecondary }]}>
                    {formatEnum('inc', inc.category)} • {inc.date}
                  </Text>
                </View>
                <Text style={[styles.itemAmount, { color: colors.primary }]}>
                  +{inc.amount.toLocaleString()} so&apos;m
                </Text>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tabHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabButtonsGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  itemCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  itemMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
});
