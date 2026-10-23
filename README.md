# Moss Nexus

Librería de flujos de automatización para **n8n**, ya armados, explicados y listos para copiar. Está pensada para quien sabe qué quiere automatizar pero no quiere pelearse con webhooks, JSON ni tokens.

**[Ver el sitio en vivo →](https://sergio-velandia.dev/Moss-Nexus/)** · Proyecto hermano de **[Moss](https://sergio-velandia.dev/Moss/)**: en Moss se aprende el porqué; en Nexus se copia el flujo y se usa.

## Vista previa

<table>
  <tr>
    <td align="center" width="50%">
      <a href="docs/img/inicio.png"><img src="docs/img/inicio.png" alt="Inicio de Moss Nexus: buscador y lienzo con un flujo animado" width="400"></a>
      <br><sub><b>Inicio</b></sub>
    </td>
    <td align="center" width="50%">
      <a href="docs/img/plantillas.png"><img src="docs/img/plantillas.png" alt="Galería de plantillas con búsqueda y filtros" width="400"></a>
      <br><sub><b>Plantillas</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <a href="docs/img/acerca.png"><img src="docs/img/acerca.png" alt="Página Acerca: qué es Nexus y su relación con Moss" width="400"></a>
      <br><sub><b>Acerca</b></sub>
    </td>
    <td align="center" width="50%">
      <a href="docs/img/ejemplo.png"><img src="docs/img/ejemplo.png" alt="Detalle de una plantilla con su mapa del flujo" width="400"></a>
      <br><sub><b>Ejemplo</b></sub>
    </td>
  </tr>
</table>

## Estado

**Estable: v1.0.0.** La librería ya no crece por fases: se actualiza con plantillas sueltas, correcciones y nuevos sellos «Probado». Historial completo en el [CHANGELOG](CHANGELOG.md).

## Plantillas

13 plantillas en tres niveles. **9 tienen el sello «Probado»**: se ejecutaron completas en una instancia real de n8n, con la fecha y la versión a la vista. Las otras 4 se revisaron, pero todavía no se probaron: úsalas como punto de partida.

| Plantilla | Nivel | Estado |
| --- | --- | --- |
| [Agenda del día por correo desde Google Calendar](https://sergio-velandia.dev/Moss-Nexus/plantillas/agenda-diaria-calendar/) | Fácil | ✅ Probada (15 oct 2026) |
| [Facturas de proveedores de Gmail a Google Drive con registro](https://sergio-velandia.dev/Moss-Nexus/plantillas/facturas-gmail-a-drive/) | Fácil | ✅ Probada (15 oct 2026) |
| [Leads del formulario web a Google Sheets con aviso en Slack](https://sergio-velandia.dev/Moss-Nexus/plantillas/leads-formulario-a-sheets/) | Fácil | ✅ Probada (15 oct 2026) |
| [Reporte diario de ventas por correo desde Google Sheets](https://sergio-velandia.dev/Moss-Nexus/plantillas/reporte-diario-ventas/) | Fácil | ✅ Probada (15 oct 2026) |
| [Alertas cuando falla cualquier flujo de n8n](https://sergio-velandia.dev/Moss-Nexus/plantillas/alertas-de-errores-n8n/) | Intermedia | ✅ Probada (19 oct 2026) |
| [Cobranza automática de facturas vencidas con recordatorios escalonados](https://sergio-velandia.dev/Moss-Nexus/plantillas/cobranza-facturas-vencidas/) | Intermedia | ✅ Probada (19 oct 2026) |
| [Onboarding de empleados: calendario, correos, Slack y registro](https://sergio-velandia.dev/Moss-Nexus/plantillas/onboarding-empleado/) | Intermedia | ✅ Probada (19 oct 2026) |
| [Leads del sitio web a HubSpot sin duplicados](https://sergio-velandia.dev/Moss-Nexus/plantillas/leads-a-hubspot-sin-duplicados/) | Intermedia | Sin probar |
| [Contactos de WhatsApp a Google Sheets con aviso por Gmail](https://sergio-velandia.dev/Moss-Nexus/plantillas/whatsapp-a-sheets/) | Intermedia | Sin probar |
| [Resumen diario de correos sin leer con IA en Slack](https://sergio-velandia.dev/Moss-Nexus/plantillas/resumen-correos-con-ia/) | Avanzada | ✅ Probada (21 oct 2026) |
| [Tickets de soporte clasificados con IA y repartidos en Slack](https://sergio-velandia.dev/Moss-Nexus/plantillas/tickets-soporte-con-ia/) | Avanzada | ✅ Probada (22 oct 2026) |
| [Aprobación de gastos por correo con registro en Google Sheets](https://sergio-velandia.dev/Moss-Nexus/plantillas/aprobacion-de-gastos/) | Avanzada | Sin probar |
| [Pagos de Stripe sin pedidos duplicados (webhook idempotente)](https://sergio-velandia.dev/Moss-Nexus/plantillas/pagos-stripe-idempotentes/) | Avanzada | Sin probar |

Una prueba del repositorio comprueba que esta tabla coincide con los datos de las plantillas.

## Cómo se prueba cada plantilla

- **Instancia real de n8n.** El flujo se importa tal como lo copia cualquiera y se ejecuta de principio a fin. El sello guarda la fecha (y la hora, si se anotó), la versión de n8n y si los datos eran ficticios o reales.
- **Datos ficticios.** Clientes, correos, facturas y empleados inventados, o alias del correo del autor. Nunca datos de otras personas.
- **Casos trampa.** Además del caso feliz: bandeja vacía, fechas que ya pasaron, recordatorios en fin de semana, correos que intentan darle órdenes a la IA, un bot fuera del canal de Slack.
- **Lo que falla queda escrito.** Cada error se corrige en la plantilla y se documenta en «Problemas frecuentes» (síntoma y solución). Lo que la plantilla no resuelve va en «Limitaciones». La lógica de los nodos Code y de las expresiones clave tiene pruebas en `src/lib/*.test.ts`.
- **Registrar primero, avisar después.** Si un aviso de Slack o de Gmail falla, el registro ya quedó hecho. Este patrón salió de las pruebas y se aplica en todas las plantillas que registran algo.
- **Si una plantilla probada cambia,** se repite una prueba corta antes de actualizar la fecha del sello.

## Cómo contribuir

- **¿Te falta un flujo?** Proponlo en [Propón un flujo](https://sergio-velandia.dev/Moss-Nexus/propon-un-flujo/) o abre un [issue](https://github.com/Sergio-Velandia/Moss-Nexus/issues).
- **¿Encontraste un error en una plantilla?** Abre un issue con la plantilla, la versión de n8n y el mensaje de error, sin credenciales ni datos personales.
- **¿Quieres aportar una plantilla?** Sigue [Cómo agregar una plantilla nueva](#cómo-agregar-una-plantilla-nueva) y abre un pull request. Entra como «Sin probar» hasta que se pruebe en una instancia real.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # pruebas: datos de todas las plantillas, lógica de los nodos Code, sellos y README
npm run lint
npm run build      # typecheck + build de producción
```

Cada push a `main` se publica en GitHub Pages (`.github/workflows/deploy.yml`).

## Cómo agregar una plantilla nueva

Agregar una plantilla es **solo crear una carpeta**. No hace falta tocar ningún componente.

1. Crea `src/data/templates/<slug>/` (el slug va en minúsculas, con guiones: `whatsapp-a-sheets`).
2. Pon dentro estos tres archivos:

### `meta.json`

```json
{
  "slug": "whatsapp-a-sheets",
  "titulo": "Contactos de WhatsApp a Google Sheets con aviso por Gmail",
  "resumen": "Una línea: lo que verá la tarjeta de la galería.",
  "problema": "Un párrafo con el problema real que resuelve, sin jerga.",
  "categoria": "ventas",
  "herramientas": ["whatsapp", "google-sheets", "gmail"],
  "dificultad": "facil",
  "tiempoEstimado": 15,
  "requisitos": ["Cuenta de Google", "Credenciales de WhatsApp Business"],
  "escenarios": ["Tienda que atiende pedidos por WhatsApp"],
  "pasos": ["Pulsa «Copiar flujo».", "Pégalo en un flujo nuevo de n8n.", "Conecta tus credenciales.", "Prueba y actívalo."],
  "probado": { "fecha": "2026-10-12", "versionN8n": "1.112.0" },
  "destacado": false
}
```

| Campo | Valores |
| --- | --- |
| `slug` | Igual al nombre de la carpeta |
| `categoria` | Un id de [`src/data/categories.ts`](src/data/categories.ts) |
| `herramientas` | Ids de [`src/data/tools.ts`](src/data/tools.ts), en el orden en que aparecen en el flujo |
| `dificultad` | `facil`, `media` o `avanzada` |
| `tiempoEstimado` | Minutos para configurarla la primera vez |
| `destacado` | `true` para que aparezca en «Destacadas» del Inicio |
| `probado` | Opcional. Solo cuando el flujo se probó en una instancia real de n8n: `{ "fecha": "AAAA-MM-DD", "hora": "HH:mm", "versionN8n": "2.x.x", "datos": "ficticios" }` (`hora`, `datos` y `nota` son opcionales; `datos` vale `ficticios` o `reales`, y `nota` aclara con qué datos se probó, sin datos personales). Sin él, la plantilla se muestra como «Sin probar» |
| `guias` | Opcional. Enlaces de apoyo que se muestran junto a los requisitos: `[{ "titulo": "…", "url": "https://…" }]` |
| `problemas` | Opcional. Errores habituales al montarla: `[{ "sintoma": "…", "solucion": "…" }]`. Se muestran como «Problemas frecuentes» |
| `limitaciones` | Opcional. Lo que la plantilla no resuelve o puede hacer mal: `["…"]`. Se muestran a la vista, antes de copiar |
| `ejemplo` | Opcional. `true` marca la plantilla como ficticia |

### `diagram.json`

El mapa visual se dibuja solo a partir de esta lista. No hacen falta coordenadas.

```json
{
  "nodos": [
    { "id": "wa", "etiqueta": "Mensaje nuevo", "herramienta": "whatsapp", "tipo": "disparador" },
    { "id": "hoja", "etiqueta": "Guardar contacto", "herramienta": "google-sheets", "tipo": "accion" }
  ],
  "conexiones": [{ "origen": "wa", "destino": "hoja" }]
}
```

- `tipo`: `disparador`, `accion` o `logica`.
- `conexiones[].etiqueta` es opcional y sirve para nombrar ramas (`"sí"` / `"no"`).
- Las etiquetas de más de 21 caracteres se recortan en el mapa, así que conviene que sean cortas.
- Si el flujo tiene más de 5 columnas (pasos en cadena), el mapa se dibuja en vertical también en escritorio.

### `workflow.json`

Es el JSON exportado de n8n, tal cual: en n8n, selecciona todos los nodos, cópialos (`Ctrl + C`) y pégalos en este archivo. Es lo que copia el botón «Copiar flujo». **Antes de guardarlo, quita los datos de tu instancia:** el bloque `credentials` de cada nodo, el contenido de `pinData` y `meta.instanceId`. Las pruebas fallan si alguno queda, porque el repositorio es público. Revisa también que no queden correos ni datos personales en los parámetros.

3. Ejecuta `npm test`. Si algún dato es inválido (una herramienta inexistente, una conexión rota, un slug que no coincide), la prueba dice exactamente qué falla y en qué archivo. En el sitio, una plantilla inválida se omite y no rompe nada.

### ¿Una herramienta o categoría nueva?

Añádela en [`src/data/tools.ts`](src/data/tools.ts) o en [`src/data/categories.ts`](src/data/categories.ts). Las herramientas usan íconos genéricos de Lucide; Nexus no usa logos de marcas.

## Stack

React 19, Vite, TypeScript, Tailwind CSS 4, React Router, Motion, Lucide y Vitest/oxlint. Sin backend: las plantillas viven en el repositorio y el formulario «Propón un flujo» envía los mensajes con EmailJS. Se publica en GitHub Pages con una página estática por ruta y `sitemap.xml`.

## Licencia

El proyecto usa tres licencias, según el tipo de material:

| Material | Licencia | Qué permite |
| --- | --- | --- |
| Flujos de n8n (`src/data/templates/*/workflow.json`) | [MIT-0](LICENSE-WORKFLOWS) | Copiarlos, modificarlos y usarlos, también con fines comerciales, sin ninguna condición |
| Textos y diagramas de las plantillas (`meta.json`, `diagram.json`) | [CC BY 4.0](LICENSE-CONTENT) | Reutilizarlos y adaptarlos citando a Moss Nexus como fuente |
| Código del sitio (todo lo demás) | [MIT](LICENSE) | Uso libre, conservando el aviso de copyright |

---

Proyecto independiente, sin relación oficial con n8n GmbH.
