import { describe, expect, it } from 'vitest'
import gastos from '../data/templates/aprobacion-de-gastos/workflow.json'
import stripe from '../data/templates/pagos-stripe-idempotentes/workflow.json'

type Asignacion = { name: string; value: string | number }
type Nodo = { name: string; parameters: Record<string, unknown> }
const asignacion = (wf: { nodes: unknown[] }, nodo: string, campo: string) =>
  ((wf.nodes as Nodo[]).find((n) => n.name === nodo)!.parameters as { assignments: { assignments: Asignacion[] } }).assignments.assignments.find(
    (a) => a.name === campo,
  )!.value
const cuerpo = (expr: string | number) => String(expr).replace(/^=\{\{/, '').replace(/\}\}$/, '')
/** Quita el espacio duro que Intl pone entre el signo y la cifra, para comparar con texto legible */
const plano = (s: string) => s.replace(/ /g, ' ')

describe('montos en COP con el mismo formato que cobranza y reporte', () => {
  it('aprobacion-de-gastos: umbral en COP y monto como «$ 1.500.000»', () => {
    expect(asignacion(gastos, 'Configuración', 'umbral')).toBe(500000)
    const formato = new Function('$json', `return (${cuerpo(asignacion(gastos, 'Configuración', 'montoTexto'))})`)
    expect(plano(formato({ Monto: 1500000 }))).toBe('$ 1.500.000')
    expect(plano(formato({ Monto: '820000' }))).toBe('$ 820.000')
  })

  it('aprobacion-de-gastos: los correos muestran el monto con formato', () => {
    const textos = JSON.stringify(gastos.nodes.filter((n) => n.name === 'Pedir aprobación' || n.name === 'Avisar al solicitante').map((n) => n.parameters))
    expect(textos).toContain('montoTexto')
    expect(textos).not.toMatch(/json\.Monto \}\}|json\.monto \}\}/)
  })

  it('pagos-stripe-idempotentes: COP sin decimales y otras monedas con dos', () => {
    const expr = cuerpo(asignacion(stripe, 'Preparar pedido', 'montoTexto'))
    const formato = (object: Record<string, unknown>) =>
      new Function('$', `return (${expr})`)(() => ({ item: { json: { data: { object } } } }))
    expect(plano(formato({ amount_total: 15000000, currency: 'cop' }))).toBe('$ 150.000')
    expect(plano(formato({ amount_total: 1999, currency: 'usd' }))).toBe('US$ 19,99')
  })
})
