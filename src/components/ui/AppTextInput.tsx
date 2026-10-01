import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

export interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export function AppTextInput({
  label,
  error,
  helperText,
  style,
  secureTextEntry,
  ...props
}: AppTextInputProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  // Eye toggle — only enabled when secureTextEntry is true
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = !!secureTextEntry;

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <View style={[
        styles.inputWrapper,
        {
          backgroundColor: colors.backgroundElement,
          borderColor: error ? colors.danger : colors.cardBorder,
        },
      ]}>
        <TextInput
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={isPassword && !showPassword}
          style={[
            styles.input,
            { color: colors.text },
            isPassword && styles.inputWithIcon,
            style,
          ]}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            style={styles.eyeBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            {showPassword
              ? <Eye size={20} color={colors.textSecondary} />
              : <EyeOff size={20} color={colors.textSecondary} />}
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
      ) : helperText ? (
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>{helperText}</Text>
      ) : null}
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 14,
    fontSize: 15,
  },
  inputWithIcon: {
    paddingRight: 0,
  },
  eyeBtn: {
    paddingHorizontal: 14,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
});
