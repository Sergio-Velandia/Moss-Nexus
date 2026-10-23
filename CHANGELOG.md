# Changelog

Todos los cambios relevantes de Moss Nexus se registran en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa [Versionado Semántico](https://semver.org/lang/es/). Mientras sea anterior a 1.0, MINOR sube con cada fase completa o plantilla nueva, y PATCH con correcciones y documentación.

## [Sin publicar]

## [0.9.0] - 2026-10-22

Honestidad visible: se distingue a simple vista qué plantillas se probaron y cuáles no.

### Añadido
- Filtro «Solo probadas» en el catálogo, con el número de plantillas probadas. Se guarda en la URL (`?probadas=1`) y por defecto se ven todas.
- Sección «Qué significa el sello «Probado»» en Acerca: cuántas plantillas lo tienen (calculado), y cómo se prueba cada una (instancia real de n8n, datos ficticios, casos trampa, problemas y limitaciones documentados).
- Pruebas que fallan si un sello no tiene fecha real, versión de n8n o tipo de datos, o si una plantilla sin sello dice en sus textos que está probada.

### Cambiado
- La etiqueta «Sin probar» es más visible en la tarjeta y en la ficha, y va acompañada de la línea «Esta plantilla se revisó, pero aún no se probó en una instancia real. Úsala como punto de partida.»

## [0.8.3] - 2026-10-22

Auditoría transversal: ¿un aviso o una acción secundaria que falla puede impedir el registro? Se revisaron las 13 plantillas; 11 ya registraban antes de avisar o no registran nada.

### Añadido
- Pruebas del repositorio para facturas (las dos salidas de Drive llegan al registro), aprobación de gastos (registro previo y actualización por ID) y los montos en COP.
- **alertas-de-errores-n8n**, **leads-formulario-a-sheets**, **onboarding-empleado**, **leads-a-hubspot-sin-duplicados** y **pagos-stripe-idempotentes**: paso «¿No usas Slack?», como en las plantillas de IA. Las alternativas no están probadas; el sello cubre solo Slack.
- **aprobacion-de-gastos**, **pagos-stripe-idempotentes**, **leads-a-hubspot-sin-duplicados** y **whatsapp-a-sheets**: limitaciones y guías de Moss. Siguen «Sin probar».

### Corregido
- **facturas-gmail-a-drive** (⚠️ cambio en una plantilla probada; el sello conserva su fecha hasta repetir la prueba corta): si fallaba la subida a Drive, la factura no quedaba registrada y el trigger no volvía a tomar ese correo. Ahora se registra igual, con «No se subió a Drive: …» en la columna Enlace.
- **aprobacion-de-gastos**: si fallaba el correo de aprobación, la solicitud se perdía. Ahora se registra como «Pendiente» antes de pedir la aprobación y la decisión actualiza esa misma fila (nueva columna ID).
- **aprobacion-de-gastos**: el umbral pasa a 500.000 COP y los correos muestran el monto como «$ 1.500.000», con el mismo formato que cobranza y reporte de ventas.
- **pagos-stripe-idempotentes**: el recibo y el aviso mostraban «150000.00 COP»; ahora muestran «$ 150.000» (y dos decimales en monedas como USD).

## [0.8.2] - 2026-10-22

### Añadido
- Pruebas del repositorio para tickets de soporte: lectura de la clasificación (JSON limpio, con bloque de código, inválido y en lote), remitente, orden de registro y avisos sin vista previa.
- **resumen-correos-con-ia** y **tickets-soporte-con-ia**: paso «¿No usas Slack?» para cambiar solo los nodos de aviso por Gmail, Outlook, Teams, Telegram, Discord o WhatsApp. Esas alternativas no están probadas; el sello cubre solo Slack.

### Cambiado
- **tickets-soporte-con-ia**: la IA pasa a un Basic LLM Chain con el sub-nodo Google Gemini Chat Model (Flash-Lite con alias «latest», temperatura 0). Para usar OpenAI o Anthropic basta con cambiar ese sub-nodo. Se elimina el nodo «Configuración» y el prompt trata el correo como datos, nunca como instrucciones.
- **tickets-soporte-con-ia**: sello «Probado» (22 oct 2026, n8n 2.43.5), con Gemini Flash-Lite y correos ficticios. La página destaca qué datos llegan al proveedor de IA, explica cómo probar el trigger de Gmail con uno o varios correos, la etiqueta de prueba y los canales de Slack, y documenta 3 problemas frecuentes y 5 limitaciones.

### Corregido
- **tickets-soporte-con-ia**: si fallaba un aviso de Slack, los tickets de ese lote podían quedar sin registrar. Ahora todo el lote se registra en la hoja antes de enviar cualquier aviso.
- **tickets-soporte-con-ia**: los avisos de Slack ya no muestran la vista previa del enlace de Gmail, y el remitente aparece sin comillas.
- **tickets-soporte-con-ia**: Gemini a veces envolvía el JSON en un bloque de código; ahora se limpia antes de leerlo.

## [0.8.1] - 2026-10-21

### Añadido
- Herramienta «IA (Gemini)» en el catálogo.
- Pruebas del repositorio para el resumen de correos: preparación de la lista, singular y plural, reglas del prompt y conexión del modelo al Chain.

### Cambiado
- **resumen-correos-con-ia**: la IA pasa a un Basic LLM Chain con el sub-nodo Google Gemini Chat Model (Flash-Lite con alias «latest», nivel gratuito). Para usar OpenAI o Anthropic basta con cambiar ese sub-nodo. Se elimina el nodo «Configuración».
- **resumen-correos-con-ia**: sello «Probado» (21 oct 2026, n8n 2.43.5), con Gemini Flash-Lite y correos ficticios. La página destaca qué datos llegan al proveedor de IA y qué implica el nivel gratuito, explica cómo probar con una etiqueta de Gmail y cómo cambiar de proveedor, y documenta 3 problemas frecuentes y 5 limitaciones.
- Términos: Gemini se suma a la lista de marcas de Google.

### Corregido
- **resumen-correos-con-ia**: el resumen salía con negrita doble (`**así**`) y una frase de introducción, que Slack no muestra bien.
- **resumen-correos-con-ia**: un correo con instrucciones para la IA podía quedar en «Requiere acción hoy». Ahora el prompt lo trata como dato y lo marca como «⚠️ posible correo sospechoso» en «Puedes ignorar».
- **resumen-correos-con-ia**: el encabezado decía «1 correos sin leer».

## [0.8.0] - 2026-10-20

### Añadido
- Página «Propón un flujo» (`/propon-un-flujo`) con dos formularios: una propuesta detallada (negocio, sector, tamaño del equipo, problema, cómo se resuelve hoy, idea, herramientas, frecuencia y objetivo) y «Habla conmigo» para escribir directamente. Validación por campo, avisos accesibles, autorización de datos obligatoria, casilla opcional para publicar la idea como plantilla y campo trampa contra bots. Los mensajes se envían con EmailJS, sin dependencias nuevas, y el correo de destino no aparece en el sitio.
- Enlaces a «Propón un flujo» en el menú, el footer, la página de contacto y una tarjeta nueva en el inicio. La ruta tiene página estática y entrada en el sitemap.

### Cambiado
- Privacidad: describe qué datos recogen los formularios, para qué, cuánto se guardan, EmailJS como tercero y los derechos de la Ley 1581 de 2012 con sus plazos.
- Términos: nueva sección sobre propuestas de flujos (no crean relación comercial y la idea solo se publica con autorización).
- Contacto: presenta el formulario como el canal para proponer flujos o conversar sobre implementarlos.

## [0.7.9] - 2026-10-20

### Añadido
- Pruebas del repositorio para onboarding: evalúan la detección de fecha pasada, el aviso del checklist, la condición del IF y el orden de ejecución tal como están en el flujo publicado.

### Cambiado
- **onboarding-empleado**: sello «Probado» (19 oct 2026, 21:39, n8n 2.43.5), con datos ficticios y alias de correo del propio autor. La página explica cómo probar con la Test URL y alias de correo, compartir la Production URL, elegir la zona horaria e invitar al bot de Slack, y documenta 5 problemas frecuentes y 4 limitaciones (duplicados, fines de semana y festivos, avisos tras un fallo y horario fijo). Enlaza las guías de Moss de OAuth 2 de Google y Slack, y la plantilla de alertas de errores.

### Corregido
- **onboarding-empleado**: si fallaba Slack, Gmail o Calendar, el ingreso podía quedar sin registrar. Ahora se registra en la hoja antes de enviar cualquier aviso.
- **onboarding-empleado**: con una fecha de ingreso pasada se agendaba una reunión en el pasado. Ahora no se agenda, el checklist al responsable empieza con un aviso para revisarla y el correo de bienvenida no menciona la reunión.

## [0.7.8] - 2026-10-20

### Añadido
- Pruebas del repositorio que ejecutan el nodo «Calcular mora» de cobranza tal como está publicado: 20 casos de calendario, fines de semana, correos, montos y fechas. Para eso se agrega `luxon` 3.7.2 como dependencia de desarrollo; no entra al build del sitio.

### Cambiado
- **cobranza-facturas-vencidas**: sello «Probado» (19 oct 2026, 21:00, n8n 2.43.5), con facturas ficticias y el correo del propio autor. La página explica cómo probar sin molestar a clientes (fórmula de vencimiento y borrado de los datos de prueba), la pestaña por nombre o por lista, y documenta 5 problemas frecuentes y 4 limitaciones (festivos, sin deduplicación por día, registro y formato de montos). Enlaza la guía de OAuth 2 de Moss y la plantilla de alertas de errores. Tiempo estimado: 30 minutos.

### Corregido
- **cobranza-facturas-vencidas**: los recordatorios y escalamientos que caían en fin de semana nunca se enviaban. Los lunes ahora se revisan también el sábado y el domingo, con el calendario en la constante `CALENDARIO`.
- **cobranza-facturas-vencidas**: una factura sin correo detenía el envío y dejaba sin registrar lo que ya había salido. Ahora sale por la ruta «Sin correo», los errores de Gmail se registran como «Error al enviar», y «firme» sin un responsable válido se envía sin copia y lo anota.
- **cobranza-facturas-vencidas**: montos en COP sin decimales, con lectura de texto colombiano («$ 1.500.000»), y fechas leídas como número de serie, sin depender del idioma de la hoja.
- En el mapa, las conexiones que saltan pasos tienen su propio carril y ya no quedan ocultas detrás de otro nodo.

## [0.7.7] - 2026-10-19

### Añadido
- Flujo de prueba opcional por plantilla (`prueba.json`), con su propio botón «Copiar flujo de prueba» y un aviso destacado. La prueba de seguridad también lo revisa.

### Cambiado
- **alertas-de-errores-n8n**: sello «Probado» (19 oct 2026, 20:04, n8n 2.43.5), con un flujo que falla a propósito. Explica cómo activar el Error Workflow (los dos flujos publicados; «Execute» no dispara alertas), incluye el flujo de prueba con el aviso de despublicarlo y documenta 5 problemas frecuentes y 4 limitaciones. Enlaza las guías de Moss de manejo de errores, Slack y OAuth 2 de Google. Tiempo estimado: 25 minutos.

### Corregido
- **alertas-de-errores-n8n**: «[critico]» sin tilde o en mayúsculas no se detectaba como crítico. Ahora funciona con o sin tilde y en mayúsculas, con una prueba que evalúa la expresión real del flujo.
- **alertas-de-errores-n8n**: si la hoja de registro fallaba, no llegaba ninguna alerta. Ahora las alertas llegan igual y además se avisa en Slack que no se pudo registrar.

## [0.7.6] - 2026-10-19

### Eliminado
- Plantilla **monitor-sitio-caido** (monitor de sitio web caído con alertas por Telegram). Su página deja de existir y la librería queda en 13 plantillas.

## [0.7.5] - 2026-10-16

### Cambiado
- El sitio usa el dominio propio **sergio-velandia.dev**: URL canónicas, Open Graph, Twitter Card, `sitemap.xml`, páginas por ruta, enlaces a Moss y al portafolio, y los botones de guías de Moss en las plantillas. Las direcciones `github.io` anteriores redirigen solas.
- El correo de contacto pasa a ser `contacto@sergio-velandia.dev`. Se sigue mostrando solo al pulsar «Mostrar correo», sin quedar legible en el HTML.
- README y licencia de contenido con el dominio nuevo.

## [0.7.4] - 2026-10-15

### Añadido
- Campo opcional `probado.nota` para aclarar con qué datos se hizo una prueba; reemplaza el texto por defecto del sello.

### Cambiado
- **leads-formulario-a-sheets**: sello «Probado» (15 oct 2026, 23:42, n8n 2.43.5), con datos reales del propio autor, que no se publican. La página explica cómo crear la app de Slack desde un manifiesto, el token de bot (que no se comparte), la invitación del bot al canal y la diferencia entre la Test URL y la Production URL. Enlaza las guías de Moss de Slack y de OAuth 2 de Google. Documenta 5 problemas frecuentes, 3 limitaciones (sin antispam, duplicados y datos personales según la Ley 1581 de 2012) y que el texto del formulario nunca se ejecuta como fórmula. Tiempo estimado: 20 minutos.

## [0.7.3] - 2026-10-15

### Añadido
- El sello «Probado» indica con qué datos se probó (campo opcional `probado.datos`). Las tres plantillas probadas aclaran que se usaron datos ficticios, creados solo para la prueba, y no datos de personas ni de negocios reales.

### Cambiado
- **reporte-diario-ventas**: sello «Probado» (15 oct 2026, 11:19, n8n 2.43.5). Requisitos, pasos y nota aclaran la hoja nativa de Google, el correo de destino, la zona horaria y la configuración regional de la hoja, y enlazan la guía de OAuth 2 de Moss. Documenta 4 problemas frecuentes y 4 limitaciones (entre ellas, que las devoluciones restan del total). El correo distingue «más vendido (por cantidad de ventas)» de «mayor ingreso». Tiempo estimado: 20 minutos.

### Corregido
- **reporte-diario-ventas**: los totales escritos como texto con formato colombiano («45.000», «$ 45.000», «45.000,50») sumaban 0 o mal sin avisar. Ahora se leen bien, y las filas con Total ilegible se cuentan y se avisan en el correo. Las fechas reales de la hoja se leen como número de serie, sin depender de su idioma. El dinero se muestra en pesos colombianos (`MONEDA`, configurable).

## [0.7.2] - 2026-10-15

### Añadido
- Campos opcionales `problemas` (síntoma → solución) y `limitaciones` en las plantillas. El detalle los muestra como «Problemas frecuentes» y «Limitaciones conocidas», antes de copiar el flujo.

### Cambiado
- **facturas-gmail-a-drive**: sello «Probado» (15 oct 2026, 21:40, n8n 2.43.5). Requisitos y pasos aclaran las APIs de Gmail, Drive y Sheets, la hoja nativa de Google y los encabezados exactos, y enlazan la guía de OAuth 2 de Moss. Documenta 5 problemas frecuentes y 3 limitaciones conocidas. Tiempo estimado: 25 minutos.

### Corregido
- **facturas-gmail-a-drive**: los logos y las imágenes de firma se subían como facturas. Ahora PDF, XML y ZIP siempre pasan, y las imágenes solo si pesan al menos 50 KB (`MIN_KB_IMAGEN`, ajustable) y su nombre no parece un logo, una firma o un ícono de red social. El enlace del registro usa el `webViewLink` de Drive.

## [0.7.1] - 2026-10-15

### Añadido
- El sello «Probado» puede indicar la hora de la prueba (campo opcional `probado.hora`).
- Campo opcional `guias` para enlazar guías de configuración desde una plantilla; se muestran junto a los requisitos.

### Cambiado
- **agenda-diaria-calendar**: primera plantilla con sello «Probado» (15 oct 2026, 00:15, n8n 2.43.5). Requisitos y pasos aclaran las credenciales OAuth 2.0 de Google Cloud Console, que el flujo no trae ninguna cuenta ni correo, y enlazan la guía de OAuth 2 del manual de Moss. Tiempo estimado: 20 minutos.

## [0.7.0] - 2026-10-12

Fase Repaso: coherencia del inicio y de la información general.

### Añadido
- Aviso en el inicio: cada plantilla es un punto de partida y suele requerir ajustes (datos, textos, reglas, horarios, herramientas y accesos).
- «Dentro de cada plantilla» se muestra con una plantilla real del catálogo: su miniatura de pasos, la división del flujo, el problema, los escenarios, los requisitos, el nivel y el estado de prueba.
- Cifras de la librería en el hero (plantillas, niveles, categorías y apps conectadas), calculadas desde los datos.
- Metadatos Open Graph y Twitter Card para compartir enlaces. La imagen se espera en `public/og.png` (1200×630).
- En el build, un `index.html` por ruta y por plantilla, con su propio título, descripción y URL canónica, para que GitHub Pages responda 200 en lugar de 404. También se genera `sitemap.xml`.
- Principios «Adaptable a tu caso» y «Libre para usar» en Acerca.

### Cambiado
- Las destacadas del inicio se equilibran por nivel (dos fáciles, dos intermedias y dos avanzadas), con un acceso a toda la galería.
- «Cómo funciona» menciona ajustar el flujo al caso propio.
- Las herramientas populares y las categorías de la galería solo se muestran si tienen plantillas.

### Corregido
- El foco del teclado en los buscadores era casi invisible.

## [0.6.0] - 2026-10-12

Fase Legal: términos, privacidad, contacto y licencia.

### Añadido
- Página de **términos y condiciones** (`/terminos`): plantillas «tal cual» y sin garantía, responsabilidad sobre credenciales y servicios de terceros, marcas, limitación de responsabilidad, licencia, y ley aplicable y jurisdicción colombianas (Ley 23 de 1982, Decisión Andina 351 de 1993 y una nota sobre la Ley 603 de 2000).
- Página de **privacidad** (`/privacidad`), basada en una auditoría del código: solo se guarda la preferencia de tema en el navegador; sin cookies, cuentas, formularios, analítica ni recursos de terceros.
- Página de **contacto** (`/contacto`): GitHub Issues y un correo que solo se muestra al pulsar un botón.
- Footer con enlaces a Términos, Privacidad, Contacto y Licencia, el año y el aviso de independencia de n8n GmbH.
- Licencias: MIT para el código del sitio, MIT-0 para los `workflow.json` y CC BY 4.0 para los textos de las plantillas.
- Pruebas de renderizado de las páginas legales y de los enlaces del footer.

### Cambiado
- La Fase 3 se da por completa: desde aquí, la librería se actualiza con plantillas sueltas.

## [0.5.0] - 2026-10-12

Fase 3, lote 3: plantillas de nivel avanzado.

### Añadido
- Plantilla **aprobacion-de-gastos**: los gastos sobre un umbral esperan la aprobación de un responsable con botones en el correo; los demás se aprueban solos y todo queda registrado.
- Plantilla **tickets-soporte-con-ia**: la IA clasifica la urgencia y la categoría de cada correo de soporte, lo resume y lo envía al canal de Slack que corresponde.
- Plantilla **resumen-correos-con-ia**: resumen diario en Slack de los correos sin leer, ordenado por lo que requiere acción hoy.
- Plantilla **pagos-stripe-idempotentes**: registra cada pago de Stripe una sola vez aunque el webhook llegue repetido, y luego envía el recibo y avisa a ventas.

### Corregido
- En pantallas angostas, el mapa se muestra como una lista de pasos numerados: los flujos con caminos en paralelo ya no se encogen hasta ser ilegibles.

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

[Sin publicar]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.9.0...HEAD
[0.9.0]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.8.3...v0.9.0
[0.8.3]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.8.2...v0.8.3
[0.8.2]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.8.1...v0.8.2
[0.8.1]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.8.0...v0.8.1
[0.8.0]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.7.9...v0.8.0
[0.7.9]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.7.8...v0.7.9
[0.7.8]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.7.7...v0.7.8
[0.7.7]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.7.6...v0.7.7
[0.7.6]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.7.5...v0.7.6
[0.7.5]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.7.4...v0.7.5
[0.7.4]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.7.3...v0.7.4
[0.7.3]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.7.2...v0.7.3
[0.7.2]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.7.1...v0.7.2
[0.7.1]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/Sergio-Velandia/Moss-Nexus/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Sergio-Velandia/Moss-Nexus/releases/tag/v0.1.0
