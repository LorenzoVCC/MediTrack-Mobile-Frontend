// Mismo criterio que la web (src/utils/measurement.js y HistoryList):
//   weight -> "Peso" (kg)
//   height -> "Talla" (cm). El back la guarda en METROS.
//   size   -> "P. cefálico" (cm). Perímetro cefálico.
//   imc    -> "IMC", con 2 decimales.
// Un 0 o un null significa "no se midió".

export const hasValue = (v) => v !== null && v !== undefined && v !== 0 && v !== ''

const mToCm = (m) => Math.round(m * 1000) / 10 // 1.105 m -> 110.5 cm

/** Número con coma decimal ("12,4"). "—" si falta. */
export function formatMeasure(value, { decimals } = {}) {
  if (!hasValue(value)) return '—'
  const number = Number(value)
  if (Number.isNaN(number)) return '—'
  const fixed = decimals === undefined
    ? String(Math.round(number * 100) / 100)
    : number.toFixed(decimals)
  return fixed.replace('.', ',')
}

/** Filas para el bloque "Mediciones". [] si la consulta no tiene ninguna medición. */
export function getMeasurementRows(measurement) {
  if (!measurement) return []
  const rows = [
    { key: 'weight', label: 'Peso', unit: 'kg', raw: measurement.weight },
    { key: 'height', label: 'Talla', unit: 'cm', raw: hasValue(measurement.height) ? mToCm(measurement.height) : null },
    { key: 'size', label: 'P. cefálico', unit: 'cm', raw: measurement.size },
    { key: 'imc', label: 'IMC', unit: '', raw: measurement.imc, decimals: 2 },
  ]
  if (!rows.some(r => hasValue(r.raw))) return []
  return rows.map(r => ({
    key: r.key,
    label: r.label,
    unit: r.unit,
    value: formatMeasure(r.raw, { decimals: r.decimals }),
  }))
}
