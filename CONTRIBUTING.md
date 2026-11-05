# Cómo contribuir

- **¿Te falta un flujo?** Proponlo en [Propón un flujo](https://sergio-velandia.dev/Moss-Nexus/propon-un-flujo/) o abre un [issue](https://github.com/Sergio-Velandia/Moss-Nexus/issues).
- **¿Encontraste un error en una plantilla?** Abre un issue con la plantilla, la versión de n8n y el mensaje de error, sin credenciales ni datos personales.
- **¿Quieres aportar una plantilla?** Sigue la guía de abajo y abre un pull request. Entra como «Sin probar» hasta que se pruebe en una instancia real.

Los comandos para correr el proyecto están en el [README](README.md#desarrollo). Los commits siguen Conventional Commits, con la descripción en español.

## Cómo agregar una plantilla nueva

Agregar una plantilla es **solo crear una carpeta**. No hace falta tocar ningún componente.

1. Crea `src/data/templates/<slug>/` (el slug va en minúsculas, con guiones: `mi-plantilla`).
2. Pon dentro los tres archivos que se explican abajo: `meta.json`, `diagram.json` y `workflow.json`.
3. Ejecuta `npm test`. Si algún dato es inválido (una herramienta inexistente, una conexión rota, un slug que no coincide), la prueba dice exactamente qué falla y en qué archivo. En el sitio, una plantilla inválida se omite y no rompe nada.

### `meta.json`

```json
{
  "slug": "mi-plantilla",
  "titulo": "Lo que hace el flujo, en una frase",
  "resumen": "Una línea: lo que verá la tarjeta de la galería.",
  "problema": "Un párrafo con el problema real que resuelve, sin jerga.",
  "categoria": "ventas",
  "herramientas": ["whatsapp", "google-sheets", "gmail"],
  "dificultad": "facil",
  "tiempoEstimado": 15,
  "requisitos": ["Cuenta de Google", "Credenciales de WhatsApp Business"],
  "escenarios": ["Tienda que atiende pedidos por WhatsApp"],
  "pasos": ["Pulsa «Copiar flujo».", "Pégalo en un flujo nuevo de n8n.", "Conecta tus credenciales.", "Prueba y actívalo."],
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
| `probado` | Opcional. Solo cuando el flujo se probó en una instancia real de n8n: `{ "fecha": "AAAA-MM-DD", "hora": "HH:mm", "versionN8n": "x.y.z", "datos": "ficticios" }` (`hora`, `datos` y `nota` son opcionales; `datos` vale `ficticios` o `reales`, y `nota` aclara con qué datos se probó, sin datos personales). Sin él, la plantilla se muestra como «Sin probar» |
| `guias` | Opcional. Enlaces de apoyo que se muestran junto a los requisitos: `[{ "titulo": "…", "url": "https://…" }]` |
| `problemas` | Opcional. Errores habituales al montarla: `[{ "sintoma": "…", "solucion": "…" }]`. Se muestran como «Problemas frecuentes» |
| `limitaciones` | Opcional. Lo que la plantilla no resuelve o puede hacer mal: `["…"]`. Se muestran a la vista, antes de copiar |
| `prueba` | Opcional, junto con un archivo `prueba.json` en la carpeta: un flujo aparte para probar la plantilla, con su propio botón. `{ "descripcion": "…", "aviso": "…" }` (`aviso` es opcional) |
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
- Las etiquetas largas se recortan en el mapa, así que conviene que sean cortas.
- Si el flujo tiene muchos pasos en cadena, el mapa se dibuja en vertical también en escritorio.

### `workflow.json`

Es el JSON exportado de n8n, tal cual: en n8n, selecciona todos los nodos, cópialos (`Ctrl + C`) y pégalos en este archivo. Es lo que copia el botón «Copiar flujo». **Antes de guardarlo, quita los datos de tu instancia:** el bloque `credentials` de cada nodo, el contenido de `pinData` y `meta.instanceId`. Las pruebas fallan si alguno queda, porque el repositorio es público. Revisa también que no queden correos ni datos personales en los parámetros.

### ¿Una herramienta o categoría nueva?

Añádela en [`src/data/tools.ts`](src/data/tools.ts) o en [`src/data/categories.ts`](src/data/categories.ts). Las herramientas usan íconos genéricos de Lucide; Nexus no usa logos de marcas.
