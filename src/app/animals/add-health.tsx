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

export default function AddHealthScreen() {
  const { animalId } = useLocalSearchParams<{ animalId: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [title, setTitle] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [treatment, setTreatment] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [vetName, setVetName] = useState('');
  const [cost, setCost] = useState('');
  const [nextCheckDate, setNextCheckDate] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = () => {
    if (!title || !diagnosis) {
      Alert.alert('Xatolik', 'Sarlavha va Tashxis kiritilishi shart!');
      return;
    }

    if (!animalId) {
      Alert.alert('Xatolik', 'Hayvon ko\'rsatilmadi.');
      return;
    }

    healthService.addHealthRecord({
      animalId,
      date,
      title,
      symptoms: symptoms || undefined,
      diagnosis,
      treatment: treatment || undefined,
      medicineName: medicineName || undefined,
      dosage: dosage || undefined,
      vetName: vetName || undefined,
      cost: cost ? Number(cost) : undefined,
      nextCheckDate: nextCheckDate || undefined,
    });

    Alert.alert('Muvaffaqiyatli', 'Sog\'liq yozuvi qo\'shildi va eslatma yaratildi.');
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Sog&apos;liq Yozuvini Qo&apos;shish</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppTextInput
          label="Sarlavha *"
          placeholder="Masalan: Shamollash va Isitma"
          value={title}
          onChangeText={setTitle}
        />

        <AppTextInput
          label="Tashxis (Diagnosis) *"
          placeholder="Masalan: Respirator infeksiya"
          value={diagnosis}
          onChangeText={setDiagnosis}
        />

        <AppTextInput
          label="Simptomlar (Alomatlar)"
          placeholder="Yo'tal, ishtahasizlik..."
          value={symptoms}
          onChangeText={setSymptoms}
        />

        <AppTextInput
          label="Muolaja / Davolash"
          placeholder="Harorat tushiruvchi dori berildi..."
          value={treatment}
          onChangeText={setTreatment}
        />

        <AppTextInput
          label="Dori nomi"
          placeholder="Masalan: Penitsillin, Analgin"
          value={medicineName}
          onChangeText={setMedicineName}
        />

        <AppTextInput
          label="Dozasi"
          placeholder="Masalan: 5ml kuniga 2 mahal"
          value={dosage}
          onChangeText={setDosage}
        />

        <AppTextInput
          label="Veterinar ismi"
          placeholder="Masalan: Dr. Karimov"
          value={vetName}
          onChangeText={setVetName}
        />

        <AppTextInput
          label="Xarajat (so'mda)"
          placeholder="Masalan: 85000"
          keyboardType="numeric"
          value={cost}
          onChangeText={setCost}
        />

        <AppDatePicker
          label="Sana *"
          value={date}
          onDateChange={setDate}
        />

        <AppDatePicker
          label="Qayta ko'rik sanasi (Eslatma uchun)"
          value={nextCheckDate}
          onDateChange={setNextCheckDate}
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
