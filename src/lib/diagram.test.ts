import { describe, expect, it } from 'vitest'
import { flowSteps, layoutDiagram, MAX_HORIZONTAL_RANKS, preferredOrientation, rankNodes, readingOrder } from './diagram'
import type { TemplateDiagram } from './types'

const node = (id: string) => ({ id, etiqueta: id, herramienta: 'n8n', tipo: 'accion' as const })

// a → b → d,  a → c → d,  b → e
const diamond: TemplateDiagram = {
  nodos: ['a', 'b', 'c', 'd', 'e'].map(node),
  conexiones: [
    { origen: 'a', destino: 'b' },
    { origen: 'a', destino: 'c' },
    { origen: 'b', destino: 'd' },
    { origen: 'c', destino: 'd' },
    { origen: 'b', destino: 'e' },
  ],
}

describe('rankNodes', () => {
  it('usa el camino más largo desde el disparador', () => {
    const r = rankNodes(diamond)
    expect(Object.fromEntries(r)).toEqual({ a: 0, b: 1, c: 1, d: 2, e: 2 })
  })
  it('un nodo suelto queda en la columna 0', () => {
    expect(rankNodes({ nodos: [node('solo')], conexiones: [] }).get('solo')).toBe(0)
  })
})

describe('layoutDiagram', () => {
  it('horizontal: las columnas avanzan en x y ningún nodo se superpone', () => {
    const l = layoutDiagram(diamond, { orientation: 'horizontal' })
    const pos = Object.fromEntries(l.nodes.map((n) => [n.id, n]))
    expect(pos.a.x).toBeLessThan(pos.b.x)
    expect(pos.b.x).toBeLessThan(pos.d.x)
    expect(pos.b.x).toBe(pos.c.x)
    for (const p of l.nodes) {
      for (const q of l.nodes) {
        if (p === q) continue
        const overlap = Math.abs(p.x - q.x) < l.nodeW && Math.abs(p.y - q.y) < l.nodeH
        expect(overlap, `${p.id}/${q.id}`).toBe(false)
      }
    }
  })
  it('vertical: las columnas avanzan en y', () => {
    const l = layoutDiagram(diamond, { orientation: 'vertical' })
    const pos = Object.fromEntries(l.nodes.map((n) => [n.id, n]))
    expect(pos.a.y).toBeLessThan(pos.b.y)
    expect(pos.b.y).toBe(pos.c.y)
  })
  it('todos los nodos caben dentro del lienzo', () => {
    for (const orientation of ['horizontal', 'vertical'] as const) {
      const l = layoutDiagram(diamond, { orientation })
      for (const n of l.nodes) {
        expect(n.x).toBeGreaterThanOrEqual(0)
        expect(n.y).toBeGreaterThanOrEqual(0)
        expect(n.x + l.nodeW).toBeLessThanOrEqual(l.width)
        expect(n.y + l.nodeH).toBeLessThanOrEqual(l.height)
      }
    }
  })
  it('genera una curva por conexión', () => {
    const l = layoutDiagram(diamond, { orientation: 'horizontal' })
    expect(l.edges).toHaveLength(5)
    expect(l.edges[0].path).toMatch(/^M [\d.]+ [\d.]+ C /)
  })
})

describe('readingOrder', () => {
  it('lee por columnas', () => {
    expect(readingOrder(diamond)).toEqual(['a', 'b', 'c', 'd', 'e'])
  })
})

describe('preferredOrientation', () => {
  const chain = (n: number): TemplateDiagram => ({
    nodos: Array.from({ length: n }, (_, i) => node(`n${i}`)),
    conexiones: Array.from({ length: n - 1 }, (_, i) => ({ origen: `n${i}`, destino: `n${i + 1}` })),
  })
  it('en pantallas angostas siempre es vertical', () => {
    expect(preferredOrientation(chain(2), false)).toBe('vertical')
  })
  it('en escritorio es horizontal hasta el límite de columnas', () => {
    expect(preferredOrientation(chain(MAX_HORIZONTAL_RANKS), true)).toBe('horizontal')
  })
  it('los flujos más largos pasan a vertical también en escritorio', () => {
    expect(preferredOrientation(chain(MAX_HORIZONTAL_RANKS + 1), true)).toBe('vertical')
  })
})

describe('flowSteps', () => {
  // a → (sí) b, a → (no) c, b → d
  const branch: TemplateDiagram = {
    nodos: ['a', 'b', 'c', 'd'].map(node),
    conexiones: [
      { origen: 'a', destino: 'b', etiqueta: 'sí' },
      { origen: 'a', destino: 'c', etiqueta: 'no' },
      { origen: 'b', destino: 'd' },
    ],
  }
  it('agrupa por pasos y marca el nodo que divide el flujo', () => {
    const steps = flowSteps(branch)
    expect(steps.map((s) => s.nodes.map((n) => n.id))).toEqual([['a'], ['b', 'c'], ['d']])
    expect(steps[1].divididoPor).toBe('a')
  })
  it('lleva la etiqueta de cada rama', () => {
    expect(flowSteps(branch)[1].nodes.map((n) => n.rama)).toEqual(['sí', 'no'])
  })
  it('después de varios caminos, dice de cuál viene cada nodo', () => {
    expect(flowSteps(branch)[2].nodes[0].despuesDe).toEqual(['b'])
  })
  it('en un flujo lineal no agrega anotaciones', () => {
    const steps = flowSteps({ nodos: ['x', 'y'].map(node), conexiones: [{ origen: 'x', destino: 'y' }] })
    expect(steps.flatMap((s) => s.nodes).every((n) => !n.rama && !n.despuesDe)).toBe(true)
  })
})

describe('carriles para conexiones que saltan columnas', () => {
  // a → b → c  y  a → c (salta la columna de b)
  const salto: TemplateDiagram = {
    nodos: ['a', 'b', 'c'].map(node),
    conexiones: [
      { origen: 'a', destino: 'b' },
      { origen: 'b', destino: 'c' },
      { origen: 'a', destino: 'c', etiqueta: 'directo' },
    ],
  }
  for (const orientation of ['horizontal', 'vertical'] as const) {
    it(`${orientation}: la conexión larga no atraviesa el nodo intermedio`, () => {
      const l = layoutDiagram(salto, { orientation })
      const b = l.nodes.find((n) => n.id === 'b')!
      const larga = l.edges.find((e) => e.from === 'a' && e.to === 'c')!
      // Todos los puntos de la línea (extremos de cada tramo) quedan fuera de la caja de b
      const puntos = [...larga.path.matchAll(/(?:[ML]|, )\s*(-?[\d.]+) (-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])])
      expect(puntos.length).toBeGreaterThan(2)
      for (const [x, y] of puntos) {
        const dentro = x > b.x && x < b.x + l.nodeW && y > b.y && y < b.y + l.nodeH
        expect(dentro, `(${x}, ${y}) cae dentro de b`).toBe(false)
      }
    })
  }
  it('los carriles no se dibujan como nodos y la etiqueta queda en el primer tramo', () => {
    const l = layoutDiagram(salto, { orientation: 'vertical' })
    expect(l.nodes.map((n) => n.id)).toEqual(['a', 'b', 'c'])
    const a = l.nodes.find((n) => n.id === 'a')!
    const larga = l.edges.find((e) => e.label === 'directo')!
    expect(larga.labelY).toBeGreaterThan(a.y + l.nodeH)
    expect(larga.labelY).toBeLessThan(l.nodes.find((n) => n.id === 'b')!.y + l.nodeH)
  })
})
