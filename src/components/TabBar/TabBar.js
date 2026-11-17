import { useEffect, useRef, useState } from 'react'
import { Keyboard, Platform, StyleSheet, Text, View } from 'react-native'
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import PressableScale from '../PressableScale/PressableScale'
import { colors, fonts } from '@/theme'

// Alto del contenido del menú; el inset inferior (barra de Android / home indicator) se suma aparte
const TAB_BAR_HEIGHT = 68
const ICON_SIZE = 24
// Margen de cada pestaña (y de la píldora) respecto de los bordes de su espacio
const INSET = 6
const SLIDE = { duration: 200, easing: Easing.out(Easing.cubic) }
// A qué distancia de la píldora (en anchos de pestaña) el contenido termina de pasar de blanco a gris
const COLOR_FADE_DISTANCE = 0.6

// Menú inferior propio (prop tabBar de expo-router/js-tabs).
// La pestaña activa lleva una píldora roja, DETRÁS del ícono y la etiqueta, que se desliza hasta la pestaña elegida.
// La píldora arranca en el instante del toque (onPressIn), sin esperar a la navegación. Si el estado de
// navegación cambia por otro motivo (ej. Perfil -> Turnos al guardar), se sincroniza y se desliza hasta ahí.
// Todas las pestañas tienen el mismo layout (ícono arriba, etiqueta abajo); la activa solo cambia de color.
// Todo corre en el hilo de UI (Reanimated). Sin ripple: el feedback al tocar es la escala leve de PressableScale.
// Igual que la barra por defecto: emite tabPress (así siguen andando popToTopOnBlur y el
// "volver al inicio" al tocar la pestaña activa) y respeta tabBarHideOnKeyboard.
export default function TabBar({ state, descriptors, emitter, navigateToTab, insets }) {
  const focusedKey = state.routes[state.index].key
  const routes = state.routes.filter(route => !descriptors[route.key]?.options?.hidden)
  const activeIndex = routes.findIndex(route => route.key === focusedKey)
  const hideOnKeyboard = Boolean(descriptors[focusedKey]?.options?.tabBarHideOnKeyboard)
  const keyboardVisible = useKeyboardVisible()

  // Ancho de cada pestaña, calculado del ancho disponible (sin píxeles fijos)
  const [tabWidth, setTabWidth] = useState(0)
  const pillX = useSharedValue(0)
  // Pestaña hacia la que va (o en la que está) la píldora; -1 = todavía sin ubicar
  const target = useRef(-1)
  const activeIndexRef = useRef(activeIndex)
  activeIndexRef.current = activeIndex
  const pressed = useRef(false)

  const moveTo = (index, width = tabWidth) => {
    if (index < 0 || !width || target.current === index) return
    const first = target.current === -1
    target.current = index
    // La primera vez se ubica directo, sin animar desde la primera pestaña
    pillX.value = first ? index * width : withTiming(index * width, SLIDE)
  }

  const handleLayout = (event) => {
    const width = event.nativeEvent.layout.width / routes.length
    if (width === tabWidth) return
    // Si cambia el ancho (otra pantalla u orientación), se reubica sin animar
    target.current = -1
    moveTo(activeIndexRef.current, width)
    setTabWidth(width)
  }

  // Sincroniza con la navigación (cambios que no vienen de tocar la barra). Si la píldora ya va hacia ahí, no hace nada.
  useEffect(() => {
    moveTo(activeIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, tabWidth])

  const pillStyle = useAnimatedStyle(() => ({ transform: [{ translateX: pillX.value }] }))

  if (hideOnKeyboard && keyboardVisible) return null

  return (
    <View
      style={[
        styles.bar,
        {
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
          paddingLeft: 8 + insets.left,
          paddingRight: 8 + insets.right,
        },
      ]}
    >
      <View style={styles.row} accessibilityRole="tablist" onLayout={handleLayout}>
        {tabWidth > 0 && (
          <Animated.View pointerEvents="none" style={[styles.pill, { width: tabWidth - INSET * 2 }, pillStyle]} />
        )}
        {routes.map((route, index) => {
          const focused = route.key === focusedKey

          // Al apoyar el dedo: la píldora sale hacia la pestaña tocada, antes de navegar
          const onPressIn = () => {
            pressed.current = false
            moveTo(index)
          }
          // Si se suelta sin completar el toque (se arrastró afuera o fue un toque largo), vuelve a la activa.
          // onPressOut llega justo antes de onPress, por eso se revisa en el siguiente ciclo.
          const onPressOut = () => {
            setTimeout(() => {
              if (!pressed.current) moveTo(activeIndexRef.current)
            }, 0)
          }
          const onPress = () => {
            pressed.current = true
            moveTo(index) // también cubre la activación por lector de pantalla, que no pasa por onPressIn
            const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true })
            if (event.defaultPrevented) moveTo(activeIndexRef.current)
            else if (!focused) navigateToTab(route.key)
          }
          const onLongPress = () => emitter.emit({ type: 'tabLongPress', target: route.key })

          return (
            <TabItem
              key={route.key}
              route={route}
              options={descriptors[route.key].options}
              index={index}
              focused={focused}
              tabWidth={tabWidth}
              pillX={pillX}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          )
        })}
      </View>
    </View>
  )
}

