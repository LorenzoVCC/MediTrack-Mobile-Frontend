// Datos de relleno: forma de GET /api/me/doctors/{id}/available-slots -> [{ date, startTime, endTime }].
// Se generan los próximos 14 días a partir de mañana, según los días y horarios de cada doctor.
import { daysFromToday, parseLocalDate } from '../utils/dates'

const pad = (n) => String(n).padStart(2, '0')
const addMinutes = (time, minutes) => {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + minutes
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`
}

// weekDays: 1 = lunes ... 5 = viernes. Turnos de 20 minutos.
const SCHEDULES = {
  1: { weekDays: [1, 3, 5], times: ['09:00', '09:20', '09:40', '10:20', '11:00'] },
  2: { weekDays: [2, 4], times: ['15:30', '16:00', '16:30', '17:00'] },
  3: { weekDays: [1, 2, 3, 4], times: ['08:40', '10:00', '11:20', '12:00'] },
}

export function getMockAvailableSlots(doctorId) {
  const schedule = SCHEDULES[doctorId]
  if (!schedule) return []
  const slots = []
  for (let offset = 1; offset <= 14; offset++) {
    const date = daysFromToday(offset)
    if (!schedule.weekDays.includes(parseLocalDate(date).getDay())) continue
    schedule.times.forEach(startTime => slots.push({ date, startTime, endTime: addMinutes(startTime, 20) }))
  }
  return slots
}
