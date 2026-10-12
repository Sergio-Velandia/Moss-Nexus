# Moss Nexus

Librería/cookbook estática de plantillas de n8n. Proyecto hermano de Moss (https://github.com/Sergio-Velandia/Moss), con repositorio propio. Interfaz en **español**.

## Reglas de trabajo
- Se trabaja por fases. Hacer SOLO la fase pedida; no adelantar la siguiente.
- Antes de escribir código de una fase nueva, mostrar un plan corto y esperar confirmación.
- Agregar una plantilla = agregar una carpeta en `src/data/templates/<slug>/` (`meta.json`, `diagram.json`, `workflow.json`). Nunca exigir cambios en componentes para eso.
- No commitear ni hacer push sin que se pida.

## Fases
- **Fase 1 (hecha):** estructura, diseño, galería, detalle, mapa generado, copiar flujo, 2 plantillas `ejemplo: true`.
- **Fase 2 (esperar a que se pida):** reemplazar los ejemplos por flujos reales. El primero es WhatsApp → Google Sheets → Gmail; el segundo lo define el usuario.
- **Fase 3+:** agregar plantillas una a una. No planificar nada de esto por adelantado.

## Stack
React 19 + Vite + TypeScript estricto, Tailwind CSS 4 (tokens en variables CSS, en `src/index.css`), React Router 7, `motion`, `lucide-react`, Vitest y oxlint. Se usa npm. Se despliega en GitHub Pages bajo `/Moss-Nexus/` y se genera `404.html` para las rutas de la SPA. No añadir dependencias sin preguntar.

## Mapa del código
- `src/lib/templates.ts`: índice automático con `import.meta.glob`. `workflow.json` se carga de forma perezosa.
- `src/lib/validate.ts`: validación de los datos. Las pruebas exigen que todas las plantillas pasen.
- `src/lib/diagram.ts`: layout del mapa (rango por el camino más largo y orden por baricentro). Horizontal en escritorio, vertical en móvil.
- `src/lib/search.ts`: búsqueda sin tildes y filtros sincronizados con la URL.
- `src/data/tools.ts` y `src/data/categories.ts`: catálogos.

## Diseño
- Oscuro por defecto, con tema claro opcional. Base verde musgo heredada de Moss y acento coral inspirado en n8n (`--c-nexus`).
- Tipografía: Inter para el texto y JetBrains Mono para metadatos.
- Superficies `.glass`, rejilla `.dot-grid` y resortes de `motion`. Animar solo `transform` y `opacity`, y respetar `prefers-reduced-motion`.
- El contraste AA está verificado; mantenerlo al tocar colores.
- Las clases propias van dentro de `@layer`, porque fuera de una capa le ganan a las utilidades de Tailwind.
- Sin logos de marcas: íconos genéricos de Lucide. Incluir la nota de que es un proyecto independiente de n8n GmbH.
- Accesibilidad: foco visible, el SVG del mapa con alternativa en lista ordenada, regiones `aria-live` para los resultados y para el estado de "Copiar flujo".
