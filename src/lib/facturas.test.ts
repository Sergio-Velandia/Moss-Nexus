import { describe, expect, it } from 'vitest'
import workflow from '../data/templates/facturas-gmail-a-drive/workflow.json'

type Nodo = { name: string; onError?: string; parameters: Record<string, unknown> }
const nodo = (nombre: string) => (workflow.nodes as Nodo[]).find((n) => n.name === nombre)!

const enlace = (nodo('Registrar factura').parameters as { columns: { value: Record<string, string> } }).columns.value.Enlace
const evaluar = ($json: unknown) => new Function('$json', `return (${enlace.replace(/^=\{\{/, '').replace(/\}\}$/, '')})`)($json)

describe('facturas-gmail-a-drive: una falla de Drive no deja la factura sin registrar', () => {
  it('las dos salidas de «Subir a Drive» (éxito y error) llegan al registro', () => {
    expect(nodo('Subir a Drive').onError).toBe('continueErrorOutput')
    const salidas = workflow.connections['Subir a Drive'].main.map((s) => s.map((l) => l.node))
    expect(salidas).toEqual([['Registrar factura'], ['Registrar factura']])
  })

  it('con éxito registra el enlace de Drive', () => {
    expect(evaluar({ webViewLink: 'https://drive.google.com/file/d/abc/view' })).toBe('https://drive.google.com/file/d/abc/view')
  })

  it('con error registra el motivo, venga como texto o como objeto', () => {
    expect(evaluar({ error: 'Insufficient permissions' })).toBe('No se subió a Drive: Insufficient permissions')
    expect(evaluar({ error: { message: 'File not found: carpeta' } })).toBe('No se subió a Drive: File not found: carpeta')
    expect(evaluar({})).toBe('No se subió a Drive: error desconocido')
  })

  it('el resto de columnas sale de «Separar adjuntos», así funciona en las dos salidas', () => {
    const cols = (nodo('Registrar factura').parameters as { columns: { value: Record<string, string> } }).columns.value
    for (const c of ['Fecha', 'Remitente', 'Asunto', 'Archivo']) expect(cols[c]).toContain("$('Separar adjuntos').item.json.")
  })
})
