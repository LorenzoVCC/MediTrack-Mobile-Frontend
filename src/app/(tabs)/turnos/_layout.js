import { Stack } from 'expo-router'
import { colors } from '@/theme'

export default function TurnosLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
}
