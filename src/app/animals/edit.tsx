import React, { useEffect } from 'react';
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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { animalFormSchema, AnimalFormInputs, livestockService } from '@/features/livestock';
import { AnimalGender } from '@/types/domain';
import { AppTextInput, AppSelect, AppButton } from '@/components/ui';

export default function EditAnimalScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const isEditing = Boolean(id);
  const existingAnimal = id ? livestockService.getAnimalById(id) : null;

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AnimalFormInputs>({
    resolver: zodResolver(animalFormSchema),
    defaultValues: {
      tagNumber: '',
      type: 'SHEEP',
      gender: 'FEMALE',
      breed: '',
      weight: 45,
      status: 'HEALTHY',
      notes: '',
    },
  });

  useEffect(() => {
    if (existingAnimal) {
      setValue('tagNumber', existingAnimal.tagNumber);
      setValue('name', existingAnimal.name ?? '');
      setValue('type', existingAnimal.type);
      setValue('gender', existingAnimal.gender);
      setValue('breed', existingAnimal.breed);
      setValue('weight', existingAnimal.weightKg);
      setValue(
        'status',
        existingAnimal.healthStatus === 'PREGNANT' ||
          existingAnimal.healthStatus === 'TREATMENT' ||
          existingAnimal.healthStatus === 'SICK'
          ? existingAnimal.healthStatus
          : 'HEALTHY'
      );
      setValue('notes', existingAnimal.notes ?? '');
    }
  }, [existingAnimal, setValue]);

  const typeOptions = [
    { label: "Qo'y", value: 'SHEEP' },
    { label: 'Mol', value: 'COW' },
    { label: 'Echki', value: 'GOAT' },
    { label: 'Ot', value: 'HORSE' },
    { label: 'Tovuq', value: 'CHICKEN' },
    { label: 'Boshqa', value: 'OTHER' },
  ];

  const genderOptions = [
    { label: "Urg'ochi (Female)", value: 'FEMALE' },
    { label: 'Erkak (Male)', value: 'MALE' },
  ];

  const healthOptions = [
    { label: "Sog'lom", value: 'HEALTHY' },
    { label: 'Kasal', value: 'SICK' },
    { label: 'Davolanishda', value: 'TREATMENT' },
    { label: 'Homilador', value: 'PREGNANT' },
  ];

  const onSubmit = (data: AnimalFormInputs) => {
    const farmId = 'farm-001';

    // Unique tag validation
    const isUnique = livestockService.isTagUnique(data.tagNumber, farmId, id);
    if (!isUnique) {
      setError('tagNumber', { message: 'Ushbu teg raqami allaqachon mavjud!' });
      return;
    }

    if (isEditing && id) {
      livestockService.updateAnimal(id, {
        tagNumber: data.tagNumber,
        name: data.name,
        type: data.type,
        gender: data.gender as AnimalGender,
        breed: data.breed,
        weightKg: data.weight,
        healthStatus: data.status,
        notes: data.notes,
      });
      Alert.alert('Muvaffaqiyatli', "Hayvon ma'lumotlari yangilandi.");
    } else {
      livestockService.addAnimal({
        farmId,
        tagNumber: data.tagNumber,
        name: data.name,
        type: data.type,
        gender: data.gender as AnimalGender,
        breed: data.breed,
        birthDate: new Date().toISOString().split('T')[0],
        weightKg: data.weight,
        status: 'ACTIVE',
        healthStatus: data.status,
        notes: data.notes,
      });
      Alert.alert('Muvaffaqiyatli', "Yangi hayvon ro'yxatga olindi.");
    }

    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          {isEditing ? "Hayvonni Tahrirlash" : "Yangi Hayvon Qo'shish"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Type Select */}
        <Controller
          control={control}
          name="type"
          render={({ field: { value, onChange } }) => (
            <AppSelect
              label="Hayvon turi *"
              options={typeOptions}
              selectedValue={value}
              onValueChange={onChange}
              error={errors.type?.message}
            />
          )}
        />

        {/* Tag Number */}
        <Controller
          control={control}
          name="tagNumber"
          render={({ field: { value, onChange } }) => (
            <AppTextInput
              label="Teg raqami (Tag Number) *"
              placeholder="Masalan: QOY-501"
              value={value || ''}
              onChangeText={onChange}
              error={errors.tagNumber?.message}
            />
          )}
        />

        {/* Gender */}
        <Controller
          control={control}
          name="gender"
          render={({ field: { value, onChange } }) => (
            <AppSelect
              label="Jinsi *"
              options={genderOptions}
              selectedValue={value}
              onValueChange={onChange}
              error={errors.gender?.message}
            />
          )}
        />

        {/* Name */}
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange } }) => (
            <AppTextInput
              label="Laqabi / Nomi (ixtiyoriy)"
              placeholder="Masalan: Oqboy"
              value={value || ''}
              onChangeText={onChange}
              error={errors.name?.message}
            />
          )}
        />

        {/* Breed */}
        <Controller
          control={control}
          name="breed"
          render={({ field: { value, onChange } }) => (
            <AppTextInput
              label="Zoti *"
              placeholder="Masalan: Hisori, Golshtin, Anglis"
              value={value || ''}
              onChangeText={onChange}
              error={errors.breed?.message}
            />
          )}
        />

        {/* Weight */}
        <Controller
          control={control}
          name="weight"
          render={({ field: { value, onChange } }) => (
            <AppTextInput
              label="Vazn (kg) *"
              placeholder="Masalan: 65"
              keyboardType="numeric"
              value={value ? String(value) : ''}
              onChangeText={(val) => onChange(Number(val) || 0)}
              error={errors.weight?.message}
            />
          )}
        />

        {/* Health Status */}
        <Controller
          control={control}
          name="status"
          render={({ field: { value, onChange } }) => (
            <AppSelect
              label="Sog'liq holati *"
              options={healthOptions}
              selectedValue={value}
              onValueChange={onChange}
              error={errors.status?.message}
            />
          )}
        />

        {/* Notes */}
        <Controller
          control={control}
          name="notes"
          render={({ field: { value, onChange } }) => (
            <AppTextInput
              label="Qo'shimcha izohlar"
              placeholder="Tashqi belgilari, emlanganligi haqida..."
              multiline
              numberOfLines={3}
              style={{ height: 80 }}
              value={value || ''}
              onChangeText={onChange}
              error={errors.notes?.message}
            />
          )}
        />

        <AppButton
          title={isEditing ? "O'zgarishlarni Saqlash" : "Saqlash va Qo'shish"}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          style={{ marginTop: 12 }}
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
    fontSize: 20,
    fontWeight: '800',
  },
  content: {
    padding: 16,
    gap: 4,
  },
});
