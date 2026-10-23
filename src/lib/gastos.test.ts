import { describe, expect, it } from 'vitest'
import workflow from '../data/templates/aprobacion-de-gastos/workflow.json'

type Nodo = { name: string; parameters: Record<string, unknown> }
const nodo = (nombre: string) => (workflow.nodes as Nodo[]).find((n) => n.name === nombre)!
const conexiones = workflow.connections as unknown as Record<string, { main: { node: string }[][] }>
const destinos = (desde: string) => conexiones[desde].main.flat().map((l) => l.node)
type Columnas = { columns: { value: Record<string, string>; matchingColumns: string[] }; operation: string }

describe('aprobacion-de-gastos: la solicitud queda registrada antes de pedir aprobación', () => {
  it('Configuración → Registrar solicitud → ¿Supera el umbral?', () => {
    expect(destinos('Configuración')).toEqual(['Registrar solicitud'])
    expect(destinos('Registrar solicitud')).toEqual(['¿Supera el umbral?'])
  })

  it('la solicitud entra como «Pendiente» con el ID de la ejecución', () => {
    const p = nodo('Registrar solicitud').parameters as unknown as Columnas
    expect(p.operation).toBe('append')
    expect(p.columns.value).toMatchObject({ ID: '={{ $execution.id }}', Estado: 'Pendiente' })
  })

  it('la decisión actualiza la misma fila buscándola por ID', () => {
    const p = nodo('Registrar decisión').parameters as unknown as Columnas
    expect(p.operation).toBe('appendOrUpdate')
    expect(p.columns.matchingColumns).toEqual(['ID'])
    expect(p.columns.value.ID).toBe('={{ $execution.id }}')
    expect(destinos('Marcar decisión')).toContain('Registrar decisión')
    expect(destinos('Aprobación automática')).toContain('Registrar decisión')
  })

  it('el umbral y el correo de aprobación leen de «Configuración», no de la fila de la hoja', () => {
    for (const nombre of ['¿Supera el umbral?', 'Pedir aprobación']) {
      const texto = JSON.stringify(nodo(nombre).parameters)
      expect(texto, nombre).not.toMatch(/\$json[.[]/)
      expect(texto, nombre).toContain("$('Configuración').item.json")
    }
  })
})
