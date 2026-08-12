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
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { financeService } from '@/features/finance';
import { ExpenseCategory } from '@/types/domain';
import { AppTextInput, AppSelect, AppDatePicker, AppButton } from '@/components/ui';

export default function AddExpenseScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('FEED');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const categoryOptions: { label: string; value: ExpenseCategory }[] = [
    { label: 'Ozuqa / Yem (Feed)', value: 'FEED' },
    { label: 'Dori-darmon (Medicine)', value: 'MEDICINE' },
    { label: 'Veterinar xizmati (Vet)', value: 'VET' },
    { label: 'Ishchilar maoshi (Worker)', value: 'WORKER' },
    { label: 'Urug&apos;lik (Seed)', value: 'SEED' },
    { label: 'O&apos;g&apos;itlar (Fertilizer)', value: 'FERTILIZER' },
    { label: 'Suv (Water)', value: 'WATER' },
    { label: 'Transport / Yoqilg&apos;i (Transport)', value: 'TRANSPORT' },
    { label: 'Texnika va uskuna (Equipment)', value: 'EQUIPMENT' },
    { label: 'Boshqa (Other)', value: 'OTHER' },
  ];

  const handleSubmit = () => {
    const amtNum = Number(amount);
    if (!title || !amtNum || amtNum <= 0) {
      Alert.alert('Xatolik', 'Sarlavha va 0 dan katta summa kiritilishi shart!');
      return;
    }

    financeService.addExpense({
      farmId: 'farm-001',
      title,
      category,
      amount: amtNum,
      currency: 'UZS',
      date,
      notes: notes || undefined,
    });

    Alert.alert('Muvaffaqiyatli', 'Xarajat saqlandi.');
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Xarajat Yozish</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppTextInput
          label="Xarajat Sarlavhasi *"
          placeholder="Masalan: Beda sotib olindi yoki Traktor yoqilg'isi"
          value={title}
          onChangeText={setTitle}
        />

        <AppSelect
          label="Kategoriya *"
          options={categoryOptions}
          selectedValue={category}
          onValueChange={(val) => setCategory(val as ExpenseCategory)}
        />

        <AppTextInput
          label="Summa (so'mda) *"
          placeholder="Masalan: 1200000"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <AppDatePicker
          label="Sana *"
          value={date}
          onDateChange={setDate}
        />

        <AppTextInput
          label="Qo'shimcha izohlar"
          placeholder="Chek yoki xaridor haqida..."
          multiline
          numberOfLines={3}
          style={{ height: 80 }}
          value={notes}
          onChangeText={setNotes}
        />

        <AppButton
          title="Xarajatni Saqlash"
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
