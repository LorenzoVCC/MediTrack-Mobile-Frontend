import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { TAB_SLIDE } from '../TabBar/TabBar'
import { RASTERIZE_TABS_DURING_TRANSITION } from '@/utils/tabPerfFlags'

// Margen extra para sacar la "foto" recién cuando la animación ya terminó
const AFTER_TRANSITION_MS = 50

// Envuelve el contenido de cada pestaña (screenLayout de las Tabs).
// Cuando la pestaña gana o pierde el foco (= empieza un cambio de pestaña), durante lo que dura
// la animación la pantalla se dibuja como una imagen fija en la GPU:
//   - Android: renderToHardwareTextureAndroid
//   - iOS: shouldRasterizeIOS
// Así, desplazarla y cambiarle la opacidad no obliga a redibujar todo su contenido en cada cuadro.
// Al terminar se vuelve a dibujar normal, para que no quede borrosa ni desactualizada.
export default function TabScene({ navigation, children }) {
  const [moving, setMoving] = useState(false)

  useEffect(() => {
    if (!RASTERIZE_TABS_DURING_TRANSITION) return
    let timer
    const startMoving = () => {
      setMoving(true)
      clearTimeout(timer)
      timer = setTimeout(() => setMoving(false), TAB_SLIDE.duration + AFTER_TRANSITION_MS)
    }
    const unsubscribes = [navigation.addListener('focus', startMoving), navigation.addListener('blur', startMoving)]
    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe())
      clearTimeout(timer)
    }
  }, [navigation])

  return (
    <View
      style={styles.scene}
      collapsable={false}
      renderToHardwareTextureAndroid={moving}
      shouldRasterizeIOS={moving}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
})
