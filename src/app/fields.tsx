import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useLand } from '@/features/crops';
import { RoleGuard } from '@/features/auth';
import { useTranslation } from '@/i18n';
import { AppTextInput, StatCard, EmptyState, LoadingState } from '@/components/ui';

export default function FieldsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const { t, formatEnum } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const { fields, stats, isLoading } = useLand();

  const filteredFields = fields.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading && !stats) {
    return <LoadingState message={`${t('fields')}...`} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.subTitle, { color: colors.textSecondary }]}>{t('fields')}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{t('activeLand')}</Text>
        </View>
        <RoleGuard permission="LAND_MANAGE">
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/fields/edit' as any)}>
            <Plus size={22} color="white" />
          </TouchableOpacity>
        </RoleGuard>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Dashboard Stats */}
        <View style={styles.statsGrid}>
          <StatCard title={t('activeLand')} value={`${stats?.totalAreaHectares || 0} ga`} accentColor={colors.primary} />
          <StatCard title={t('cropHistory')} value={stats?.activeCropsCount || 0} accentColor={colors.accentAmber} />
          <StatCard title={t('expectedHarvest')} value={stats?.upcomingHarvestsCount || 0} accentColor={colors.accentBlue} />
        </View>

        {/* Search Bar */}
        <AppTextInput
          placeholder={t('search')}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* List Section Header */}
        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, { color: colors.text }]}>{t('fields')} ({filteredFields.length})</Text>
        </View>

        {filteredFields.length === 0 ? (
          <EmptyState
            title={t('fields')}
            description={t('noData')}
            actionTitle={t('addField')}
            onAction={() => router.push('/fields/edit' as any)}
          />
        ) : (
          filteredFields.map((field) => (
            <TouchableOpacity
              key={field.id}
              activeOpacity={0.8}
              onPress={() => router.push({ pathname: '/crops/[id]' as any, params: { id: field.id } })}
              style={[styles.fieldCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.fieldName, { color: colors.text }]}>{field.name}</Text>
                <View style={[styles.areaBadge, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.areaText, { color: colors.primary }]}>
                    {field.area} {formatEnum('unit', field.areaUnit)}
                  </Text>
                </View>
              </View>

              <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>
                {t('location')}: {field.location || "-"} • {t('soilType')}: {field.soilType || '-'}
              </Text>
            </TouchableOpacity>
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
  listHeader: {
    marginVertical: 4,
  },
  listTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  fieldCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldName: {
    fontSize: 17,
    fontWeight: '700',
  },
  areaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  areaText: {
    fontSize: 12,
    fontWeight: '800',
  },
  cardMeta: {
    fontSize: 13,
  },
});
