import { describe, expect, it } from 'vitest'
import readme from '../../README.md?raw'
import { templates } from './templates'

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const fechaCorta = (iso: string) => {
  const [a, m, d] = iso.split('-').map(Number)
  return `${d} ${MESES[m - 1]} ${a}`
}

describe('README: la tabla de plantillas coincide con los datos', () => {
  const filas = readme.split(/\r?\n/).filter((l) => l.startsWith('| [') && l.includes('/plantillas/'))

  it('hay una fila por plantilla', () => {
    expect(filas).toHaveLength(templates.length)
  })

  it.each(templates.map((t) => [t.slug, t] as const))('%s: título, enlace y estado', (slug, t) => {
    const fila = filas.find((l) => l.includes(`/plantillas/${slug}/)`))
    expect(fila, `falta la fila de ${slug}`).toBeDefined()
    expect(fila).toContain(`[${t.titulo}]`)
    expect(fila).toContain(t.probado ? `✅ Probada (${fechaCorta(t.probado.fecha)})` : '| Sin probar |')
  })

  it('las cifras del texto coinciden', () => {
    const probadas = templates.filter((t) => t.probado).length
    expect(readme).toContain(`${templates.length} plantillas en tres niveles. **${probadas} tienen el sello «Probado»**`)
    expect(readme).toContain(`Las otras ${templates.length - probadas} se revisaron`)
  })
})
