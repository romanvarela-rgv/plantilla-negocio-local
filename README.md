# Plantilla de web para negocios locales

[![CI](https://github.com/romanvarela-rgv/plantilla-negocio-local/actions/workflows/ci.yml/badge.svg)](https://github.com/romanvarela-rgv/plantilla-negocio-local/actions/workflows/ci.yml)

Generador de sitios de una página para negocios de barrio. Cambiás un archivo (`negocio/negocio.json`), corrés un comando y tenés un sitio estático listo para subir, con botón de WhatsApp, horarios, mapa y SEO local.

Lo armé después de hacer a mano tres sitios casi iguales ([Punto Com](https://github.com/romanvarela-rgv/ciberkiosco-punto-com), [Brothers Gym](https://github.com/romanvarela-rgv/brothers-gym-web) y [Quantum Gym](https://github.com/romanvarela-rgv/quantum-gym-web)).

**[Ver demo](https://romanvarela-rgv.github.io/plantilla-negocio-local/)** (negocio ficticio)

*One-page website generator for local businesses: edit one JSON file, get a static, SEO-ready site with WhatsApp contact and a live "open / closed" sign. Zero dependencies, just Node.*

## Qué tiene

- **Cartel "Abierto / Cerrado"** que se calcula con los horarios y la zona horaria del negocio (no la del visitante). Soporta horarios cortados y turnos que pasan la medianoche, y avisa "Cierra en 15 min".
- **Toldo a rayas** con los colores del negocio: el color de texto sobre cada color se elige solo para cumplir contraste AA.
- Secciones que aparecen solo si tienen datos: servicios, horarios, fotos, reseñas, preguntas frecuentes y mapa.
- **SEO local:** JSON-LD `LocalBusiness` con horarios y dirección, `FAQPage`, Open Graph, `robots.txt` y `sitemap.xml`.
- `"indexar": false` para mostrarle una propuesta al cliente sin que aparezca en Google.
- **Validación:** si un teléfono, horario, color, link o foto está mal cargado, el build falla y te dice qué campo corregir.

## Seguridad

- Sin dependencias de npm: nada que auditar ni actualizar.
- Todo texto del JSON se escapa antes de ir al HTML; hay un test que arma el sitio con datos maliciosos y verifica que no se cuele ningún `<script>`.
- Content Security Policy sin `unsafe-inline`: los colores van a un `theme.css` generado en vez de estilos inline.
- `.htaccess` para Hostinger con HTTPS forzado, HSTS, `X-Frame-Options`, `nosniff`, `Referrer-Policy` y `Permissions-Policy`.
- Solo se aceptan links `https://` y fotos dentro de `negocio/img/`.

Detalle en [docs/05_SECURITY.md](docs/05_SECURITY.md).

## Cómo usarla para un cliente nuevo

1. Hacé una copia del repo (botón **Use this template** o `git clone`).
2. Editá `negocio/negocio.json` con los datos del negocio. Todos los campos están en [docs/07_DATABASE.md](docs/07_DATABASE.md).
3. Poné las fotos en `negocio/img/` (WebP de hasta 1600 px) y referencialas por nombre:
   ```json
   "imagenes": {
     "portada": { "src": "frente.webp", "alt": "Frente del local con el toldo rojo" },
     "galeria": [{ "src": "mostrador.webp", "alt": "Mostrador con facturas" }]
   }
   ```
4. Probalo:
   ```bash
   npm run dev      # arma dist/ y lo sirve en http://127.0.0.1:4321
   npm test         # tests de horarios, validación y seguridad
   ```
5. Subí el contenido de `dist/` a `public_html` en Hostinger (incluido el `.htaccess`).

Necesita Node 20 o más nuevo. No hace falta `npm install`.

## Estructura

```
negocio/        lo único que cambia por cliente (JSON + fotos)
src/            plantilla: estilos, JS del cartel y lógica en src/lib/
scripts/        build.mjs (genera dist/) y serve.mjs (servidor local)
test/           node --test
docs/           PRD, diseño, arquitectura, seguridad y estilo
```

El proyecto sigue mi protocolo de trabajo: primero la documentación en `docs/`, después el código.

## Licencia

MIT

---

Diseño y desarrollo: Roman Gael Varela (RGV) · [romangaelvarela.online](https://romangaelvarela.online)
