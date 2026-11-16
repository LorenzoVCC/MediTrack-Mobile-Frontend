import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import Screen from '@/components/Screen/Screen'
import ScreenTitle from '@/components/ScreenTitle/ScreenTitle'
import InfoBlock from '@/components/InfoBlock/InfoBlock'
import FormField from '@/components/FormField/FormField'
import BottomBar from '@/components/BottomBar/BottomBar'
import Button from '@/components/Button/Button'
import { useToast } from '@/components/Toast/Toast'
import { MOCK_PROFILE } from '@/mocks/profile'
import { formatShortDate, maskShortDate, parseShortDate, toDateKey } from '@/utils/dates'

// Etapa 1: datos de relleno. Después: getMyProfile() y updateMyProfile().
// El email se muestra pero no se edita: el back no lo permite (UpdateMyProfileDto no lo tiene).
const toForm = (profile) => ({
  firstName: profile.firstName,
  lastName: profile.lastName,
  dateOfBirth: formatShortDate(profile.dateOfBirth), // "dd/mm/aaaa"
})

const FIELDS = ['firstName', 'lastName', 'dateOfBirth']

function validate(form) {
  const errors = {}
  if (!form.firstName.trim()) errors.firstName = 'Completá el nombre'
  if (!form.lastName.trim()) errors.lastName = 'Completá el apellido'
  const dob = parseShortDate(form.dateOfBirth)
  if (!dob) errors.dateOfBirth = 'Ingresá una fecha válida (dd/mm/aaaa)'
  else if (dob > toDateKey(new Date())) errors.dateOfBirth = 'La fecha no puede ser futura'
  return errors
}

export default function PerfilScreen() {
  const showToast = useToast()
  const [original, setOriginal] = useState(() => toForm(MOCK_PROFILE))
  const [form, setForm] = useState(original)

  const hasChanges = FIELDS.some(f => form[f] !== original[f])
  const errors = validate(form)
  const isValid = Object.keys(errors).length === 0

  const setField = (field) => (value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleCancel = () => {
    setForm(original)
    router.navigate('/turnos')
  }

  // Etapa 1: guardado simulado. Los valores guardados pasan a ser los nuevos originales.
  const handleSave = () => {
    const saved = { ...form, firstName: form.firstName.trim(), lastName: form.lastName.trim() }
    setOriginal(saved)
    setForm(saved)
    showToast('Datos guardados')
    router.navigate('/turnos')
  }

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <ScreenTitle title="Mi perfil" subtitle="Datos personales del paciente" />
          <InfoBlock title="Datos personales">
            <FormField
              label="Nombre"
              value={form.firstName}
              onChangeText={setField('firstName')}
              error={errors.firstName}
              autoCapitalize="words"
              autoComplete="given-name"
              returnKeyType="next"
            />
            <FormField
              label="Apellido"
              value={form.lastName}
              onChangeText={setField('lastName')}
              error={errors.lastName}
              autoCapitalize="words"
              autoComplete="family-name"
              returnKeyType="next"
            />
            <FormField
              label="Fecha de nacimiento"
              value={form.dateOfBirth}
              onChangeText={text => setField('dateOfBirth')(maskShortDate(text))}
              error={form.dateOfBirth.length === 10 || !form.dateOfBirth ? errors.dateOfBirth : undefined}
              placeholder="dd/mm/aaaa"
              keyboardType="number-pad"
              maxLength={10}
            />
            <FormField
              label="Email"
              value={MOCK_PROFILE.email}
              readOnly
              hint="El email no se puede modificar"
            />
          </InfoBlock>
        </ScrollView>

        <BottomBar>
          <Button label="Cancelar" variant="secondary" onPress={handleCancel} />
          <Button label="Guardar" disabled={!hasChanges || !isValid} onPress={handleSave} />
        </BottomBar>
      </KeyboardAvoidingView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
})
