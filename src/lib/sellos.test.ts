import { describe, expect, it } from 'vitest'
import { templates } from './templates'
import { validateMeta } from './validate'
import type { Template } from './types'

const probadas = templates.filter((t) => t.probado)
const sinProbar = templates.filter((t) => !t.probado)

/** Frases que afirman que la plantilla se probó, salvo cuando van negadas («no están probadas», «tampoco») */
const AFIRMA_PRUEBA = /(?<!(?:no|tampoco|aún no)\s)\b(?:está|están|fue|fueron|ha sido|quedó)\s+probad[ao]s?\b|sello «Probado»|probad[ao] en n8n/i

function textos(t: Template) {
  return [t.titulo, t.resumen, t.problema, ...t.requisitos, ...t.escenarios, ...t.pasos, ...(t.limitaciones ?? []), ...(t.problemas ?? []).flatMap((p) => [p.sintoma, p.solucion])]
}

describe('sello «Probado»: completo y honesto', () => {
  it('hay plantillas de los dos tipos (si no, revisa estas pruebas)', () => {
    expect(probadas.length).toBeGreaterThan(0)
    expect(sinProbar.length).toBeGreaterThan(0)
  })

  it.each(probadas.map((t) => [t.slug, t] as const))('%s: el sello tiene fecha real, versión de n8n y tipo de datos', (_slug, t) => {
    const { fecha, versionN8n, datos } = t.probado!
    expect(new Date(`${fecha}T00:00:00`).toISOString().slice(0, 10)).toBe(fecha)
    expect(fecha <= new Date().toISOString().slice(0, 10)).toBe(true)
    expect(versionN8n).toMatch(/^\d+\.\d+\.\d+$/)
    expect(['ficticios', 'reales']).toContain(datos)
  })

  it.each(sinProbar.map((t) => [t.slug, t] as const))('%s: sin sello, ningún texto dice que está probada', (_slug, t) => {
    expect(textos(t).filter((s) => AFIRMA_PRUEBA.test(s))).toEqual([])
  })

  it('el detector distingue una afirmación de una negación', () => {
    expect(AFIRMA_PRUEBA.test('Este flujo está probado con Gmail.')).toBe(true)
    expect(AFIRMA_PRUEBA.test('Probado en n8n 2.43.5.')).toBe(true)
    expect(AFIRMA_PRUEBA.test('Esas alternativas tampoco están probadas.')).toBe(false)
    expect(AFIRMA_PRUEBA.test('Las alternativas no están probadas.')).toBe(false)
  })

  it('la validación rechaza un sello sin fecha o sin versión', () => {
    const { diagrama: _d, loadWorkflow: _w, loadPrueba: _p, ...meta } = templates[0]
    const base = { ...meta, slug: 'x' }
    expect(validateMeta({ ...base, probado: { fecha: '2026-10-22', versionN8n: '2.43.5' } }, 'x')).toEqual([])
    expect(validateMeta({ ...base, probado: { versionN8n: '2.43.5' } }, 'x')).not.toEqual([])
    expect(validateMeta({ ...base, probado: { fecha: '2026-10-22' } }, 'x')).not.toEqual([])
    expect(validateMeta({ ...base, probado: { fecha: '22/10/2026', versionN8n: '2.43.5' } }, 'x')).not.toEqual([])
  })
})
