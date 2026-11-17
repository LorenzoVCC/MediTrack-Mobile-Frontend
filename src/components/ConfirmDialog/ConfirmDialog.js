import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import Button from '../Button/Button'
import useModalTransition from '@/hooks/useModalTransition'
import { colors, fonts } from '@/theme'

// Diálogo de confirmación con dos botones.
// Izquierda: la acción que descarta (onLeft). Derecha: la que conserva (onRight).
// Tocar afuera o el "atrás" de Android equivale a conservar (onRight).
// Animación: el fondo hace fade y el cuadro aparece con una leve escala y desplazamiento; al cerrar, a la inversa.
export default function ConfirmDialog({
  visible,
  title,
  message,
  leftLabel,
  onLeft,
  leftVariant = 'destructive',
  rightLabel,
  onRight,
}) {
  const { mounted, progress } = useModalTransition(visible)

  const cardStyle = {
    opacity: progress,
    transform: [
      { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
      { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) },
    ],
  }

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onRight}>
      {/* Mientras se cierra no recibe toques, para no disparar dos veces una acción */}
      <View style={styles.root} pointerEvents={visible ? 'auto' : 'none'}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, { opacity: progress }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onRight} accessibilityLabel="Cerrar diálogo" />
        </Animated.View>
        <Animated.View style={[styles.card, cardStyle]} accessibilityViewIsModal>
          <Text style={styles.title} accessibilityRole="header">{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={styles.actions}>
            <Button label={leftLabel} variant={leftVariant} onPress={onLeft} />
            <Button label={rightLabel} variant="primary" onPress={onRight} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  overlay: {
    backgroundColor: colors.overlay,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  title: {
    fontFamily: fonts.title,
    fontSize: 20,
    color: colors.text,
  },
  message: {
    marginTop: 8,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 21,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
})
