import { describe, expect, it } from 'vitest'
import { buildTemplates, relatedTemplates, templateErrors, templates, toolUsage } from './templates'
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
  it('cuenta el uso de cada herramienta', () => {
    expect(toolUsage(pool).get('gmail')).toBe(2)
  })
})
