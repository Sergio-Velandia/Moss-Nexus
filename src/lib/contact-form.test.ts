import { describe, expect, it, vi } from 'vitest'
import { buildEmail, FORMS, sendEmail, validate, type Values } from './contact-form'

const propuesta: Values = {
  nombre: 'Ana Pérez',
  correo: 'ana@ejemplo.com',
  negocio: 'Panadería La Espiga',
  sector: 'Comercio o tienda en línea',
  tamano: '2 a 10 personas',
  problema: 'Los pedidos por WhatsApp se copian a mano.',
  hoy: '',
  idea: 'Que cada pedido quede en una hoja y avise al equipo.',
  herramientas: ['WhatsApp', 'Google Sheets'],
  otras: '',
  frecuencia: 'Varias veces al día',
  objetivo: 'Ayuda para implementarlo en mi negocio',
  publicar: '',
  autorizacion: 'sí',
}

describe('formularios: validación', () => {
  it('una propuesta completa no tiene errores', () => expect(validate('propuesta', propuesta)).toEqual({}))

  it('exige nombre, correo, problema, idea, objetivo y autorización, en el orden del formulario', () => {
    expect(Object.keys(validate('propuesta', {}))).toEqual(['nombre', 'correo', 'problema', 'idea', 'objetivo', 'autorizacion'])
    expect(Object.keys(validate('conversacion', {}))).toEqual(['nombre', 'correo', 'mensaje', 'autorizacion'])
  })

  it('rechaza correos mal escritos y acepta los válidos', () => {
    for (const correo of ['ana', 'ana@', 'ana@ejemplo', 'ana @ejemplo.com']) {
      expect(validate('conversacion', { nombre: 'Ana', correo, mensaje: 'Hola', autorizacion: 'sí' })).toHaveProperty('correo')
    }
    expect(validate('conversacion', { nombre: 'Ana', correo: 'ana.perez+n8n@empresa.com.co', mensaje: 'Hola', autorizacion: 'sí' })).toEqual({})
  })

  it('un texto con solo espacios cuenta como vacío y se respeta el largo máximo', () => {
    const e = validate('conversacion', { nombre: '   ', correo: 'ana@ejemplo.com', mensaje: 'x'.repeat(2001), autorizacion: 'sí' })
    expect(e.nombre).toBe('Este campo es obligatorio.')
    expect(e.mensaje).toMatch(/Máximo 2000/)
  })

  it('una opción que no está en la lista no pasa', () => {
    expect(validate('propuesta', { ...propuesta, objetivo: 'Otra cosa' })).toHaveProperty('objetivo')
  })
})

describe('formularios: correo armado', () => {
  it('la propuesta lleva asunto con el negocio y solo los campos respondidos', () => {
    const c = buildEmail('propuesta', propuesta)
    expect(c.asunto).toBe('[Moss Nexus] Propuesta de flujo de Ana Pérez (Panadería La Espiga)')
    expect(c).toMatchObject({ tipo: 'Propón un flujo', nombre: 'Ana Pérez', correo: 'ana@ejemplo.com' })
    expect(c.mensaje).toContain('El problema:\nLos pedidos por WhatsApp se copian a mano.')
    expect(c.mensaje).toContain('Herramientas que ya usan: WhatsApp, Google Sheets')
    expect(c.mensaje).toContain('Acepta publicarla como plantilla: no')
    expect(c.mensaje).not.toContain('Cómo lo resuelven hoy')
    expect(c.mensaje).toMatch(/Autorizó el tratamiento de sus datos/)
  })

  it('«Habla conmigo» usa el asunto escrito o uno con el nombre', () => {
    const base = { nombre: 'Ana', correo: 'ana@ejemplo.com', mensaje: 'Hola', autorizacion: 'sí' }
    expect(buildEmail('conversacion', { ...base, asunto: 'Una pregunta' }).asunto).toBe('[Moss Nexus] Una pregunta')
    expect(buildEmail('conversacion', base).asunto).toBe('[Moss Nexus] Mensaje de Ana')
  })
})

describe('formularios: envío', () => {
  it('llama a la API de EmailJS con el servicio configurado y los parámetros de la plantilla', async () => {
    const fetchMock = vi.fn(async () => new Response('OK', { status: 200 }))
    const params = buildEmail('conversacion', { nombre: 'Ana', correo: 'ana@ejemplo.com', mensaje: 'Hola', autorizacion: 'sí' })
    await sendEmail(params, fetchMock as unknown as typeof fetch)
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://api.emailjs.com/api/v1.0/email/send')
    const body = JSON.parse(String(init.body))
    expect(body.service_id).toBe('service_ykyb3t9')
    expect(body.template_params).toEqual(params)
  })

  it('un error de EmailJS se propaga para mostrar el aviso', async () => {
    const fetchMock = vi.fn(async () => new Response('Bad', { status: 400 }))
    await expect(sendEmail(buildEmail('conversacion', {}), fetchMock as unknown as typeof fetch)).rejects.toThrow(/400/)
  })

  it('ningún campo pide el correo de destino: se configura en EmailJS', () => {
    const textos = JSON.stringify(FORMS)
    expect(textos).not.toMatch(/@sergio-velandia\.dev/)
  })
})
