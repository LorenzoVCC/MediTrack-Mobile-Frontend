// Datos de relleno: forma de GET /api/me/appointments (MyAppointmentDto).
// status refleja el enum del back: 'Reservado' | 'Cancelado'. Fechas relativas a hoy.
import { daysFromToday } from '../utils/dates'

export const MOCK_APPOINTMENTS = [
  { id: 101, date: daysFromToday(-6), startTime: '10:00', endTime: '10:20', status: 'Reservado', doctorId: 1, doctorFirstName: 'Laura', doctorLastName: 'Méndez' },
  { id: 108, date: daysFromToday(9), startTime: '16:30', endTime: '16:50', status: 'Reservado', doctorId: 2, doctorFirstName: 'Martín', doctorLastName: 'Sosa' },
  { id: 105, date: daysFromToday(4), startTime: '11:20', endTime: '11:40', status: 'Cancelado', doctorId: 3, doctorFirstName: 'Carolina', doctorLastName: 'Ferreyra' },
  { id: 112, date: daysFromToday(2), startTime: '09:40', endTime: '10:00', status: 'Reservado', doctorId: 1, doctorFirstName: 'Laura', doctorLastName: 'Méndez' },
]
