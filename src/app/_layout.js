import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
// Se importa cada peso por separado para no sumar al bundle las variantes que no se usan
import { Fraunces_500Medium } from '@expo-google-fonts/fraunces/500Medium'
import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces/600SemiBold'
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular'
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium'
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold'
import { ToastProvider } from '@/components/Toast/Toast'
import { colors } from '@/theme'

// Etapa 1: el paciente se considera logueado; la app abre directo en las pestañas.
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  })

  // Si las fuentes fallan, se sigue con las del sistema
  if (!fontsLoaded && !fontError) return null

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
      </ToastProvider>
    </SafeAreaProvider>
  )
}
