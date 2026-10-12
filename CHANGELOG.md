# Changelog

Todos los cambios relevantes de Moss Nexus se registran en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa [Versionado Semántico](https://semver.org/lang/es/). Mientras sea anterior a 1.0, MINOR sube con cada fase completa o plantilla nueva, y PATCH con correcciones y documentación.

## [Sin publicar]

## [0.1.1] - 2026-10-12

### Añadido
- Convenciones de commits y estrategia de versionado en `CLAUDE.md`.
- Este `CHANGELOG.md`, con el historial desde la Fase 1.
- Presentación, estado del proyecto y espacio para capturas en el README.

### Cambiado
- La versión de `package.json` pasa a 0.1.1, sincronizada con este changelog.

## [0.1.0] - 2026-10-12

Fase 1: estructura y diseño del sitio.

### Añadido
- Páginas de inicio, galería (`/plantillas`), detalle (`/plantillas/:slug`), acerca y 404.
- Inicio con hero animado, cómo funciona, plantillas destacadas, herramientas populares, estructura de una plantilla y ecosistema Moss.
- Galería con búsqueda que ignora las tildes y filtros por herramienta, categoría y dificultad, guardados en la URL, con estados vacío y de carga.
- Mapa visual del flujo generado desde `diagram.json`: horizontal en escritorio, vertical en móvil y con una alternativa accesible.
- Botón «Copiar flujo», con confirmación visual y descarga `.json` como respaldo.
- Sello «Probado», con la fecha y la versión de n8n.
- Índice automático de plantillas desde `src/data/templates/<slug>/`, con validación y pruebas.
- Dos plantillas de ejemplo, ficticias, para probar el diseño.
- Tema oscuro por defecto y tema claro opcional, con la paleta musgo de Moss y acento coral.
- Despliegue automático en GitHub Pages con cada push a `main`.

[Sin publicar]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Sergio-Velandia/Moss-Nexus/releases/tag/v0.1.0
