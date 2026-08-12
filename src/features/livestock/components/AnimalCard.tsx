import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { Animal } from '@/types/domain';

export interface AnimalCardProps {
  animal: Animal;
  onPress?: () => void;
}

export function AnimalCard({ animal, onPress }: AnimalCardProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.backgroundElement,
          borderColor: colors.cardBorder,
        },
      ]}>
      <View style={styles.headerRow}>
        <Text style={[styles.name, { color: colors.text }]}>{animal.name}</Text>
        <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.badgeText, { color: colors.primary }]}>{animal.type}</Text>
        </View>
      </View>
      <Text style={[styles.details, { color: colors.textSecondary }]}>
        {animal.breed} • {animal.birthDate} • {animal.weightKg} kg
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  details: {
    fontSize: 13,
  },
});
