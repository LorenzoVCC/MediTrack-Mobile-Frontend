import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import Button from '../Button/Button'
import { colors, fonts } from '@/theme'

// Diálogo de confirmación con dos botones.
// Izquierda: la acción que descarta (onLeft). Derecha: la que conserva (onRight).
// Tocar afuera o el "atrás" de Android equivale a conservar (onRight).
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
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRight}>
      <Pressable style={styles.overlay} onPress={onRight} accessibilityLabel="Cerrar diálogo">
        <Pressable style={styles.card} accessibilityViewIsModal>
          <Text style={styles.title} accessibilityRole="header">{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={styles.actions}>
            <Button label={leftLabel} variant={leftVariant} onPress={onLeft} />
            <Button label={rightLabel} variant="primary" onPress={onRight} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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
