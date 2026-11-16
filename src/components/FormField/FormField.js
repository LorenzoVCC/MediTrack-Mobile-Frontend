import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { colors, fonts } from '@/theme'

// Campo con etiqueta. Editable (TextInput) o de solo lectura (readOnly).
// Solo lectura + collapsible: arranca resumido en 2 líneas y se expande al tocarlo.
// unit: se muestra al lado del valor (ej. "kg"), salvo que el valor sea "—".
export default function FormField({
  label,
  value,
  onChangeText,
  readOnly = false,
  collapsible = false,
  unit,
  placeholder,
  error,
  hint,
  style,
  ...inputProps
}) {
  const [expanded, setExpanded] = useState(false)
  const [focused, setFocused] = useState(false)
  const display = value === null || value === undefined || value === '' ? '—' : String(value)

  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>

      {readOnly && collapsible && (
        <Pressable
          accessibilityRole="button"
          accessibilityHint={expanded ? 'Mostrar menos' : 'Mostrar el texto completo'}
          onPress={() => setExpanded(e => !e)}
          style={[styles.box, styles.readOnlyBox]}
        >
          <Text style={styles.value} numberOfLines={expanded ? undefined : 2}>{display}</Text>
          <Text style={styles.toggle}>{expanded ? 'Ver menos' : 'Ver más'}</Text>
        </Pressable>
      )}

      {readOnly && !collapsible && (
        <View style={[styles.box, styles.readOnlyBox, styles.row]}>
          <Text style={styles.value}>{display}</Text>
          {unit && display !== '—' ? <Text style={styles.unit}>{unit}</Text> : null}
        </View>
      )}

      {!readOnly && (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.box, styles.input, (focused || error) && styles.inputHighlight]}
          {...inputProps}
        />
      )}

      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  box: {
    minHeight: 46,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
  },
  readOnlyBox: {
    backgroundColor: colors.surfaceMuted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    flexShrink: 1,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 21,
    color: colors.text,
  },
  unit: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  toggle: {
    marginTop: 6,
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.accent,
  },
  input: {
    backgroundColor: colors.surface,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
  },
  inputHighlight: {
    borderColor: colors.accent,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.accent,
  },
  hint: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
})
