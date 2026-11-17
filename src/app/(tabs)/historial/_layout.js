import { Stack } from 'expo-router'
import { colors } from '@/theme'

// slide_from_right: los detalles entran desde la derecha en Android; en iOS es el push nativo con gesto de volver.
// contentStyle con el fondo de la app para que no aparezca un flash blanco durante la transición.
const screenOptions = {
  headerShown: false,
  animation: 'slide_from_right',
  contentStyle: { backgroundColor: colors.background },
}

export default function HistorialLayout() {
  return <Stack screenOptions={screenOptions} />
}
