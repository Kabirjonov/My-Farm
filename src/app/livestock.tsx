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
import { AppTextInput, StatCard, EmptyState, LoadingState, AppSelect } from '@/components/ui';

export default function LivestockScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

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
    { label: 'Barchasi', value: 'ALL' },
    { label: "Qo'y", value: 'SHEEP' },
    { label: 'Mol', value: 'COW' },
    { label: 'Echki', value: 'GOAT' },
    { label: 'Ot', value: 'HORSE' },
    { label: 'Tovuq', value: 'CHICKEN' },
  ];

  const healthFilterOptions = [
    { label: 'Barcha Holatlar', value: 'ALL' },
    { label: "Sog'lom", value: 'HEALTHY' },
    { label: 'Kasal', value: 'SICK' },
    { label: 'Homilador', value: 'PREGNANT' },
  ];

  if (isLoading && !stats) {
    return <LoadingState message="Chorva ma'lumotlari yuklanmoqda..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.subTitle, { color: colors.textSecondary }]}>Chorva Boshqaruvi</Text>
          <Text style={[styles.title, { color: colors.text }]}>Ferma Hayvonlari</Text>
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
          <StatCard title="Jami Faol Hayvonlar" value={stats?.totalActive || 0} accentColor={colors.primary} />
          <StatCard title="Qo'ylar" value={stats?.byType.SHEEP || 0} accentColor={colors.accentAmber} />
          <StatCard title="Mollar" value={stats?.byType.COW || 0} accentColor={colors.accentBlue} />
          <StatCard title="Homilador / Kasal" value={(stats?.byHealthStatus.PREGNANT || 0) + (stats?.byHealthStatus.SICK || 0)} accentColor={colors.warning} />
        </View>

        {/* Search & Filter Section */}
        <View style={[styles.filterCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
          <AppTextInput
            placeholder="Teg raqami, nomi yoki zotidan qidirish..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Hayvon turi bo&apos;yicha filter:</Text>
          <AppSelect
            options={typeFilterOptions}
            selectedValue={selectedType}
            onValueChange={setSelectedType}
          />

          <Text style={[styles.filterLabel, { color: colors.textSecondary, marginTop: 8 }]}>Sog&apos;liq holati bo&apos;yicha filter:</Text>
          <AppSelect
            options={healthFilterOptions}
            selectedValue={selectedHealth}
            onValueChange={setSelectedHealth}
          />
        </View>

        {/* Animals List Section */}
        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, { color: colors.text }]}>Hayvonlar Ro&apos;yxati ({animals.length})</Text>
        </View>

        {animals.length === 0 ? (
          <EmptyState
            title="Hayvonlar topilmadi"
            description="Qidiruv natijasiga mos keladigan hayvon yaratilmagan."
            actionTitle="Yangi Hayvon Qo'shish"
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
                    {item.healthStatus}
                  </Text>
                </View>
              </View>
              <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>
                Turi: {item.type} • Zoti: {item.breed} • Vazn: {item.weightKg} kg
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
