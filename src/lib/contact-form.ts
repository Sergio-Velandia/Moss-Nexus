import { site } from '../data/site'
import { tools } from '../data/tools'

/**
 * Formularios de «Propón un flujo»: definición de campos, validación, armado del correo y envío por EmailJS.
 * La página los dibuja a partir de estas definiciones, así validación e interfaz no se desalinean.
 * El correo de destino no está en el código: se configura en la plantilla de EmailJS.
 */

export type FormKind = 'propuesta' | 'conversacion'

export interface Field {
  name: string
  label: string
  type: 'text' | 'email' | 'textarea' | 'select' | 'radio' | 'tools' | 'checkbox'
  required?: boolean
  hint?: string
  placeholder?: string
  options?: string[]
  autoComplete?: string
  maxLength?: number
}

export type Values = Record<string, string | string[]>

const TEXTO = 120
const PARRAFO = 2000

/** Campo trampa: invisible para las personas. Si llega con texto, lo llenó un bot y no se envía nada. */
export const HONEYPOT = 'sitio_web'

const contacto: Field[] = [
  { name: 'nombre', label: 'Tu nombre', type: 'text', required: true, autoComplete: 'name', maxLength: TEXTO },
  { name: 'correo', label: 'Tu correo', type: 'email', required: true, autoComplete: 'email', maxLength: TEXTO, hint: 'Solo para responderte.' },
]

const autorizacion: Field = {
  name: 'autorizacion',
  label: 'Autorizo el tratamiento de mis datos para que me respondan, según la política de privacidad.',
  type: 'checkbox',
  required: true,
}

/** Herramientas que la persona puede marcar: las del catálogo que son servicios externos */
export const TOOL_OPTIONS = tools.filter((t) => !t.nativa).map((t) => t.nombre)

export const FORMS: Record<FormKind, { title: string; fields: Field[] }> = {
  propuesta: {
    title: 'Propón un flujo',
    fields: [
      ...contacto,
      { name: 'negocio', label: 'Negocio o empresa', type: 'text', maxLength: TEXTO, autoComplete: 'organization', hint: 'Si es un proyecto personal, déjalo vacío.' },
      {
        name: 'sector',
        label: 'Sector',
        type: 'select',
        options: ['Comercio o tienda en línea', 'Servicios profesionales', 'Salud', 'Educación', 'Tecnología', 'Manufactura o logística', 'Restaurantes y turismo', 'Organización sin ánimo de lucro', 'Otro'],
      },
      { name: 'tamano', label: 'Tamaño del equipo', type: 'select', options: ['Solo yo', '2 a 10 personas', '11 a 50 personas', '51 a 200 personas', 'Más de 200 personas'] },
      {
        name: 'problema',
        label: 'El problema',
        type: 'textarea',
        required: true,
        maxLength: PARRAFO,
        hint: '¿Qué tarea repetitiva, error frecuente o cuello de botella quieres resolver?',
        placeholder: 'Ejemplo: cada pedido que llega por WhatsApp lo copiamos a mano en una hoja y a veces se pierde.',
      },
      { name: 'hoy', label: 'Cómo lo resuelven hoy', type: 'textarea', maxLength: PARRAFO, hint: 'Quién lo hace, con qué herramientas y cuánto tiempo toma.' },
      {
        name: 'idea',
        label: 'Tu idea',
        type: 'textarea',
        required: true,
        maxLength: PARRAFO,
        hint: '¿Qué te gustaría que pasara de forma automática?',
        placeholder: 'Ejemplo: cuando llegue un pedido, que quede en la hoja y le avise al equipo por Slack.',
      },
      { name: 'herramientas', label: 'Herramientas que ya usan', type: 'tools', options: TOOL_OPTIONS, hint: 'Marca las que apliquen.' },
      { name: 'otras', label: 'Otras herramientas', type: 'text', maxLength: TEXTO, placeholder: 'Ejemplo: Excel, Siigo, Shopify' },
      { name: 'frecuencia', label: '¿Cada cuánto ocurre?', type: 'select', options: ['Varias veces al día', 'Una vez al día', 'Cada semana', 'Cada mes', 'No lo sé'] },
      {
        name: 'objetivo',
        label: '¿Qué buscas?',
        type: 'radio',
        required: true,
        options: ['Que sea una plantilla de la librería', 'Ayuda para implementarlo en mi negocio', 'Solo compartir la idea'],
      },
      {
        name: 'publicar',
        label: 'Si la idea le sirve a más personas, acepto que se publique como plantilla de Moss Nexus, sin mis datos ni los de mi negocio.',
        type: 'checkbox',
      },
      autorizacion,
    ],
  },
  conversacion: {
    title: 'Habla conmigo',
    fields: [
      ...contacto,
      { name: 'asunto', label: 'Asunto', type: 'text', maxLength: TEXTO },
      { name: 'mensaje', label: 'Mensaje', type: 'textarea', required: true, maxLength: PARRAFO },
      autorizacion,
    ],
  },
}

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const texto = (v: string | string[] | undefined) => (Array.isArray(v) ? v.join(', ') : (v ?? '')).trim()

