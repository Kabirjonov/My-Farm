import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { AlertCircle } from 'lucide-react-native';
import { AppButton } from './AppButton';

export interface ErrorStateProps {
  title?: string;
  error?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Xatolik yuz berdi',
  error = 'Ma’lumotlarni yuklashda muammo bo’ldi.',
  onRetry,
}: ErrorStateProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <View style={styles.container}>
      <AlertCircle size={40} color={colors.danger} />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.errorText, { color: colors.textSecondary }]}>{error}</Text>
      {onRetry && (
        <AppButton title="Qayta urinish" onPress={onRetry} variant="outline" size="small" style={styles.button} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});
