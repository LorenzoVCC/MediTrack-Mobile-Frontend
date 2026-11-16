import { Pressable, StyleSheet, Text, View } from 'react-native'
import Chevron from '../Chevron/Chevron'
import { colors, fonts } from '@/theme'

// Tarjeta de una consulta del historial. Recibe los textos ya formateados.
export default function ConsultaCard({ date, reason, doctorName, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Consulta del ${date}: ${reason}, con ${doctorName}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.body}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.reason} numberOfLines={2}>{reason || '—'}</Text>
        <Text style={styles.doctor} numberOfLines={1}>{doctorName}</Text>
      </View>
      <Chevron direction="right" />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  date: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  reason: {
    fontFamily: fonts.title,
    fontSize: 17,
    color: colors.text,
  },
  doctor: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
})
