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
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { landService } from '@/features/crops';
import { CropStatus } from '@/types/domain';
import { AppTextInput, AppSelect, AppDatePicker, AppButton } from '@/components/ui';

export default function AddCropSeasonScreen() {
  const { fieldId } = useLocalSearchParams<{ fieldId: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const field = fieldId ? landService.getFieldById(fieldId) : null;

  const [cropName, setCropName] = useState('');
  const [seasonYear, setSeasonYear] = useState(String(new Date().getFullYear()));
  const [plantedDate, setPlantedDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedHarvestDate, setExpectedHarvestDate] = useState('');
  const [expectedYield, setExpectedYield] = useState('');
  const [expectedYieldUnit, setExpectedYieldUnit] = useState('TON');
  const [status, setStatus] = useState<CropStatus>('PLANTED');
  const [seedCost, setSeedCost] = useState('');
  const [fertilizerCost, setFertilizerCost] = useState('');
  const [medicineCost, setMedicineCost] = useState('');
  const [waterCost, setWaterCost] = useState('');
  const [notes, setNotes] = useState('');

  const statusOptions: { label: string; value: CropStatus }[] = [
    { label: 'Rejalashtirilgan (Planned)', value: 'PLANNED' },
    { label: 'Ekilgan (Planted)', value: 'PLANTED' },
    { label: "O'smoqda (Growing)", value: 'GROWING' },
  ];

  const yieldUnitOptions = [
    { label: 'Tonna (Ton)', value: 'TON' },
    { label: 'Kilogram (Kg)', value: 'KG' },
    { label: 'Qop (Bag)', value: 'BAG' },
  ];

  const handleSubmit = () => {
    if (!cropName || !plantedDate) {
      Alert.alert('Xatolik', 'Ekin nomi va ekilgan sana kiritilishi shart!');
      return;
    }

    if (!fieldId) {
      Alert.alert('Xatolik', 'Yer maydoni ko\'rsatilmadi.');
      return;
    }

    landService.createCropSeason({
      fieldId,
      cropName,
      seasonYear: Number(seasonYear) || new Date().getFullYear(),
      plantedDate,
      expectedHarvestDate: expectedHarvestDate || undefined,
      expectedYield: expectedYield ? Number(expectedYield) : undefined,
      expectedYieldUnit,
      status,
      seedCost: seedCost ? Number(seedCost) : undefined,
      fertilizerCost: fertilizerCost ? Number(fertilizerCost) : undefined,
      medicineCost: medicineCost ? Number(medicineCost) : undefined,
      waterCost: waterCost ? Number(waterCost) : undefined,
      notes: notes || undefined,
    });

    Alert.alert('Muvaffaqiyatli', 'Ekin mavsumi yaratildi va xarajatlar avtomatik moliya bo\'limiga o\'tkazildi.');
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Ekin Ekish (Crop Season)</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {field && (
          <View style={[styles.infoBanner, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.infoBannerText, { color: colors.primary }]}>
              Tanlangan Maydon: {field.name} ({field.area} {field.areaUnit})
            </Text>
          </View>
        )}

        <AppTextInput
          label="Ekin Nomi *"
          placeholder="Masalan: Kuzgi Bug'doy, Makkajo'xori, Paxta"
          value={cropName}
          onChangeText={setCropName}
        />

        <AppTextInput
          label="Mavsum Yili *"
          placeholder="2026"
          keyboardType="numeric"
          value={seasonYear}
          onChangeText={setSeasonYear}
        />

        <AppDatePicker
          label="Ekilgan sana *"
          value={plantedDate}
          onDateChange={setPlantedDate}
        />

        <AppDatePicker
          label="Kutilayotgan yig'im sanasi (Eslatma uchun)"
          value={expectedHarvestDate}
          onDateChange={setExpectedHarvestDate}
        />

        <AppTextInput
          label="Kutilayotgan hosil (Expected yield)"
          placeholder="Masalan: 12.5"
          keyboardType="numeric"
          value={expectedYield}
          onChangeText={setExpectedYield}
        />

        <AppSelect
          label="Hosil birligi"
          options={yieldUnitOptions}
          selectedValue={expectedYieldUnit}
          onValueChange={setExpectedYieldUnit}
        />

        <AppSelect
          label="Ekin holati *"
          options={statusOptions}
          selectedValue={status}
          onValueChange={(val) => setStatus(val as CropStatus)}
        />

        {/* Expenses Section */}
        <Text style={[styles.sectionHeading, { color: colors.text }]}>Agrotexnik Xarajatlar (so&apos;mda)</Text>

        <AppTextInput
          label="Urug' xarajati"
          placeholder="Masalan: 4500000"
          keyboardType="numeric"
          value={seedCost}
          onChangeText={setSeedCost}
        />

        <AppTextInput
          label="O'g'it va minerallar xarajati"
          placeholder="Masalan: 3200000"
          keyboardType="numeric"
          value={fertilizerCost}
          onChangeText={setFertilizerCost}
        />

        <AppTextInput
          label="Zararkunandalarga qarshi dori xarajati"
          placeholder="Masalan: 1200000"
          keyboardType="numeric"
          value={medicineCost}
          onChangeText={setMedicineCost}
        />

        <AppTextInput
          label="Suv va sug'orish xarajati"
          placeholder="Masalan: 800000"
          keyboardType="numeric"
          value={waterCost}
          onChangeText={setWaterCost}
        />

        <AppTextInput
          label="Qo'shimcha izohlar"
          placeholder="Urug' navi va agrotexnika bo'yicha..."
          multiline
          numberOfLines={3}
          style={{ height: 80 }}
          value={notes}
          onChangeText={setNotes}
        />

        <AppButton
          title="Ekin Mavsumini Saqlash"
          onPress={handleSubmit}
          style={{ marginTop: 16 }}
        />
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
    alignItems: 'center',
    gap: 15,
  },
  backButton: {
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
    gap: 4,
  },
  infoBanner: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  infoBannerText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },
});
