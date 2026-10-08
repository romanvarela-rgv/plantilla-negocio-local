# 01 — PRD (Product Requirements Document)

> **Proyecto:** Plantilla de web para negocios locales
> **Versión:** 0.1 · **Fecha:** 2026-10-08 · **Estado:** En desarrollo

## 1. Resumen
Un generador que arma la web de un negocio de barrio a partir de un solo archivo (`negocio/negocio.json`): sitio estático de una página, pensado para que la gente escriba por WhatsApp y para aparecer en búsquedas locales.

## 2. Problema
Hice tres sitios casi iguales a mano (Punto Com, Brothers Gym y Quantum Gym): mismas secciones, mismo botón de WhatsApp, mismo JSON-LD. Cada cliente nuevo arranca copiando un HTML de 50-120 KB y cambiando datos a mano, lo que tarda horas y deja errores (teléfonos viejos, horarios que no coinciden con el JSON-LD).

## 3. Objetivos
- Tener la primera versión de un sitio de cliente en menos de 1 hora, cambiando solo el JSON y las fotos.
- Que horarios, teléfono y dirección salgan de un solo lugar y coincidan en la página, el JSON-LD y el link de WhatsApp.
- Lighthouse ≥ 95 en Performance, Accesibilidad, Buenas prácticas y SEO en mobile.
- Cero dependencias de npm: solo Node.

## 4. Usuarios / Personas
| Persona | Descripción | Necesidad principal | Rol en el sistema |
|---------|-------------|---------------------|-------------------|
| Desarrollador (RGV) | Arma sitios para clientes | Rapidez y no repetir trabajo | Edita el JSON, corre el build, publica |
| Dueño del negocio | Cliente de RGV | Que lo encuentren y le escriban | Pasa datos y fotos, aprueba |
| Visitante | Vecino buscando el negocio | Saber si está abierto, dónde queda y cómo escribir | Solo lee el sitio |

## 5. Funcionalidades del MVP

### F-01 — Sitio desde un JSON
- **Historia de usuario:** Como desarrollador, quiero cambiar un solo archivo para tener el sitio de un cliente nuevo.
- **Criterios de aceptación:**
  - [ ] `npm run build` genera `dist/` con `index.html`, CSS, JS, favicon, `robots.txt` y `sitemap.xml`.
  - [ ] Cada sección (servicios, horarios, galería, reseñas, preguntas, ubicación) aparece solo si tiene datos.

### F-02 — Validación del JSON
- **Historia de usuario:** Como desarrollador, quiero que el build me avise de datos mal cargados antes de publicar.
- **Criterios de aceptación:**
  - [ ] Dado un color, URL, teléfono, horario o ruta de imagen inválidos, el build falla y dice qué campo corregir.

### F-03 — Cartel "Abierto / Cerrado"
- **Historia de usuario:** Como visitante, quiero saber si el negocio está abierto ahora y, si no, cuándo abre.
- **Criterios de aceptación:**
  - [ ] Usa la zona horaria del negocio, no la del visitante.
  - [ ] Soporta horarios cortados (mañana y tarde) y horarios que pasan la medianoche.
  - [ ] Marca el día de hoy en la tabla de horarios.
  - [ ] Sin JavaScript, la tabla de horarios se sigue viendo.

### F-04 — Contacto por WhatsApp
- **Criterios de aceptación:**
  - [ ] Botón principal, botón flotante y cierre llevan a `wa.me` con un mensaje inicial configurable.

### F-05 — SEO local
- **Criterios de aceptación:**
  - [ ] JSON-LD `LocalBusiness` (con horarios y dirección) y `FAQPage` si hay preguntas.
  - [ ] Open Graph, canonical, `robots.txt` y `sitemap.xml`.
  - [ ] Opción `indexar: false` para propuestas que todavía no aprobó el cliente.

### F-06 — Tema por negocio
- **Criterios de aceptación:**
  - [ ] Colores y fuentes salen del JSON; el color del texto sobre cada color se elige solo para cumplir contraste AA.

## 6. Fuera de alcance
- Panel de administración o CMS.
- Formularios, pagos, turnos o cualquier backend.
- Multi-página o multi-idioma.
- Traer reseñas de Google automáticamente (se cargan a mano, copiadas tal cual).

## 7. Métricas de éxito
| Métrica | Objetivo | Cómo se mide |
|---------|----------|--------------|
| Tiempo para un sitio nuevo | < 1 hora | Cronometrar el próximo cliente |
| Lighthouse mobile | ≥ 95 en las 4 categorías | Chrome DevTools |
| Errores de datos publicados | 0 | Validación del build |

## 8. Supuestos y riesgos
- [SUPUESTO] Los clientes publican en Hostinger (Apache/LiteSpeed) o GitHub Pages.
- Riesgo: Google Fonts manda la IP del visitante a Google. Mitigación: se puede pasar a fuentes del sistema (ver 05_SECURITY.md).
- Riesgo: cargar reseñas inventadas. Regla: solo reseñas reales, copiadas tal cual y con su autor.
