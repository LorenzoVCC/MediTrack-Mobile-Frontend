import { StyleSheet, Text, View } from 'react-native'
import { colors, fonts } from '@/theme'

// Card blanca con título, para agrupar campos ("Información de la consulta", "Mediciones"...)
export default function InfoBlock({ title, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.body}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
  },
  title: {
    fontFamily: fonts.title,
    fontSize: 18,
    color: colors.text,
    marginBottom: 12,
  },
  body: {
    gap: 14,
  },
})
