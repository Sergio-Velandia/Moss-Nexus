import { getCategory } from '../data/categories'
import { getTool } from '../data/tools'
import type { Difficulty, Template } from './types'

export interface Filters {
  q: string
  /** La plantilla debe usar TODAS las herramientas elegidas */
  herramientas: string[]
  categoria: string | null
  dificultad: Difficulty | null
}

export const emptyFilters: Filters = { q: '', herramientas: [], categoria: null, dificultad: null }

/** Minúsculas y sin tildes: "automatización" encuentra "automatizacion" y al revés */
export const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()

function haystack(t: Template) {
  return normalize(
    [
      t.titulo,
      t.resumen,
      t.problema,
      getCategory(t.categoria)?.nombre ?? '',
      ...t.herramientas.map((h) => getTool(h)?.nombre ?? h),
      ...t.escenarios,
    ].join(' '),
  )
}

export function filterTemplates(pool: Template[], f: Filters): Template[] {
  const words = normalize(f.q).split(/\s+/).filter(Boolean)
  return pool.filter((t) => {
    if (f.categoria && t.categoria !== f.categoria) return false
    if (f.dificultad && t.dificultad !== f.dificultad) return false
    if (!f.herramientas.every((h) => t.herramientas.includes(h))) return false
    if (words.length === 0) return true
    const text = haystack(t)
    return words.every((w) => text.includes(w))
  })
}

const DIFFS: Difficulty[] = ['facil', 'media', 'avanzada']

/** Los filtros viven en la URL: se pueden compartir y el botón Atrás funciona */
export function filtersFromParams(p: URLSearchParams): Filters {
  const dif = p.get('dificultad')
  return {
    q: p.get('q') ?? '',
    herramientas: (p.get('herramienta') ?? '').split(',').filter(Boolean),
    categoria: p.get('categoria') || null,
    dificultad: DIFFS.includes(dif as Difficulty) ? (dif as Difficulty) : null,
  }
}

export function paramsFromFilters(f: Filters): URLSearchParams {
  const p = new URLSearchParams()
  if (f.q.trim()) p.set('q', f.q)
  if (f.herramientas.length) p.set('herramienta', f.herramientas.join(','))
  if (f.categoria) p.set('categoria', f.categoria)
  if (f.dificultad) p.set('dificultad', f.dificultad)
  return p
}

export const isFiltering = (f: Filters) =>
  f.q.trim() !== '' || f.herramientas.length > 0 || f.categoria !== null || f.dificultad !== null
