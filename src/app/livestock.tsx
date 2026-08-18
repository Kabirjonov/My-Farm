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
import { useLivestock } from '@/features/livestock';
import { RoleGuard } from '@/features/auth';
import { useTranslation } from '@/i18n';
import { AppTextInput, StatCard, EmptyState, LoadingState, AppSelect } from '@/components/ui';

export default function LivestockScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const { t, formatEnum } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedHealth, setSelectedHealth] = useState('ALL');
  const [sortBy] = useState<'createdAt' | 'birthDate' | 'weightKg'>('createdAt');

  const filterOptions = {
    searchQuery: searchQuery || undefined,
    type: selectedType !== 'ALL' ? selectedType : undefined,
    healthStatus: selectedHealth !== 'ALL' ? selectedHealth : undefined,
    sortBy,
  };

  const { animals, stats, isLoading } = useLivestock(filterOptions);

  const typeFilterOptions = [
    { label: t('all'), value: 'ALL' },
    { label: formatEnum('type', 'SHEEP'), value: 'SHEEP' },
    { label: formatEnum('type', 'COW'), value: 'COW' },
    { label: formatEnum('type', 'GOAT'), value: 'GOAT' },
    { label: formatEnum('type', 'HORSE'), value: 'HORSE' },
    { label: formatEnum('type', 'CHICKEN'), value: 'CHICKEN' },
  ];

  const healthFilterOptions = [
    { label: t('all'), value: 'ALL' },
    { label: formatEnum('health', 'HEALTHY'), value: 'HEALTHY' },
    { label: formatEnum('health', 'SICK'), value: 'SICK' },
    { label: formatEnum('health', 'PREGNANT'), value: 'PREGNANT' },
  ];

  if (isLoading && !stats) {
    return <LoadingState message={`${t('livestock')}...`} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.subTitle, { color: colors.textSecondary }]}>{t('livestock')}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{t('totalAnimals')}</Text>
        </View>
        <RoleGuard permission="ANIMAL_CREATE">
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/animals/edit')}>
            <Plus size={22} color="white" />
          </TouchableOpacity>
        </RoleGuard>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Dashboard Stats Summary Grid */}
        <View style={styles.statsGrid}>
          <StatCard title={t('totalAnimals')} value={stats?.totalActive || 0} accentColor={colors.primary} />
          <StatCard title={t('typeSHEEP')} value={stats?.byType.SHEEP || 0} accentColor={colors.accentAmber} />
          <StatCard title={t('typeCOW')} value={stats?.byType.COW || 0} accentColor={colors.accentBlue} />
          <StatCard title={t('sickPregnant')} value={(stats?.byHealthStatus.PREGNANT || 0) + (stats?.byHealthStatus.SICK || 0)} accentColor={colors.warning} />
        </View>

        {/* Search & Filter Section */}
        <View style={[styles.filterCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
          <AppTextInput
            placeholder={t('search')}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>{t('typeOTHER')}:</Text>
          <AppSelect
            options={typeFilterOptions}
            selectedValue={selectedType}
            onValueChange={setSelectedType}
          />

          <Text style={[styles.filterLabel, { color: colors.textSecondary, marginTop: 8 }]}>{t('status')}:</Text>
          <AppSelect
            options={healthFilterOptions}
            selectedValue={selectedHealth}
            onValueChange={setSelectedHealth}
          />
        </View>

        {/* Animals List Section */}
        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, { color: colors.text }]}>{t('livestock')} ({animals.length})</Text>
        </View>

        {animals.length === 0 ? (
          <EmptyState
            title={t('livestock')}
            description={t('search')}
            actionTitle={t('addAnimal')}
            onAction={() => router.push('/animals/edit')}
          />
        ) : (
          animals.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => router.push({ pathname: '/animals/[id]', params: { id: item.id } })}
              style={[styles.animalCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={[styles.tagNumber, { color: colors.primary }]}>{item.tagNumber}</Text>
                  <Text style={[styles.animalName, { color: colors.text }]}>{item.name || item.breed}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.healthStatus === 'HEALTHY' ? colors.primaryLight : '#FEF3C7' }]}>
                  <Text style={[styles.statusText, { color: item.healthStatus === 'HEALTHY' ? colors.primary : colors.warning }]}>
                    {formatEnum('health', item.healthStatus)}
                  </Text>
                </View>
              </View>
              <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>
                {formatEnum('type', item.type)} • {item.breed} • {item.weightKg} kg
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
    fontSize: 24,
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
  filterCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  listHeader: {
    marginVertical: 4,
  },
  listTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  animalCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tagNumber: {
    fontSize: 12,
    fontWeight: '800',
  },
  animalName: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardMeta: {
    fontSize: 13,
  },
});
