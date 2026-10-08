# 08 — API

> Basado en: 01_PRD.md, 03_ARCHITECTURE.md, 05_SECURITY.md, 07_DATABASE.md

## 1. Información general
No aplica: el proyecto no expone ni consume APIs. Es un sitio estático.

## 2. Integraciones externas
| Servicio | Uso | Endpoints consumidos | Webhooks | Variable de entorno |
|----------|-----|----------------------|----------|---------------------|
| WhatsApp | Abrir chat con mensaje (F-04) | `https://wa.me/<número>?text=<mensaje>` (link, no API) | No | No |
| Google Maps | Mapa y "Cómo llegar" | `https://www.google.com/maps?q=…&output=embed` y `https://www.google.com/maps/dir/?api=1&destination=…` | No | No |
| Google Fonts | Tipografías (F-06) | `https://fonts.googleapis.com/css2` | No | No |

## 3. Rate limiting
No aplica.
