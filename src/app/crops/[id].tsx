import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Plus, Sprout, ShoppingBag } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { landService, useLand } from '@/features/crops';
import { RoleGuard } from '@/features/auth';
import { ErrorState } from '@/components/ui';

export default function FieldDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const field = id ? landService.getFieldById(id) : null;
  const { cropSeasons } = useLand(id);

  if (!field) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <ErrorState title="Topilmadi" error="Ko'rsatilgan yer maydoni bazada topilmadi." />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{field.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Field Main Card */}
        <View style={[styles.mainCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.fieldName, { color: colors.text }]}>{field.name}</Text>
              <Text style={[styles.fieldMeta, { color: colors.textSecondary }]}>Joylashuv: {field.location || "Ko'rsatilmagan"}</Text>
            </View>
            <View style={[styles.areaBadge, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.areaText, { color: colors.primary }]}>{field.area} {field.areaUnit}</Text>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.gridItem}>
              <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>TUPROQ TURI</Text>
              <Text style={[styles.gridValue, { color: colors.text }]}>{field.soilType || 'Oddiy'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>SUVORISH MANBAI</Text>
              <Text style={[styles.gridValue, { color: colors.text }]}>{field.waterSource || 'Arik/Kanal'}</Text>
            </View>
          </View>

          <RoleGuard permission="LAND_MANAGE">
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push({ pathname: '/fields/add-crop' as any, params: { fieldId: field.id } })}>
              <Plus size={18} color="white" />
              <Text style={styles.actionBtnText}>Yangi Ekin Ekish (Crop Season)</Text>
            </TouchableOpacity>
          </RoleGuard>
        </View>

        {/* Crop Seasons Timeline */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ekin Mavsumlari Tarixi ({cropSeasons.length})</Text>
        </View>

        {cropSeasons.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
            <Text style={{ color: colors.textSecondary }}>Hozircha ekilgan ekinlar tarixi yo&apos;q.</Text>
          </View>
        ) : (
          cropSeasons.map((crop) => (
            <View key={crop.id} style={[styles.cropCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
              <View style={styles.cropCardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Sprout size={20} color={colors.primary} />
                  <Text style={[styles.cropName, { color: colors.text }]}>{crop.cropName} ({crop.seasonYear})</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: crop.status === 'HARVESTED' ? colors.primaryLight : '#FEF3C7' }]}>
                  <Text style={[styles.statusText, { color: crop.status === 'HARVESTED' ? colors.primary : colors.warning }]}>
                    {crop.status}
                  </Text>
                </View>
              </View>

              <Text style={[styles.cropMeta, { color: colors.textSecondary }]}>
                Ekilgan sana: {crop.plantedDate} • Kutilgan yig&apos;im: {crop.expectedHarvestDate || "Ko'rsatilmagan"}
              </Text>

              {crop.expectedYield ? (
                <Text style={[styles.yieldText, { color: colors.primary }]}>
                  Kutilayotgan hosil: {crop.expectedYield} {crop.expectedYieldUnit || 'tonna'}
                </Text>
              ) : null}

              {/* Add Harvest Button */}
              <RoleGuard permission="LAND_MANAGE">
                <TouchableOpacity
                  style={[styles.miniHarvestBtn, { backgroundColor: colors.accentAmber }]}
                  onPress={() => router.push({ pathname: '/fields/add-harvest' as any, params: { cropSeasonId: crop.id } })}>
                  <ShoppingBag size={14} color="white" />
                  <Text style={styles.miniHarvestText}>Hosil Yig&apos;imini Kiritish</Text>
                </TouchableOpacity>
              </RoleGuard>
            </View>
          ))
        )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  mainCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  fieldName: {
    fontSize: 20,
    fontWeight: '800',
  },
  fieldMeta: {
    fontSize: 13,
    marginTop: 2,
  },
  areaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  areaText: {
    fontSize: 13,
    fontWeight: '800',
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  gridItem: {
    flex: 1,
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    marginTop: 6,
  },
  actionBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionHeader: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyBox: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cropCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  cropCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cropName: {
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
  cropMeta: {
    fontSize: 13,
  },
  yieldText: {
    fontSize: 14,
    fontWeight: '700',
  },
  miniHarvestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 6,
  },
  miniHarvestText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
});
