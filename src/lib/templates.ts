import type { Template, TemplateDiagram, TemplateMeta } from './types'
import { validateDiagram, validateMeta } from './validate'

/**
 * Índice automático: cada carpeta en src/data/templates/ con meta.json + diagram.json + workflow.json
 * aparece en el sitio sin tocar ningún componente.
 * meta y diagrama se incluyen en el bundle (son pequeños); el workflow se descarga solo cuando se necesita.
 */
const metas = import.meta.glob('../data/templates/*/meta.json', { eager: true, import: 'default' })
const diagrams = import.meta.glob('../data/templates/*/diagram.json', { eager: true, import: 'default' })
const workflows = import.meta.glob('../data/templates/*/workflow.json', { import: 'default' })

const folderOf = (path: string) => path.split('/').at(-2)!

export function buildTemplates(
  metaFiles: Record<string, unknown>,
  diagramFiles: Record<string, unknown>,
  workflowFiles: Record<string, () => Promise<unknown>>,
) {
  const byFolder = <T>(files: Record<string, T>) => new Map(Object.entries(files).map(([p, v]) => [folderOf(p), v]))
  const diagramsBy = byFolder(diagramFiles)
  const workflowsBy = byFolder(workflowFiles)

  const templates: Template[] = []
  const errors: Record<string, string[]> = {}

  for (const [path, meta] of Object.entries(metaFiles)) {
    const folder = folderOf(path)
    const problems = [...validateMeta(meta, folder), ...validateDiagram(diagramsBy.get(folder))]
    if (!workflowsBy.has(folder)) problems.push('falta workflow.json')
    if (problems.length > 0) {
      errors[folder] = problems
      continue
    }
    templates.push({
      ...(meta as TemplateMeta),
      diagrama: diagramsBy.get(folder) as TemplateDiagram,
      loadWorkflow: workflowsBy.get(folder)!,
    })
  }

  // Primero las probadas, de la más reciente a la más antigua; después las que aún no se han probado
  templates.sort(
    (a, b) =>
      Number(!a.probado) - Number(!b.probado) ||
      (b.probado?.fecha ?? '').localeCompare(a.probado?.fecha ?? '') ||
      a.titulo.localeCompare(b.titulo, 'es'),
  )
  return { templates, errors }
}

const built = buildTemplates(metas, diagrams, workflows)

if (Object.keys(built.errors).length > 0) {
  // Una plantilla rota no tumba el sitio: se omite y se avisa en consola (y las pruebas fallan)
  console.error('[Moss Nexus] Plantillas omitidas por datos inválidos:', built.errors)
}

export const templates = built.templates
export const templateErrors = built.errors

export const getTemplate = (slug: string) => templates.find((t) => t.slug === slug)
export const featuredTemplates = () => templates.filter((t) => t.destacado)

/** Relacionadas: misma categoría pesa más que compartir herramientas */
export function relatedTemplates(current: Template, limit = 3, pool: Template[] = templates) {
  return pool
    .filter((t) => t.slug !== current.slug)
    .map((t) => ({
      t,
      score:
        (t.categoria === current.categoria ? 3 : 0) +
        t.herramientas.filter((h) => current.herramientas.includes(h)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.t)
}

/** Cuántas plantillas usan cada herramienta */
export function toolUsage(pool: Template[] = templates) {
  const counts = new Map<string, number>()
  for (const t of pool) for (const h of t.herramientas) counts.set(h, (counts.get(h) ?? 0) + 1)
  return counts
}

/** Cifras de la librería para el inicio: siempre calculadas, nunca escritas a mano */
export function libraryStats(pool: Template[] = templates) {
  return {
    plantillas: pool.length,
    niveles: new Set(pool.map((t) => t.dificultad)).size,
    categorias: new Set(pool.map((t) => t.categoria)).size,
    herramientas: new Set(pool.flatMap((t) => t.herramientas)).size,
  }
}
