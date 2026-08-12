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
import { healthService } from '@/features/health';
import { BreedingResult } from '@/types/domain';
import { AppTextInput, AppSelect, AppDatePicker, AppButton } from '@/components/ui';

export default function AddBreedingScreen() {
  const { animalId } = useLocalSearchParams<{ animalId: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [partnerAnimalId, setPartnerAnimalId] = useState('');
  const [breedingDate, setBreedingDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedBirthDate, setExpectedBirthDate] = useState('');
  const [result, setResult] = useState<BreedingResult>('PREGNANT');
  const [childrenCount, setChildrenCount] = useState('0');
  const [notes, setNotes] = useState('');

  const resultOptions: { label: string; value: BreedingResult }[] = [
    { label: 'Homilador (Pregnant)', value: 'PREGNANT' },
    { label: 'Tug&apos;ildi (Birth Done)', value: 'BIRTH_DONE' },
    { label: 'Natijasiz (Not Pregnant)', value: 'NOT_PREGNANT' },
    { label: 'Muvaffaqiyatsiz (Failed)', value: 'FAILED' },
  ];

  const handleSubmit = () => {
    if (!breedingDate || !expectedBirthDate) {
      Alert.alert('Xatolik', 'Urchish sanasi va kutilayotgan tug\'ish sanasi kiritilishi shart!');
      return;
    }

    if (!animalId) {
      Alert.alert('Xatolik', 'Ona hayvon ko\'rsatilmadi.');
      return;
    }

    healthService.addBreedingRecord({
      animalId,
      partnerAnimalId: partnerAnimalId || undefined,
      breedingDate,
      expectedBirthDate,
      result,
      childrenCount: Number(childrenCount) || 0,
      notes: notes || undefined,
    });

    Alert.alert('Muvaffaqiyatli', 'Naslchilik/Tug\'ish yozuvi va kutilayotgan tug\'ish sanasi eslatmasi saqlandi.');
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Naslchilik Yozuvini Qo&apos;shish</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppDatePicker
          label="Urchish / Qochirish sanasi *"
          value={breedingDate}
          onDateChange={setBreedingDate}
        />

        <AppDatePicker
          label="Kutilayotgan tug'ish sanasi *"
          value={expectedBirthDate}
          onDateChange={setExpectedBirthDate}
        />

        <AppSelect
          label="Natija / Holat *"
          options={resultOptions}
          selectedValue={result}
          onValueChange={(val) => setResult(val as BreedingResult)}
        />

        <AppTextInput
          label="Erkak (Ota) hayvon Teg raqami (ixtiyoriy)"
          placeholder="Masalan: OT-007 yoki QOY-100"
          value={partnerAnimalId}
          onChangeText={setPartnerAnimalId}
        />

        <AppTextInput
          label="Tug'ilgan bolalar soni (agar tug'ilgan bo'lsa)"
          placeholder="0"
          keyboardType="numeric"
          value={childrenCount}
          onChangeText={setChildrenCount}
        />

        <AppTextInput
          label="Izohlar"
          placeholder="Nasilchilik bo'yicha qo'shimcha ma'lumotlar..."
          multiline
          numberOfLines={3}
          style={{ height: 80 }}
          value={notes}
          onChangeText={setNotes}
        />

        <AppButton
          title="Yozuvni Saqlash"
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
});
