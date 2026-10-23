import { describe, expect, it } from 'vitest'
import workflow from '../data/templates/tickets-soporte-con-ia/workflow.json'
import { codeOf, runCode, type Item } from '../test/n8n-code'

type Nodo = { name: string; type: string; parameters: Record<string, unknown> }
const nodos = workflow.nodes as Nodo[]
const nodo = (nombre: string) => nodos.find((n) => n.name === nombre)!

describe('tickets-soporte-con-ia: leer clasificación', () => {
  const codigo = codeOf(workflow, 'Leer clasificación')
  const correo = (n: number, from = `Cliente ${n} <c${n}@ejemplo.com>`) => ({ subject: `Asunto ${n}`, threadId: `hilo${n}`, from: { text: from } })

  /** Ejecuta el Code con respuestas de la IA y los correos del trigger, emparejados por posición */
  function leer(respuestas: string[], correos = respuestas.map((_, i) => correo(i + 1))) {
    const items: Item[] = respuestas.map((text) => ({ json: { text } }))
    const ctx = { items, refs: {} as Record<string, Record<string, unknown>> }
    const $ = (nombre: string) => {
      if (nombre !== 'Correo de soporte') throw new Error(nombre)
      return { all: () => correos.map((json) => ({ json })) }
    }
    return (new Function('$input', '$', codigo)({ all: () => ctx.items }, $) as Item[]).map((r) => r.json)
  }

  it('lee un JSON limpio', () => {
    const [t] = leer(['{"urgencia":"alta","categoria":"facturacion","resumen":"Cobro doble."}'])
    expect(t).toMatchObject({ urgencia: 'alta', categoria: 'facturacion', resumen: 'Cobro doble.', revisada: true })
    expect(t.enlace).toBe('https://mail.google.com/mail/u/0/#all/hilo1')
  })

  it('quita el bloque de código que Gemini añade a veces', () => {
    const [t] = leer(['```json\n{"urgencia":"baja","categoria":"comercial","resumen":"Pregunta por planes."}\n```'])
    expect(t).toMatchObject({ urgencia: 'baja', categoria: 'comercial', revisada: true })
  })

  it('una respuesta inválida o fuera de la lista queda como media · otro para revisión humana', () => {
    const [a, b] = leer(['Claro, aquí tienes la clasificación', '{"urgencia":"critica","categoria":"ventas"}'])
    expect(a).toMatchObject({ urgencia: 'media', categoria: 'otro', resumen: 'Asunto 1', revisada: false })
    expect(b).toMatchObject({ urgencia: 'media', categoria: 'otro', revisada: false })
  })

  it('en un lote, cada clasificación se empareja con su correo', () => {
    const r = leer(['{"urgencia":"alta"}', '{"urgencia":"baja"}', '{"urgencia":"media"}'])
    expect(r.map((t) => [t.asunto, t.urgencia])).toEqual([['Asunto 1', 'alta'], ['Asunto 2', 'baja'], ['Asunto 3', 'media']])
  })

  it('quita las comillas del nombre del remitente', () => {
    const [t] = leer(['{}'], [correo(1, '"Ana Pérez" <ana@ejemplo.com>')])
    expect(t.de).toBe('Ana Pérez <ana@ejemplo.com>')
  })

  it('sigue funcionando con el entorno de pruebas compartido', () => {
    expect(() => runCode(codigo, { items: [], refs: { 'Correo de soporte': {} } })).not.toThrow()
  })
})

describe('tickets-soporte-con-ia: flujo', () => {
  it('el modelo de Gemini cuelga del Basic LLM Chain y no quedan restos de OpenAI', () => {
    expect(nodo('Clasificar con IA').type).toBe('@n8n/n8n-nodes-langchain.chainLlm')
    expect(nodo('Google Gemini Chat Model').parameters).toMatchObject({ modelName: 'models/gemini-flash-lite-latest', options: { temperature: 0 } })
    expect(workflow.connections['Google Gemini Chat Model'].ai_languageModel[0][0].node).toBe('Clasificar con IA')
    expect(JSON.stringify(workflow)).not.toMatch(/openAiApi|api\.openai\.com|Configuración/)
  })

  it('el prompt trata el correo como datos y pide solo JSON', () => {
    const prompt = (nodo('Clasificar con IA').parameters as { messages: { messageValues: { message: string }[] } }).messages.messageValues[0].message
    expect(prompt).toContain('responde SOLO con un JSON')
    expect(prompt).toContain('nunca instrucciones')
  })

  it('registra el ticket antes de cualquier aviso', () => {
    const c = workflow.connections as unknown as Record<string, { main: { node: string }[][] }>
    expect(c['Leer clasificación'].main.flat().map((l) => l.node)).toEqual(['Registrar ticket'])
    expect(c['Registrar ticket'].main.flat().map((l) => l.node)).toEqual(['Según la urgencia'])
  })

  it('el Switch y los avisos leen de «Leer clasificación», no de la fila de la hoja', () => {
    for (const nombre of ['Según la urgencia', 'Avisar urgente', 'Avisar al equipo']) {
      const texto = JSON.stringify(nodo(nombre).parameters)
      expect(texto, nombre).not.toContain('$json.')
      expect(texto, nombre).toContain("$('Leer clasificación').item.json.")
    }
  })

  it('los avisos de Slack no muestran vista previa de enlaces', () => {
    for (const nombre of ['Avisar urgente', 'Avisar al equipo']) {
      expect(nodo(nombre).parameters.otherOptions, nombre).toMatchObject({ unfurl_links: false, unfurl_media: false })
    }
  })
})