function TabItem({ route, options, index, focused, tabWidth, pillX, onPressIn, onPressOut, onPress, onLongPress }) {
  const label = typeof options.tabBarLabel === 'string' ? options.tabBarLabel : options.title ?? route.name

  // Cercanía de la píldora a esta pestaña: 1 cuando está encima, 0 cuando está lejos
  const activeStyle = useAnimatedStyle(() => {
    if (!tabWidth) return { opacity: focused ? 1 : 0 }
    const distance = Math.abs(pillX.value - index * tabWidth) / tabWidth
    return { opacity: interpolate(distance, [0, COLOR_FADE_DISTANCE], [1, 0], Extrapolation.CLAMP) }
  })
  const inactiveStyle = useAnimatedStyle(() => {
    if (!tabWidth) return { opacity: focused ? 0 : 1 }
    const distance = Math.abs(pillX.value - index * tabWidth) / tabWidth
    return { opacity: interpolate(distance, [0, COLOR_FADE_DISTANCE], [0, 1], Extrapolation.CLAMP) }
  })

  const renderContent = (color) => (
    <>
      <View style={styles.icon}>{options.tabBarIcon?.({ focused, color, size: ICON_SIZE })}</View>
      <Text style={[styles.label, { color }]} numberOfLines={1}>{label}</Text>
    </>
  )

  return (
    <PressableScale
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
      testID={options.tabBarButtonTestID}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.item}
    >
      {/* Dos capas idénticas superpuestas (gris y blanca) que se cruzan mientras pasa la píldora */}
      <Animated.View style={[styles.layer, inactiveStyle]}>{renderContent(colors.textMuted)}</Animated.View>
      <Animated.View style={[styles.layer, activeStyle]}>{renderContent(colors.surface)}</Animated.View>
    </PressableScale>
  )
}

// Visible mientras el teclado está abierto (en iOS se avisa antes de que aparezca, como la barra por defecto)
function useKeyboardVisible() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    const subscriptions = [
      Keyboard.addListener(showEvent, () => setVisible(true)),
      Keyboard.addListener(hideEvent, () => setVisible(false)),
    ]
    return () => subscriptions.forEach(s => s.remove())
  }, [])

  return visible
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  // Detrás de los ítems: misma caja que cada pestaña (alto del menú menos INSET arriba y abajo)
  pill: {
    position: 'absolute',
    top: INSET,
    bottom: INSET,
    left: INSET,
    zIndex: 0,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  item: {
    flex: 1,
    margin: INSET,
    zIndex: 1,
  },
  // Cada capa ocupa toda la pestaña y centra ícono + etiqueta: las dos quedan exactamente superpuestas
  layer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
  },
})
