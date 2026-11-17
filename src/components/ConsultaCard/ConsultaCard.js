import { memo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Chevron from '../Chevron/Chevron'
import PressableScale from '../PressableScale/PressableScale'
import { colors, fonts } from '@/theme'

// Tarjeta de una consulta del historial. Recibe los textos ya formateados.
// onPress(id): la lista pasa un callback estable, así memo evita re-renderizar las tarjetas que no cambian.
function ConsultaCard({ id, date, reason, doctorName, onPress }) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`Consulta del ${date}: ${reason}, con ${doctorName}`}
      onPress={() => onPress(id)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.body}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.reason} numberOfLines={2}>{reason || '—'}</Text>
        <Text style={styles.doctor} numberOfLines={1}>{doctorName}</Text>
      </View>
      <Chevron direction="right" />
    </PressableScale>
  )
}

export default memo(ConsultaCard)

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
