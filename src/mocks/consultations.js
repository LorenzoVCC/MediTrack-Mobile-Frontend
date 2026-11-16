// Datos de relleno: forma de GET /api/me/consultations.
// measurement.height viene en METROS (como el back); size es el perímetro cefálico en cm.
// Fechas relativas a hoy para que siempre sean pasadas.
import { daysFromToday } from '../utils/dates'

const at = (offset) => `${daysFromToday(offset)}T00:00:00`

export const MOCK_CONSULTATIONS = [
  {
    id: 41,
    date: at(-6),
    reason: 'Control de niño sano',
    description: 'Control de rutina de los 7 años. Buen estado general, alimentación variada y actividad física regular. Vacunas al día según calendario nacional. Se indica control odontológico y próximo control pediátrico en 6 meses.',
    doctorId: 1,
    doctorFirstName: 'Laura',
    doctorLastName: 'Méndez',
    measurement: { weight: 23.4, height: 1.218, size: 51.5, imc: 15.77 },
  },
  {
    id: 38,
    date: at(-34),
    reason: 'Tos y congestión',
    description: 'Cuadro de 4 días de tos seca nocturna y congestión nasal, sin fiebre. Auscultación sin ruidos agregados. Se indican lavados nasales con solución fisiológica y control si aparece fiebre o dificultad para respirar.',
    doctorId: 2,
    doctorFirstName: 'Martín',
    doctorLastName: 'Sosa',
    measurement: { weight: 23.1, height: 0, size: 0, imc: 0 },
  },
  {
    id: 33,
    date: at(-75),
    reason: 'Otitis',
    description: 'Dolor de oído derecho desde ayer. Otoscopia con tímpano abombado. Se indica tratamiento antibiótico por 7 días y analgésicos según dolor.',
    doctorId: 1,
    doctorFirstName: 'Laura',
    doctorLastName: 'Méndez',
    measurement: null,
  },
  {
    id: 27,
    date: at(-140),
    reason: 'Control de crecimiento',
    description: 'Control de peso y talla. Curva de crecimiento adecuada para la edad.',
    doctorId: 3,
    doctorFirstName: 'Carolina',
    doctorLastName: 'Ferreyra',
    measurement: { weight: 22.0, height: 1.19, size: 51.2, imc: 15.54 },
  },
]
