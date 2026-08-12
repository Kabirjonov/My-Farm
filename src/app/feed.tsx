import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Plus, AlertTriangle } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useFeed } from '@/features/feed';
import { RoleGuard } from '@/features/auth';
import { AppTextInput, StatCard, EmptyState, LoadingState } from '@/components/ui';

export default function FeedScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const { items, stats, isLoading } = useFeed();

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading && !stats) {
    return <LoadingState message="Yem zaxirasi ma'lumotlari yuklanmoqda..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.subTitle, { color: colors.textSecondary }]}>Ozuqa Boshqaruvi</Text>
          <Text style={[styles.title, { color: colors.text }]}>Yem Zaxirasi</Text>
        </View>
        <RoleGuard permission="FEED_MANAGE">
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/feed/edit' as any)}>
            <Plus size={22} color="white" />
          </TouchableOpacity>
        </RoleGuard>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Dashboard Summary Cards */}
        <View style={styles.statsGrid}>
          <StatCard title="Jami Yem Turlari" value={stats?.totalTypes || 0} accentColor={colors.primary} />
          <StatCard title="Kam Qolgan Yemlar" value={stats?.lowStockCount || 0} accentColor={colors.danger} />
          <StatCard title="Bugungi Chiqim" value={stats?.totalOutToday || 0} accentColor={colors.warning} />
        </View>

        {/* Search Bar */}
        <AppTextInput
          placeholder="Yem nomi bo'yicha qidirish..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* List Section Header */}
        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, { color: colors.text }]}>Yem Qoldiqlari Ro&apos;yxati ({filteredItems.length})</Text>
        </View>

        {filteredItems.length === 0 ? (
          <EmptyState
            title="Yem turi topilmadi"
            description="Qidiruv natijasiga mos yozuv yaratilmagan."
            actionTitle="Yangi Yem Qo'shish"
            onAction={() => router.push('/feed/edit' as any)}
          />
        ) : (
          filteredItems.map((item) => {
            const isLowStock = item.currentQuantity <= item.minQuantity;

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => router.push({ pathname: '/feed/[id]' as any, params: { id: item.id } })}
                style={[styles.feedCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.feedName, { color: colors.text }]}>{item.name}</Text>
                  {isLowStock && (
                    <View style={[styles.badge, { backgroundColor: '#FEE2E2' }]}>
                      <AlertTriangle size={12} color={colors.danger} />
                      <Text style={[styles.badgeText, { color: colors.danger }]}>Kam Qoldi</Text>
                    </View>
                  )}
                </View>

                <View style={styles.cardRow}>
                  <Text style={[styles.qtyText, { color: colors.primary }]}>
                    {item.currentQuantity} {item.unit}
                  </Text>
                  <Text style={[styles.minText, { color: colors.textSecondary }]}>
                    Minimal chegara: {item.minQuantity} {item.unit}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
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
  listHeader: {
    marginVertical: 4,
  },
  listTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  feedCard: {
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
  feedName: {
    fontSize: 17,
    fontWeight: '700',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 18,
    fontWeight: '800',
  },
  minText: {
    fontSize: 12,
  },
});
