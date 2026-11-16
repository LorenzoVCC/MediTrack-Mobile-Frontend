import { Pressable, StyleSheet, Text, View } from 'react-native'
import Chevron from '../Chevron/Chevron'
import StatusBadge from '../StatusBadge/StatusBadge'
import { colors, fonts } from '@/theme'

// Tarjeta de un turno. Recibe los textos ya formateados; muted atenúa los pasados o cancelados.
export default function TurnoCard({ date, time, doctorName, status, muted = false, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Turno del ${date} a las ${time}, con ${doctorName}. ${status}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, muted && styles.muted, pressed && styles.pressed]}
    >
      <View style={styles.body}>
        <View style={styles.top}>
          <Text style={styles.date} numberOfLines={1}>{date}</Text>
          <StatusBadge status={status} />
        </View>
        <Text style={styles.time}>{time}</Text>
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
  muted: {
    opacity: 0.7,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  date: {
    flexShrink: 1,
    fontFamily: fonts.title,
    fontSize: 17,
    color: colors.text,
  },
  time: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.text,
  },
  doctor: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
})
