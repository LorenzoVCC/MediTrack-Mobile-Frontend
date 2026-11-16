import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppHeader from '../AppHeader/AppHeader'
import { colors } from '@/theme'

// Base de todas las pantallas: zona segura arriba + cabecera + contenido.
// Abajo no hace falta: el menú de pestañas ya respeta la zona segura.
export default function Screen({ children }) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <AppHeader />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.header,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
})