/** Devuelve un mensaje de error por campo inválido, en el orden del formulario */
export function validate(kind: FormKind, values: Values): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const f of FORMS[kind].fields) {
    const v = texto(values[f.name])
    if (f.required && !v) {
      errors[f.name] =
        f.type === 'checkbox' ? 'Necesito tu autorización para poder responderte.' : f.type === 'radio' ? 'Elige una opción.' : 'Este campo es obligatorio.'
    } else if (f.type === 'email' && v && !CORREO.test(v)) {
      errors[f.name] = 'Revisa el correo: debe tener la forma nombre@dominio.com.'
    } else if (f.maxLength && v.length > f.maxLength) {
      errors[f.name] = `Máximo ${f.maxLength} caracteres.`
    } else if (f.options && v && f.type !== 'tools' && !f.options.includes(v)) {
      errors[f.name] = 'Elige una de las opciones.'
    }
  }
  return errors
}

export interface EmailParams {
  tipo: string
  nombre: string
  correo: string
  asunto: string
  mensaje: string
}

/** Convierte las respuestas en un correo de texto: una línea o un bloque por campo respondido */
export function buildEmail(kind: FormKind, values: Values): EmailParams {
  const { title, fields } = FORMS[kind]
  const nombre = texto(values.nombre)
  const lineas: string[] = []
  for (const f of fields) {
    if (f.name === 'autorizacion') continue
    const v = texto(values[f.name])
    if (f.type === 'checkbox') {
      lineas.push(`${f.name === 'publicar' ? 'Acepta publicarla como plantilla' : f.label}: ${v ? 'sí' : 'no'}`)
    } else if (v) {
      lineas.push(f.type === 'textarea' ? `${f.label}:\n${v}\n` : `${f.label}: ${v}`)
    }
  }
  lineas.push('', 'Autorizó el tratamiento de sus datos para recibir respuesta.')
  const asunto =
    kind === 'propuesta'
      ? `[Moss Nexus] Propuesta de flujo de ${nombre}${texto(values.negocio) ? ` (${texto(values.negocio)})` : ''}`
      : `[Moss Nexus] ${texto(values.asunto) || `Mensaje de ${nombre}`}`
  return { tipo: title, nombre, correo: texto(values.correo), asunto, mensaje: lineas.join('\n').trim() }
}

export const emailjsReady = () => Boolean(site.emailjs.serviceId && site.emailjs.templateId && site.emailjs.publicKey)

/** Envía el correo con la API REST de EmailJS (sin su SDK, para no sumar dependencias) */
export async function sendEmail(params: EmailParams, fetchImpl: typeof fetch = fetch): Promise<void> {
  const { serviceId, templateId, publicKey } = site.emailjs
  const res = await fetchImpl('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service_id: serviceId, template_id: templateId, user_id: publicKey, template_params: params }),
  })
  if (!res.ok) throw new Error(`EmailJS respondió ${res.status}`)
}
