# Ruta del Adobe · Una expedición por Catamarca

Experiencia web informativa e interactiva sobre la Ruta del Adobe (departamento Tinogasta, Catamarca), basada en la presentación del proyecto. Un avión de papel recorre un mapa ilustrado de estilo scrapbook por siete lugares de adobe entre Tinogasta y Fiambalá.

Publicado en https://ruta-del-adobe.vercel.app

## Qué incluye

- Portada y una intro con estilo de película.
- Mapa vintage ilustrado, generado en SVG: montañas, río Abaucán, RN 60, pueblos y pines con foto.
- Vuelo guiado con cámara cinematográfica y un modo película que hace el recorrido automático.
- Una página por cada lugar: historia, ubicación, detalle de la foto, consejos de visita y enlace a Google Maps.
- Guía para el viaje real: ficha de información, opciones de itinerario, características del recorrido, una checklist y recomendaciones.
- La sección "¿Por qué elegí este destino?" y la propuesta del proyecto.
- Sonido ambiente opcional, generado en el navegador.

## Controles

- Scroll, arrastre o gesto: avanzar y retroceder por la ruta.
- Flechas del teclado o botones ‹ ›: ir a la parada anterior o siguiente.
- Barra espaciadora o ▶: modo película.
- Enter: abrir el lugar en el que estás.

## Ver localmente

Desde esta carpeta, ejecutá `python -m http.server 4174 --directory dist` y abrí http://127.0.0.1:4174/.

El mapa y el avión son recursos ilustrados: no son cartografía de navegación. El recorrido real se hace por tierra.
