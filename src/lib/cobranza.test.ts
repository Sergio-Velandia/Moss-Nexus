import { describe, expect, it } from 'vitest'
import { DateTime } from 'luxon'
import cobranza from '../data/templates/cobranza-facturas-vencidas/workflow.json'
import { codeOf, runCode, type Item } from '../test/n8n-code'

// Lógica del nodo «Calcular mora», ejecutada tal como está en el workflow publicado
const codigo = codeOf(cobranza, 'Calcular mora')

const MARTES = '2026-10-20' // ventana de 1 día
const LUNES = '2026-10-19' // ventana de 3 días: sábado, domingo y lunes

/** Factura con N días de mora respecto a `hoy` (vencimiento = hoy − N), con datos de ejemplo */
const factura = (hoy: string, numero: string, diasMora: number, extra: Record<string, unknown> = {}): Item => ({
  json: {
    'Número': numero,
    Cliente: `Cliente ${numero}`,
    Correo: 'ana@ejemplo.com',
    Monto: 1500000,
    Vencimiento: DateTime.fromISO(hoy).minus({ days: diasMora }).toFormat('yyyy-MM-dd'),
    Estado: 'Pendiente',
    Responsable: 'cobros@ejemplo.com',
    ...extra,
  },
})

type Gestion = { etapa: string; accion: string; monto: string; cc: string }
function gestiones(hoy: string, facturas: Item[]): Record<string, Gestion> {
  const salida = runCode(codigo, { items: facturas, now: `${hoy}T08:00:00` })
  return Object.fromEntries(salida.map((s) => [String(s.json.numero), s.json as unknown as Gestion]))
}

describe('cobranza: calendario en un día hábil normal (martes)', () => {
  const g = gestiones(MARTES, [
    ...[1, 7, 15, 22, 30, 37, 2].map((d) => factura(MARTES, `D${d}`, d)),
    factura(MARTES, 'PAGADA', 1, { Estado: 'PAGADA' }),
    factura(MARTES, 'FUTURA', -5),
  ])
  it('días 1 y 7 → amable', () => expect([g.D1?.etapa, g.D7?.etapa]).toEqual(['amable', 'amable']))
  it('días 15 y 22 → firme', () => expect([g.D15?.etapa, g.D22?.etapa]).toEqual(['firme', 'firme']))
  it('días 30 y 37 → escalar', () => expect([g.D30?.etapa, g.D37?.etapa]).toEqual(['escalar', 'escalar']))
  it('día 2, pagada (con cualquier mayúscula) y futura → sin gestión', () => {
    expect([g.D2, g.PAGADA, g.FUTURA]).toEqual([undefined, undefined, undefined])
    expect(Object.keys(g)).toHaveLength(6)
  })
})

describe('cobranza: los lunes revisa también el fin de semana', () => {
  const g = gestiones(LUNES, [
    factura(LUNES, 'SAB1', 3),
    factura(LUNES, 'DOM7', 8),
    factura(LUNES, 'SAB30', 32),
    factura(LUNES, 'DOM1', 2),
    factura(LUNES, 'NADA', 4),
    factura(LUNES, 'VARIOS', 7),
    factura(LUNES, 'F15', 16),
  ])
  it('el día 1 cayó el sábado (hoy 3) → amable', () => expect(g.SAB1?.etapa).toBe('amable'))
  it('el día 7 cayó el domingo (hoy 8) → amable', () => expect(g.DOM7?.etapa).toBe('amable'))
  it('el día 30 cayó el sábado (hoy 32) → escalar', () => expect(g.SAB30?.etapa).toBe('escalar'))
  it('el día 1 cayó el domingo (hoy 2) → amable', () => expect(g.DOM1?.etapa).toBe('amable'))
  it('hoy 4 (días 2, 3 y 4 sin recordatorio) → sin gestión', () => expect(g.NADA).toBeUndefined())
  it('si caen varios días (5, 6 y 7), gana el más alto', () => expect(g.VARIOS?.etapa).toBe('amable'))
  it('hoy 16: la ventana incluye el día 15 → firme', () => expect(g.F15?.etapa).toBe('firme'))
})

