import { Easing } from 'react-native'
import { Tabs } from 'expo-router/js-tabs'
import TabIcon from '@/components/TabIcon/TabIcon'
import TabBar from '@/components/TabBar/TabBar'
import { colors } from '@/theme'

export const unstable_settings = {
  initialRouteName: 'turnos',
}

// Cambio de pestaña: desplazamiento corto con curva suave (corre con native driver)
const TAB_TRANSITION = {
  animation: 'timing',
  config: { duration: 200, easing: Easing.out(Easing.cubic) },
}

// Menú inferior: Historial, Turnos, Perfil. Barra propia (TabBar): la pestaña activa lleva una
// píldora roja que se desliza entre pestañas, con ícono y etiqueta en blanco.
// Historial y Turnos son stacks: el menú sigue visible en sus detalles, con la pestaña de origen marcada.
// popToTopOnBlur: al volver a esa pestaña se ve la lista, no el detalle que quedó abierto.
// lazy: false precarga las tres pestañas al inicio, así el primer cambio no espera a montar la pantalla.
// Las pestañas quedan montadas al cambiar; freezeOnBlur no tiene efecto en Expo Router.
const renderTabBar = props => <TabBar {...props} />

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={renderTabBar}
      screenOptions={{
        headerShown: false,
        lazy: false,
        animation: 'shift',
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
