import { hasCategory } from '../data/categories'
import { hasTool } from '../data/tools'
import type { TemplateDiagram, TemplateMeta } from './types'

/**
 * Comprueba los archivos de una plantilla y devuelve los problemas en español legible.
 * Lista vacía = plantilla válida. Las pruebas exigen que todas las plantillas del repo pasen.
 */

const DIFFICULTIES = ['facil', 'media', 'avanzada']
const NODE_KINDS = ['disparador', 'accion', 'logica']

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const isText = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0
const isTextList = (v: unknown): v is string[] => Array.isArray(v) && v.length > 0 && v.every(isText)

export function validateMeta(meta: unknown, folder: string): string[] {
  if (!isObj(meta)) return ['meta.json no es un objeto']
  const errors: string[] = []
  const need = (key: keyof TemplateMeta, ok: boolean, msg: string) => {
    if (!ok) errors.push(`meta.${key}: ${msg}`)
  }

  need('slug', meta.slug === folder, `debe ser igual al nombre de la carpeta ("${folder}")`)
  for (const key of ['titulo', 'resumen', 'problema'] as const) need(key, isText(meta[key]), 'texto obligatorio')
  need('categoria', isText(meta.categoria) && hasCategory(meta.categoria), 'debe ser un id de src/data/categories.ts')
  need('herramientas', isTextList(meta.herramientas), 'lista de ids no vacía')
  if (isTextList(meta.herramientas)) {
    for (const id of meta.herramientas) {
      if (!hasTool(id)) errors.push(`meta.herramientas: "${id}" no existe en src/data/tools.ts`)
    }
  }
  need('dificultad', DIFFICULTIES.includes(meta.dificultad as string), `una de: ${DIFFICULTIES.join(', ')}`)
  need(
    'tiempoEstimado',
    typeof meta.tiempoEstimado === 'number' && meta.tiempoEstimado > 0,
    'número de minutos mayor que 0',
  )
  for (const key of ['requisitos', 'escenarios', 'pasos'] as const) need(key, isTextList(meta[key]), 'lista de textos no vacía')
  // Opcional: sin él, la plantilla se publica como «Sin probar»
  if (meta.probado !== undefined) {
    need(
      'probado',
      isObj(meta.probado) &&
        typeof meta.probado.fecha === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(meta.probado.fecha) &&
        isText(meta.probado.versionN8n),
      '{ fecha: "AAAA-MM-DD", versionN8n: "1.x.x" }',
    )
    if (isObj(meta.probado) && meta.probado.datos !== undefined && !['ficticios', 'reales'].includes(meta.probado.datos as string)) {
      errors.push('meta.probado.datos: "ficticios" o "reales"')
    }
    if (isObj(meta.probado) && meta.probado.nota !== undefined && !isText(meta.probado.nota)) {
      errors.push('meta.probado.nota: texto no vacío')
    }
    if (isObj(meta.probado) && meta.probado.hora !== undefined && !/^([01]\d|2[0-3]):[0-5]\d$/.test(String(meta.probado.hora))) {
      errors.push('meta.probado.hora: formato HH:mm de 24 horas, por ejemplo "00:15"')
    }
  }
  need('destacado', typeof meta.destacado === 'boolean', 'true o false')
  if (meta.problemas !== undefined) {
    need(
      'problemas',
      Array.isArray(meta.problemas) && meta.problemas.every((p) => isObj(p) && isText(p.sintoma) && isText(p.solucion)),
      'lista de { sintoma, solucion }',
    )
  }
  if (meta.limitaciones !== undefined) need('limitaciones', isTextList(meta.limitaciones), 'lista de textos no vacía')
  if (meta.prueba !== undefined) {
    need(
      'prueba',
      isObj(meta.prueba) && isText(meta.prueba.descripcion) && (meta.prueba.aviso === undefined || isText(meta.prueba.aviso)),
      '{ descripcion, aviso? }',
    )
  }
  if (meta.guias !== undefined) {
    need(
      'guias',
      Array.isArray(meta.guias) && meta.guias.every((g) => isObj(g) && isText(g.titulo) && typeof g.url === 'string' && g.url.startsWith('https://')),
      'lista de { titulo, url } con URL https',
    )
  }
  if (meta.ejemplo !== undefined) need('ejemplo', typeof meta.ejemplo === 'boolean', 'true o false')
  return errors
}

export function validateDiagram(diagram: unknown): string[] {
  if (!isObj(diagram)) return ['diagram.json no es un objeto']
  const { nodos, conexiones } = diagram
  if (!Array.isArray(nodos) || nodos.length === 0) return ['diagram.nodos: lista no vacía']
  if (!Array.isArray(conexiones)) return ['diagram.conexiones: lista (puede estar vacía)']

  const errors: string[] = []
  const ids = new Set<string>()
  nodos.forEach((n, i) => {
    if (!isObj(n) || !isText(n.id) || !isText(n.etiqueta)) {
      errors.push(`diagram.nodos[${i}]: necesita id y etiqueta`)
      return
    }
    if (ids.has(n.id)) errors.push(`diagram.nodos: id repetido "${n.id}"`)
    ids.add(n.id)
    if (!isText(n.herramienta) || !hasTool(n.herramienta)) {
      errors.push(`diagram.nodos "${n.id}": herramienta "${String(n.herramienta)}" no existe en src/data/tools.ts`)
    }
    if (!NODE_KINDS.includes(n.tipo as string)) errors.push(`diagram.nodos "${n.id}": tipo debe ser ${NODE_KINDS.join(', ')}`)
  })
  conexiones.forEach((c, i) => {
    if (!isObj(c) || !ids.has(c.origen as string) || !ids.has(c.destino as string)) {
      errors.push(`diagram.conexiones[${i}]: origen y destino deben ser ids de nodos existentes`)
    }
  })
  if (errors.length === 0 && hasCycle(diagram as unknown as TemplateDiagram)) {
    errors.push('diagram.conexiones: hay un ciclo; el mapa solo admite flujos que avanzan')
  }
  return errors
}

function hasCycle({ nodos, conexiones }: TemplateDiagram): boolean {
  const next = new Map<string, string[]>(nodos.map((n) => [n.id, []]))
  for (const c of conexiones) next.get(c.origen)!.push(c.destino)
  const state = new Map<string, 1 | 2>() // 1 = visitando, 2 = terminado
  const visit = (id: string): boolean => {
    if (state.get(id) === 1) return true
    if (state.get(id) === 2) return false
    state.set(id, 1)
    const found = next.get(id)!.some(visit)
    state.set(id, 2)
    return found
  }
  return nodos.some((n) => visit(n.id))
}
