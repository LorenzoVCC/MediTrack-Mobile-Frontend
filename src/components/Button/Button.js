import { Pressable, StyleSheet, Text } from 'react-native'
import { colors, fonts } from '@/theme'

// variant: 'primary' (relleno acento) | 'secondary' (borde neutro) | 'destructive' (borde y texto acento)
export default function Button({ label, onPress, variant = 'primary', disabled = false, style }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, styles[`${variant}Label`]]} numberOfLines={2}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  destructive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    textAlign: 'center',
  },
  primaryLabel: {
    color: colors.surface,
  },
  secondaryLabel: {
    color: colors.textSecondary,
  },
  destructiveLabel: {
    color: colors.accent,
  },
})
