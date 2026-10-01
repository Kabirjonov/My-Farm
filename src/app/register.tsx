import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Tractor, ArrowLeft } from 'lucide-react-native';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { useAuth, UserRole } from '@/features/auth';
import { useTranslation } from '@/i18n';
import { AppTextInput, AppSelect, AppButton } from '@/components/ui';

export default function RegisterScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const { register } = useAuth();
  const { t } = useTranslation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [farmName, setFarmName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('OWNER');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const roleOptions: { label: string; value: UserRole }[] = [
    { label: t('roleOWNER'), value: 'OWNER' },
    { label: t('roleMANAGER'), value: 'MANAGER' },
    { label: t('roleWORKER'), value: 'WORKER' },
    { label: t('roleVET'), value: 'VET' },
  ];

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim()) {
      setErrorMsg('Ism-familiya va Email kiritilishi shart!');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Parol kamida 6 ta belgidan iborat bo\'lishi kerak!');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      await register(fullName.trim(), email.trim(), password, farmName.trim() || 'Mening Fermam');
      router.replace('/');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Xatolik yuz berdi. Qayta urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: C.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>

      {/* Top Header */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: C.text }]}>{t('registerBtn')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Register Card */}
      <View style={[styles.card, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.logoIcon, { backgroundColor: C.primary }]}>
            <Tractor size={24} color="#fff" />
          </View>
          <View>
            <Text style={[styles.cardTitle, { color: C.text }]}>{t('registerBtn')}</Text>
            <Text style={[styles.cardSub, { color: C.textSecondary }]}>Yangi ferma hisobini yarating</Text>
          </View>
        </View>

        {errorMsg ? (
          <View style={[styles.errorBanner, { backgroundColor: C.dangerLight }]}>
            <Text style={[styles.errorText, { color: C.danger }]}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* Full Name Input */}
        <AppTextInput
          label={`${t('fullName')} *`}
          placeholder="masalan: Alisher Oxunjonov"
          value={fullName}
          onChangeText={setFullName}
        />

        {/* Email Input */}
        <AppTextInput
          label={`${t('email')} *`}
          placeholder="masalan: alisher@myfarm.uz"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Farm Name Input */}
        <AppTextInput
          label={t('farmName')}
          placeholder="masalan: Vodiy Agro Ferma"
          value={farmName}
          onChangeText={setFarmName}
        />

        {/* Role Select */}
        <AppSelect
          label={t('role')}
          options={roleOptions}
          selectedValue={role}
          onValueChange={(val) => setRole(val as UserRole)}
        />

        {/* Password Input */}
        <AppTextInput
          label={t('password')}
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <AppButton
          title={t('registerBtn')}
          onPress={handleRegister}
          style={{ marginTop: 8 }}
        />

        {/* Login Link */}
        <TouchableOpacity
          style={styles.switchAuthRow}
          onPress={() => router.push('/login' as any)}>
          <Text style={[styles.switchText, { color: C.textSecondary }]}>
            {t('alreadyHaveAccount')}
          </Text>
          <Text style={[styles.switchLink, { color: C.primary }]}>
            {t('loginBtn')}
          </Text>
        </TouchableOpacity>
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
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 20, fontWeight: '800' },
  cardSub: { fontSize: 12 },

  errorBanner: {
    padding: 10,
    borderRadius: Radius.md,
  },
  errorText: { fontSize: 13, fontWeight: '600' },

  switchAuthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  switchText: { fontSize: 13 },
  switchLink: { fontSize: 13, fontWeight: '800' },
});
