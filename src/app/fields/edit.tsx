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
import { landService } from '@/features/crops';
import { AreaUnit } from '@/types/domain';
import { AppTextInput, AppSelect, AppButton } from '@/components/ui';

export default function AddFieldScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('HECTARE');
  const [location, setLocation] = useState('');
  const [soilType, setSoilType] = useState('');
  const [waterSource, setWaterSource] = useState('');
  const [notes, setNotes] = useState('');

  const unitOptions: { label: string; value: AreaUnit }[] = [
    { label: 'Gektar (Hectare)', value: 'HECTARE' },
    { label: 'Sotix (Sotix)', value: 'SOTIX' },
    { label: 'Kvadrat Metr (SQM)', value: 'SQM' },
  ];

  const handleSubmit = () => {
    if (!name || !area) {
      Alert.alert('Xatolik', 'Maydon nomi va maydoni kiritilishi shart!');
      return;
    }

    landService.createField({
      farmId: 'farm-001',
      name,
      area: Number(area) || 0,
      areaUnit,
      location: location || undefined,
      soilType: soilType || undefined,
      waterSource: waterSource || undefined,
      notes: notes || undefined,
    });

    Alert.alert('Muvaffaqiyatli', 'Yangi yer maydoni saqlandi.');
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Yangi Yer Qo&apos;shish</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppTextInput
          label="Yer Maydoni Nomi *"
          placeholder="Masalan: Shimoliy 5-Gektar Maydon"
          value={name}
          onChangeText={setName}
        />

        <AppTextInput
          label="Maydoni o'lchami *"
          placeholder="Masalan: 5"
          keyboardType="numeric"
          value={area}
          onChangeText={setArea}
        />

        <AppSelect
          label="O'lchov birligi *"
          options={unitOptions}
          selectedValue={areaUnit}
          onValueChange={(val) => setAreaUnit(val as AreaUnit)}
        />

        <AppTextInput
          label="Joylashuvi / Xaritadagi o'rni"
          placeholder="Masalan: Katta ariq bo'yi"
          value={location}
          onChangeText={setLocation}
        />

        <AppTextInput
          label="Tuproq turi"
          placeholder="Masalan: Qora tuproq, Qumloq"
          value={soilType}
          onChangeText={setSoilType}
        />

        <AppTextInput
          label="Suv manbai"
          placeholder="Masalan: Kanal, Artezian quduq"
          value={waterSource}
          onChangeText={setWaterSource}
        />

        <AppTextInput
          label="Qo'shimcha izohlar"
          placeholder="Ekin rotatsiyasi va unumdorligi haqida..."
          multiline
          numberOfLines={3}
          style={{ height: 80 }}
          value={notes}
          onChangeText={setNotes}
        />

        <AppButton
          title="Yer Maydonini Saqlash"
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
