import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Calendar } from 'lucide-react-native';

export interface AppDatePickerProps {
  label?: string;
  value: string; // ISO date format YYYY-MM-DD
  onDateChange: (date: string) => void;
  error?: string;
}

export function AppDatePicker({
  label,
  value,
  onDateChange,
  error,
}: AppDatePickerProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  // Default to today if not provided
  const currentDate = value || new Date().toISOString().split('T')[0];

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          // Fallback date setter for web / simple mobile input
          onDateChange(currentDate);
        }}
        style={[
          styles.dateButton,
          {
            backgroundColor: colors.backgroundElement,
            borderColor: error ? colors.danger : colors.cardBorder,
          },
        ]}>
        <Calendar size={18} color={colors.primary} />
        <Text style={[styles.dateText, { color: colors.text }]}>{currentDate}</Text>
      </TouchableOpacity>
      {error && <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  dateButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