describe('cobranza: correos inválidos no detienen el envío', () => {
  const g = gestiones(MARTES, [
    factura(MARTES, 'AMABLE-VACIO', 1, { Correo: '' }),
    factura(MARTES, 'AMABLE-MAL', 7, { Correo: 'ana@' }),
    factura(MARTES, 'FIRME-OK', 15),
    factura(MARTES, 'FIRME-SIN-RESP', 22, { Responsable: '' }),
    factura(MARTES, 'FIRME-SIN-CLIENTE', 15, { Correo: '' }),
    factura(MARTES, 'ESCALAR-SIN-CLIENTE', 30, { Correo: '' }),
    factura(MARTES, 'ESCALAR-RESP-MAL', 37, { Responsable: 'nadie' }),
  ])
  it('«amable» con correo vacío o mal escrito → sin_correo, con la acción para la hoja', () => {
    expect([g['AMABLE-VACIO']?.etapa, g['AMABLE-MAL']?.etapa]).toEqual(['sin_correo', 'sin_correo'])
    expect(g['AMABLE-VACIO']?.accion).toBe('Sin correo válido: no se envió')
  })
  it('«firme» con responsable válido → lo pone en copia', () => {
    expect(g['FIRME-OK']).toMatchObject({ etapa: 'firme', cc: 'cobros@ejemplo.com', accion: 'Recordatorio firme' })
  })
  it('«firme» sin responsable válido → se envía sin copia y se anota', () => {
    expect(g['FIRME-SIN-RESP']).toMatchObject({ etapa: 'firme', cc: '' })
    expect(g['FIRME-SIN-RESP']?.accion).toMatch(/sin copia/)
  })
  it('«firme» sin correo del cliente → sin_correo', () => expect(g['FIRME-SIN-CLIENTE']?.etapa).toBe('sin_correo'))
  it('«escalar» solo necesita al responsable', () => expect(g['ESCALAR-SIN-CLIENTE']?.etapa).toBe('escalar'))
  it('«escalar» con responsable inválido → sin_correo', () => expect(g['ESCALAR-RESP-MAL']?.etapa).toBe('sin_correo'))
})

describe('cobranza: montos en COP y fechas', () => {
  const normaliza = (s?: string) => s?.replace(/\s/g, ' ')
  it('número y textos «$ 1.500.000», «1.500.000» y «1500000» → $ 1.500.000', () => {
    const g = gestiones(MARTES, [
      factura(MARTES, 'NUM', 1),
      factura(MARTES, 'T1', 1, { Monto: '$ 1.500.000' }),
      factura(MARTES, 'T2', 1, { Monto: '1.500.000' }),
      factura(MARTES, 'T3', 1, { Monto: '1500000' }),
    ])
    expect(['NUM', 'T1', 'T2', 'T3'].map((k) => normaliza(g[k]?.monto))).toEqual(Array(4).fill('$ 1.500.000'))
  })
  it('monto ilegible → «el monto pendiente», sin inventar una cifra', () => {
    expect(gestiones(MARTES, [factura(MARTES, 'X', 1, { Monto: 'pendiente' })]).X?.monto).toBe('el monto pendiente')
  })
  it('vencimiento como número de serie de Sheets y como DD/MM/AAAA', () => {
    const serie = DateTime.fromISO('2026-10-19').diff(DateTime.fromISO('1899-12-30'), 'days').days
    const g = gestiones(MARTES, [
      factura(MARTES, 'SERIE', 0, { Vencimiento: serie }),
      factura(MARTES, 'DMA', 0, { Vencimiento: '19/10/2026' }),
    ])
    expect([g.SERIE?.etapa, g.DMA?.etapa]).toEqual(['amable', 'amable'])
  })
})
