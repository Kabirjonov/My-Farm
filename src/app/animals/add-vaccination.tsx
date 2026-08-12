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
import { AppTextInput, AppDatePicker, AppButton } from '@/components/ui';

export default function AddVaccinationScreen() {
  const { animalId } = useLocalSearchParams<{ animalId: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [vaccineName, setVaccineName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextDueDate, setNextDueDate] = useState('');
  const [vetName, setVetName] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!vaccineName) {
      Alert.alert('Xatolik', 'Vaktsina nomi kiritilishi shart!');
      return;
    }

    if (!animalId) {
      Alert.alert('Xatolik', 'Hayvon ko\'rsatilmadi.');
      return;
    }

    healthService.addVaccination({
      animalId,
      vaccineName,
      date,
      nextDueDate: nextDueDate || undefined,
      vetName: vetName || undefined,
      cost: cost ? Number(cost) : undefined,
      notes: notes || undefined,
    });

    Alert.alert('Muvaffaqiyatli', 'Emlash yozuvi va keyingi emlash eslatmasi saqlandi.');
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Emlash Yozuvini Qo&apos;shish</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppTextInput
          label="Vaktsina nomi *"
          placeholder="Masalan: Quturishga qarshi (Rabies)"
          value={vaccineName}
          onChangeText={setVaccineName}
        />

        <AppDatePicker
          label="Emlash sanasi *"
          value={date}
          onDateChange={setDate}
        />

        <AppDatePicker
          label="Keyingi emlash sanasi (Eslatma uchun)"
          value={nextDueDate}
          onDateChange={setNextDueDate}
        />

        <AppTextInput
          label="Veterinar ismi"
          placeholder="Masalan: Dr. Ergashev"
          value={vetName}
          onChangeText={setVetName}
        />

        <AppTextInput
          label="Vaktsina xarajati (so'mda)"
          placeholder="Masalan: 45000"
          keyboardType="numeric"
          value={cost}
          onChangeText={setCost}
        />

        <AppTextInput
          label="Izohlar"
          placeholder="Seriya raqami va dorixona belgisi..."
          multiline
          numberOfLines={3}
          style={{ height: 80 }}
          value={notes}
          onChangeText={setNotes}
        />

        <AppButton
          title="Emlashni Saqlash"
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
