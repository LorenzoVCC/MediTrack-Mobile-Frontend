import { StyleSheet, Text, View } from 'react-native'
import { colors, fonts } from '@/theme'

// Cabecera con el logo. Por ahora el logo es el texto "MediTrack" en Fraunces.
export default function AppHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.brand} accessibilityRole="header">MediTrack</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: colors.header,
  },
  brand: {
    fontFamily: fonts.title,
    fontSize: 22,
    color: colors.text,
  },
})
