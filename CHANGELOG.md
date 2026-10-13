# Changelog

Todos los cambios relevantes de Moss Nexus se registran en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa [Versionado Semántico](https://semver.org/lang/es/). Mientras sea anterior a 1.0, MINOR sube con cada fase completa o plantilla nueva, y PATCH con correcciones y documentación.

## [Sin publicar]

## [0.4.0] - 2026-10-12

Fase 3, lote 2: plantillas de nivel intermedio.

### Añadido
- Plantilla **onboarding-empleado**: un formulario de ingreso agenda la bienvenida, escribe a la persona, envía una lista de verificación al responsable, lo anuncia en Slack y lo registra.
- Plantilla **cobranza-facturas-vencidas**: recordatorios de cobro con tono según los días de mora (amable, firme y escalado al responsable) y registro de cada gestión.
- Plantilla **leads-a-hubspot-sin-duplicados**: normaliza los leads de un webhook y los crea o actualiza en HubSpot por correo; los inválidos van a una hoja para revisar.
- Plantilla **alertas-de-errores-n8n**: flujo de errores central que registra los fallos, avisa en Slack y escala por correo los flujos marcados como [crítico].

## [0.3.0] - 2026-10-12

Fase 3, lote 1: plantillas de nivel fácil.

### Añadido
- Plantilla **leads-formulario-a-sheets**: formulario propio de n8n que guarda cada lead en Google Sheets y avisa a ventas en Slack.
- Plantilla **agenda-diaria-calendar**: agenda del día por correo desde Google Calendar, con el tiempo total en reuniones.
- Plantilla **monitor-sitio-caido**: revisa un sitio cada 5 minutos y avisa por Telegram solo cuando cae y cuando se recupera.
- Plantilla **facturas-gmail-a-drive**: sube a Drive las facturas que llegan por Gmail, con nombre ordenado, y las registra en una hoja.
- Herramientas Formulario de n8n, Google Drive, HubSpot y Stripe, y categorías Finanzas, Operaciones y TI, y Recursos humanos.
- Prueba que verifica que las conexiones de cada workflow apunten a nodos existentes.

## [0.2.0] - 2026-10-12

Fase 2: primeros flujos reales.

### Añadido
- Plantilla **whatsapp-a-sheets**: guarda los contactos de WhatsApp (Cloud API oficial) en Google Sheets sin duplicados y avisa por Gmail cuando escribe alguien nuevo.
- Plantilla **reporte-diario-ventas**: cada mañana resume las ventas de ayer desde Google Sheets y las envía por Gmail, también cuando no hubo ventas.
- Estado «Sin probar» en tarjetas y detalle, para plantillas publicadas que aún no se han probado en una instancia real de n8n.
- Prueba que impide publicar workflows con credenciales, `pinData` o `meta.instanceId`.
- Capturas de la vista previa en el README.

### Cambiado
- El sello «Probado» es opcional. Las plantillas probadas se listan primero.
- Los flujos con más de 5 columnas se dibujan en vertical también en escritorio.
- Textos del inicio y de Acerca que prometían que todas las plantillas estaban probadas.

### Corregido
- El rayo del disparador tapaba la etiqueta del primer nodo.
- Las etiquetas largas se salían de los nodos del mapa.
- El mapa se encogía hasta quedar ilegible en flujos largos.

### Eliminado
- Las dos plantillas de ejemplo de la Fase 1.

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

[Sin publicar]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Sergio-Velandia/Moss-Nexus/releases/tag/v0.1.0
