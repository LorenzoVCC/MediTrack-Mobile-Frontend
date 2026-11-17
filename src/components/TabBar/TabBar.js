import { memo, useCallback, useEffect, useRef, useState } from 'react'
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
import { PILL_FADE_ONLY_WHITE } from '@/utils/tabPerfFlags'
import { colors, fonts } from '@/theme'

// Alto del contenido del menú; el inset inferior (barra de Android / home indicator) se suma aparte
const TAB_BAR_HEIGHT = 68
const ICON_SIZE = 24
// Margen de cada pestaña (y de la píldora) respecto de los bordes de su espacio
const INSET = 6
// Misma duración y curva que el cambio de pantalla (TAB_TRANSITION en app/(tabs)/_layout.js)
export const TAB_SLIDE = { duration: 200, easing: Easing.out(Easing.cubic) }
// A qué distancia de la píldora (en anchos de pestaña) el contenido termina de pasar de blanco a gris
const COLOR_FADE_DISTANCE = 0.6

// TEMPORAL: imprime en la terminal de Metro cuántos ms pasan entre el toque y el inicio
// de la animación del contenido. Poner en false (o borrar el bloque marcado) cuando ya no haga falta.
const MEDIR_DEMORA = true

// Menú inferior propio (prop tabBar de expo-router/js-tabs).
//
// Cómo funciona un toque en una pestaña (todo en onPressIn, al apoyar el dedo):
//   1. moveTo(index): la píldora roja empieza a deslizarse (Reanimated, hilo de UI).
//   2. Se avisa tabPress y se navega; el contenido de la pantalla se desliza
//      en cuanto la navegación procesa el cambio.
// Si la pestaña cambia por otro motivo (ej. Perfil -> Turnos al guardar), el useEffect de
// activeIndex lleva la píldora hasta ahí.
//
// Cada pestaña dibuja su contenido dos veces, en gris y en blanco, una encima de la otra;
// la blanca se hace visible a medida que la píldora llega. Así ningún ícono se mueve de lugar.
//
// Rendimiento: las animaciones solo leen shared values en el hilo de UI (nada se lee desde JS
// mientras se mueven). TabItem está memoizado y recibe handlers estables: al cambiar de pestaña
// solo se re-renderizan las pestañas cuyo estado "activa" cambió.
export default function TabBar({ state, descriptors, emitter, navigateToTab, insets }) {
  const focusedKey = state.routes[state.index].key
  const routes = state.routes.filter(route => !descriptors[route.key]?.options?.hidden)
  const activeIndex = routes.findIndex(route => route.key === focusedKey)
  const hideOnKeyboard = Boolean(descriptors[focusedKey]?.options?.tabBarHideOnKeyboard)
  const keyboardVisible = useKeyboardVisible()

  // Ancho de cada pestaña: el ancho disponible dividido por la cantidad de pestañas
  const [tabWidth, setTabWidth] = useState(0)
  // Posición horizontal de la píldora (shared value de Reanimated)
  const pillX = useSharedValue(0)
  // Pestaña hacia la que va (o en la que está) la píldora; -1 = todavía no se ubicó
  const pillIndex = useRef(-1)

  // Los valores de este render, para que los handlers de abajo puedan ser estables (useCallback sin
  // dependencias) y aun así usar siempre los datos actuales.
  const latest = useRef(null)
  latest.current = { routes, focusedKey, activeIndex, tabWidth, emitter, navigateToTab }
  // TEMPORAL: momento del último toque, para la medición de MEDIR_DEMORA
  const touchTime = useRef(null)

  const moveTo = useCallback((index, width = latest.current.tabWidth) => {
    if (index < 0 || !width || pillIndex.current === index) return
    const isFirstTime = pillIndex.current === -1
    pillIndex.current = index
    // La primera vez se ubica directo, sin animar desde la primera pestaña
    pillX.value = isFirstTime ? index * width : withTiming(index * width, TAB_SLIDE)
  }, [pillX])

  // Toque en la pestaña index: mueve la píldora y navega.
  // Mismo comportamiento que la barra por defecto: avisa tabPress (de esto dependen popToTopOnBlur
  // y el "volver a la lista" al tocar la pestaña activa) y navega si corresponde.
  const handleSelect = useCallback((index) => {
    const { routes, focusedKey, activeIndex, emitter, navigateToTab } = latest.current
    const route = routes[index]
    if (MEDIR_DEMORA && route.key !== focusedKey) touchTime.current = performance.now() // TEMPORAL
    moveTo(index)
    const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true })
    if (event.defaultPrevented) moveTo(activeIndex)
    else if (route.key !== focusedKey) navigateToTab(route.key)
  }, [moveTo])

  const handleLongPress = useCallback((index) => {
    const { routes, emitter } = latest.current
    emitter.emit({ type: 'tabLongPress', target: routes[index].key })
  }, [])

  const handleLayout = (event) => {
    const width = event.nativeEvent.layout.width / routes.length
    if (width === tabWidth) return
    // Si cambia el ancho, la píldora se reubica sin animar
    pillIndex.current = -1
    moveTo(activeIndex, width)
    setTabWidth(width)
  }

  // Cambios de pestaña que no vienen de tocar la barra. Si la píldora ya va hacia ahí, no hace nada.
  useEffect(() => {
    moveTo(activeIndex)
  }, [activeIndex, tabWidth, moveTo])

  // --- TEMPORAL: medición de la demora (ver MEDIR_DEMORA) ---
  const routeKeys = routes.map(route => route.key).join(',')
  useEffect(() => {
    if (!MEDIR_DEMORA) return
    const unsubscribes = latest.current.routes.map(route =>
      descriptors[route.key].navigation.addListener('transitionStart', () => {
        if (touchTime.current === null) return
        const ms = Math.round(performance.now() - touchTime.current)
        console.log(`[demora pestaña] ${route.name}: ${ms} ms entre el toque y el inicio de la animación del contenido`)
        touchTime.current = null
      }),
    )
    return () => unsubscribes.forEach(unsubscribe => unsubscribe())
    // Solo se vuelve a suscribir si cambian las pestañas, no en cada render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKeys])
  // --- fin TEMPORAL ---

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
          const { options } = descriptors[route.key]
          const label = typeof options.tabBarLabel === 'string' ? options.tabBarLabel : options.title ?? route.name
          return (
            <TabItem
              key={route.key}
              index={index}
              label={label}
              renderIcon={options.tabBarIcon}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              testID={options.tabBarButtonTestID}
              focused={route.key === focusedKey}
              tabWidth={tabWidth}
              pillX={pillX}
              onSelect={handleSelect}
              onLongPress={handleLongPress}
            />
          )
        })}
      </View>
    </View>
  )
}

