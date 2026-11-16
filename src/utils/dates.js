// Fechas sin librerías. Las fechas del back llegan como "yyyy-MM-dd" o "yyyy-MM-ddT00:00:00";
// se parsean en hora LOCAL (parsearlas como UTC correría el día en Argentina).

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

const pad = (n) => String(n).padStart(2, '0')

/** "2026-10-21T00:00:00" -> Date local del 21/10/2026 */
export function parseLocalDate(value) {
  if (!value) return null
  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

/** Date -> "2026-10-21" */
export function toDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** "2026-11-10" -> "Martes 10 de noviembre" (suma el año si no es el actual) */
export function formatLongDate(value, now = new Date()) {
  const date = parseLocalDate(value)
  if (!date) return '—'
  const base = `${DAYS[date.getDay()]} ${date.getDate()} de ${MONTHS[date.getMonth()]}`
  return date.getFullYear() === now.getFullYear() ? base : `${base} de ${date.getFullYear()}`
}

/** "2026-11-10" -> "10/11/2026" */
export function formatShortDate(value) {
  const date = parseLocalDate(value)
  if (!date) return ''
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
}

/** "10/11/2026" -> "2026-11-10", o null si no es una fecha válida */
export function parseShortDate(text) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text ?? '')
  if (!match) return null
  const [, d, m, y] = match.map(Number)
  const date = new Date(y, m - 1, d)
  const valid = date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d
  return valid ? toDateKey(date) : null
}

/** Mientras se escribe: deja solo dígitos y pone las barras ("10112026" -> "10/11/2026") */
export function maskShortDate(text) {
  const digits = String(text).replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

/** Fecha + hora ("2026-11-10", "09:30") -> Date local */
export function toDateTime(date, time = '00:00') {
  const day = parseLocalDate(date)
  if (!day) return null
  const [h, m] = time.split(':').map(Number)
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m)
}

/** Fecha relativa a hoy, en formato "yyyy-MM-dd". Solo para los mocks. */
export function daysFromToday(offset, now = new Date()) {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset)
  return toDateKey(d)
}
