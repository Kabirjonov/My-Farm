import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, UserCheck } from 'lucide-react-native';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { useAuth } from '@/features/auth';
import { useTranslation } from '@/i18n';
import { AppTextInput, AppButton } from '@/components/ui';

export default function ProfileEditScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const { t } = useTranslation();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [farmName, setFarmName] = useState(user?.currentFarmName || '');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
      setFarmName(user.currentFarmName || '');
    }
  }, [user]);

  const handleSave = () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert(t('error'), 'Ism va email bo\'sh bo\'lishi mumkin emas.');
      return;
    }
    updateProfile({
      fullName,
      email,
      currentFarmName: farmName,
    });
    Alert.alert(t('success'), 'Profil ma\'lumotlari yangilandi!');
    router.back();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: C.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: C.text }]}>{t('profileEdit')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Profile Edit Card */}
      <View style={[styles.card, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>
        <View style={styles.avatarRow}>
          <View style={[styles.avatar, { backgroundColor: C.primary }]}>
            <Text style={styles.avatarText}>
              {(fullName || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.avatarMeta}>
            <Text style={[styles.userName, { color: C.text }]}>{user?.fullName}</Text>
            <Text style={[styles.userRole, { color: C.primary }]}>
              {t(`role${user?.role || 'OWNER'}` as any)}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: C.divider }]} />

        {/* Full Name */}
        <AppTextInput
          label={t('fullName')}
          value={fullName}
          onChangeText={setFullName}
          placeholder="masalan: Alisher Oxunjonov"
        />

        {/* Email */}
        <AppTextInput
          label={t('email')}
          value={email}
          onChangeText={setEmail}
          placeholder="masalan: alisher@myfarm.uz"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Farm Name */}
        <AppTextInput
          label={t('farmName')}
          value={farmName}
          onChangeText={setFarmName}
          placeholder="masalan: Chorvador Ferma"
        />

        <AppButton
          title={t('saveChanges')}
          onPress={handleSave}
          style={{ marginTop: 8 }}
        />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    padding: 20,
    paddingTop: 56,
    gap: 16,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800' },

  card: {
    padding: 20,
    borderRadius: Radius.xl,
    gap: 14,
  },

  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  avatarMeta: { gap: 2 },
  userName: { fontSize: 18, fontWeight: '800' },
  userRole: { fontSize: 12, fontWeight: '700' },

  divider: { height: 1 },
});
