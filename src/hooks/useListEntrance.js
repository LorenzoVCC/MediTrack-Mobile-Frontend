import { useCallback, useRef } from 'react'
import { useFocusEffect } from 'expo-router'
import { Easing, ReduceMotion, useSharedValue, withTiming } from 'react-native-reanimated'
import { ENTRANCE_TOTAL_MS } from '@/components/ListEntryItem/ListEntryItem'

// Entrada escalonada de una lista, la primera vez que la pantalla se MUESTRA (primer foco), no al montarse:
// las pestañas se precargan ocultas, y así la animación no se gasta mientras nadie la ve.
// Devuelve un único shared value (0 -> 1) que corre en el hilo de UI; cada tarjeta (ListEntryItem) calcula
// su propio tramo. No vuelve a animar al hacer scroll ni al volver a la pestaña.
// Con "reducir movimiento" activado en el sistema, las tarjetas aparecen directo.
export default function useListEntrance() {
  const progress = useSharedValue(0)
  const started = useRef(false)

  useFocusEffect(
    useCallback(() => {
      if (started.current) return
      started.current = true
      progress.value = withTiming(1, {
        duration: ENTRANCE_TOTAL_MS,
        easing: Easing.linear,
        reduceMotion: ReduceMotion.System,
      })
    }, [progress]),
  )

  return progress
}
