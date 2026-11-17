import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Animated, Easing, StyleSheet, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, fonts } from '@/theme'

const DURATION_MS = 2200
const HEADER_HEIGHT = 56
const SLIDE_DISTANCE = 16

// Aviso breve. Vive en la raíz (ToastProvider) para que siga visible al cambiar de pestaña.
// Uso: const showToast = useToast(); showToast('Datos guardados')
const ToastContext = createContext(() => {})

export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }) {
  const [message, setMessage] = useState(null)
  const [id, setId] = useState(0)

  const showToast = useCallback((text) => {
    setMessage(text)
    setId(n => n + 1)
  }, [])

  const hideToast = useCallback(() => setMessage(null), [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {message ? <Toast key={id} message={message} onHide={hideToast} /> : null}
    </ToastContext.Provider>
  )
}

export default function Toast({ message, onHide }) {
  const insets = useSafeAreaInsets()
  // progress: 0 = oculto (arriba y transparente), 1 = visible. Un solo valor para fade + deslizamiento.
  const progress = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.timing(progress, { toValue: 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.delay(DURATION_MS),
      Animated.timing(progress, { toValue: 0, duration: 200, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
    ])
    animation.start(({ finished }) => finished && onHide())
    return () => animation.stop()
  }, [progress, onHide])

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [-SLIDE_DISTANCE, 0] })

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[styles.toast, { top: insets.top + HEADER_HEIGHT + 12, opacity: progress, transform: [{ translateY }] }]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    maxWidth: '90%',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: colors.green,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  text: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.surface,
  },
})
