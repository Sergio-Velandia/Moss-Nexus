import { DateTime, Settings } from 'luxon'

/**
 * Ejecuta el código de un nodo Code de una plantilla con un entorno parecido al de n8n:
 * $input, $now, $today, DateTime, $('Nodo') y $getWorkflowStaticData.
 * Solo para pruebas: luxon es devDependency y no entra al build del sitio.
 */
Settings.defaultZone = 'America/Bogota'

interface WorkflowConCodigo {
  nodes: { name: string; type: string; parameters: unknown }[]
}

export interface Item {
  json: Record<string, unknown>
  binary?: Record<string, unknown>
}

export function codeOf(workflow: WorkflowConCodigo, nombre: string): string {
  const nodo = workflow.nodes.find((n) => n.name === nombre && n.type === 'n8n-nodes-base.code')
  if (!nodo) throw new Error(`No hay un nodo Code llamado «${nombre}»`)
  return (nodo.parameters as { jsCode: string }).jsCode
}

export function runCode(
  codigo: string,
  { items = [], now = '2026-10-20T08:00:00', refs = {}, staticData = {} }: {
    items?: Item[]
    /** Hora simulada, ISO, en la zona America/Bogota */
    now?: string
    refs?: Record<string, Record<string, unknown>>
    staticData?: Record<string, unknown>
  } = {},
): Item[] {
  const $input = { all: () => items, first: () => items[0] }
  const $ = (nombre: string) => {
    if (!(nombre in refs)) throw new Error(`Referencia a un nodo desconocido: ${nombre}`)
    const item = { json: refs[nombre] }
    return { first: () => item, item, all: () => [item] }
  }
  const $now = DateTime.fromISO(now)
  const ejecutar = new Function('$input', '$', '$now', 'DateTime', '$getWorkflowStaticData', codigo)
  return ejecutar($input, $, $now, DateTime, () => staticData) as Item[]
}
