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
import { feedService } from '@/features/feed';
import { FeedTransactionType } from '@/types/domain';
import { AppTextInput, AppSelect, AppDatePicker, AppButton } from '@/components/ui';

export default function AddFeedTransactionScreen() {
  const { feedItemId, initialType } = useLocalSearchParams<{ feedItemId: string; initialType?: FeedTransactionType }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const feedItem = feedItemId ? feedService.getFeedItemById(feedItemId) : null;

  const [type, setType] = useState<FeedTransactionType>(initialType || 'IN');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const typeOptions: { label: string; value: FeedTransactionType }[] = [
    { label: 'Kirim (Sotib olindi / Yig&apos;ildi)', value: 'IN' },
    { label: 'Chiqim (Hayvonlarga berildi)', value: 'OUT' },
    { label: 'Yaroqsiz / Yo&apos;qotish (Waste)', value: 'WASTE' },
    { label: 'Tuzatish (Adjustment)', value: 'ADJUSTMENT' },
  ];

  const handleSubmit = () => {
    const qtyNum = Number(quantity);
    if (!qtyNum || qtyNum <= 0) {
      Alert.alert('Xatolik', 'Miqdor 0 dan katta bo\'lishi kerak!');
      return;
    }

    if (!feedItem) {
      Alert.alert('Xatolik', 'Yem turi ko\'rsatilmadi.');
      return;
    }

    // Business Rule Check: Warning if OUT or WASTE exceeds current quantity
    if ((type === 'OUT' || type === 'WASTE') && qtyNum > feedItem.currentQuantity) {
      Alert.alert(
        'Ogohlantirish: Qoldiq yetarli emas!',
        `Amaldagi qoldiq: ${feedItem.currentQuantity} ${feedItem.unit}. Siz ${qtyNum} ${feedItem.unit} chiqim qilmoqchisiz. Baribir davom ettirasizmi?`,
        [
          { text: 'Bekor qilish', style: 'cancel' },
          { text: 'Chiqim qilish', onPress: () => processSave(qtyNum) },
        ]
      );
      return;
    }

    processSave(qtyNum);
  };

  const processSave = (qtyNum: number) => {
    feedService.addTransaction({
      feedItemId: feedItem!.id,
      type,
      quantity: qtyNum,
      unit: feedItem!.unit,
      price: price ? Number(price) : undefined,
      date,
      notes: notes || undefined,
    });

    Alert.alert('Muvaffaqiyatli', 'Tranzaksiya saqlandi va qoldiq yangilandi.');
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Kirim / Chiqim Yozish</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {feedItem && (
          <View style={[styles.infoBanner, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.infoBannerText, { color: colors.primary }]}>
              Tanlangan Yem: {feedItem.name} (Qoldiq: {feedItem.currentQuantity} {feedItem.unit})
            </Text>
          </View>
        )}

        <AppSelect
          label="Operatsiya turi *"
          options={typeOptions}
          selectedValue={type}
          onValueChange={(val) => setType(val as FeedTransactionType)}
        />

        <AppTextInput
          label={`Miqdor (${feedItem?.unit || 'birlik'}) *`}
          placeholder="Masalan: 50"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />

        {type === 'IN' && (
          <AppTextInput
            label="Birlik narxi (so'mda, xarajatga yozish uchun)"
            placeholder="Masalan: 25000"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        )}

        <AppDatePicker
          label="Sana *"
          value={date}
          onDateChange={setDate}
        />

        <AppTextInput
          label="Izoh"
          placeholder="Qaysi podaga berilganligi va sababi..."
          multiline
          numberOfLines={3}
          style={{ height: 80 }}
          value={notes}
          onChangeText={setNotes}
        />

        <AppButton
          title="Tranzaksiyani Saqlash"
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
});
