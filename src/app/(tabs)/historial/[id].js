import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import Screen from '@/components/Screen/Screen'
import ScreenTitle from '@/components/ScreenTitle/ScreenTitle'
import InfoBlock from '@/components/InfoBlock/InfoBlock'
import FormField from '@/components/FormField/FormField'
import BottomBar from '@/components/BottomBar/BottomBar'
import Button from '@/components/Button/Button'
import { MOCK_CONSULTATIONS } from '@/mocks/consultations'
import { formatLongDate } from '@/utils/dates'
import { doctorFullName } from '@/utils/appointments'
import { getMeasurementRows } from '@/utils/measurement'
import { colors, fonts } from '@/theme'

// Detalle de una consulta, solo lectura
export default function ConsultaDetalleScreen() {
  const { id } = useLocalSearchParams()
  const consultation = MOCK_CONSULTATIONS.find(c => String(c.id) === String(id))
  const measurements = getMeasurementRows(consultation?.measurement)

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/historial'))

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle title="Detalle de la consulta" />

        {!consultation && <Text style={styles.empty}>No encontramos esta consulta.</Text>}

        {consultation && (
          <InfoBlock title="Información de la consulta">
            <FormField label="Motivo" value={consultation.reason} readOnly />
            <FormField label="Descripción" value={consultation.description} readOnly collapsible />
            <FormField label="Fecha" value={formatLongDate(consultation.date)} readOnly />
            <FormField label="Doctor" value={doctorFullName(consultation)} readOnly />
          </InfoBlock>
        )}

        {measurements.length > 0 && (
          <InfoBlock title="Mediciones">
            <View style={styles.grid}>
              {measurements.map(m => (
                <FormField key={m.key} label={m.unit ? `${m.label} (${m.unit})` : m.label} value={m.value} readOnly style={styles.cell} />
              ))}
            </View>
          </InfoBlock>
        )}
      </ScrollView>

      <BottomBar>
        <Button label="Volver" variant="secondary" onPress={goBack} />
      </BottomBar>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cell: {
    flexGrow: 1,
    flexBasis: '45%',
  },
  empty: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textSecondary,
  },
})
