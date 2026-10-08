# 07 — Base de datos

> Basado en: 01_PRD.md, 03_ARCHITECTURE.md, 05_SECURITY.md

## 1. Motor elegido
No aplica: no hay base de datos. Los datos del negocio viven en `negocio/negocio.json`, versionado en git.

## 2. Entidades
El "modelo" es el esquema del JSON. Lo valida `src/lib/validar.mjs`; el ejemplo completo está en `negocio/negocio.json`.

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `nombre` | texto | sí | Nombre del negocio |
| `rubro` | texto | sí | Ej. "Panadería" |
| `tipoSchema` | texto | no | Tipo de schema.org (por defecto `LocalBusiness`) |
| `eslogan` | texto | no | Frase debajo del nombre |
| `descripcion` | texto | sí | Meta description, hasta 160 caracteres |
| `url` | URL https | sí | Dirección final del sitio (canonical) |
| `indexar` | booleano | no | `false` para propuestas (agrega `noindex`) |
| `idioma` | texto | no | Por defecto `es-AR` |
| `zonaHoraria` | texto IANA | no | Por defecto `America/Argentina/Buenos_Aires` |
| `whatsapp` | dígitos | sí | Con código de país, sin `+` |
| `mensajeWhatsapp` | texto | no | Mensaje inicial |
| `telefono` | texto | no | Para mostrar y para el JSON-LD |
| `direccion` | objeto | sí | `calle`, `localidad`, `provincia`, `codigoPostal`, `pais` |
| `mapa` | booleano | no | Muestra el mapa embebido (por defecto `true`) |
| `mapsUrl` | URL https | no | Link a la ficha de Google Maps para "Cómo llegar" (si no, se arma con la dirección) |
| `horarios` | objeto | no | `lun`…`dom`, cada uno una lista de `["HH:MM","HH:MM"]` |
| `notaHorarios` | texto | no | Ej. feriados |
| `tituloServicios` | texto | no | Título de la sección de servicios (por defecto "Qué hacemos") |
| `servicios` | lista | no | `titulo`, `descripcion`, `precio` |
| `imagenes` | objeto | no | `portada`, `compartir` y `galeria` con `src` y `alt` |
| `resenas` | lista | no | `texto`, `autor`, `estrellas` (1-5) |
| `linkResenas` | URL https | no | Link a las reseñas en Google |
| `preguntas` | lista | no | `pregunta`, `respuesta` |
| `redes` | objeto | no | `instagram`, `facebook`, `tiktok` (URLs https) |
| `tema` | objeto | no | `colores.marca`, `colores.acento` (#RRGGBB con contraste AA posible), `fuentes.titulos`, `fuentes.texto`. Sin `fuentes` usa Bricolage Grotesque + Figtree; `"fuentes": {}` usa las del sistema |
| `tituloCierre` | texto | no | Título de la banda final (por defecto "¿Tenés una consulta?") |
| `credito` | objeto | no | `texto` y `url` del pie |

## 3. Relaciones
No aplica.

## 4. Índices
No aplica.

## 5. Migraciones
Si cambia el esquema, actualizar `validar.mjs`, esta tabla y `negocio/negocio.json` en el mismo commit.

## 6. Datos semilla (seed)
`negocio/negocio.json` trae un negocio de ejemplo **ficticio** (Panadería La Espiga) con el WhatsApp en ceros. Se reemplaza entero para cada cliente.

## 7. Backups y recuperación
Git. Para cada cliente, el repo del cliente guarda su JSON y sus fotos.
