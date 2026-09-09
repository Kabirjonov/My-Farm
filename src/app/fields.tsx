import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { MapPin, Plus, Calendar, Leaf } from 'lucide-react-native';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useLand } from '@/features/crops';
import { RoleGuard } from '@/features/auth';
import { useTranslation } from '@/i18n';
import { LoadingState } from '@/components/ui';

const CROP_STATUS_CONFIG: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  GROWING:    { label: "O\u2019smoqda",   emoji: '🌱', color: '#2E7D32', bg: '#E8F5E9' },
  HARVESTED:  { label: "Yig\u2019ildi",   emoji: '✅', color: '#1565C0', bg: '#E3F2FD' },
  PLANTED:    { label: 'Ekildi',           emoji: '🌾', color: '#E65100', bg: '#FFF3E0' },
  FALLOW:     { label: 'Dam olmoqda',      emoji: '🏕️', color: '#6D4C41', bg: '#EFEBE9' },
  FAILED:     { label: 'Yaroqsiz',         emoji: '❌', color: '#C62828', bg: '#FFEBEE' },
};


export default function FieldsScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const { t, formatEnum } = useTranslation();

  const { fields, stats, isLoading } = useLand();

  if (isLoading) {
    return <LoadingState message={`${t('fields')}...`} />;
  }

  const totalArea = fields.reduce((s, f) => s + f.area, 0);

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.backgroundElement, borderBottomColor: C.divider }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={[styles.headerIconBg, { backgroundColor: C.successLight }]}>
              <MapPin size={20} color={C.primary} />
            </View>
            <View>
              <Text style={[styles.headerSub, { color: C.textSecondary }]}>{t('fields')}</Text>
              <Text style={[styles.headerTitle, { color: C.text }]}>{t('yerVaEkinlar')}</Text>
            </View>
          </View>
          <RoleGuard permission="LAND_MANAGE">
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: C.primary }]}
              onPress={() => router.push('/fields/edit' as any)}>
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          </RoleGuard>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: t('totalFields'), value: `${fields.length} ta`, color: C.primary, bg: C.successLight },
            { label: t('totalArea'), value: `${totalArea.toFixed(1)} ga`, color: C.accentBlue, bg: '#E3F2FD' },
            { label: t('activeCrops'), value: `${stats?.activeCropsCount ?? 0} ta`, color: C.accentAmber, bg: C.warningLight },
          ].map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: s.bg }]}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: s.color, opacity: 0.8 }]}>{s.label}</Text>
            </View>
          ))}

        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {fields.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: C.backgroundElement, borderColor: C.cardBorder }]}>
            <Text style={{ fontSize: 48 }}>🌾</Text>
            <Text style={[styles.emptyTitle, { color: C.text }]}>{t('noData')}</Text>
            <Text style={[styles.emptyText, { color: C.textSecondary }]}>
              Maydon qo'shish uchun + tugmasini bosing
            </Text>
          </View>
        ) : (
          fields.map((field) => {
            return (
              <TouchableOpacity
                key={field.id}
                activeOpacity={0.85}
                onPress={() => router.push({ pathname: '/fields/[id]', params: { id: field.id } } as any)}
                style={[styles.fieldCard, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>

                {/* Field header row */}
                <View style={styles.fieldTopRow}>
                  <View style={styles.fieldTitleGroup}>
                    <Text style={styles.fieldAreaEmoji}>🌍</Text>
                    <View>
                      <Text style={[styles.fieldName, { color: C.text }]}>{field.name}</Text>
                      <Text style={[styles.fieldArea, { color: C.primary }]}>
                        {field.area} {formatEnum('unit', field.areaUnit)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: C.divider }]} />

                {/* Field meta */}
                <View style={styles.fieldMeta}>
                  {field.soilType && (
                    <View style={styles.metaItem}>
                      <Leaf size={13} color={C.textMuted} />
                      <Text style={[styles.metaText, { color: C.textSecondary }]}>{field.soilType}</Text>
                    </View>
                  )}
                  {field.waterSource && (
                    <View style={styles.metaItem}>
                      <Text style={styles.metaEmoji}>💧</Text>
                      <Text style={[styles.metaText, { color: C.textSecondary }]}>{field.waterSource}</Text>
                    </View>
                  )}
                  {!field.soilType && !field.waterSource && (
                    <Text style={[styles.metaText, { color: C.textMuted }]}>
                      📅 {t('addCrop')}
                    </Text>
                  )}
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
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSub: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  headerTitle: { fontSize: 20, fontWeight: '800', marginTop: 1 },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  statCard: {
    flex: 1,
    padding: 10,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  statValue: { fontSize: 15, fontWeight: '800' },
  statLabel: { fontSize: 10, fontWeight: '600', marginTop: 2, textAlign: 'center' },

  content: { padding: 16, gap: 12 },

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

  fieldCard: {
    padding: 14,
    borderRadius: Radius.lg,
    gap: 10,
  },
  fieldTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldTitleGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fieldAreaEmoji: { fontSize: 26 },
  fieldName: { fontSize: 16, fontWeight: '700' },
  fieldArea: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  cropStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  cropStatusEmoji: { fontSize: 12 },
  cropStatusText: { fontSize: 11, fontWeight: '700' },
  divider: { height: 1 },
  fieldMeta: { flexDirection: 'row', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaEmoji: { fontSize: 13 },
  metaText: { fontSize: 12 },
  cropBox: {
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: 8,
  },
  cropTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cropName: { flex: 1, fontSize: 13, fontWeight: '700' },
  cropYield: { fontSize: 12, fontWeight: '600' },
  cropDates: { flexDirection: 'row', gap: 16 },
  cropDateItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cropDateText: { fontSize: 11 },
});
