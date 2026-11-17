import { Tabs } from 'expo-router/js-tabs'
import TabIcon from '@/components/TabIcon/TabIcon'
import TabBar, { TAB_SLIDE } from '@/components/TabBar/TabBar'
import TabScene from '@/components/TabScene/TabScene'
import { TAB_SCENE_ANIMATION } from '@/utils/tabPerfFlags'
import { colors } from '@/theme'

export const unstable_settings = {
  initialRouteName: 'turnos',
}

// Cambio de pestaña: desplazamiento corto (native driver) con la MISMA duración y curva que la píldora
// del menú (TAB_SLIDE), para que contenido e indicador se muevan juntos.
const TAB_TRANSITION = {
  animation: 'timing',
  config: TAB_SLIDE,
}

// Menú inferior: Historial, Turnos, Perfil. Barra propia (TabBar): la pestaña activa lleva una
// píldora roja que se desliza entre pestañas, con ícono y etiqueta en blanco.
// Historial y Turnos son stacks: el menú sigue visible en sus detalles, con la pestaña de origen marcada.
// popToTopOnBlur: al volver a esa pestaña se ve la lista, no el detalle que quedó abierto.
// lazy: false precarga las tres pestañas al inicio, así el primer cambio no espera a montar la pantalla.
// detachInactiveScreens={false}: las pestañas ocultas siguen enganchadas a la vista nativa, así al cambiar
// no hay que volver a engancharlas justo cuando arranca la animación.
// Las pestañas quedan montadas al cambiar; freezeOnBlur no tiene efecto en Expo Router.
const renderTabBar = props => <TabBar {...props} />
// Envuelve cada pantalla de pestaña: la rasteriza mientras dura el cambio (ver TabScene)
const renderTabScene = ({ navigation, children }) => <TabScene navigation={navigation}>{children}</TabScene>

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={renderTabBar}
      detachInactiveScreens={false}
      screenLayout={renderTabScene}
      screenOptions={{
        headerShown: false,
        lazy: false,
        // TEMPORAL: 'shift' o 'fade' según tabPerfFlags (hipótesis 2)
        animation: TAB_SCENE_ANIMATION,
        transitionSpec: TAB_TRANSITION,
        // Fondo de la app en la escena: evita el flash blanco del tema por defecto durante la transición
        sceneStyle: { backgroundColor: colors.background },
        // La lee TabBar: el menú se oculta mientras el teclado está abierto (formulario de Perfil)
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="historial"
        options={{
          title: 'Historial',
          popToTopOnBlur: true,
          tabBarIcon: ({ color }) => <TabIcon name="historial" color={color} />,
        }}
      />
      <Tabs.Screen
        name="turnos"
        options={{
          title: 'Turnos',
          popToTopOnBlur: true,
          tabBarIcon: ({ color }) => <TabIcon name="turnos" color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabIcon name="perfil" color={color} />,
        }}
      />
    </Tabs>
  )
}
