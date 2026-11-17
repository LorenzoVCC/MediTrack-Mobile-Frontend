// TEMPORAL: interruptores para encontrar la traba al cambiar de pestaña.
// Cambiá uno por vez, guardá (o recargá en Expo Go) y compará. Cuando se sepa cuál sirve,
// se deja ese comportamiento fijo en el código y se borra este archivo.

// Hipótesis 2: animación del contenido al cambiar de pestaña.
//   'shift' = opacidad + desplazamiento corto (el diseño actual)
//   'fade'  = solo opacidad (un poco más barata; el contenido no se desplaza)
export const TAB_SCENE_ANIMATION = 'shift'

// Hipótesis 3: mientras dura el cambio de pestaña, cada pantalla se dibuja como una imagen fija
// en la GPU (renderToHardwareTextureAndroid / shouldRasterizeIOS), así moverla y cambiarle la
// opacidad no obliga a redibujar todo su contenido en cada cuadro. Se saca al terminar.
export const RASTERIZE_TABS_DURING_TRANSITION = true

// Hipótesis 5: en el menú, cuántas capas se animan por cuadro mientras pasa la píldora.
//   false = gris y blanca se cruzan (6 capas animadas; el diseño actual)
//   true  = la gris queda fija y solo se anima la blanca encima (3 capas animadas)
export const PILL_FADE_ONLY_WHITE = false
