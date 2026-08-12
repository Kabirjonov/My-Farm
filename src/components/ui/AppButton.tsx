import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  useColorScheme,
} from 'react-native';
import { Colors } from '@/constants/theme';

export interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function AppButton({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled,
  style,
  textStyle,
  ...props
}: AppButtonProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.backgroundSelected,
          textColor: colors.text,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.cardBorder,
          borderWidth: 1,
          textColor: colors.text,
        };
      case 'danger':
        return {
          backgroundColor: colors.danger,
          textColor: '#ffffff',
        };
      case 'primary':
      default:
        return {
          backgroundColor: colors.primary,
          textColor: '#ffffff',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 6, paddingHorizontal: 12, fontSize: 13 };
      case 'large':
        return { paddingVertical: 14, paddingHorizontal: 24, fontSize: 17 };
      case 'medium':
      default:
        return { paddingVertical: 10, paddingHorizontal: 18, fontSize: 15 };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: vStyles.backgroundColor },
        vStyles.borderColor ? { borderColor: vStyles.borderColor, borderWidth: vStyles.borderWidth } : undefined,
        { paddingVertical: sStyles.paddingVertical, paddingHorizontal: sStyles.paddingHorizontal },
        (disabled || loading) && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}>
      {loading ? (
        <ActivityIndicator color={vStyles.textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: vStyles.textColor, fontSize: sStyles.fontSize }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '700',
  },
});
