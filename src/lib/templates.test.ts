import { describe, expect, it } from 'vitest'
import { balancedFeatured, buildTemplates, libraryStats, relatedTemplates, templateErrors, templates, toolUsage } from './templates'
import { validateDiagram, validateMeta } from './validate'
import type { Template, TemplateDiagram, TemplateMeta } from './types'

const meta: TemplateMeta = {
  slug: 'demo',
  titulo: 'Demo',
  resumen: 'Resumen',
  problema: 'Problema',
  categoria: 'ventas',
  herramientas: ['gmail'],
  dificultad: 'facil',
  tiempoEstimado: 5,
  requisitos: ['a'],
  escenarios: ['b'],
  pasos: ['c'],
  probado: { fecha: '2026-01-01', versionN8n: '1.0.0' },
  destacado: false,
}
const diagram: TemplateDiagram = {
  nodos: [
    { id: 'a', etiqueta: 'A', herramienta: 'webhook', tipo: 'disparador' },
    { id: 'b', etiqueta: 'B', herramienta: 'gmail', tipo: 'accion' },
  ],
  conexiones: [{ origen: 'a', destino: 'b' }],
}

describe('plantillas del repositorio', () => {
  it('todas tienen datos válidos', () => {
    expect(templateErrors).toEqual({})
  })
  it('se cargan automáticamente desde src/data/templates', () => {
    expect(templates.length).toBeGreaterThan(0)
  })
  it('los slugs son únicos', () => {
    expect(new Set(templates.map((t) => t.slug)).size).toBe(templates.length)
  })
  it('el workflow de cada una es JSON de n8n con nodos', async () => {
    for (const t of templates) {
      const wf = (await t.loadWorkflow()) as { nodes?: unknown[] }
      expect(Array.isArray(wf.nodes), t.slug).toBe(true)
    }
  })
})

// El repo es público: un export de n8n sin limpiar filtra ids de credenciales, datos de prueba y el id de la instancia
describe('workflows publicables', () => {
  type Workflow = { nodes?: { name: string; credentials?: unknown }[]; pinData?: Record<string, unknown>; meta?: Record<string, unknown> }

  it('ningún nodo incluye credenciales', async () => {
    for (const t of templates) {
      const wf = (await t.loadWorkflow()) as Workflow
      const withCreds = (wf.nodes ?? []).filter((n) => n.credentials !== undefined).map((n) => n.name)
      expect(withCreds, `${t.slug}: quita "credentials" de estos nodos`).toEqual([])
    }
  })
  it('las conexiones apuntan a nodos existentes y los nombres no se repiten', async () => {
    type Conn = Record<string, { main: { node: string }[][] }>
    for (const t of templates) {
      const wf = (await t.loadWorkflow()) as Workflow & { connections?: Conn }
      const names = (wf.nodes ?? []).map((n) => n.name)
      expect(new Set(names).size, `${t.slug}: hay nombres de nodo repetidos`).toBe(names.length)
      const broken = Object.entries(wf.connections ?? {}).flatMap(([from, c]) => [
        ...(names.includes(from) ? [] : [from]),
        ...c.main.flat().map((l) => l.node).filter((to) => !names.includes(to)),
      ])
      expect(broken, `${t.slug}: conexiones a nodos que no existen`).toEqual([])
    }
  })
  it('no incluye datos fijados (pinData) ni el id de la instancia', async () => {
    for (const t of templates) {
      const wf = (await t.loadWorkflow()) as Workflow
      expect(Object.keys(wf.pinData ?? {}), `${t.slug}: vacía "pinData"`).toEqual([])
      expect(wf.meta?.instanceId, `${t.slug}: quita "meta.instanceId"`).toBeUndefined()
    }
  })
})

describe('validateMeta', () => {
  it('acepta una meta correcta', () => {
    expect(validateMeta(meta, 'demo')).toEqual([])
  })
  it('exige que el slug coincida con la carpeta', () => {
    expect(validateMeta(meta, 'otra').join()).toMatch(/slug/)
  })
  it('rechaza herramientas y categorías desconocidas', () => {
    const errors = validateMeta({ ...meta, herramientas: ['fax'], categoria: 'nada' }, 'demo').join('\n')
    expect(errors).toMatch(/"fax"/)
    expect(errors).toMatch(/categoria/)
  })
  it('acepta plantillas sin probar (sin campo probado)', () => {
    const { probado: _omit, ...sinProbar } = meta
    expect(validateMeta(sinProbar, 'demo')).toEqual([])
  })
  it('rechaza fechas con otro formato', () => {
    expect(validateMeta({ ...meta, probado: { fecha: '01/01/2026', versionN8n: '1' } }, 'demo').join()).toMatch(/probado/)
  })
})

