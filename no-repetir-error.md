# Bitácora de Integración: Menú Makilovers

## 1. El Reto Inicial
El sitio estático (GitHub Pages) requería consumir datos dinámicos desde una hoja de cálculo (Google Sheets) publicada como CSV. El problema principal no era la conectividad, sino la **infraestructura de los datos** y la falta de un puente lógico entre el `fetch` y el DOM (la interfaz visual).

## 2. Balance del Accionamiento (Lecciones Aprendidas)
* **Error de Enfoque:** Inicialmente, se asumió que el problema era una restricción de red (CORS o bloqueos de seguridad). Se demostró que la comunicación HTTP era correcta (estado 200).
* **El Cuello de Botella:** La causa real de que la web no mostrara nada era la ausencia de un **motor de transformación**. Recibir el CSV en formato crudo sin una función que lo convirtiera a objetos de JavaScript (`procesarCSV`) hacía imposible que el navegador lo interpretara.
* **Normalización:** La estructura de datos "Frankenstein" (mezcla de texto libre y tablas) dificultaba el parseo. Se validó la importancia de la limpieza de datos para evitar que las celdas vacías rompieran el flujo de ejecución.

## 3. Arquitectura Implementada
* **Capa de Extracción:** `fetch()` asíncrono sobre el endpoint `pub?output=csv`.
* **Capa de Procesamiento:** Conversión de flujo de texto a `Array` de objetos utilizando `split` y mapeo de cabeceras.
* **Capa de Renderizado:** Inyección directa al DOM mediante `innerHTML` con gestión de estados (si no hay datos, se muestra un valor por defecto).

## 4. Estado Actual
- **Conectividad:** OK.
- **Renderizado:** OK (visualización operativa).
- **Pendientes:** Refinar el diseño CSS de las tarjetas de productos para mejorar la UX.