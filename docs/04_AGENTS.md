# 04 — Agentes de IA

> Basado en: 01_PRD.md, 03_ARCHITECTURE.md

## 1. Agentes del producto
No aplica: el sitio generado no usa IA.

## 2. Agentes de desarrollo (Claude Code, Cursor, Codex…)

### Reglas de trabajo
1. Leer todos los documentos de `/docs` antes de actuar.
2. Toda decisión debe respetar la documentación; si algo la contradice, avisar antes de continuar.
3. No inventar dependencias, endpoints, entidades ni variables de entorno que no estén documentados.
4. Pedir confirmación antes de acciones destructivas (borrar archivos, force push, cambios en producción).
5. Nunca escribir secretos en el código (ver 05_SECURITY.md).
6. Seguir 06_CODE_STYLE.md y la convención de commits.
7. Si se cambia una decisión, actualizar el documento correspondiente en el mismo cambio.

### Herramientas permitidas
- Node (build, tests y servidor local), git, gh.
- Navegador para revisar el sitio generado.

### Acciones prohibidas
- Agregar dependencias de npm sin actualizar 03_ARCHITECTURE.md y justificarlo.
- Cargar reseñas, teléfonos, direcciones o datos de un negocio real que no haya pasado el cliente.
- Publicar en el hosting de un cliente sin su aprobación.
- Meter HTML sin escapar en `render.mjs`.
