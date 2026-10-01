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
import { useQueryClient } from '@tanstack/react-query';
import { Colors } from '@/constants/theme';
import { reminderRepository } from '@/lib/db/repositories/reminderRepository';
import { AppTextInput, AppDatePicker, AppButton } from '@/components/ui';

export default function AddReminderScreen() {
  const { animalId, tagNumber } = useLocalSearchParams<{ animalId?: string; tagNumber?: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(tagNumber ? `${tagNumber} - ` : '');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Xatolik', 'Eslatma sarlavhasi kiritilishi shart!');
      return;
    }

    if (!dueDate) {
      Alert.alert('Xatolik', 'Bajarilish sanasi kiritilishi shart!');
      return;
    }

    reminderRepository.create({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate,
      isCompleted: false,
      relatedEntityName: animalId ? 'Animal' : undefined,
      relatedEntityId: animalId || undefined,
    });

    queryClient.invalidateQueries({ queryKey: ['reminders'] });

    Alert.alert('Muvaffaqiyatli', 'Eslatma saqlandi.');
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Eslatma Qo'shish</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppTextInput
          label="Eslatma Sarlavhasi *"
          placeholder="Masalan: Vetsanoat ko'rigi yoki Vitamin berish"
          value={title}
          onChangeText={setTitle}
        />

        <AppDatePicker
          label="Bajarilish Sanasi *"
          value={dueDate}
          onDateChange={setDueDate}
        />

        <AppTextInput
          label="Batafsil Izoh (ixtiyoriy)"
          placeholder="Qo'shimcha eslatmalar va ma'lumotlar..."
          multiline
          numberOfLines={3}
          style={{ height: 80 }}
          value={description}
          onChangeText={setDescription}
        />

        <AppButton
          title="Eslatmani Saqlash"
          onPress={handleSubmit}
          style={{ marginTop: 16 }}
        />
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
    fontSize: 20,
    fontWeight: '800',
  },
  content: {
    padding: 16,
    gap: 12,
  },
});
