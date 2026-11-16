import { StyleSheet, Text, View } from 'react-native'
import { colors, fonts } from '@/theme'

const VARIANTS = {
  Reservado: { bg: colors.greenSoft, text: colors.green },
  Cancelado: { bg: colors.accentSoft, text: colors.accent },
  Finalizado: { bg: '#F3EEE7', text: colors.textSecondary },
  'Por confirmar': { bg: '#FBF1DE', text: '#8A5A0A' },
}

export default function StatusBadge({ status }) {
  const variant = VARIANTS[status] ?? VARIANTS.Finalizado
  return (
    <View style={[styles.badge, { backgroundColor: variant.bg }]}>
      <Text style={[styles.text, { color: variant.text }]}>{status}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  text: {
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
})
