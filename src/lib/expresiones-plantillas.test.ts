import { describe, expect, it } from 'vitest'
import alertas from '../data/templates/alertas-de-errores-n8n/workflow.json'

/**
 * Evalúa una expresión de n8n («={{ … }}») de un workflow publicado, con el $json que recibiría el nodo.
 * Sirve para probar la lógica de las plantillas sin una instancia de n8n.
 */
function evaluar(expresion: string, $json: unknown) {
  const cuerpo = expresion.replace(/^=\{\{/, '').replace(/\}\}$/, '').trim()
  return new Function('$json', `return (${cuerpo})`)($json)
}

describe('alertas-de-errores-n8n: detección de flujos críticos', () => {
  const set = alertas.nodes.find((n) => n.name === 'Preparar alerta')!
  const critico = (set.parameters as { assignments: { assignments: { name: string; value: string }[] } }).assignments.assignments.find(
    (a) => a.name === 'critico',
  )!.value
  const esCritico = (nombre?: string) => evaluar(critico, { workflow: nombre === undefined ? undefined : { name: nombre } })

  it.each(['Facturas a Drive [crítico]', 'Reporte de ventas [critico]', 'Cobros [CRÍTICO]', 'Pagos [Critico]'])('«%s» es crítico', (nombre) => {
    expect(esCritico(nombre)).toBe(true)
  })
  it('un flujo sin la marca no es crítico, y un nombre ausente no rompe la expresión', () => {
    expect(esCritico('Agenda diaria')).toBe(false)
    expect(esCritico('Crítico sin corchetes')).toBe(false)
    expect(esCritico(undefined)).toBe(false)
  })
})
