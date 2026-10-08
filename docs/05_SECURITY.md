# 05 — Seguridad

> Basado en: 01_PRD.md, 03_ARCHITECTURE.md

## 1. Autenticación
No aplica: sitio estático y público, sin usuarios.

## 2. Roles y permisos
No aplica.

## 3. Datos sensibles
- El sitio solo publica datos que el negocio quiere hacer públicos: nombre, dirección, teléfono, horarios y redes.
- No hay formularios ni cookies propias. No se guarda nada del visitante.
- Terceros que reciben la IP del visitante: Google Fonts y Google Maps (si hay mapa). Para evitarlo, poner `"tema": { "fuentes": {} }` (usa fuentes del sistema) y `"mapa": false`.
- Las reseñas se publican con el nombre que el autor ya hizo público en Google.
- Normativa: Ley 25.326 (Argentina). Al no recolectar datos, no hace falta aviso de privacidad.

## 4. Gestión de secretos y API keys
No hay secretos: el proyecto no usa API keys. `.env` sigue en `.gitignore` por las dudas.

| Variable | Servicio | Entorno |
|----------|----------|---------|
| (ninguna) | | |

## 5. Validación de inputs
El único input es `negocio.json`, y lo escribe el desarrollador. Igual se valida todo en `src/lib/validar.mjs` porque los datos los pasa el cliente y se copian de WhatsApp, Google, etc.:
- Colores: solo `#RRGGBB` (evita inyección de CSS en `theme.css`) y con algún color de texto que llegue a contraste AA.
- URLs: solo `https://` (bloquea `javascript:` y `data:`).
- WhatsApp: solo dígitos, 10 a 15.
- Horarios: `HH:MM` de 00:00 a 23:59.
- Imágenes: ruta relativa dentro de `negocio/img/`, sin `..`, con extensión de imagen, que exista y con `alt`.
- Fuentes: solo letras, números y espacios.
- Tipo de schema: solo letras (ej. `Bakery`).

## 6. Protección contra ataques comunes
- **XSS:** todo texto pasa por `esc()` antes de ir al HTML. El JSON-LD y los datos de horario escapan `<`, `>` y `&` como `<` para que no puedan cerrar el `<script>`. `app.js` solo usa `textContent`, nunca `innerHTML`.
- **CSP** (en `<meta>` y en `.htaccess`): `default-src 'self'`, scripts solo propios, sin `unsafe-inline` ni `unsafe-eval`, `object-src 'none'`, `base-uri 'self'`, `form-action 'none'`. Se permiten Google Fonts y el iframe de Google Maps.
- **Clickjacking:** `frame-ancestors 'none'` y `X-Frame-Options: DENY` (en `.htaccess`, porque no funcionan en `<meta>`).
- **Links externos:** `rel="noopener noreferrer"`.
- **Headers** (`.htaccess`): `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` que apaga cámara, micrófono, geolocalización y pagos.
- **Cadena de suministro:** sin dependencias de npm. El workflow de CI usa actions oficiales de GitHub con permisos mínimos.
- **Servidor local:** `serve.mjs` escucha solo en `127.0.0.1` y bloquea rutas fuera de `dist/`.
- CSRF, inyección SQL, rate limiting y CORS: no aplican (no hay backend).

## 7. Logs y monitoreo
No hay logs propios. El hosting registra accesos.

## 8. Checklist de seguridad
- [x] Sin secretos en el repositorio
- [ ] HTTPS en todos los entornos públicos (forzado por `.htaccess`; GitHub Pages ya usa HTTPS)
- [x] Contraseñas hasheadas — no aplica
- [x] Validación de inputs (del JSON, en el build)
- [x] Permisos en backend — no aplica
- [x] Rate limiting — no aplica
- [x] Dependencias auditadas (no hay)
- [x] Backups — el JSON y las fotos viven en git
