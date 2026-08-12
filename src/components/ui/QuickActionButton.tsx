import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

export interface QuickActionButtonProps {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  accentColor?: string;
}

export function QuickActionButton({
  title,
  icon,
  onPress,
  accentColor,
}: QuickActionButtonProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const bg = accentColor ? `${accentColor}15` : colors.primaryLight;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.container, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}
      onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: bg }]}>
        {icon}
      </View>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    minWidth: 140,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
});
