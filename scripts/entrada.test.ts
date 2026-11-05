import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Con readFileSync y no con ?raw: Vitest entrega vacíos los CSS importados
const html = readFileSync('index.html', 'utf8')
const estilos = readFileSync('src/index.css', 'utf8')
const css = readFileSync('src/styles/entrada.css', 'utf8')

const BASE = '/Moss-Nexus/'
const ORIGEN = 'https://sergio-velandia.dev'
const plantilla = /<template id="plantilla-entrada">[\s\S]*?<\/template>/.exec(html)?.[0] ?? ''
const script = (/<\/template>\s*<script>([\s\S]*?)<\/script>/.exec(html)?.[1] ?? '').replaceAll('%BASE_URL%', BASE)

/** Lo justo del DOM para ejecutar el script real de index.html, sin sumar jsdom como dependencia */
class Nodo {
  className = ''
  style = { cssText: '' }
  hijos: Nodo[] = []
  oyentes: Record<string, (e: { target: unknown }) => void> = {}
  montado = false
  querySelector(selector: string) {
    return selector === '.entrada-granos' ? granos : null
  }
  appendChild(hijo: Nodo) {
    this.hijos.push(hijo)
  }
  remove() {
    this.montado = false
  }
  addEventListener(tipo: string, fn: (e: { target: unknown }) => void) {
    this.oyentes[tipo] = fn
  }
  cloneNode() {
    return this
  }
}
let granos = new Nodo()

interface Llegada {
  referente?: string
  tipo?: string
  movimientoReducido?: boolean
  sinDatos?: boolean
}

function llegar({ referente = '', tipo = 'navigate', movimientoReducido = false, sinDatos = false }: Llegada = {}) {
  granos = new Nodo()
  const entrada = new Nodo()
  const meta = { color: '#faf7ef', getAttribute: () => meta.color, setAttribute: (_a: string, v: string) => void (meta.color = v) }
  const ventana: Record<string, () => void> = {}
  const temporizador = { ms: 0, fn: () => {} }
  const document = {
    referrer: referente,
    getElementById: () => ({ content: { firstElementChild: entrada } }),
    createElement: () => new Nodo(),
    querySelector: () => meta,
    body: { prepend: (n: Nodo) => void (n.montado = true) },
  }
  const performance = {
    getEntriesByType: () => {
      if (sinDatos) throw new Error('no disponible')
      return [{ type: tipo }]
    },
  }
  new Function('document', 'performance', 'location', 'matchMedia', 'addEventListener', 'removeEventListener', 'setTimeout', script)(
    document,
    performance,
    { origin: ORIGEN },
    () => ({ matches: movimientoReducido }),
    (t: string, fn: () => void) => (ventana[t] = fn),
    (t: string) => delete ventana[t],
    (fn: () => void, ms: number) => Object.assign(temporizador, { fn, ms }),
  )
  return { entrada, meta, ventana, temporizador, granos }
}

describe('pantalla de entrada: cuándo aparece', () => {
  it('aparece al llegar de afuera', () => {
    expect(llegar({ referente: 'https://www.google.com/' }).entrada.montado).toBe(true)
    expect(llegar().entrada.montado).toBe(true)
  })

  it('aparece también al venir de Moss, que comparte dominio', () => {
    expect(llegar({ referente: `${ORIGEN}/Moss/manual/` }).entrada.montado).toBe(true)
  })

  it('no aparece al recargar ni al volver atrás', () => {
    expect(llegar({ tipo: 'reload' }).entrada.montado).toBe(false)
    expect(llegar({ tipo: 'back_forward' }).entrada.montado).toBe(false)
  })

  it('no aparece al abrir otra página del mismo sitio', () => {
    expect(llegar({ referente: `${ORIGEN}${BASE}plantillas/` }).entrada.montado).toBe(false)
  })

  it('no aparece con movimiento reducido', () => {
    expect(llegar({ movimientoReducido: true }).entrada.montado).toBe(false)
  })

  it('si el navegador no da los datos de la navegación, no rompe la página', () => {
    expect(() => llegar({ sinDatos: true })).not.toThrow()
    expect(llegar({ sinDatos: true }).entrada.montado).toBe(false)
  })

  it('no guarda nada en el navegador', () => {
    expect(script).not.toMatch(/localStorage|sessionStorage|cookie|indexedDB/)
  })
})

describe('pantalla de entrada: cuándo se va', () => {
  it('se va a los 3 segundos como mucho y devuelve el color del navegador', () => {
    const { entrada, meta, temporizador } = llegar()
    expect(meta.color).toBe('#0e130e')
    expect(temporizador.ms).toBe(3000)
    temporizador.fn()
    expect(entrada.montado).toBe(false)
    expect(meta.color).toBe('#faf7ef')
  })

  it('se va al terminar su animación, no la de un hijo', () => {
    const { entrada } = llegar()
    entrada.oyentes.animationend({ target: new Nodo() })
    expect(entrada.montado).toBe(true)
    entrada.oyentes.animationend({ target: entrada })
    expect(entrada.montado).toBe(false)
  })

  it.each([
    ['un toque', 'pointerdown'],
    ['una tecla', 'keydown'],
  ])('se salta con %s y deja de escuchar', (_nombre, evento) => {
    const { entrada, ventana } = llegar()
    ventana[evento]()
    expect(entrada.montado).toBe(false)
    expect(Object.keys(ventana)).toEqual([])
  })
})

