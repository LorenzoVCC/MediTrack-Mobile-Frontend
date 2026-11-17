import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated'

// Solo se animan las primeras tarjetas (las que se ven al entrar); el resto aparece directo
const MAX_ANIMATED_ITEMS = 8
const STAGGER_MS = 50
const ITEM_MS = 250
const OFFSET_Y = 16
export const ENTRANCE_TOTAL_MS = STAGGER_MS * (MAX_ANIMATED_ITEMS - 1) + ITEM_MS

// Envoltorio de una tarjeta de lista: fade + subida corta (tipo FadeInDown), escalonado según index.
// progress es el shared value de useListEntrance; el cálculo corre en el hilo de UI.
export default function ListEntryItem({ index, progress, children }) {
  const style = useAnimatedStyle(() => {
    if (index >= MAX_ANIMATED_ITEMS) return { opacity: 1, transform: [{ translateY: 0 }] }
    const start = (index * STAGGER_MS) / ENTRANCE_TOTAL_MS
    const end = (index * STAGGER_MS + ITEM_MS) / ENTRANCE_TOTAL_MS
    const t = interpolate(progress.value, [start, end], [0, 1], Extrapolation.CLAMP)
    const eased = 1 - Math.pow(1 - t, 3) // ease-out cúbica
    return { opacity: eased, transform: [{ translateY: (1 - eased) * OFFSET_Y }] }
  })

  return <Animated.View style={style}>{children}</Animated.View>
}
