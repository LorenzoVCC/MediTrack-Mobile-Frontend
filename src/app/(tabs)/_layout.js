import { Tabs } from 'expo-router/js-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import TabIcon from '@/components/TabIcon/TabIcon'
import { colors, fonts } from '@/theme'

export const unstable_settings = {
  initialRouteName: 'turnos',
}

const TAB_BAR_HEIGHT = 68

// Menú inferior: Historial, Turnos, Perfil. La pestaña activa lleva fondo verde.
// Historial y Turnos son stacks: el menú sigue visible en sus detalles, con la pestaña de origen marcada.
// popToTopOnBlur: al volver a esa pestaña se ve la lista, no el detalle que quedó abierto.
export default function TabsLayout() {
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarActiveBackgroundColor: colors.greenSoft,
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 12 },
        tabBarItemStyle: { marginHorizontal: 6, marginVertical: 6, borderRadius: 14 },
        tabBarStyle: {
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
          paddingHorizontal: 8,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
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
