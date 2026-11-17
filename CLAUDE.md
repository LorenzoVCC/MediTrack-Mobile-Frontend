# MediTrack-Mobile

App móvil (Expo + React Native, JavaScript, expo-router) de MediTrack, **solo para el rol Paciente**.
Proyectos hermanos en `../`: `Proyecto-Pediatria-ver1` (web React) y `MediTrackAPI` (back .NET).
**No modificar la web ni el back**; la web se usa solo como referencia.

Ver también `AGENTS.md` (reglas de Expo: SDK 58, usar `npx expo install`, docs versionadas).

## Estado actual: Etapa 1 (solo diseño)

- El paciente se considera logueado. **No hay** login, logout, token, AuthContext ni llamadas a la API.
- Todos los datos salen de `src/mocks/`, con la misma forma que los DTO del back, para cambiarlos después por services.
- Fuera de alcance: percentiles.
- Las acciones están simuladas: Guardar turno, Cancelar turno y Guardar perfil solo navegan (o muestran el aviso).

## Estructura

```
src/app/                      rutas (expo-router)
  _layout.js                  fuentes + SafeAreaProvider + ToastProvider + Stack
  index.js                    Redirect -> /turnos
  (tabs)/_layout.js           Tabs (expo-router/js-tabs): historial, turnos, perfil; inicial: turnos
  (tabs)/historial/index.js   lista de consultas
  (tabs)/historial/[id].js    ConsultaDetalle (solo lectura)
  (tabs)/turnos/index.js      lista de turnos + "Reservar Turno"
  (tabs)/turnos/detalle.js    TurnoDetalle, parámetro modo = "crear" | "ver" (+ id)
  (tabs)/perfil.js            formulario de datos personales
src/components/<Nombre>/<Nombre>.js   un componente por carpeta, sin fetch
src/mocks/                    doctors, consultations, appointments, profile, availableSlots
src/utils/                    dates, measurement, appointments
src/theme/                    colors, fonts
```

El alias `@/` apunta a `src/` (`jsconfig.json`).

## Navegación

- Historial y Turnos son Stacks dentro de las pestañas: el menú inferior sigue visible en los detalles, con la pestaña de origen marcada.
- `popToTopOnBlur: true` en Historial y Turnos: al volver a la pestaña se ve la lista.
- Perfil vuelve a Turnos con `router.navigate('/turnos')` para que quede marcada esa pestaña.
- Volver desde un detalle: `router.back()`, con fallback a `router.replace(...)` si no hay historial.

## Decisiones tomadas (no cambiar sin consultar)

- **Mediciones**: los mismos nombres que la web (`HistoryList` + `utils/measurement.js`):
  `weight` → Peso (kg), `height` → **Talla** (cm; el back la guarda en **metros**), `size` → **P. cefálico** (cm), `imc` → IMC (2 decimales).
  Un 0 o null significa que no se midió y se muestra "—". Si no hay ninguna medición, se oculta el bloque.
- **Estados de turno**: el enum del back es `Disponible | Reservado | Cancelado`. "Confirmado" no existe.
  Solo de UI: `Finalizado` (reservado con horario pasado) y `Por confirmar` (modo crear).
- **Orden de turnos**: primero los próximos (no cancelados, futuros; el más cercano primero) y después los pasados o cancelados (el más reciente primero).
- **Perfil**: nombre, apellido y fecha de nacimiento (dd/mm/aaaa, con máscara) son editables. El **email es de solo lectura** porque el back no lo edita (`UpdateMyProfileDto`).
  Guardar se deshabilita sin cambios o con datos inválidos.
- **Dropdown** = versión móvil de `DoctorSelect` de la web: placeholder sin selección, caja estática con ≤1 opción (`staticIfSingle`) y la opción elegida resaltada.
  Fecha se habilita al elegir doctor y Hora al elegir fecha; cambiar el doctor resetea fecha y hora.
- **Toast** global (`ToastProvider` en la raíz), para que siga visible al cambiar de pestaña.
- Fechas parseadas en hora **local**, nunca con `toISOString()` (en Argentina corre el día).

## Estilo

- Paleta de la web en `src/theme/colors.js`: fondo `#FBF7F2`, texto `#2B2320`, secundario `#5C544C`, bordes `#EFE7DC`, acento `#C0392B`, cabecera `#F5DFDA`.
- Menú inferior propio (`components/TabBar`): la pestaña activa es una píldora roja (acento `#C0392B`) con ícono y etiqueta en blanco, que se desliza entre pestañas; las inactivas van en gris (`#8A8078`). Sin ripple: al tocar solo hay una escala leve (`PressableScale`).
- Fraunces para los títulos e Inter para el resto. Se importa cada peso por separado (`@expo-google-fonts/inter/400Regular`) para no inflar el bundle.
- Sin librerías de UI ni de íconos: los íconos son SVG propios (`react-native-svg`).
- Botones: `primary` (relleno acento), `secondary` (borde neutro), `destructive` (borde y texto acento).

## Convenciones

- Componentes chicos, props hacia abajo y callbacks hacia arriba. Ningún componente hace fetch.
- Textos de UI en español rioplatense.
- **Commits sin líneas de atribución a Claude.**
- Antes de aplicar cambios grandes, mostrar el plan.

## Próximas etapas (pendiente)

- Reemplazar `src/mocks/` por services equivalentes a `patientPortalService.js` de la web:
  `getMyProfile`, `updateMyProfile`, `getMyConsultations`, `getMyDoctors`, `getMyAppointments`,
  `getAvailableSlots(doctorId, from, to)` (máx. 31 días), `bookAppointment`, `cancelMyAppointment`.
- Login/logout, token y AuthContext.

## Verificación

- `npx expo start` y abrir en Expo Go (SDK 58).
- Sin dispositivo: `npx expo export --platform android` (compila el bundle) y `npx expo-doctor`.
