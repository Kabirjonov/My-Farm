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
import { IncomeCategory } from '@/types/domain';
import { AppTextInput, AppSelect, AppDatePicker, AppButton } from '@/components/ui';

export default function AddIncomeScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IncomeCategory>('MILK');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [relatedAnimalId, setRelatedAnimalId] = useState('');
  const [notes, setNotes] = useState('');

  const categoryOptions: { label: string; value: IncomeCategory }[] = [
    { label: 'Sut sotuvi (Milk)', value: 'MILK' },
    { label: 'Chorva sotuvi (Animal Sale)', value: 'ANIMAL_SALE' },
    { label: 'Go&apos;sht sotuvi (Meat)', value: 'MEAT' },
    { label: 'Yung sotuvi (Wool)', value: 'WOOL' },
    { label: 'Tuxum sotuvi (Egg)', value: 'EGG' },
    { label: 'Hosil sotuvi (Harvest)', value: 'HARVEST' },
    { label: 'Boshqa (Other)', value: 'OTHER' },
  ];

  const handleSubmit = () => {
    const amtNum = Number(amount);
    if (!title || !amtNum || amtNum <= 0) {
      Alert.alert('Xatolik', 'Sarlavha va 0 dan katta summa kiritilishi shart!');
      return;
    }

    financeService.addIncome({
      farmId: 'farm-001',
      title,
      category,
      amount: amtNum,
      currency: 'UZS',
      date,
      relatedAnimalId: relatedAnimalId || undefined,
      notes: notes || undefined,
    });

    Alert.alert(
      'Muvaffaqiyatli',
      category === 'ANIMAL_SALE' && relatedAnimalId
        ? 'Daromad saqlandi va hayvon holati SOTILGAN darajasiga yangilandi.'
        : 'Daromad saqlandi.'
    );
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Daromad Yozish</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppTextInput
          label="Daromad Sarlavhasi *"
          placeholder="Masalan: Kunlik 50L sut sotuvi yoki Qozonlik buqa sotildi"
          value={title}
          onChangeText={setTitle}
        />

        <AppSelect
          label="Kategoriya *"
          options={categoryOptions}
          selectedValue={category}
          onValueChange={(val) => setCategory(val as IncomeCategory)}
        />

        <AppTextInput
          label="Tushgan summa (so'mda) *"
          placeholder="Masalan: 3500000"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {category === 'ANIMAL_SALE' && (
          <AppTextInput
            label="Sotilgan hayvon Teg raqami / ID (Hayvonni SOTILGAN qilish uchun)"
            placeholder="Masalan: QOY-001 yoki MOL-102"
            value={relatedAnimalId}
            onChangeText={setRelatedAnimalId}
          />
        )}

        <AppDatePicker
          label="Sana *"
          value={date}
          onDateChange={setDate}
        />

        <AppTextInput
          label="Qo'shimcha izohlar"
          placeholder="Xaridor va sotuv ma'lumotlari..."
          multiline
          numberOfLines={3}
          style={{ height: 80 }}
          value={notes}
          onChangeText={setNotes}
        />

        <AppButton
          title="Daromadni Saqlash"
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
