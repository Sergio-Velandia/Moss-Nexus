import { describe, expect, it } from 'vitest'
import { emptyFilters, filterTemplates, filtersFromParams, isFiltering, normalize, paramsFromFilters } from './search'
import type { Template } from './types'

const mk = (over: Partial<Template>) =>
  ({
    slug: 'x',
    titulo: '',
    resumen: '',
    problema: '',
    categoria: 'ventas',
    herramientas: [],
    dificultad: 'facil',
    escenarios: [],
    ...over,
  }) as Template

const pool = [
  mk({ slug: 'wa', titulo: 'WhatsApp a Sheets', herramientas: ['whatsapp', 'google-sheets', 'gmail'] }),
  mk({ slug: 'rep', titulo: 'Reporte diario', categoria: 'reportes', dificultad: 'media', herramientas: ['slack', 'google-sheets'] }),
  mk({ slug: 'auto', titulo: 'Automatización de facturas', herramientas: ['gmail'], probado: { fecha: '2026-10-15', versionN8n: '2.43.5' } }),
]
const slugs = (ts: Template[]) => ts.map((t) => t.slug)

describe('normalize', () => {
  it('quita tildes y mayúsculas', () => {
    expect(normalize('  AutomatizaCIÓN ')).toBe('automatizacion')
  })
})

describe('filterTemplates', () => {
  it('sin filtros devuelve todo', () => {
    expect(filterTemplates(pool, emptyFilters)).toHaveLength(3)
  })
  it('busca sin importar tildes', () => {
    expect(slugs(filterTemplates(pool, { ...emptyFilters, q: 'automatizacion' }))).toEqual(['auto'])
  })
  it('todas las palabras deben aparecer', () => {
    expect(slugs(filterTemplates(pool, { ...emptyFilters, q: 'whatsapp reporte' }))).toEqual([])
  })
  it('busca también por nombre de herramienta', () => {
    expect(slugs(filterTemplates(pool, { ...emptyFilters, q: 'slack' }))).toEqual(['rep'])
  })
  it('las herramientas elegidas se combinan con Y', () => {
    expect(slugs(filterTemplates(pool, { ...emptyFilters, herramientas: ['google-sheets'] }))).toEqual(['wa', 'rep'])
    expect(slugs(filterTemplates(pool, { ...emptyFilters, herramientas: ['google-sheets', 'gmail'] }))).toEqual(['wa'])
  })
  it('filtra por categoría y dificultad', () => {
    expect(slugs(filterTemplates(pool, { ...emptyFilters, categoria: 'reportes' }))).toEqual(['rep'])
    expect(slugs(filterTemplates(pool, { ...emptyFilters, dificultad: 'facil' }))).toEqual(['wa', 'auto'])
  })
})

describe('solo probadas', () => {
  it('por defecto se ven todas; con el filtro, solo las que tienen sello', () => {
    expect(filterTemplates(pool, emptyFilters)).toHaveLength(3)
    expect(slugs(filterTemplates(pool, { ...emptyFilters, probadas: true }))).toEqual(['auto'])
  })
  it('se combina con los demás filtros', () => {
    expect(slugs(filterTemplates(pool, { ...emptyFilters, probadas: true, herramientas: ['google-sheets'] }))).toEqual([])
  })
})

describe('filtros en la URL', () => {
  it('ida y vuelta sin pérdidas', () => {
    const f = { q: 'hola', herramientas: ['gmail', 'slack'], categoria: 'ventas', dificultad: 'media' as const, probadas: true }
    expect(filtersFromParams(paramsFromFilters(f))).toEqual(f)
  })
  it('ignora dificultades inventadas', () => {
    expect(filtersFromParams(new URLSearchParams('dificultad=imposible')).dificultad).toBeNull()
  })
  it('isFiltering', () => {
    expect(isFiltering(emptyFilters)).toBe(false)
    expect(isFiltering({ ...emptyFilters, q: ' ' })).toBe(false)
    expect(isFiltering({ ...emptyFilters, categoria: 'ventas' })).toBe(true)
    expect(isFiltering({ ...emptyFilters, probadas: true })).toBe(true)
    expect(filtersFromParams(new URLSearchParams('probadas=1')).probadas).toBe(true)
    expect(paramsFromFilters(emptyFilters).toString()).toBe('')
  })
})