// Una pestaña. Memoizada: solo se re-renderiza si cambia alguna de sus props (por ejemplo focused).
// onSelect(index) se llama al apoyar el dedo (onPressIn), así la píldora y el contenido arrancan
// en el mismo toque. onPress solo se usa cuando la pestaña se activa sin onPressIn (lector de
// pantalla); en un toque normal no hace nada porque onSelect ya se llamó.
const TabItem = memo(function TabItem({
  index,
  label,
  renderIcon,
  accessibilityLabel,
  testID,
  focused,
  tabWidth,
  pillX,
  onSelect,
  onLongPress,
}) {
  const selectedOnPressIn = useRef(false)

  // Cercanía de la píldora a esta pestaña: 1 cuando está encima, 0 cuando está lejos
  const activeStyle = useAnimatedStyle(() => {
    if (!tabWidth) return { opacity: focused ? 1 : 0 }
    const distance = Math.abs(pillX.value - index * tabWidth) / tabWidth
    return { opacity: interpolate(distance, [0, COLOR_FADE_DISTANCE], [1, 0], Extrapolation.CLAMP) }
  })
  const inactiveStyle = useAnimatedStyle(() => {
    // TEMPORAL (hipótesis 5): con PILL_FADE_ONLY_WHITE la capa gris queda fija
    if (PILL_FADE_ONLY_WHITE) return { opacity: 1 }
    if (!tabWidth) return { opacity: focused ? 0 : 1 }
    const distance = Math.abs(pillX.value - index * tabWidth) / tabWidth
    return { opacity: interpolate(distance, [0, COLOR_FADE_DISTANCE], [0, 1], Extrapolation.CLAMP) }
  })

  const renderContent = (color) => (
    <>
      <View style={styles.icon}>{renderIcon?.({ focused, color, size: ICON_SIZE })}</View>
      <Text style={[styles.label, { color }]} numberOfLines={1}>{label}</Text>
    </>
  )

  return (
    <PressableScale
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      onPressIn={() => {
        selectedOnPressIn.current = true
        onSelect(index)
      }}
      onPress={() => {
        if (!selectedOnPressIn.current) onSelect(index)
        selectedOnPressIn.current = false
      }}
      onLongPress={() => {
        selectedOnPressIn.current = false
        onLongPress(index)
      }}
      style={styles.item}
    >
      <Animated.View style={[styles.layer, inactiveStyle]}>{renderContent(colors.textMuted)}</Animated.View>
      <Animated.View style={[styles.layer, activeStyle]}>{renderContent(colors.surface)}</Animated.View>
    </PressableScale>
  )
})

// true mientras el teclado está abierto (en iOS se avisa antes de que aparezca, como la barra por defecto)
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
