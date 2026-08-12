import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

export interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Yuklanmoqda...' }: LoadingStateProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  message: {
    fontSize: 14,
    marginTop: 12,
    fontWeight: '500',
  },
});
