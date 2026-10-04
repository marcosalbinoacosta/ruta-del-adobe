# ADOBE · Una expedición por Catamarca

Experiencia web de exploración: avión guiado por scroll, cámara móvil, siete paradas, visitas con detalles interactivos, pasaporte con sellos guardados en el dispositivo, vuelo automático, sonido opcional y guía de viaje.

## Abrir

Sitio publicado en Vercel. Para verlo localmente:

Desde esta carpeta ejecutar `python -m http.server 4173 --directory dist` y abrir http://127.0.0.1:4173/. También se puede servir la carpeta `dist` con cualquier servidor web estático.

## Controles

- Scroll o gesto vertical: avanzar/retroceder por la ruta.
- Flechas del teclado o botones anterior/siguiente: elegir parada.
- Botón de reproducción: vuelo automático; el scroll manual lo detiene.
- Explorar este lugar: abrir la visita; el punto con + muestra un detalle.
- Guardar sello: incorporar el lugar al pasaporte local.
- Nota musical: activar/desactivar ambiente sonoro.

El escenario ilustrado es interpretativo. Cada visita enlaza a la ubicación real en Google Maps. La guía conserva los datos del documento de referencia y enlaces a fuentes institucionales. No inventa horarios o tarifas.

## Verificación

Se comprobó la sintaxis de JavaScript, la carga de la web, el avance mediante scroll, las visitas y detalles, el guardado de sellos, la llegada a Fiambalá y las vistas de escritorio y celular. El control WebMCP se verificó con una entrada válida y otra inválida. El navegador no reportó errores en esa revisión.

El sitio completo y sus recursos están en `dist`.
