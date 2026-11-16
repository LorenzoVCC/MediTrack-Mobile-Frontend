import { toDateTime } from './dates'

// Refleja el enum AppointmentStatus del back
export const APPOINTMENT_STATUS = {
  DISPONIBLE: 'Disponible',
  RESERVADO: 'Reservado',
  CANCELADO: 'Cancelado',
}

// Solo de UI: un turno reservado cuyo horario ya pasó
export const FINALIZADO = 'Finalizado'
// Solo de UI: el turno que se está armando en modo "crear"
export const POR_CONFIRMAR = 'Por confirmar'

export const doctorFullName = (item) =>
  [item.doctorFirstName ?? item.firstName, item.doctorLastName ?? item.lastName].filter(Boolean).join(' ')

export const isPast = (appointment, now = new Date()) =>
  toDateTime(appointment.date, appointment.startTime) < now

export const isUpcoming = (appointment, now = new Date()) =>
  appointment.status !== APPOINTMENT_STATUS.CANCELADO && !isPast(appointment, now)

/** Estado para mostrar: Cancelado, Finalizado (pasado) o Reservado */
export function getDisplayStatus(appointment, now = new Date()) {
  if (appointment.status === APPOINTMENT_STATUS.CANCELADO) return APPOINTMENT_STATUS.CANCELADO
  if (isPast(appointment, now)) return FINALIZADO
  return appointment.status
}

/** Próximos primero (del más cercano al más lejano); después pasados o cancelados (el más reciente primero) */
export function sortAppointments(appointments, now = new Date()) {
  const time = (a) => toDateTime(a.date, a.startTime).getTime()
  const upcoming = appointments.filter(a => isUpcoming(a, now)).sort((a, b) => time(a) - time(b))
  const rest = appointments.filter(a => !isUpcoming(a, now)).sort((a, b) => time(b) - time(a))
  return [...upcoming, ...rest]
}