describe('pantalla de entrada: la marca', () => {
  const posiciones = () =>
    llegar().granos.hijos.map((g) => {
      const v = (nombre: string) => Number(new RegExp(`--${nombre}:(-?[\\d.]+)`).exec(g.style.cssText)?.[1])
      return { x: v('x'), y: v('y') }
    })

  it('son 70 granos y todos caen dentro de la capa de 128 px', () => {
    const p = posiciones()
    expect(p).toHaveLength(70)
    for (const { x, y } of p) {
      expect(Math.abs(x)).toBeLessThanOrEqual(64)
      expect(Math.abs(y)).toBeLessThanOrEqual(64)
    }
  })

  it('llenan los dos cuadros del favicon, y la curva pasa entre ellos', () => {
    const dentro = (px: number, py: number, lado: number) => (g: { x: number; y: number }) => {
      const x = g.x / 2 + 32
      const y = g.y / 2 + 32
      return x >= px && x <= px + lado && y >= py && y <= py + lado
    }
    const p = posiciones()
    expect(p.filter(dentro(9, 13, 18)).length).toBeGreaterThanOrEqual(25)
    expect(p.filter(dentro(37, 33, 18)).length).toBeGreaterThanOrEqual(25)
    // El tramo de la curva entre los dos cuadros
    expect(p.filter((g) => g.x / 2 + 32 > 27 && g.x / 2 + 32 < 37).length).toBeGreaterThan(0)
  })

  it('la silueta es la del favicon', () => {
    for (const trazo of ['M20 22c10 0 12 20 24 20', 'x="9" y="13" width="18" height="18" rx="6"', 'x="37" y="33" width="18" height="18" rx="6"']) {
      expect(plantilla).toContain(trazo)
    }
    expect(plantilla).toContain('var(--c-entrada-musgo)')
    expect(plantilla).toContain('var(--c-entrada-coral)')
  })

  it('lleva el nombre y el lema de Nexus', () => {
    expect(plantilla).toContain('<span class="entrada-nitida">Moss</span>')
    expect(plantilla).toContain('<span class="entrada-nitida">Nexus</span>')
    expect(plantilla).toContain('Del problema al flujo en minutos')
  })
})

describe('pantalla de entrada: el diseño', () => {
  it('sus animaciones terminan antes de los 3 segundos', () => {
    const duracion = Number(/--entrada-duracion:\s*(\d+)ms/.exec(css)?.[1])
    expect(duracion).toBeGreaterThan(0)
    expect(duracion).toBeLessThanOrEqual(3000)
    // Las capas con su propio tiempo tampoco se pasan: retraso + duración
    const capas = [...css.matchAll(/animation-delay: (\d+)ms;\s*animation-duration: (\d+)ms/g)]
    expect(capas.length).toBeGreaterThan(0)
    for (const [, retraso, propia] of capas) expect(Number(retraso) + Number(propia)).toBeLessThanOrEqual(duracion)
  })

  it('solo anima transform y opacity', () => {
    const fotogramas = [...css.replace(/\r\n/g, '\n').matchAll(/@keyframes [\w-]+ \{([\s\S]*?)\n\}/g)].map((m) => m[1])
    expect(fotogramas.length).toBeGreaterThan(0)
    const propiedades = new Set(fotogramas.flatMap((f) => [...f.matchAll(/^\s*([a-z-]+):/gm)].map((m) => m[1])))
    expect([...propiedades].sort()).toEqual(['opacity', 'transform'])
  })

  it('no usa hex sueltos: los colores viven en los tokens', () => {
    expect(css).toContain('.entrada {')
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i)
    expect(plantilla).not.toMatch(/#[0-9a-f]{3,8}\b/i)
  })

  it('se oculta a los lectores de pantalla y no tiene títulos ni elementos con foco', () => {
    expect(plantilla).toContain('class="entrada" aria-hidden="true"')
    expect(plantilla).not.toMatch(/<(h[1-6]|a|button|input)\b/)
  })

  it('va en una capa, para que no le gane a las utilidades de Tailwind', () => {
    expect(estilos).toContain('@import "./styles/entrada.css" layer(components);')
  })
})

describe('pantalla de entrada: contraste', () => {
  const token = (nombre: string) => {
    const valor = new RegExp(`--c-entrada-${nombre}:\\s*(#[0-9a-f]{6})`, 'i').exec(estilos)?.[1]
    if (!valor) throw new Error(`Falta el token ${nombre}`)
    return valor
  }
  const luminancia = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const v = parseInt(hex.slice(i, i + 2), 16) / 255
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const contraste = (a: string, b: string) => {
    const [claro, oscuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
    return (claro + 0.05) / (oscuro + 0.05)
  }

  // «Nexus» es texto grande y los granos y la silueta son gráficos: 3:1
  it.each([
    ['texto', 4.5],
    ['lema', 4.5],
    ['grano', 3],
    ['musgo', 3],
    ['coral', 3],
  ] as const)('%s sobre fondo cumple %s:1', (nombre, minimo) => {
    expect(contraste(token(nombre), token('fondo'))).toBeGreaterThanOrEqual(minimo)
  })
})
