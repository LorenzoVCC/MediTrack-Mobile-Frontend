import { StyleSheet, View } from 'react-native'
import { colors } from '@/theme'

// Barra fija al pie del contenido (encima del menú de pestañas). Recibe los botones como children.
export default function BottomBar({ children }) {
  return <View style={styles.bar}>{children}</View>
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
})
