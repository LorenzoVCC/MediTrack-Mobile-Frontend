import Svg, { Circle, Path, Rect } from 'react-native-svg'

// Íconos del menú inferior, dibujados en SVG (sin librerías de íconos)
const ICONS = {
  // Documento con reloj
  historial: (
    <>
      <Path d="M11 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v2" />
      <Path d="M14 3v5h5" />
      <Path d="M9 9h2M9 13h3" />
      <Circle cx="17" cy="17" r="4" />
      <Path d="M17 15.3V17l1.2 1" />
    </>
  ),
  // Calendario
  turnos: (
    <>
      <Rect x="3" y="5" width="18" height="16" rx="2" />
      <Path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  // Persona
  perfil: (
    <>
      <Circle cx="12" cy="8" r="4" />
      <Path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
}

export default function TabIcon({ name, color, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </Svg>
  )
}
