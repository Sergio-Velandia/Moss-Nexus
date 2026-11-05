import { describe, expect, it } from 'vitest'
import { COMPOSE, estoMePaso, N8N_VERSION, noLevanta, pasosDesdeCero, pasosImportar } from '../data/primeros-pasos'
import { templates } from './templates'

const pasos = [...pasosDesdeCero, ...pasosImportar]
const tropiezos = [...noLevanta, ...estoMePaso]
const SECCIONES = ['desde-cero', 'importar', 'no-levanta', 'esto-me-paso']
const paso = (id: string) => pasos.find((p) => p.id === id)!

describe('primeros pasos: el compose', () => {
  it('fija una versión de n8n con la que se probó alguna plantilla', () => {
    expect(COMPOSE).toContain(`image: docker.n8n.io/n8nio/n8n:${N8N_VERSION}`)
    expect(N8N_VERSION).toMatch(/^\d+\.\d+\.\d+$/)
    expect(templates.some((t) => t.probado?.versionN8n === N8N_VERSION)).toBe(true)
    expect(COMPOSE).not.toContain('latest')
  })

  it('tiene volumen, zona horaria y puerto solo local', () => {
    expect(COMPOSE).toContain('n8n_data:/home/node/.n8n')
    expect(COMPOSE).toContain('GENERIC_TIMEZONE=')
    expect(COMPOSE).toContain('"127.0.0.1:5678:5678"')
  })

  it('no fija nombres: otro nombre de proyecto de Compose no toca otra instalación', () => {
    expect(COMPOSE).not.toMatch(/container_name|external:|^\s*name:/m)
  })

  it('la clave sale del .env, nunca del compose', () => {
    expect(COMPOSE).toContain('N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY:?')
    expect(JSON.stringify([pasos, tropiezos, COMPOSE])).not.toMatch(/[0-9a-f]{32}/i)
  })
})

describe('primeros pasos: los pasos', () => {
  it('cada paso cierra con qué deberías estar viendo', () => {
    for (const p of pasos) expect(p.verificar.trim(), p.id).not.toBe('')
  })

  it('todo el código se puede copiar: los comandos van en bloques, no solo en el texto', () => {
    expect(pasosDesdeCero.filter((p) => p.bloques?.length).length).toBeGreaterThanOrEqual(5)
    for (const p of pasos) for (const b of p.bloques ?? []) expect(b.codigo.trim(), p.id).not.toBe('')
  })

  it('comprueba que el volumen funciona bajando y levantando el contenedor', () => {
    const p = paso('comprobar-volumen')
    expect(p.bloques?.[0].codigo).toBe('docker compose down\ndocker compose up -d')
    expect(p.verificar).toContain('sigue ahí')
    expect(p.aviso).toContain('down -v')
  })

  it('dice sin rodeos qué se pierde con la clave y que el .env no se sube', () => {
    const { aviso } = paso('clave')
    expect(aviso).toContain('no se recuperan')
    expect(aviso).toContain('nunca se sube a un repositorio')
  })

  it('no enlaza a Moss: esta guía es la única fuente de verdad', () => {
    expect(JSON.stringify([pasos, tropiezos])).not.toMatch(/\/Moss\/|Moss:/)
  })
})

describe('primeros pasos: los tropiezos', () => {
  it('cada uno tiene síntoma, causa y qué hacer', () => {
    for (const t of tropiezos) {
      expect(t.sintoma.trim(), t.id).not.toBe('')
      expect(t.causa.trim(), t.id).not.toBe('')
      expect(t.queHacer.trim(), t.id).not.toBe('')
    }
  })

  it('están los cuatro tropiezos pedidos, con su ancla', () => {
    const ids = estoMePaso.map((t) => t.id)
    for (const id of ['flujos-de-error-manual', 'credenciales-google-7-dias', 'slack-not-in-channel', 'sheets-xlsx']) expect(ids).toContain(id)
  })

  it('ninguna ancla se repite', () => {
    const anclas = [...SECCIONES, ...pasos.map((p) => p.id), ...tropiezos.map((t) => t.id)]
    expect(new Set(anclas).size).toBe(anclas.length)
    for (const a of anclas) expect(a).toMatch(/^[a-z0-9-]+$/)
  })

  it('el tropiezo de las ejecuciones manuales usa el nombre del botón de n8n', () => {
    const t = estoMePaso.find((x) => x.id === 'flujos-de-error-manual')!
    expect(t.sintoma).toContain('«Execute workflow»')
  })
})

describe('primeros pasos: enlaces desde las plantillas', () => {
  const enlaces = templates.flatMap((t) => (t.guias ?? []).filter((g) => g.url.includes('/primeros-pasos')).map((g) => ({ slug: t.slug, ...g })))

  it('hay enlaces, y cada uno apunta a un tropiezo que existe', () => {
    expect(enlaces.length).toBeGreaterThan(0)
    const ids = new Set(tropiezos.map((t) => t.id))
    for (const e of enlaces) {
      expect(e.url, e.slug).toMatch(/^https:\/\/sergio-velandia\.dev\/Moss-Nexus\/primeros-pasos\/#/)
      expect(ids.has(e.url.split('#')[1]), `${e.slug}: ${e.url}`).toBe(true)
    }
  })
})
