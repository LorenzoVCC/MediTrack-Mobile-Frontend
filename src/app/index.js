import { Redirect } from 'expo-router'

// La app abre directo en la pestaña Turnos
export default function Index() {
  return <Redirect href="/turnos" />
}
