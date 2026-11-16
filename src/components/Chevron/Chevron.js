import Svg, { Path } from 'react-native-svg'
import { colors } from '@/theme'

// direction: 'down' | 'right'
export default function Chevron({ direction = 'down', color = colors.textMuted, size = 16 }) {
  const d = direction === 'right' ? 'M9 6l6 6-6 6' : 'M6 9l6 6 6-6'
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d={d} />
    </Svg>
  )
}