describe('validateDiagram', () => {
  it('acepta un diagrama correcto', () => {
    expect(validateDiagram(diagram)).toEqual([])
  })
  it('detecta conexiones a nodos inexistentes', () => {
    expect(validateDiagram({ ...diagram, conexiones: [{ origen: 'a', destino: 'z' }] }).length).toBe(1)
  })
  it('detecta ciclos', () => {
    const cyc = { ...diagram, conexiones: [...diagram.conexiones, { origen: 'b', destino: 'a' }] }
    expect(validateDiagram(cyc).join()).toMatch(/ciclo/)
  })
  it('detecta ids repetidos', () => {
    expect(validateDiagram({ ...diagram, nodos: [diagram.nodos[0], diagram.nodos[0]] }).join()).toMatch(/repetido/)
  })
})

describe('buildTemplates', () => {
  const wf = () => Promise.resolve({})
  it('ordena primero las probadas (más recientes antes) y después las sin probar', () => {
    const { probado: _omit, ...sinProbar } = meta
    const metas: Record<string, unknown> = {
      vieja: { ...meta, slug: 'vieja', probado: { fecha: '2026-01-01', versionN8n: '1' } },
      sin: { ...sinProbar, slug: 'sin' },
      nueva: { ...meta, slug: 'nueva', probado: { fecha: '2026-06-01', versionN8n: '1' } },
    }
    const byPath = <T,>(file: string, value: (slug: string) => T) =>
      Object.fromEntries(Object.keys(metas).map((slug) => [`../t/${slug}/${file}`, value(slug)]))
    const { templates: ok } = buildTemplates(
      byPath('meta.json', (slug) => metas[slug]),
      byPath('diagram.json', () => diagram),
      byPath('workflow.json', () => wf),
    )
    expect(ok.map((t) => t.slug)).toEqual(['nueva', 'vieja', 'sin'])
  })
  it('omite las plantillas inválidas y reporta por carpeta', () => {
    const { templates: ok, errors } = buildTemplates(
      { '../t/demo/meta.json': meta, '../t/rota/meta.json': { ...meta, slug: 'rota', titulo: '' } },
      { '../t/demo/diagram.json': diagram, '../t/rota/diagram.json': diagram },
      { '../t/demo/workflow.json': wf, '../t/rota/workflow.json': wf },
    )
    expect(ok.map((t) => t.slug)).toEqual(['demo'])
    expect(Object.keys(errors)).toEqual(['rota'])
  })
  it('exige workflow.json', () => {
    const { errors } = buildTemplates({ '../t/demo/meta.json': meta }, { '../t/demo/diagram.json': diagram }, {})
    expect(errors.demo).toContain('falta workflow.json')
  })
})

describe('relatedTemplates y toolUsage', () => {
  const mk = (slug: string, categoria: string, herramientas: string[]) =>
    ({ ...meta, slug, categoria, herramientas }) as Template
  const pool = [mk('a', 'ventas', ['gmail']), mk('b', 'ventas', ['slack']), mk('c', 'reportes', ['gmail']), mk('d', 'reportes', ['slack'])]

  it('prioriza la misma categoría y excluye las que no comparten nada', () => {
    expect(relatedTemplates(pool[0], 3, pool).map((t) => t.slug)).toEqual(['b', 'c'])
  })
  it('las destacadas se reparten por nivel, en orden fácil → avanzada', () => {
    const d = (slug: string, dificultad: Template['dificultad'], destacado = true) => ({ ...meta, slug, dificultad, destacado }) as Template
    const lote = [d('a1', 'avanzada'), d('f1', 'facil'), d('f2', 'facil'), d('f3', 'facil'), d('m1', 'media'), d('m2', 'media', false), d('a2', 'avanzada')]
    expect(balancedFeatured(lote, 2).map((t) => t.slug)).toEqual(['f1', 'f2', 'm1', 'a1', 'a2'])
  })
  it('calcula las cifras de la librería sin repetir', () => {
    expect(libraryStats(pool)).toEqual({ plantillas: 4, niveles: 1, categorias: 2, herramientas: 2 })
  })
  it('cuenta el uso de cada herramienta', () => {
    expect(toolUsage(pool).get('gmail')).toBe(2)
  })
})
