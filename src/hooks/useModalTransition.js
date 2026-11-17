import { useEffect, useRef, useState } from 'react'
import { Animated, Easing } from 'react-native'

const IN = { duration: 200, easing: Easing.out(Easing.cubic) }
const OUT = { duration: 160, easing: Easing.in(Easing.cubic) }

// Apertura y cierre animados para un Modal (con animationType="none").
// Devuelve mounted (si el Modal tiene que estar visible) y progress (Animated.Value de 0 a 1).
// Al cerrar, el Modal sigue montado hasta que termina la animación de salida.
// La animación corre con native driver; el estado solo monta y desmonta.
export default function useModalTransition(visible) {
  const progress = useRef(new Animated.Value(0)).current
  const [mounted, setMounted] = useState(visible)
  const animation = useRef(null)

  const run = (toValue, config, onDone) => {
    animation.current?.stop()
    animation.current = Animated.timing(progress, { toValue, ...config, useNativeDriver: true })
    animation.current.start(({ finished }) => finished && onDone?.())
  }

  // Cierre: anima la salida y recién después desmonta
  useEffect(() => {
    if (visible) setMounted(true)
    else if (mounted) run(0, OUT, () => setMounted(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  // Apertura: una vez montado el contenido del Modal
  useEffect(() => {
    if (visible && mounted) run(1, IN)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, mounted])

  useEffect(() => () => animation.current?.stop(), [])

  return { mounted, progress }
}
