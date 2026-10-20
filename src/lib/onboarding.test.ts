import { describe, expect, it } from 'vitest'
import { DateTime } from 'luxon'
import onboarding from '../data/templates/onboarding-empleado/workflow.json'
import '../test/n8n-code' // fija la zona America/Bogota

type Nodo = (typeof onboarding.nodes)[number]
const nodo = (nombre: string) => onboarding.nodes.find((n) => n.name === nombre) as Nodo

/** Evalúa una expresión «={{ … }}» de un campo, con $json, $today y $('Preparar datos') como en n8n */
function evaluar(expresion: string, ctx: { $json?: unknown; hoy?: string; preparar?: unknown }) {
  const cuerpo = expresion.replace(/^=\{\{/, '').replace(/\}\}$/, '').trim()
  const $ = () => ({ item: { json: ctx.preparar } })
  return new Function('$json', '$today', '$', 'DateTime', `return (${cuerpo})`)(
    ctx.$json,
    DateTime.fromISO(ctx.hoy ?? '2026-10-19'),
    $,
    DateTime,
  )
}

/** Sustituye cada {{ … }} de un texto de n8n por su valor */
const plantilla = (texto: string, preparar: unknown) =>
  texto.replace(/^=/, '').replace(/\{\{(.*?)\}\}/gs, (_, e: string) => String(evaluar(`={{${e}}}`, { preparar })))

describe('onboarding-empleado: fecha de ingreso pasada', () => {
  const set = nodo('Preparar datos').parameters as { assignments: { assignments: { name: string; value: string }[] } }
  const fechaPasada = set.assignments.assignments.find((a) => a.name === 'fechaPasada')!.value
  const pasada = (fecha: string) => evaluar(fechaPasada, { $json: { 'Fecha de ingreso': fecha }, hoy: '2026-10-19' })

  it('ayer ya pasó; hoy y mañana no', () => {
    expect([pasada('2026-10-18'), pasada('2026-10-19'), pasada('2026-10-20')]).toEqual([true, false, false])
  })

  it('con fecha pasada, el checklist empieza con el aviso y no promete la reunión', () => {
    const mensaje = (nodo('Checklist al responsable').parameters as { message: string }).message
    const datos = { nombre: 'Ana Pérez', cargo: 'Analista', fechaLegible: 'domingo 18 de octubre' }
    const conAviso = plantilla(mensaje, { ...datos, fechaPasada: true })
    expect(conAviso.startsWith('⚠️ La fecha de ingreso registrada (domingo 18 de octubre) ya pasó: revísala.\n\nHola:')).toBe(true)
    expect(conAviso).toMatch(/No se agendó la reunión de bienvenida/)
    const normal = plantilla(mensaje, { ...datos, fechaPasada: false })
    expect(normal.startsWith('Hola:')).toBe(true)
    expect(normal).toMatch(/La reunión de bienvenida ya está en tu calendario\.$/)
  })

  it('el IF solo deja pasar a Calendar las fechas futuras', () => {
    const cond = (nodo('¿Fecha futura?').parameters as { conditions: { conditions: { leftValue: string }[] } }).conditions.conditions[0]!
    expect(evaluar(cond.leftValue, { preparar: { fechaPasada: false } })).toBe(true)
    expect(evaluar(cond.leftValue, { preparar: { fechaPasada: true } })).toBe(false)
  })
})

describe('onboarding-empleado: orden de ejecución', () => {
  it('el registro va antes de cualquier aviso', () => {
    const c = onboarding.connections as Record<string, { main: { node: string }[][] }>
    expect(c['Preparar datos']!.main[0]!.map((x) => x.node)).toEqual(['Registrar ingreso'])
    expect(c['Registrar ingreso']!.main[0]!.map((x) => x.node)).toEqual([
      '¿Fecha futura?',
      'Correo de bienvenida',
      'Checklist al responsable',
      'Anunciar al equipo',
    ])
  })
})
