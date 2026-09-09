import React, { useState } from 'react';
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
import { Lock, Mail, Tractor, ArrowRight, UserCheck } from 'lucide-react-native';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { useAuth } from '@/features/auth';
import { useTranslation } from '@/i18n';
import { AppTextInput, AppButton } from '@/components/ui';

export default function LoginScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = () => {
    if (!email.trim()) {
      setErrorMsg('Email kiritilishi shart!');
      return;
    }
    setErrorMsg('');
    login(email, password);
    Alert.alert(t('success'), 'Tizimga muvaffaqiyatli kirdingiz!');
    router.replace('/');
  };

  const handleDemoFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('123456');
    setErrorMsg('');
    login(demoEmail, '123456');
    router.replace('/');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: C.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>

      {/* Header / Brand Logo */}
      <View style={styles.brandHeader}>
        <View style={[styles.logoCircle, { backgroundColor: C.primary }]}>
          <Tractor size={38} color="#fff" />
        </View>
        <Text style={[styles.brandTitle, { color: C.text }]}>{t('appName')}</Text>
        <Text style={[styles.brandSubtitle, { color: C.textSecondary }]}>
          Ferma boshqaruvi va chorvachilik tizimi
        </Text>
      </View>

      {/* Login Card */}
      <View style={[styles.card, { backgroundColor: C.backgroundElement, ...Shadow.card }]}>
        <Text style={[styles.cardTitle, { color: C.text }]}>{t('loginBtn')}</Text>

        {errorMsg ? (
          <View style={[styles.errorBanner, { backgroundColor: C.dangerLight }]}>
            <Text style={[styles.errorText, { color: C.danger }]}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* Email Input */}
        <AppTextInput
          label={t('email')}
          placeholder="masalan: fermer@myfarm.uz"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
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
          title={t('loginBtn')}
          onPress={handleLogin}
          style={{ marginTop: 8 }}
        />

        {/* Register Link */}
        <TouchableOpacity
          style={styles.switchAuthRow}
          onPress={() => router.push('/register' as any)}>
          <Text style={[styles.switchText, { color: C.textSecondary }]}>
            {t('dontHaveAccount')}
          </Text>
          <Text style={[styles.switchLink, { color: C.primary }]}>
            {t('registerBtn')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Demo Quick Fill Buttons */}
      <View style={styles.demoSection}>
        <Text style={[styles.demoTitle, { color: C.textSecondary }]}>
          ⚡ {t('demoAccounts')}:
        </Text>
        <View style={styles.demoButtonsRow}>
          <TouchableOpacity
            style={[styles.demoBtn, { backgroundColor: C.successLight }]}
            onPress={() => handleDemoFill('owner@myfarm.uz')}>
            <UserCheck size={14} color={C.primary} />
            <Text style={[styles.demoBtnText, { color: C.primary }]}>
              {t('ownerDemo')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoBtn, { backgroundColor: '#E3F2FD' }]}
            onPress={() => handleDemoFill('manager@myfarm.uz')}>
            <UserCheck size={14} color={C.accentBlue} />
            <Text style={[styles.demoBtnText, { color: C.accentBlue }]}>
              {t('managerDemo')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoBtn, { backgroundColor: C.warningLight }]}
            onPress={() => handleDemoFill('worker@myfarm.uz')}>
            <UserCheck size={14} color={C.accentAmber} />
            <Text style={[styles.demoBtnText, { color: C.accentAmber }]}>
              {t('workerDemo')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    padding: 20,
    paddingTop: 80,
    gap: 20,
  },

  brandHeader: {
    alignItems: 'center',
    gap: 8,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  brandTitle: { fontSize: 24, fontWeight: '900', textAlign: 'center' },
  brandSubtitle: { fontSize: 13, textAlign: 'center' },

  card: {
    padding: 20,
    borderRadius: Radius.xl,
    gap: 12,
  },
  cardTitle: { fontSize: 20, fontWeight: '800', marginBottom: 4 },

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

  demoSection: { gap: 8 },
  demoTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  demoButtonsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.md,
  },
  demoBtnText: { fontSize: 12, fontWeight: '700' },
});
