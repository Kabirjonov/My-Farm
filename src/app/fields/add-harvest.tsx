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
import { HarvestQuality } from '@/types/domain';
import { AppTextInput, AppSelect, AppDatePicker, AppButton } from '@/components/ui';

export default function AddHarvestScreen() {
  const { cropSeasonId } = useLocalSearchParams<{ cropSeasonId: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const cropSeason = cropSeasonId ? landService.getCropSeasonById(cropSeasonId) : null;

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('TON');
  const [quality, setQuality] = useState<HarvestQuality>('HIGH');
  const [soldQuantity, setSoldQuantity] = useState('');
  const [soldAmount, setSoldAmount] = useState('');
  const [notes, setNotes] = useState('');

  const qualityOptions: { label: string; value: HarvestQuality }[] = [
    { label: 'Yuqori Sifat (High)', value: 'HIGH' },
    { label: 'O&apos;rta Sifat (Medium)', value: 'MEDIUM' },
    { label: 'Past Sifat (Low)', value: 'LOW' },
    { label: 'Aralash (Mixed)', value: 'MIXED' },
  ];

  const unitOptions = [
    { label: 'Tonna (Ton)', value: 'TON' },
    { label: 'Kilogram (Kg)', value: 'KG' },
    { label: 'Qop (Bag)', value: 'BAG' },
  ];

  const handleSubmit = () => {
    const qtyNum = Number(quantity);
    if (!qtyNum || qtyNum <= 0) {
      Alert.alert('Xatolik', 'Hosil miqdori 0 dan katta kiritilishi shart!');
      return;
    }

    if (!cropSeasonId) {
      Alert.alert('Xatolik', 'Ekin mavsumi ko\'rsatilmadi.');
      return;
    }

    landService.addHarvestRecord({
      cropSeasonId,
      date,
      quantity: qtyNum,
      unit,
      quality,
      soldQuantity: soldQuantity ? Number(soldQuantity) : undefined,
      soldAmount: soldAmount ? Number(soldAmount) : undefined,
      notes: notes || undefined,
    }, true);

    Alert.alert('Muvaffaqiyatli', 'Hosil yig\'im yozuvi saqlandi va ekin holati YIG\'ILGAN statusiga o\'tkazildi.');
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Hosil Yig&apos;imini Kiritish</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {cropSeason && (
          <View style={[styles.infoBanner, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.infoBannerText, { color: colors.primary }]}>
              Ekin: {cropSeason.cropName} ({cropSeason.seasonYear})
            </Text>
          </View>
        )}

        <AppDatePicker
          label="Hosil yig'ilgan sana *"
          value={date}
          onDateChange={setDate}
        />

        <AppTextInput
          label="Jami yig'ib olingan hosil miqdori *"
          placeholder="Masalan: 14.2"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />

        <AppSelect
          label="Hosil birligi *"
          options={unitOptions}
          selectedValue={unit}
          onValueChange={setUnit}
        />

        <AppSelect
          label="Hosil sifati *"
          options={qualityOptions}
          selectedValue={quality}
          onValueChange={(val) => setQuality(val as HarvestQuality)}
        />

        <Text style={[styles.sectionHeading, { color: colors.text }]}>Sotuv va Daromad Ma&apos;lumotlari (ixtiyoriy)</Text>

        <AppTextInput
          label="Sotilgan hosil miqdori"
          placeholder="Masalan: 10.0"
          keyboardType="numeric"
          value={soldQuantity}
          onChangeText={setSoldQuantity}
        />

        <AppTextInput
          label="Sotuvdan tushgan daromad (so&apos;mda, Moliya bo&apos;limiga o&apos;tadi)"
          placeholder="Masalan: 35000000"
          keyboardType="numeric"
          value={soldAmount}
          onChangeText={setSoldAmount}
        />

        <AppTextInput
          label="Qo'shimcha izohlar"
          placeholder="Omborga topshirilganligi va xaridor haqida..."
          multiline
          numberOfLines={3}
          style={{ height: 80 }}
          value={notes}
          onChangeText={setNotes}
        />

        <AppButton
          title="Hosil Yozuvini Saqlash"
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
