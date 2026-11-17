import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, FlatList, Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Chevron from '../Chevron/Chevron'
import useModalTransition from '@/hooks/useModalTransition'
import { colors, fonts } from '@/theme'

const OPTION_HEIGHT = 60
const ENABLE_FADE_MS = 180

// Versión móvil de DoctorSelect (web): una caja que abre una lista para elegir una opción.
// options: [{ value, label, sublabel? }]; value: el valor elegido (o null); onChange(value).
// Como en la web:
//   - Sin selección se ve el placeholder.
//   - staticIfSingle: con 0 o 1 opción es una caja informativa, sin flecha ni lista.
//   - La opción elegida aparece resaltada en la lista.
// disabled: se ve apagada y no abre (ej. Fecha sin doctor, o el modo "ver").
// Animaciones: la lista sube desde abajo con fade del fondo (y baja al cerrar);
// cuando el campo se habilita (Fecha u Hora), su contenido aparece con un fade corto.
export default function Dropdown({ label, options, value, onChange, placeholder, disabled = false, staticIfSingle = false }) {
  const [open, setOpen] = useState(false)
  const insets = useSafeAreaInsets()
  const selectedIndex = options.findIndex(o => String(o.value) === String(value))
  const selected = options[selectedIndex]
  const isStatic = staticIfSingle && options.length <= 1
  const interactive = !disabled && !isStatic && options.length > 0
  const a11yLabel = `${label}: ${selected ? selected.label : placeholder}`

  const { height: windowHeight } = useWindowDimensions()
  const { mounted, progress } = useModalTransition(open)
  const sheetTranslateY = progress.interpolate({ inputRange: [0, 1], outputRange: [windowHeight * 0.6, 0] })

  // Fade corto al habilitarse; en el primer montaje no se anima
  const contentOpacity = useRef(new Animated.Value(1)).current
  const wasInteractive = useRef(interactive)
  useEffect(() => {
    if (interactive && !wasInteractive.current) {
      contentOpacity.setValue(0)
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: ENABLE_FADE_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start()
    }
    wasInteractive.current = interactive
  }, [interactive, contentOpacity])

  const choose = (option) => {
    setOpen(false)
    if (String(option.value) !== String(value)) onChange(option.value)
  }

  const content = selected ? (
    <View style={styles.info}>
      <Text style={styles.name} numberOfLines={1}>{selected.label}</Text>
      {selected.sublabel ? <Text style={styles.sublabel} numberOfLines={1}>{selected.sublabel}</Text> : null}
    </View>
  ) : (
    <Text style={styles.placeholder} numberOfLines={1}>{placeholder}</Text>
  )

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      {interactive ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={a11yLabel}
          accessibilityState={{ expanded: open }}
          onPress={() => setOpen(true)}
          style={({ pressed }) => [styles.box, pressed && styles.boxPressed]}
        >
          <Animated.View style={[styles.fade, { opacity: contentOpacity }]}>{content}</Animated.View>
          <Chevron />
        </Pressable>
      ) : (
        <View
          accessible
          accessibilityLabel={a11yLabel}
          accessibilityState={{ disabled: true }}
          style={[styles.box, styles.boxStatic, disabled && styles.boxDisabled]}
        >
          {content}
        </View>
      )}

      <Modal visible={mounted} transparent animationType="none" onRequestClose={() => setOpen(false)}>
        {/* Mientras se cierra no recibe toques, para no elegir dos veces */}
        <View style={styles.root} pointerEvents={open ? 'auto' : 'none'}>
          <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, { opacity: progress }]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} accessibilityLabel="Cerrar lista" />
          </Animated.View>
          <Animated.View style={[styles.sheet, { paddingBottom: insets.bottom + 8, transform: [{ translateY: sheetTranslateY }] }]}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={o => String(o.value)}
              initialScrollIndex={Math.max(0, selectedIndex)}
              getItemLayout={(_, index) => ({ length: OPTION_HEIGHT, offset: OPTION_HEIGHT * index, index })}
              renderItem={({ item, index }) => {
                const isSelected = index === selectedIndex
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => choose(item)}
                    style={({ pressed }) => [styles.option, isSelected && styles.optionSelected, pressed && styles.optionPressed]}
                  >
                    <Text style={[styles.name, isSelected && styles.nameSelected]} numberOfLines={1}>{item.label}</Text>
                    {item.sublabel ? <Text style={styles.sublabel} numberOfLines={1}>{item.sublabel}</Text> : null}
                  </Pressable>
                )
              }}
            />
          </Animated.View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  box: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
  boxPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  boxStatic: {
    backgroundColor: colors.surfaceMuted,
  },
  boxDisabled: {
    opacity: 0.6,
  },
  info: {
    flexShrink: 1,
    gap: 1,
  },
  name: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
  },
  nameSelected: {
    color: colors.accent,
  },
  sublabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  placeholder: {
    flexShrink: 1,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textMuted,
  },
  fade: {
    flexShrink: 1,
  },
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: colors.overlay,
  },
  sheet: {
    maxHeight: '60%',
    paddingTop: 16,
    paddingHorizontal: 8,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: colors.surface,
  },
  sheetTitle: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    fontFamily: fonts.title,
    fontSize: 18,
    color: colors.text,
  },
  option: {
    height: OPTION_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  optionSelected: {
    backgroundColor: colors.accentSoft,
  },
  optionPressed: {
    backgroundColor: colors.surfaceMuted,
  },
})
