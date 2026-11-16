import { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import Screen from '@/components/Screen/Screen'
import ScreenTitle from '@/components/ScreenTitle/ScreenTitle'
import InfoBlock from '@/components/InfoBlock/InfoBlock'
import Dropdown from '@/components/Dropdown/Dropdown'
import StatusBadge from '@/components/StatusBadge/StatusBadge'
import BottomBar from '@/components/BottomBar/BottomBar'
import Button from '@/components/Button/Button'
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog'
import { MOCK_DOCTORS } from '@/mocks/doctors'
import { MOCK_APPOINTMENTS } from '@/mocks/appointments'
import { getMockAvailableSlots } from '@/mocks/availableSlots'
import { formatLongDate } from '@/utils/dates'
import { POR_CONFIRMAR, doctorFullName, getDisplayStatus, isUpcoming } from '@/utils/appointments'
import { colors, fonts } from '@/theme'

const doctorOption = (doctor) => ({
  value: String(doctor.id),
  label: doctorFullName(doctor),
  sublabel: doctor.specialty || undefined,
})

const goToList = () => (router.canGoBack() ? router.back() : router.replace('/turnos'))

// Detalle de turno. Un solo componente para los dos modos (parámetro "modo"):
//   crear: viene de "Reservar Turno". Se elige doctor -> fecha -> hora.
//   ver:   viene de tocar una tarjeta. Todo deshabilitado; se puede cancelar si es próximo.
export default function TurnoDetalleScreen() {
  const { modo, id } = useLocalSearchParams()

  return (
    <Screen>
      {modo === 'ver' ? <VerTurno id={id} /> : <CrearTurno />}
    </Screen>
  )
}

function StatusField({ status }) {
  return (
    <View style={styles.statusField}>
      <Text style={styles.statusLabel}>Estado</Text>
      <StatusBadge status={status} />
    </View>
  )
}

function CrearTurno() {
  // Etapa 1: datos de relleno. Después: getMyDoctors() y getAvailableSlots().
  const doctors = MOCK_DOCTORS
  // Como la web: con un solo doctor, queda elegido de entrada
  const [doctorId, setDoctorId] = useState(doctors.length === 1 ? String(doctors[0].id) : null)
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [confirmVisible, setConfirmVisible] = useState(false)

  const slots = useMemo(() => (doctorId ? getMockAvailableSlots(Number(doctorId)) : []), [doctorId])
  const dateOptions = useMemo(
    () => [...new Set(slots.map(s => s.date))].map(d => ({ value: d, label: formatLongDate(d) })),
    [slots],
  )
  const timeOptions = useMemo(
    () => slots.filter(s => s.date === date).map(s => ({ value: s.startTime, label: `${s.startTime} hs` })),
    [slots, date],
  )

  // Cambiar el doctor descarta fecha y hora; cambiar la fecha descarta la hora
  const handleDoctorChange = (value) => {
    setDoctorId(value)
    setDate(null)
    setTime(null)
  }
  const handleDateChange = (value) => {
    setDate(value)
    setTime(null)
  }

  const canSave = Boolean(doctorId && date && time)
  const noSlots = Boolean(doctorId) && dateOptions.length === 0

  return (
    <>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle title="Reservar turno" />
        <InfoBlock title="Información del turno">
          <Dropdown
            label="Doctor"
            options={doctors.map(doctorOption)}
            value={doctorId}
            onChange={handleDoctorChange}
            placeholder={doctors.length ? 'Seleccionar doctor' : 'Sin doctores'}
            staticIfSingle
          />
          <Dropdown
            label="Fecha"
            options={dateOptions}
            value={date}
            onChange={handleDateChange}
            placeholder={!doctorId ? 'Primero elegí un doctor' : noSlots ? 'Sin fechas disponibles' : 'Seleccionar fecha'}
            disabled={!doctorId || noSlots}
          />
          <Dropdown
            label="Hora"
            options={timeOptions}
            value={time}
            onChange={setTime}
            placeholder={date ? 'Seleccionar hora' : 'Primero elegí una fecha'}
            disabled={!date}
          />
          <StatusField status={POR_CONFIRMAR} />
        </InfoBlock>
      </ScrollView>

      <BottomBar>
        <Button label="Cancelar" variant="secondary" onPress={() => setConfirmVisible(true)} />
        {/* Etapa 1: todavía no reserva; solo vuelve a la lista */}
        <Button label="Guardar" disabled={!canSave} onPress={goToList} />
      </BottomBar>

      <ConfirmDialog
        visible={confirmVisible}
        title="¿Desea cancelar el turno?"
        message="Se perderán los datos ingresados"
        leftLabel="Cancelar"
        onLeft={() => {
          setConfirmVisible(false)
          goToList()
        }}
        rightLabel="Conservar Reserva"
        onRight={() => setConfirmVisible(false)}
      />
    </>
  )
}

function VerTurno({ id }) {
  const appointment = MOCK_APPOINTMENTS.find(a => String(a.id) === String(id))
  const [confirmVisible, setConfirmVisible] = useState(false)

  if (!appointment) {
    return (
      <>
        <View style={styles.content}>
          <Text style={styles.empty}>No encontramos este turno.</Text>
        </View>
        <BottomBar>
          <Button label="Volver" variant="secondary" onPress={goToList} />
        </BottomBar>
      </>
    )
  }

  // Pasado o cancelado: solo "Volver"
  const canCancel = isUpcoming(appointment)

  return (
    <>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle title="Detalle del turno" />
        <InfoBlock title="Información del turno">
          <Dropdown
            label="Doctor"
            options={[{ value: String(appointment.doctorId), label: doctorFullName(appointment) }]}
            value={String(appointment.doctorId)}
            disabled
          />
          <Dropdown
            label="Fecha"
            options={[{ value: appointment.date, label: formatLongDate(appointment.date) }]}
            value={appointment.date}
            disabled
          />
          <Dropdown
            label="Hora"
            options={[{ value: appointment.startTime, label: `${appointment.startTime} hs` }]}
            value={appointment.startTime}
            disabled
          />
          <StatusField status={getDisplayStatus(appointment)} />
        </InfoBlock>
      </ScrollView>

      <BottomBar>
        {canCancel && <Button label="Cancelar turno" variant="destructive" onPress={() => setConfirmVisible(true)} />}
        <Button label="Volver" variant={canCancel ? 'primary' : 'secondary'} onPress={goToList} />
      </BottomBar>

      <ConfirmDialog
        visible={confirmVisible}
        title="¿Desea cancelar el turno?"
        message="El horario quedará libre"
        leftLabel="Cancelar turno"
        onLeft={() => {
          // Etapa 1: todavía no cancela; solo vuelve a la lista
          setConfirmVisible(false)
          goToList()
        }}
        rightLabel="Conservar turno"
        onRight={() => setConfirmVisible(false)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
  },
  statusField: {
    gap: 6,
  },
  statusLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  empty: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textSecondary,
  },
})
