# Moss Nexus

Librería/cookbook estática de plantillas de n8n. Proyecto hermano de Moss (https://github.com/Sergio-Velandia/Moss), con repositorio propio. Interfaz en **español**.

## Reglas de trabajo
- Se trabaja por fases. Hacer SOLO la fase pedida; no adelantar la siguiente.
- Antes de escribir código de una fase nueva, mostrar un plan corto y esperar confirmación.
- Agregar una plantilla = agregar una carpeta en `src/data/templates/<slug>/` (`meta.json`, `diagram.json`, `workflow.json`). Nunca exigir cambios en componentes para eso.
- No commitear ni hacer push sin que se pida.

## Convenciones de commits
- Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `style:`.
- Descripción en español, en minúscula, en imperativo y de unos 70 caracteres como máximo. Ejemplo: `docs: agrega presentación y capturas al README`.
- Un commit es un cambio lógico. No mezclar en un mismo commit documentación, estilos y datos.
- Cada plantilla nueva va en su propio commit: `feat(plantilla): agrega whatsapp-a-sheets`. Para corregirla después: `fix(plantilla): corrige credenciales en whatsapp-a-sheets`.
- Las fases y las plantillas se trabajan en ramas cortas (`feat/plantilla-<slug>`, `docs/pulido-repo`) que se integran a `main` al terminar. No acumular trabajo de varios días sin commitear.
- Push y tags solo con confirmación explícita del usuario.

## Versionado
- SemVer sobre el sitio, como `0.MINOR.PATCH` mientras sea anterior a 1.0.
  - **MINOR:** una fase completa o una plantilla nueva.
  - **PATCH:** correcciones y cambios de documentación.
- `CHANGELOG.md` sigue Keep a Changelog, en español. El campo `version` de `package.json` siempre coincide con la última versión del changelog.
- **Regla:** una plantilla suelta sube MINOR. Un lote planificado sube un MINOR por lote (la Fase 3 se publica por nivel: v0.3.0 fáciles, v0.4.0 intermedias y v0.5.0 avanzadas). La Fase 2 contó como un solo MINOR con sus dos plantillas.
- Cada plantilla va en su propio commit. Al cerrar la plantilla suelta o el lote, un commit `chore(release): vX.Y.Z` sube la versión y agrega al CHANGELOG una línea por plantilla.
- **Sello «Probado»:** solo se añade `probado` cuando el usuario da la fecha y la versión de n8n de su prueba. Nunca inventarlas. Marcar una plantilla existente como probada es PATCH: `fix(plantilla): marca <slug> como probada`.
- Cada versión se marca con un tag `vX.Y.Z` en `main`, que solo se crea con confirmación del usuario.

## Fases
Orden acordado. Cada fase empieza solo cuando el usuario la pide y con un plan confirmado.

- **Fase 1 (hecha, v0.1.0):** estructura, diseño, galería, detalle, mapa generado, copiar flujo y 2 plantillas `ejemplo: true`.
- **Fase 1.5 (hecha, v0.1.1):** pulido del repo, convenciones de commits, versionado y CHANGELOG.
- **Fase 2 (hecha, v0.2.0):** `whatsapp-a-sheets` (WhatsApp Cloud API oficial) y `reporte-diario-ventas`. Se publicaron «Sin probar» por decisión del usuario, y se eliminaron los ejemplos.
- **Fase 3 (hecha, v0.3.0 a v0.5.0):** 12 plantillas para entornos profesionales, 4 por nivel, todas «Sin probar». Desde aquí, la librería solo se **actualiza**: plantillas sueltas cuando el usuario las pida (MINOR cada una), correcciones y sellos «Probado» (PATCH).
  - Las plantillas se generan con nodos nativos. Para IA se usa una petición HTTP a la API de OpenAI con la credencial openAiApi y el modelo en un nodo «Configuración». La lógica de cada nodo Code se prueba con casos antes de commitear.
  - El mapa: SVG desde md (vertical si hay más de 5 columnas) y lista de pasos (FlowSteps) en pantallas angostas.
- **Fase Legal (hecha, v0.6.0):** `/terminos`, `/privacidad`, `/contacto` (correo armado en el cliente al pulsar un botón, nunca en el HTML), footer legal y licencias MIT / MIT-0 / CC BY 4.0. Si el sitio cambia su manejo de datos (por ejemplo, analítica), actualizar antes `/privacidad` y `site.legalUpdated`. Brief original:
  - Antes de redactar, auditar con evidencia qué hace el sitio con los datos: almacenamiento, terceros, formularios y qué se copia o descarga. La privacidad describe solo lo verificado.
  - Páginas `/terminos`, `/privacidad` y `/contacto`, con carga perezosa y el mismo diseño. Contacto sin formulario: GitHub Issues más el placeholder `CONTACTO_EMAIL`, preguntando al usuario cuál usar.
  - Footer con Términos, Privacidad, Contacto, Licencia, el aviso de n8n GmbH y el año.
  - Licencia: presentar las opciones A (MIT), B (MIT + CC BY 4.0) o C, y preguntar antes de crear archivos.
  - Prueba de las rutas y del footer, y comprobar la recarga directa en Pages.
  - Actualizar CHANGELOG, README y CLAUDE.md. Al final, listar las cláusulas que conviene revisar con un profesional.
- **Fase Repaso del inicio:** rama `docs/repaso-inicio`.
  - Primero un informe sin cambios, en tabla: elemento / estado actual / problema / cambio propuesto. Después del OK, commits pequeños, uno por tema.
  - Contrastar cada afirmación del sitio con la realidad: hero, cómo funciona, destacadas sin `ejemplo`, chips de herramientas con al menos una plantilla, cifras dinámicas, sello Probado, enlaces a Moss, Acerca, footer y legales, metadatos y Open Graph, README, CHANGELOG y package.json, accesibilidad y móvil.
  - Aclarar en el inicio que cada plantilla es un punto de partida y puede requerir personalizaciones y ajustes según la persona o la empresa (sus datos, columnas, reglas de negocio y herramientas).
  - No inventar cifras ni funciones. Pedir al usuario lo que falte.
  - Proponer PATCH o MINOR al final.

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
