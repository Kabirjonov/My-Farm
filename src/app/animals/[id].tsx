import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Edit3, HeartPulse, Syringe, DollarSign, Info, Plus, Baby, Bell, MoreVertical, Calendar, Scale, Award, Activity, X } from 'lucide-react-native';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { livestockService } from '@/features/livestock';
import { useHealth } from '@/features/health';
import { reminderRepository } from '@/lib/db/repositories/reminderRepository';
import { RoleGuard } from '@/features/auth';
import { ErrorState, AppButton, AppTextInput } from '@/components/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/i18n';

const ANIMAL_EMOJI: Record<string, string> = {
  SHEEP: '🐑',
  COW: '🐄',
  GOAT: '🐐',
  HORSE: '🐎',
  CHICKEN: '🐓',
  OTHER: '🐾',
};

export default function AnimalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { t, formatEnum } = useTranslation();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'info' | 'health' | 'vaccination' | 'breeding' | 'reminders' | 'finance'>('info');
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteText, setNoteText] = useState('');

  const animal = id ? livestockService.getAnimalById(id) : null;
  const { healthRecords, vaccinations, breedingRecords } = useHealth(id);
  const reminders = animal ? reminderRepository.list().filter((r) => r.relatedEntityId === animal.id || r.title.includes(animal.tagNumber)) : [];

  const handleSaveNote = () => {
    if (animal) {
      livestockService.updateAnimal(animal.id, { notes: noteText });
      queryClient.invalidateQueries({ queryKey: ['livestock'] });
      setNoteModalVisible(false);
      Alert.alert('Muvaffaqiyatli', 'Izoh saqlandi.');
    }
  };

  if (!animal) {
    return (
      <View style={[styles.container, { backgroundColor: C.background }]}>
        <View style={[styles.header, { backgroundColor: C.backgroundElement, borderBottomColor: C.divider }]}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <ArrowLeft size={22} color={C.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: C.text }]}>{t('livestock')}</Text>
          <View style={{ width: 40 }} />
        </View>
        <ErrorState title={t('noData')} error="Ko'rsatilgan hayvon topilmadi yoki arxivlangan." />
      </View>
    );
  }

  const handleArchive = () => {
    Alert.alert(
      t('confirmDelete'),
      `${animal.tagNumber} — ${t('confirmDeleteMsg')}`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            livestockService.archiveAnimal(animal.id);
            queryClient.invalidateQueries({ queryKey: ['livestock'] });
            queryClient.invalidateQueries({ queryKey: ['livestock-stats'] });
            router.back();
          },

        },
      ]
    );
  };

  const getHealthBadgeStyle = (health: string) => {
    switch (health) {
      case 'HEALTHY': return { bg: C.successLight, text: C.success };
      case 'SICK': return { bg: C.dangerLight, text: C.danger };
      case 'PREGNANT': return { bg: '#FFF3E0', text: C.accentAmber };
      case 'TREATMENT': return { bg: '#E3F2FD', text: C.accentBlue };
      default: return { bg: C.backgroundSelected, text: C.textSecondary };
    }
  };

  const badge = getHealthBadgeStyle(animal.healthStatus);

  // Calculate age string from birthDate
  const getAgeString = (birthDateStr: string) => {
    if (!birthDateStr) return 'Noma\'lum';
    const birth = new Date(birthDateStr);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    if (years > 0) {
      return `${years} yosh ${months > 0 ? months + ' oy' : ''}`;
    }
    return `${months} oy`;
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.backgroundElement, borderBottomColor: C.divider }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.text }]} numberOfLines={1}>
          Hayvon Ma'lumoti
        </Text>
        <RoleGuard permission="ANIMAL_EDIT">
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: C.successLight }]}
            onPress={() => router.push({ pathname: '/animals/edit', params: { id: animal.id } })}>
            <Edit3 size={18} color={C.primary} />
          </TouchableOpacity>
        </RoleGuard>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Animal Profile Banner Card */}
        <View style={[styles.profileCard, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>
          <View style={styles.profileTop}>
            <View style={[styles.animalAvatar, { backgroundColor: C.successLight }]}>
              <Text style={styles.animalEmoji}>{ANIMAL_EMOJI[animal.type] || '🐾'}</Text>
            </View>
            <View style={styles.profileDetails}>
              <View style={styles.nameRow}>
                <Text style={[styles.animalName, { color: C.text }]} numberOfLines={1}>
                  {animal.name || animal.breed}
                </Text>
                <View style={[styles.healthBadge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.healthBadgeText, { color: badge.text }]}>
                    {formatEnum('health', animal.healthStatus)}
                  </Text>
                </View>
              </View>

              <View style={styles.tagEditRow}>
                <Text style={[styles.tagNumber, { color: C.primary }]}>{animal.tagNumber}</Text>
                <RoleGuard permission="ANIMAL_EDIT">
                  <TouchableOpacity
                    style={[styles.editBadgeBtn, { backgroundColor: C.primary }]}
                    onPress={() => router.push({ pathname: '/animals/edit', params: { id: animal.id } })}>
                    <Edit3 size={12} color="#fff" />
                    <Text style={styles.editBadgeBtnText}>Tahrirlash</Text>
                  </TouchableOpacity>
                </RoleGuard>
              </View>

              <Text style={[styles.breedText, { color: C.textSecondary }]}>
                {formatEnum('type', animal.type)} · {animal.breed}
              </Text>
            </View>
          </View>


          <View style={[styles.cardDivider, { backgroundColor: C.divider }]} />

          {/* Quick Stats Grid 2x2 */}
          <View style={styles.statsGrid}>
            <View style={[styles.statBox, { backgroundColor: C.background }]}>
              <Calendar size={16} color={C.primary} />
              <View>
                <Text style={[styles.statBoxLabel, { color: C.textSecondary }]}>YOSHI</Text>
                <Text style={[styles.statBoxValue, { color: C.text }]}>{getAgeString(animal.birthDate)}</Text>
              </View>
            </View>

            <View style={[styles.statBox, { backgroundColor: C.background }]}>
              <Scale size={16} color={C.accentAmber} />
              <View>
                <Text style={[styles.statBoxLabel, { color: C.textSecondary }]}>OG'IRLIGI</Text>
                <Text style={[styles.statBoxValue, { color: C.text }]}>{animal.weightKg} kg</Text>
              </View>
            </View>

            <View style={[styles.statBox, { backgroundColor: C.background }]}>
              <Award size={16} color={C.accentBlue} />
              <View>
                <Text style={[styles.statBoxLabel, { color: C.textSecondary }]}>ZOTI</Text>
                <Text style={[styles.statBoxValue, { color: C.text }]}>{animal.breed}</Text>
              </View>
            </View>

            <View style={[styles.statBox, { backgroundColor: C.background }]}>
              <Activity size={16} color={C.success} />
              <View>
                <Text style={[styles.statBoxLabel, { color: C.textSecondary }]}>HOMILADOR</Text>
                <Text style={[styles.statBoxValue, { color: C.text }]}>
                  {animal.healthStatus === 'PREGNANT' ? 'Ha' : 'Yo\'q'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.tabBarScroll, { backgroundColor: C.backgroundElement, borderBottomColor: C.divider }]}
          contentContainerStyle={styles.tabBarContent}
        >
          {[
            { key: 'info', label: 'Umumiy', icon: Info },
            { key: 'health', label: `Sog'liq (${healthRecords.length})`, icon: HeartPulse },
            { key: 'vaccination', label: `Emlash (${vaccinations.length})`, icon: Syringe },
            ...(animal.gender === 'FEMALE' ? [{ key: 'breeding', label: `Nasl (${breedingRecords.length})`, icon: Baby }] : []),
            { key: 'reminders', label: `Eslatmasi (${reminders.length})`, icon: Bell },
            { key: 'finance', label: 'Moliya', icon: DollarSign },
          ].map((tItem) => {
            const Icon = tItem.icon;
            const isActive = activeTab === tItem.key;
            return (
              <TouchableOpacity
                key={tItem.key}
                onPress={() => setActiveTab(tItem.key as any)}
                style={[
                  styles.tabItem,
                  isActive && { borderBottomColor: C.primary, borderBottomWidth: 2.5 },
                ]}>
                <Icon size={15} color={isActive ? C.primary : C.textSecondary} />
                <Text style={[styles.tabItemText, { color: isActive ? C.primary : C.textSecondary }]}>
                  {tItem.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Tab Content */}
        <View style={[styles.tabCard, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>
          {activeTab === 'info' && (
            <View style={styles.infoList}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: C.textSecondary }]}>Tug'ilgan sana</Text>
                <Text style={[styles.infoValue, { color: C.text }]}>{animal.birthDate || '—'}</Text>
              </View>
              <View style={[styles.rowDivider, { backgroundColor: C.divider }]} />

              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: C.textSecondary }]}>Jinsi</Text>
                <Text style={[styles.infoValue, { color: C.text }]}>{formatEnum('gender', animal.gender)}</Text>
              </View>
              <View style={[styles.rowDivider, { backgroundColor: C.divider }]} />

              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: C.textSecondary }]}>Sotib olingan narxi</Text>
                <Text style={[styles.infoValue, { color: C.primary }]}>
                  {animal.purchasePrice ? `${animal.purchasePrice.toLocaleString()} UZS` : '—'}
                </Text>
              </View>
              <View style={[styles.rowDivider, { backgroundColor: C.divider }]} />

              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: C.textSecondary }]}>Ferma</Text>
                <Text style={[styles.infoValue, { color: C.text }]}>Asosiy ferma</Text>
              </View>
              <View style={[styles.rowDivider, { backgroundColor: C.divider }]} />

              <View style={{ gap: 8, marginTop: 4 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={[styles.infoLabel, { color: C.textSecondary }]}>Izoh / Qaydlar</Text>
                  <TouchableOpacity
                    style={[styles.miniAddBtn, { backgroundColor: C.primary }]}
                    onPress={() => {
                      setNoteText(animal.notes || '');
                      setNoteModalVisible(true);
                    }}>
                    <Edit3 size={14} color="white" />
                    <Text style={styles.miniAddBtnText}>+ Izoh yozish</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: C.background, padding: 12, borderRadius: Radius.md, borderWidth: 1, borderColor: C.divider }}>
                  <Text style={{ fontSize: 13, color: animal.notes ? C.text : C.textSecondary, lineHeight: 18 }}>
                    {animal.notes || "Hozircha izoh mavjud emas. Yangi izoh yozish uchun tugmani bosing."}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'health' && (
            <View style={styles.section}>
              <View style={styles.sectionTop}>
                <Text style={[styles.sectionTitle, { color: C.text }]}>Sog'liq Yozuvlari</Text>
                <TouchableOpacity
                  style={[styles.miniAddBtn, { backgroundColor: C.primary }]}
                  onPress={() => router.push({ pathname: '/animals/add-health' as any, params: { animalId: animal.id } })}>
                  <Plus size={14} color="white" />
                  <Text style={styles.miniAddBtnText}>+ Qo'shish</Text>
                </TouchableOpacity>
              </View>
              {healthRecords.length === 0 ? (
                <Text style={[styles.emptyText, { color: C.textSecondary }]}>Hozircha sog'liq yozuvlari yo'q.</Text>
              ) : (
                healthRecords.map((item) => (
                  <View key={item.id} style={[styles.timelineCard, { backgroundColor: C.background }]}>
                    <Text style={[styles.timelineTitle, { color: C.text }]}>{item.title} ({item.date})</Text>
                    <Text style={[styles.timelineBody, { color: C.textSecondary }]}>Tashxis: {item.diagnosis}</Text>
                    {item.treatment && <Text style={[styles.timelineBody, { color: C.textSecondary }]}>Muolaja: {item.treatment}</Text>}
                    {item.cost ? <Text style={[styles.timelineCost, { color: C.primary }]}>Xarajat: {item.cost.toLocaleString()} so'm</Text> : null}
                  </View>
                ))
              )}
            </View>
          )}

          {activeTab === 'vaccination' && (
            <View style={styles.section}>
              <View style={styles.sectionTop}>
                <Text style={[styles.sectionTitle, { color: C.text }]}>Emlash Tarixi</Text>
                <TouchableOpacity
                  style={[styles.miniAddBtn, { backgroundColor: C.primary }]}
                  onPress={() => router.push({ pathname: '/animals/add-vaccination' as any, params: { animalId: animal.id } })}>
                  <Plus size={14} color="white" />
                  <Text style={styles.miniAddBtnText}>+ Qo'shish</Text>
                </TouchableOpacity>
              </View>
              {vaccinations.length === 0 ? (
                <Text style={[styles.emptyText, { color: C.textSecondary }]}>Hozircha emlash yozuvlari yo'q.</Text>
              ) : (
                vaccinations.map((item) => (
                  <View key={item.id} style={[styles.timelineCard, { backgroundColor: C.background }]}>
                    <Text style={[styles.timelineTitle, { color: C.text }]}>{item.vaccineName} ({item.date})</Text>
                    {item.nextDueDate && <Text style={[styles.timelineBody, { color: C.warning }]}>Keyingi emlash: {item.nextDueDate}</Text>}
                    {item.vetName && <Text style={[styles.timelineBody, { color: C.textSecondary }]}>Veterinar: {item.vetName}</Text>}
                  </View>
                ))
              )}
            </View>
          )}

          {activeTab === 'breeding' && (
            <View style={styles.section}>
              <View style={styles.sectionTop}>
                <Text style={[styles.sectionTitle, { color: C.text }]}>Naslchilik Yozuvlari</Text>
                {animal.gender === 'FEMALE' && (
                  <TouchableOpacity
                    style={[styles.miniAddBtn, { backgroundColor: C.primary }]}
                    onPress={() => router.push({ pathname: '/animals/add-breeding' as any, params: { animalId: animal.id } })}>
                    <Plus size={14} color="white" />
                    <Text style={styles.miniAddBtnText}>+ Qo'shish</Text>
                  </TouchableOpacity>
                )}
              </View>
              {animal.gender !== 'FEMALE' ? (
                <Text style={[styles.emptyText, { color: C.textSecondary }]}>Naslchilik yozuvlari faqat urg'ochi (FEMALE) hayvonlar uchun mo'ljallangan.</Text>
              ) : breedingRecords.length === 0 ? (
                <Text style={[styles.emptyText, { color: C.textSecondary }]}>Hozircha naslchilik yozuvlari yo'q.</Text>
              ) : (
                breedingRecords.map((item) => (
                  <View key={item.id} style={[styles.timelineCard, { backgroundColor: C.background }]}>
                    <Text style={[styles.timelineTitle, { color: C.text }]}>Holat: {item.result} ({item.breedingDate})</Text>
                    <Text style={[styles.timelineBody, { color: C.warning }]}>Kutilayotgan tug'ish: {item.expectedBirthDate}</Text>
                    {item.actualBirthDate && <Text style={[styles.timelineBody, { color: C.primary }]}>Tug'ilgan sana: {item.actualBirthDate}</Text>}
                  </View>
                ))
              )}
            </View>
          )}

          {activeTab === 'reminders' && (
            <View style={styles.section}>
              <View style={styles.sectionTop}>
                <Text style={[styles.sectionTitle, { color: C.text }]}>Eslatmalar</Text>
                <TouchableOpacity
                  style={[styles.miniAddBtn, { backgroundColor: C.primary }]}
                  onPress={() => router.push({ pathname: '/animals/add-reminder' as any, params: { animalId: animal.id, tagNumber: animal.tagNumber } })}>
                  <Plus size={14} color="white" />
                  <Text style={styles.miniAddBtnText}>+ Qo'shish</Text>
                </TouchableOpacity>
              </View>
              {reminders.length === 0 ? (
                <Text style={[styles.emptyText, { color: C.textSecondary }]}>Hozircha eslatmalar yo'q.</Text>
              ) : (
                reminders.map((item) => (
                  <View key={item.id} style={[styles.timelineCard, { backgroundColor: C.background }]}>
                    <Text style={[styles.timelineTitle, { color: C.text }]}>{item.title}</Text>
                    <Text style={[styles.timelineBody, { color: C.warning }]}>Bajarilish sanasi: {item.dueDate}</Text>
                    {item.description ? <Text style={[styles.timelineBody, { color: C.textSecondary }]}>{item.description}</Text> : null}
                  </View>
                ))
              )}
            </View>
          )}

          {activeTab === 'finance' && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: C.text }]}>Moliya Ma'lumoti</Text>
              <View style={{ gap: 12, marginTop: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, color: C.textSecondary, fontWeight: '500' }}>Sotib olingan narxi:</Text>
                  <Text style={{ fontSize: 15, color: C.primary, fontWeight: '700' }}>
                    {typeof animal.purchasePrice === 'number' && animal.purchasePrice > 0
                      ? `${animal.purchasePrice.toLocaleString()} UZS`
                      : "Ko'rsatilmagan"}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, color: C.textSecondary, fontWeight: '500' }}>Sotib olingan sanasi:</Text>
                  <Text style={{ fontSize: 15, color: C.text, fontWeight: '600' }}>
                    {animal.purchaseDate ? animal.purchaseDate : "Ko'rsatilmagan"}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Archive Button */}
        <RoleGuard permission="ANIMAL_DELETE">
          <AppButton
            title="Hayvonni Arxivlash"
            variant="danger"
            onPress={handleArchive}
            style={{ marginTop: 8 }}
          />
        </RoleGuard>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Notes Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={noteModalVisible}
        onRequestClose={() => setNoteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: C.backgroundElement, borderColor: C.divider }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: C.text }]}>
                {animal.tagNumber} uchun Izoh Yozish
              </Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setNoteModalVisible(false)}>
                <X size={20} color={C.text} />
              </TouchableOpacity>
            </View>

            <AppTextInput
              label="Izoh / Qayd"
              placeholder="Oziqlanishi, vaksinatsiyasi, salomatlik holati bo'yicha belgilaringiz..."
              multiline
              numberOfLines={4}
              style={{ height: 100 }}
              value={noteText}
              onChangeText={setNoteText}
            />

            <View style={styles.modalBtnRow}>
              <AppButton
                title="Bekor qilish"
                variant="outline"
                onPress={() => setNoteModalVisible(false)}
                style={{ flex: 1 }}
              />
              <AppButton
                title="Saqlash"
                onPress={handleSaveNote}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingTop: 56,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderBottomWidth: 1,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },

  content: { padding: 16, gap: 14 },

  profileCard: {
    padding: 16,
    borderRadius: Radius.lg,
    gap: 14,
  },
  profileTop: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  animalAvatar: {
    width: 64,
    height: 64,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animalEmoji: { fontSize: 32 },
  profileDetails: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagEditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  editBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  editBadgeBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  animalName: { fontSize: 18, fontWeight: '800' },
  tagNumber: { fontSize: 14, fontWeight: '700' },
  breedText: { fontSize: 12 },

  healthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  healthBadgeText: { fontSize: 11, fontWeight: '700' },

  cardDivider: { height: 1 },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: Radius.md,
  },
  statBoxLabel: { fontSize: 10, fontWeight: '700' },
  statBoxValue: { fontSize: 13, fontWeight: '700', marginTop: 1 },

  tabBarScroll: {
    borderBottomWidth: 1,
    maxHeight: 48,
  },
  tabBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tabItemText: { fontSize: 12, fontWeight: '700' },

  tabCard: {
    padding: 16,
    borderRadius: Radius.lg,
  },

  infoList: { gap: 10 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: { fontSize: 13 },
  infoValue: { fontSize: 13, fontWeight: '600' },
  rowDivider: { height: 1 },

  section: { gap: 12 },
  sectionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '700' },
  emptyText: { fontSize: 13 },

  miniAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
  },
  miniAddBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  timelineCard: {
    padding: 12,
    borderRadius: Radius.md,
    gap: 4,
  },
  timelineTitle: { fontSize: 14, fontWeight: '700' },
  timelineBody: { fontSize: 12 },
  timelineCost: { fontSize: 12, fontWeight: '700' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: Radius.lg,
    padding: 20,
    borderWidth: 1,
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
});
