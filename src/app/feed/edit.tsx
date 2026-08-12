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
import { feedService } from '@/features/feed';
import { FeedUnit } from '@/types/domain';
import { AppTextInput, AppSelect, AppButton } from '@/components/ui';

export default function AddFeedItemScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Ozuqa');
  const [unit, setUnit] = useState<FeedUnit>('BALE');
  const [currentQuantity, setCurrentQuantity] = useState('0');
  const [minQuantity, setMinQuantity] = useState('10');
  const [notes, setNotes] = useState('');

  const unitOptions: { label: string; value: FeedUnit }[] = [
    { label: 'Press (Bale)', value: 'BALE' },
    { label: 'Kilogram (Kg)', value: 'KG' },
    { label: 'Tonna (Ton)', value: 'TON' },
    { label: 'Qop (Bag)', value: 'BAG' },
    { label: 'Litr (Liter)', value: 'LITER' },
    { label: 'Dona (Piece)', value: 'PIECE' },
  ];

  const handleSubmit = () => {
    if (!name) {
      Alert.alert('Xatolik', 'Yem nomi kiritilishi shart!');
      return;
    }

    feedService.createFeedItem({
      farmId: 'farm-001',
      name,
      category,
      unit,
      currentQuantity: Number(currentQuantity) || 0,
      minQuantity: Number(minQuantity) || 0,
      notes: notes || undefined,
    });

    Alert.alert('Muvaffaqiyatli', 'Yangi yem zaxiraga saqlandi.');
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Yangi Yem Turi Qo&apos;shish</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppTextInput
          label="Yem nomi *"
          placeholder="Masalan: Beda (press), Somon, Arpa"
          value={name}
          onChangeText={setName}
        />

        <AppTextInput
          label="Kategoriya (ixtiyoriy)"
          placeholder="Masalan: Quruq yem, Don, Silos"
          value={category}
          onChangeText={setCategory}
        />

        <AppSelect
          label="O'lchov birligi *"
          options={unitOptions}
          selectedValue={unit}
          onValueChange={(val) => setUnit(val as FeedUnit)}
        />

        <AppTextInput
          label="Boshlang'ich qoldiq miqdori *"
          placeholder="0"
          keyboardType="numeric"
          value={currentQuantity}
          onChangeText={setCurrentQuantity}
        />

        <AppTextInput
          label="Minimal ogohlantirish qoldig'i (Min quantity) *"
          placeholder="10"
          keyboardType="numeric"
          value={minQuantity}
          onChangeText={setMinQuantity}
        />

        <AppTextInput
          label="Qo'shimcha izohlar"
          placeholder="Ombordagi joyi va sifati haqida..."
          multiline
          numberOfLines={3}
          style={{ height: 80 }}
          value={notes}
          onChangeText={setNotes}
        />

        <AppButton
          title="Yem Turini Saqlash"
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
