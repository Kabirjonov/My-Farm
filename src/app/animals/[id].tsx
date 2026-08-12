import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Edit3, HeartPulse, Syringe, DollarSign, Info, Plus, Baby } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { livestockService } from '@/features/livestock';
import { useHealth } from '@/features/health';
import { RoleGuard } from '@/features/auth';
import { ErrorState, AppButton } from '@/components/ui';

export default function AnimalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [activeTab, setActiveTab] = useState<'info' | 'health' | 'vaccination' | 'breeding' | 'finance'>('info');

  const animal = id ? livestockService.getAnimalById(id) : null;
  const { healthRecords, vaccinations, breedingRecords } = useHealth(id);

  if (!animal) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <ErrorState title="Topilmadi" error="Ko'rsatilgan hayvon topilmadi yoki arxivlangan." />
      </View>
    );
  }

  const handleArchive = () => {
    Alert.alert(
      'Arxivlashni tasdiqlang',
      `Rostdan ham ${animal.tagNumber} hayvonini arxivlamoqchimisiz?`,
      [
        { text: 'Bekor qilish', style: 'cancel' },
        {
          text: 'Arxivlash',
          style: 'destructive',
          onPress: () => {
            livestockService.archiveAnimal(animal.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{animal.tagNumber}</Text>
        <RoleGuard permission="ANIMAL_EDIT">
          <TouchableOpacity style={styles.editButton} onPress={() => router.push({ pathname: '/animals/edit', params: { id: animal.id } })}>
            <Edit3 size={20} color={colors.primary} />
          </TouchableOpacity>
        </RoleGuard>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Card */}
        <View style={[styles.mainCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
          <View style={styles.cardTopRow}>
            <View>
              <Text style={[styles.animalName, { color: colors.text }]}>{animal.name || animal.breed}</Text>
              <Text style={[styles.tagSub, { color: colors.textSecondary }]}>Teg: {animal.tagNumber}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.statusText, { color: colors.primary }]}>{animal.healthStatus}</Text>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.gridItem}>
              <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>TURI</Text>
              <Text style={[styles.gridValue, { color: colors.text }]}>{animal.type}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>ZOTI</Text>
              <Text style={[styles.gridValue, { color: colors.text }]}>{animal.breed}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>VAZN</Text>
              <Text style={[styles.gridValue, { color: colors.text }]}>{animal.weightKg} kg</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>JINSI</Text>
              <Text style={[styles.gridValue, { color: colors.text }]}>{animal.gender}</Text>
            </View>
          </View>
        </View>

        {/* Tab Buttons */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'info' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab('info')}>
            <Info size={16} color={activeTab === 'info' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, { color: activeTab === 'info' ? colors.primary : colors.textSecondary }]}>Ma&apos;lumot</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'health' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab('health')}>
            <HeartPulse size={16} color={activeTab === 'health' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, { color: activeTab === 'health' ? colors.primary : colors.textSecondary }]}>Sog&apos;liq ({healthRecords.length})</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'vaccination' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab('vaccination')}>
            <Syringe size={16} color={activeTab === 'vaccination' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, { color: activeTab === 'vaccination' ? colors.primary : colors.textSecondary }]}>Emlash ({vaccinations.length})</Text>
          </TouchableOpacity>

          {animal.gender === 'FEMALE' && (
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'breeding' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab('breeding')}>
              <Baby size={16} color={activeTab === 'breeding' ? colors.primary : colors.textSecondary} />
              <Text style={[styles.tabText, { color: activeTab === 'breeding' ? colors.primary : colors.textSecondary }]}>Naslchilik ({breedingRecords.length})</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'finance' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab('finance')}>
            <DollarSign size={16} color={activeTab === 'finance' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, { color: activeTab === 'finance' ? colors.primary : colors.textSecondary }]}>Moliya</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Tab Content */}
        <View style={[styles.tabContentCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
          {activeTab === 'info' && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Qo&apos;shimcha Izohlar & Tarix</Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                {animal.notes || "Hozircha izohlar mavjud emas."}
              </Text>
              <Text style={[styles.metaDate, { color: colors.textSecondary }]}>Tug&apos;ilgan sana: {animal.birthDate}</Text>
            </View>
          )}

          {activeTab === 'health' && (
            <View style={styles.section}>
              <View style={styles.rowBetween}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Sog&apos;liq Yozuvlari</Text>
                <RoleGuard permission="HEALTH_MANAGE">
                  <TouchableOpacity
                    style={[styles.miniAddBtn, { backgroundColor: colors.primary }]}
                    onPress={() => router.push({ pathname: '/animals/add-health' as any, params: { animalId: animal.id } })}>
                    <Plus size={14} color="white" />
                    <Text style={styles.miniAddBtnText}>Qo&apos;shish</Text>
                  </TouchableOpacity>
                </RoleGuard>
              </View>
              {healthRecords.length === 0 ? (
                <Text style={[styles.bodyText, { color: colors.textSecondary }]}>Hozircha sog&apos;liq yozuvlari yo&apos;q.</Text>
              ) : (
                healthRecords.map((item) => (
                  <View key={item.id} style={styles.timelineItem}>
                    <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title} ({item.date})</Text>
                    <Text style={[styles.bodyText, { color: colors.textSecondary }]}>Tashxis: {item.diagnosis}</Text>
                    {item.treatment && <Text style={[styles.bodyText, { color: colors.textSecondary }]}>Muolaja: {item.treatment}</Text>}
                    {item.cost ? <Text style={[styles.bodyText, { color: colors.primary }]}>Xarajat: {item.cost.toLocaleString()} so&apos;m</Text> : null}
                  </View>
                ))
              )}
            </View>
          )}

          {activeTab === 'vaccination' && (
            <View style={styles.section}>
              <View style={styles.rowBetween}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Emlash Tarixi</Text>
                <RoleGuard permission="HEALTH_MANAGE">
                  <TouchableOpacity
                    style={[styles.miniAddBtn, { backgroundColor: colors.primary }]}
                    onPress={() => router.push({ pathname: '/animals/add-vaccination' as any, params: { animalId: animal.id } })}>
                    <Plus size={14} color="white" />
                    <Text style={styles.miniAddBtnText}>Qo&apos;shish</Text>
                  </TouchableOpacity>
                </RoleGuard>
              </View>
              {vaccinations.length === 0 ? (
                <Text style={[styles.bodyText, { color: colors.textSecondary }]}>Hozircha emlash yozuvlari yo&apos;q.</Text>
              ) : (
                vaccinations.map((item) => (
                  <View key={item.id} style={styles.timelineItem}>
                    <Text style={[styles.itemTitle, { color: colors.text }]}>{item.vaccineName} ({item.date})</Text>
                    {item.nextDueDate && <Text style={[styles.bodyText, { color: colors.warning }]}>Keyingi emlash: {item.nextDueDate}</Text>}
                    {item.vetName && <Text style={[styles.bodyText, { color: colors.textSecondary }]}>Veterinar: {item.vetName}</Text>}
                  </View>
                ))
              )}
            </View>
          )}

          {activeTab === 'breeding' && animal.gender === 'FEMALE' && (
            <View style={styles.section}>
              <View style={styles.rowBetween}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Naslchilik Yozuvlari</Text>
                <RoleGuard permission="HEALTH_MANAGE">
                  <TouchableOpacity
                    style={[styles.miniAddBtn, { backgroundColor: colors.primary }]}
                    onPress={() => router.push({ pathname: '/animals/add-breeding' as any, params: { animalId: animal.id } })}>
                    <Plus size={14} color="white" />
                    <Text style={styles.miniAddBtnText}>Qo&apos;shish</Text>
                  </TouchableOpacity>
                </RoleGuard>
              </View>
              {breedingRecords.length === 0 ? (
                <Text style={[styles.bodyText, { color: colors.textSecondary }]}>Hozircha naslchilik yozuvlari yo&apos;q.</Text>
              ) : (
                breedingRecords.map((item) => (
                  <View key={item.id} style={styles.timelineItem}>
                    <Text style={[styles.itemTitle, { color: colors.text }]}>Holat: {item.result} ({item.breedingDate})</Text>
                    <Text style={[styles.bodyText, { color: colors.warning }]}>Kutilayotgan tug&apos;ish: {item.expectedBirthDate}</Text>
                    {item.actualBirthDate && <Text style={[styles.bodyText, { color: colors.primary }]}>Tug&apos;ilgan sana: {item.actualBirthDate}</Text>}
                  </View>
                ))
              )}
            </View>
          )}

          {activeTab === 'finance' && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Moliya Ma&apos;lumoti</Text>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                Sotib olingan narxi: {animal.purchasePrice ? `${animal.purchasePrice.toLocaleString()} so&apos;m` : "Ko'rsatilmagan"}
              </Text>
            </View>
          )}
        </View>

        {/* Action Button: Archive */}
        <RoleGuard permission="ANIMAL_DELETE">
          <AppButton
            title="Hayvonni Arxivlash"
            variant="danger"
            onPress={handleArchive}
            style={{ marginTop: 20 }}
          />
        </RoleGuard>
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
  editButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
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
    gap: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  animalName: {
    fontSize: 20,
    fontWeight: '800',
  },
  tagSub: {
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    minWidth: '45%',
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  gridValue: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  tabScroll: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabContentCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  section: {
    gap: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  miniAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  miniAddBtnText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
  },
  timelineItem: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
    gap: 2,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 18,
  },
  metaDate: {
    fontSize: 12,
    marginTop: 8,
  },
});
