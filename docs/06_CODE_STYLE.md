# 06 — Estilo de código

> Basado en: 03_ARCHITECTURE.md

## 1. Convenciones de nombres
| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Variables / funciones | camelCase en español | `estadoActual`, `textoSobre` |
| Constantes | UPPER_SNAKE_CASE | `DIAS`, `SEMANA` |
| Archivos | minúsculas, `.mjs` para módulos de Node | `horario.mjs` |
| Clases CSS | minúsculas con guiones, en español | `.cartel`, `.btn--primario` |
| Campos del JSON | camelCase en español | `mensajeWhatsapp` |

## 2. Idioma
Código, comentarios, textos del sitio y documentación en español (Argentina, con vos). El README tiene una línea en inglés.

## 3. Formato
2 espacios, comillas simples en JS, punto y coma. Sin linter por ahora para no sumar dependencias.

## 4. Estructura de archivos
Por capa, como en 03_ARCHITECTURE.md. La lógica que corre en el navegador y en Node (horarios) va en `src/lib/` sin APIs de Node.

## 5. Manejo de errores
- Build: errores de validación juntos, uno por línea con la ruta del campo (`horarios.lun[0]`), y salida con código 1.
- Navegador: si falla el cálculo del horario, el cartel queda oculto y la tabla sigue visible.

## 6. Comentarios y documentación
Comentar el porqué, no el qué. El README explica cómo usar la plantilla para un cliente nuevo.

## 7. Testing
- `node --test` (incluido en Node, sin dependencias).
- Se testea: horarios (cortados, medianoche, domingo a lunes, cierra pronto), validación, escape de HTML y un build completo con datos maliciosos.
- Tests en `test/*.test.mjs`. Corren en CI en cada push.

## 8. Convención de commits
Conventional Commits: `tipo(ámbito): descripción`
- Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`

## 9. Ramas y pull requests
`main` siempre publicable. Cambios grandes en `feature/<nombre>` y merge cuando pasan los tests.
