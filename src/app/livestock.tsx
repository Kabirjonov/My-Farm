import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useColorScheme,
} from 'react-native';
import { Plus, Search, SlidersHorizontal } from 'lucide-react-native';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useLivestock } from '@/features/livestock';
import { RoleGuard } from '@/features/auth';
import { useTranslation } from '@/i18n';
import { LoadingState } from '@/components/ui';

const ANIMAL_EMOJI: Record<string, string> = {
  SHEEP: '🐑',
  COW: '🐄',
  GOAT: '🐐',
  HORSE: '🐎',
  CHICKEN: '🐓',
  OTHER: '🐾',
};

export default function LivestockScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const { t, formatEnum } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedHealth, setSelectedHealth] = useState('ALL');

  const filterOptions = {
    searchQuery: searchQuery || undefined,
    type: selectedType !== 'ALL' ? selectedType : undefined,
    healthStatus: selectedHealth !== 'ALL' ? selectedHealth : undefined,
    sortBy: 'createdAt' as const,
  };

  const { animals, stats, isLoading } = useLivestock(filterOptions);

  const typeFilters = [
    { label: t('all'), value: 'ALL' },
    { label: t('typeSHEEP'), value: 'SHEEP' },
    { label: t('typeCOW'), value: 'COW' },
    { label: t('typeGOAT'), value: 'GOAT' },
  ];

  const healthFilters = [
    { label: t('all'), value: 'ALL' },
    { label: t('healthHEALTHY'), value: 'HEALTHY' },
    { label: t('healthSICK'), value: 'SICK' },
    { label: t('healthPREGNANT'), value: 'PREGNANT' },
  ];

  if (isLoading && !stats) {
    return <LoadingState message={`${t('livestock')}...`} />;
  }

  const getHealthBadgeStyle = (health: string) => {
    switch (health) {
      case 'HEALTHY': return { bg: C.successLight, text: C.success };
      case 'SICK': return { bg: C.dangerLight, text: C.danger };
      case 'PREGNANT': return { bg: '#FFF3E0', text: C.accentAmber };
      case 'TREATMENT': return { bg: '#E3F2FD', text: C.accentBlue };
      default: return { bg: C.backgroundSelected, text: C.textSecondary };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Fixed Header */}
      <View style={[styles.header, { backgroundColor: C.backgroundElement, borderBottomColor: C.divider }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerSub, { color: C.textSecondary }]}>{t('livestock')}</Text>
            <Text style={[styles.headerTitle, { color: C.text }]}>{t('totalAnimals')}</Text>
          </View>
          <RoleGuard permission="ANIMAL_CREATE">
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: C.primary }]}
              onPress={() => router.push('/animals/edit')}>
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          </RoleGuard>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: C.background, borderColor: C.cardBorder }]}>
          <Search size={16} color={C.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: C.text }]}
            placeholder={t('search')}
            placeholderTextColor={C.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity>
            <SlidersHorizontal size={16} color={C.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Type Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {typeFilters.map((f) => (
            <TouchableOpacity
              key={f.value}
              onPress={() => setSelectedType(f.value)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: selectedType === f.value ? C.primary : C.background,
                  borderColor: selectedType === f.value ? C.primary : C.cardBorder,
                },
              ]}>
              <Text style={[
                styles.filterChipText,
                { color: selectedType === f.value ? '#fff' : C.textSecondary },
              ]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
          {healthFilters.slice(1).map((f) => (
            <TouchableOpacity
              key={`h-${f.value}`}
              onPress={() => setSelectedHealth(selectedHealth === f.value ? 'ALL' : f.value)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: selectedHealth === f.value ? C.dangerLight : C.background,
                  borderColor: selectedHealth === f.value ? C.danger : C.cardBorder,
                },
              ]}>
              <Text style={[
                styles.filterChipText,
                { color: selectedHealth === f.value ? C.danger : C.textSecondary },
              ]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { label: t('totalAnimals'), value: stats?.totalActive || 0, color: C.primary },
            { label: t('typeSHEEP'), value: stats?.byType?.SHEEP || 0, color: '#795548' },
            { label: t('typeCOW'), value: stats?.byType?.COW || 0, color: C.accentBlue },
            { label: t('healthSICK'), value: (stats?.byHealthStatus?.SICK || 0), color: C.danger },
          ].map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: C.textSecondary }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* List count */}
        <Text style={[styles.listCount, { color: C.textSecondary }]}>
          {animals.length} ta hayvon topildi
        </Text>

        {/* Animal Cards */}
        {animals.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: C.backgroundElement, borderColor: C.cardBorder }]}>
            <Text style={{ fontSize: 40 }}>🐾</Text>
            <Text style={[styles.emptyTitle, { color: C.text }]}>{t('noData')}</Text>
            <Text style={[styles.emptyText, { color: C.textSecondary }]}>
              Hayvon qo'shish uchun + tugmasini bosing
            </Text>
          </View>
        ) : (
          animals.map((item) => {
            const badge = getHealthBadgeStyle(item.healthStatus);
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() => router.push({ pathname: '/animals/[id]', params: { id: item.id } })}
                style={[styles.animalCard, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>

                {/* Animal Icon */}
                <View style={[styles.animalIconBox, { backgroundColor: C.successLight }]}>
                  <Text style={styles.animalEmoji}>{ANIMAL_EMOJI[item.type] || '🐾'}</Text>
                </View>

                {/* Animal Info */}
                <View style={styles.animalInfo}>
                  <View style={styles.animalTopRow}>
                    <Text style={[styles.animalName, { color: C.text }]}>
                      {item.name || item.breed}
                    </Text>
                    <View style={[styles.healthBadge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.healthBadgeText, { color: badge.text }]}>
                        {formatEnum('health', item.healthStatus)}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.animalTag, { color: C.primary }]}>{item.tagNumber}</Text>

                  <View style={styles.animalMeta}>
                    <Text style={[styles.animalMetaText, { color: C.textSecondary }]}>
                      🏷️ {formatEnum('type', item.type)}
                    </Text>
                    <Text style={[styles.animalMetaDot, { color: C.textMuted }]}>·</Text>
                    <Text style={[styles.animalMetaText, { color: C.textSecondary }]}>
                      {item.breed}
                    </Text>
                    <Text style={[styles.animalMetaDot, { color: C.textMuted }]}>·</Text>
                    <Text style={[styles.animalMetaText, { color: C.textSecondary }]}>
                      ⚖️ {item.weightKg} kg
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
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
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerSub: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  headerTitle: { fontSize: 22, fontWeight: '800', marginTop: 2 },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 14 },

  filterScroll: { paddingHorizontal: 16, paddingBottom: 10 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    marginRight: 8,
  },
  filterChipText: { fontSize: 12, fontWeight: '700' },

  content: {
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 10,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  statCard: {
    flex: 1,
    padding: 10,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 10, fontWeight: '600', marginTop: 2, textAlign: 'center' },

  listCount: { fontSize: 13, fontWeight: '500', marginBottom: 4 },

  emptyBox: {
    padding: 40,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptyText: { fontSize: 13, textAlign: 'center' },

  animalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: Radius.lg,
  },
  animalIconBox: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animalEmoji: { fontSize: 28 },
  animalInfo: { flex: 1 },
  animalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  animalName: { fontSize: 15, fontWeight: '700', flex: 1 },
  animalTag: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  animalMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  animalMetaText: { fontSize: 12 },
  animalMetaDot: { fontSize: 12 },

  healthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  healthBadgeText: { fontSize: 11, fontWeight: '700' },
});
