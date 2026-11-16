import { StyleSheet, Text, View } from 'react-native'
import { colors, fonts } from '@/theme'

// Título de sección de cada pantalla, con un subtítulo opcional (ej. "4 consultas")
export default function ScreenTitle({ title, subtitle }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title} accessibilityRole="header">{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 2,
    marginBottom: 4,
  },
  title: {
    fontFamily: fonts.title,
    fontSize: 24,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
})
