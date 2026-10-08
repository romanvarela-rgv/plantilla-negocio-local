# 02 — Design System

> Basado en: 01_PRD.md

## 1. Principios de diseño
- **Parece un negocio del barrio, no una startup.** El toldo y el cartel de la puerta son los dos elementos de identidad; todo lo demás es sobrio.
- **Lo útil primero.** Si está abierto, dónde queda y cómo escribir tienen que verse sin hacer scroll en mobile.
- **El color es del cliente.** La plantilla define la estructura; `marca` y `acento` cambian con cada negocio.

## 2. Paleta de colores
Los valores de `marca` y `acento` vienen de `negocio.json` (`tema.colores`). El resto es fijo.

| Token | HEX | Uso |
|-------|-----|-----|
| `--marca` | del JSON (por defecto #0F6B5A) | Toldo, banda final, bordes de servicios |
| `--acento` | del JSON (por defecto #F3B23A) | Cartel "Abierto", botón de WhatsApp, foco |
| `--sobre-marca` / `--sobre-acento` | #FFFFFF o #17212B | Texto sobre esos colores, elegido por contraste |
| `--papel` | #F5F7F6 | Fondo |
| `--superficie` | #FFFFFF | Cards |
| `--tinta` | #17212B | Texto principal, cartel "Cerrado" |
| `--tinta-suave` | #55606B | Texto secundario |
| `--linea` | #DCE2DF | Bordes y separadores |

### Modo oscuro
No aplica: el sitio imita un frente de local (toldo y cartel) y se ve igual siempre. Se declara `color-scheme: light`.

## 3. Tipografía
Las familias vienen de `tema.fuentes` (Google Fonts). Por defecto:

| Rol | Fuente | Tamaño | Peso | Line-height |
|-----|--------|--------|------|-------------|
| Nombre del negocio (hero) | Bricolage Grotesque | clamp(3rem, 10vw, 7.5rem) | 800 | 0.9 |
| H2 | Bricolage Grotesque | clamp(1.9rem, 4.5vw, 3rem) | 800 | 1 |
| Body | Figtree | 1.0625rem | 400 | 1.6 |
| Small / etiquetas | Figtree | 0.875rem | 600 | 1.4 |

Horarios y precios usan `font-variant-numeric: tabular-nums`.

## 4. Espaciado y layout
- Escala: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 72 / 112 px.
- Ancho máximo del contenido: 1120 px, con 20 px de margen lateral en mobile.
- Breakpoint principal: 860 px (hero en dos columnas, horarios y ubicación lado a lado).
- Radio: 14 px en cards e imágenes, 999 px en botones.

## 5. Componentes UI
### Toldo
Franja a rayas `marca` / blanco con el borde inferior ondulado (máscara CSS). Va arriba de todo.
### Cartel de la puerta
Cartel colgado de dos hilos. Estados: `abierto` (fondo acento), `cierra-pronto` (acento con texto "Cierra en X min"), `cerrado` (fondo tinta). Oculto si no hay JS o no hay horarios.
### Botones
- Primario: fondo acento, texto `--sobre-acento`, ícono de WhatsApp.
- Secundario: borde tinta, fondo transparente.
- Estados: hover (sube 1 px y oscurece), focus-visible (contorno de 3 px), active.
### Cards de servicio
Fondo superficie, borde superior de 4 px en marca, título, descripción y precio opcional.
### Preguntas
`<details>` nativo con un "+" que rota a "×".
### Botón flotante de WhatsApp
Círculo de 56 px abajo a la derecha, siempre visible.

## 6. Movimiento y animación
- Solo una animación: el cartel se balancea una vez al cargar (900 ms, se frena solo).
- Hover de botones: 150 ms.
- Con `prefers-reduced-motion: reduce` no se anima nada.

## 7. Iconografía e imágenes
- Íconos SVG inline (WhatsApp, ubicación, Instagram, Facebook), sin librerías.
- Fotos reales del local en `negocio/img/`, preferentemente WebP de hasta 1600 px. Todas con `alt` obligatorio.
- `loading="lazy"` en todo salvo la foto de portada.

## 8. Accesibilidad
- Contraste mínimo WCAG AA (4.5:1 texto normal, 3:1 texto grande y elementos de UI). El build elige el color de texto sobre `marca` y `acento`.
- Foco visible en todos los elementos interactivos.
- Todo navegable con teclado; link "Saltar al contenido".
- Texto alternativo obligatorio (el build falla sin `alt`).
- El cartel usa `aria-live="polite"`.

## 9. Tono de los textos
- Tratamiento de **vos**, frases cortas, sin exagerar.
- Botones que dicen lo que pasa: "Escribinos por WhatsApp", "Cómo llegar".
- Estados del cartel: "Abierto · cierra a las 20:00", "Cierra en 15 min", "Cerrado · abre mañana a las 8:00".
