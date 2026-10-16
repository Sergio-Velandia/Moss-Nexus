/** Forma de los archivos de cada plantilla en src/data/templates/<slug>/ */

export type Difficulty = 'facil' | 'media' | 'avanzada'

/** meta.json */
export interface TemplateMeta {
  slug: string
  titulo: string
  /** Una línea: lo que verá la tarjeta de la galería */
  resumen: string
  /** Contexto humano: el problema real que resuelve, en un párrafo */
  problema: string
  /** id de src/data/categories.ts */
  categoria: string
  /** ids de src/data/tools.ts, en el orden en que aparecen en el flujo */
  herramientas: string[]
  dificultad: Difficulty
  /** Minutos que toma configurarla la primera vez */
  tiempoEstimado: number
  requisitos: string[]
  escenarios: string[]
  pasos: string[]
  /** Solo se añade cuando el flujo se probó en una instancia real de n8n. Sin él, se muestra «Sin probar». */
  probado?: {
    fecha: string
    versionN8n: string
    /** Hora local de la prueba, HH:mm (24 h). Opcional */
    hora?: string
    /** Con qué datos se probó. «ficticios»: creados solo para la prueba; «reales»: se aclara en el sello. Opcional */
    datos?: 'ficticios' | 'reales'
    /** Aclaración de con qué datos se probó; reemplaza el texto por defecto. Nunca con datos personales. Opcional */
    nota?: string
  }
  destacado: boolean
  /** Errores habituales al montarla: qué ves y cómo resolverlo. Opcional */
  problemas?: { sintoma: string; solucion: string }[]
  /** Lo que la plantilla no resuelve o puede hacer mal. Se muestra a la vista, antes de copiar. Opcional */
  limitaciones?: string[]
  /** Guías externas útiles para configurarla (por ejemplo, el manual de Moss). Opcional */
  guias?: { titulo: string; url: string }[]
  /** Plantilla ficticia, solo para ver el diseño. Se muestra con una marca visible. */
  ejemplo?: boolean
}

export type NodeKind = 'disparador' | 'accion' | 'logica'

/** diagram.json */
export interface TemplateDiagram {
  nodos: { id: string; etiqueta: string; herramienta: string; tipo: NodeKind }[]
  conexiones: { origen: string; destino: string; etiqueta?: string }[]
}

export interface Template extends TemplateMeta {
  diagrama: TemplateDiagram
  /** Carga perezosa del JSON de n8n: solo se descarga al abrir el detalle o copiar */
  loadWorkflow: () => Promise<unknown>
}
