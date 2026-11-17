import { useState } from 'react'
import { Pressable } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const PRESS_IN = { duration: 100 }
const PRESS_OUT = { duration: 160 }

// Pressable con feedback al tocar: se achica levemente mientras está presionado.
// La escala corre en el hilo de UI (Reanimated). Si está disabled, no escala.
// style acepta un objeto o una función ({ pressed }) => estilo, igual que Pressable.
export default function PressableScale({ style, scaleTo = 0.97, disabled = false, onPressIn, onPressOut, ...rest }) {
  const scale = useSharedValue(1)
  // pressed solo cambia los estilos de "presionado" que ya tenía cada componente; la animación no depende de esto
  const [pressed, setPressed] = useState(false)
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  const handlePressIn = (event) => {
    setPressed(true)
    if (!disabled) scale.value = withTiming(scaleTo, PRESS_IN)
    onPressIn?.(event)
  }

  const handlePressOut = (event) => {
    setPressed(false)
    scale.value = withTiming(1, PRESS_OUT)
    onPressOut?.(event)
  }

  const resolvedStyle = typeof style === 'function' ? style({ pressed }) : style

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[resolvedStyle, animatedStyle]}
    />
  )
}
