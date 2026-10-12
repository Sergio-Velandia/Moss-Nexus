# Moss Nexus

Librería de flujos de automatización para **n8n**, ya armados, explicados y listos para copiar. Es el proyecto hermano de [Moss](https://github.com/Sergio-Velandia/Moss): en Moss se aprende el porqué; en Nexus se copia el flujo y se usa.

**Sitio:** https://sergio-velandia.github.io/Moss-Nexus/

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # pruebas (incluye la validación de todas las plantillas)
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

### `workflow.json`

Es el JSON exportado de n8n, tal cual: en n8n, selecciona todos los nodos, cópialos (`Ctrl + C`) y pégalos en este archivo. Es lo que copia el botón «Copiar flujo». **Revisa que no queden credenciales ni datos personales.**

3. Ejecuta `npm test`. Si algún dato es inválido (una herramienta inexistente, una conexión rota, un slug que no coincide), la prueba dice exactamente qué falla y en qué archivo. En el sitio, una plantilla inválida se omite y no rompe nada.

### ¿Una herramienta o categoría nueva?

Añádela en [`src/data/tools.ts`](src/data/tools.ts) o en [`src/data/categories.ts`](src/data/categories.ts). Las herramientas usan íconos genéricos de Lucide; Nexus no usa logos de marcas.

## Stack

React 19, Vite, TypeScript, Tailwind CSS 4, React Router, Motion, Lucide y Vitest/oxlint. Sin backend: las plantillas viven en el repositorio.

---

Proyecto independiente, sin relación oficial con n8n GmbH.
