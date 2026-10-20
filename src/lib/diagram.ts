import type { TemplateDiagram } from './types'

/**
 * Posiciona los nodos del mapa a partir de diagram.json, sin coordenadas escritas a mano.
 * 1. Cada nodo va a la columna de su camino más largo desde un disparador (así el flujo siempre avanza).
 * 2. Dentro de cada columna, los nodos se ordenan por la posición media de sus padres para cruzar menos líneas.
 * 3. Las conexiones que saltan columnas reservan un carril propio en cada columna intermedia.
 * El resultado se puede dibujar en horizontal (escritorio) o vertical (móvil) intercambiando ejes.
 */

export type Orientation = 'horizontal' | 'vertical'

export interface PlacedNode {
  id: string
  /** Columna (profundidad en el flujo) */
  rank: number
  /** Posición dentro de la columna */
  slot: number
  x: number
  y: number
}

export interface PlacedEdge {
  from: string
  to: string
  label?: string
  path: string
  /** Dónde va la etiqueta de la conexión (punto medio del primer tramo) */
  labelX: number
  labelY: number
}

export interface Layout {
  nodes: PlacedNode[]
  edges: PlacedEdge[]
  width: number
  height: number
  nodeW: number
  nodeH: number
}

export interface LayoutOptions {
  orientation: Orientation
  nodeW?: number
  nodeH?: number
  /** Separación entre columnas (eje del flujo) */
  gapMain?: number
  /** Separación entre nodos de una misma columna */
  gapCross?: number
  padding?: number
}

export function rankNodes({ nodos, conexiones }: TemplateDiagram): Map<string, number> {
  const parents = new Map<string, string[]>(nodos.map((n) => [n.id, []]))
  for (const c of conexiones) parents.get(c.destino)?.push(c.origen)
  const rank = new Map<string, number>()
  const resolve = (id: string): number => {
    const known = rank.get(id)
    if (known !== undefined) return known
    const ps = parents.get(id) ?? []
    const r = ps.length === 0 ? 0 : Math.max(...ps.map(resolve)) + 1
    rank.set(id, r)
    return r
  }
  nodos.forEach((n) => resolve(n.id))
  return rank
}

export function layoutDiagram(diagram: TemplateDiagram, opts: LayoutOptions): Layout {
  const { orientation, nodeW = 200, nodeH = 64, padding = 16 } = opts
  const horizontal = orientation === 'horizontal'
  const gapMain = opts.gapMain ?? (horizontal ? 64 : 44)
  const gapCross = opts.gapCross ?? (horizontal ? 28 : 20)

  const rank = rankNodes(diagram)
  const columns: string[][] = []
  for (const n of diagram.nodos) (columns[rank.get(n.id)!] ??= []).push(n.id)

  // Las conexiones que saltan columnas pasan por «carriles»: puntos invisibles en cada columna intermedia
  // que reservan su propio hueco, para que la línea no quede detrás de otro nodo
  const parents = new Map<string, string[]>(diagram.nodos.map((n) => [n.id, []]))
  const carriles = new Map<number, string[]>() // índice de la conexión → ids de sus carriles, en orden
  diagram.conexiones.forEach((c, i) => {
    const desde = rank.get(c.origen)!
    const hasta = rank.get(c.destino)!
    let anterior = c.origen
    const ids: string[] = []
    for (let r = desde + 1; r < hasta; r++) {
      const id = `carril:${i}:${r}`
      columns[r].push(id)
      parents.set(id, [anterior])
      ids.push(id)
      anterior = id
    }
    parents.get(c.destino)!.push(anterior)
    carriles.set(i, ids)
  })

  // Ordenar cada columna por el slot medio de sus padres (barycenter de una pasada)
  const slot = new Map<string, number>()
  columns.forEach((col, r) => {
    if (r > 0) {
      const weight = (id: string) => {
        const ps = (parents.get(id) ?? []).filter((p) => slot.has(p))
        return ps.length ? ps.reduce((s, p) => s + slot.get(p)!, 0) / ps.length : 0
      }
      col.sort((a, b) => weight(a) - weight(b))
    }
    col.forEach((id, i) => slot.set(id, i - (col.length - 1) / 2)) // centrado alrededor de 0
  })

  // En el eje cruzado, el tamaño de cada nodo depende de la orientación
  const mainSize = horizontal ? nodeW : nodeH
  const crossSize = horizontal ? nodeH : nodeW
  const maxPerCol = Math.max(...columns.map((c) => c.length))
  const crossSpan = maxPerCol * crossSize + (maxPerCol - 1) * gapCross
  const mainSpan = columns.length * mainSize + (columns.length - 1) * gapMain

  const lugar = (r: number, s: number) => {
    const main = padding + r * (mainSize + gapMain)
    const cross = padding + crossSpan / 2 - crossSize / 2 + s * (crossSize + gapCross)
    return { x: horizontal ? main : cross, y: horizontal ? cross : main }
  }

  const nodes: PlacedNode[] = diagram.nodos.map((n) => {
    const r = rank.get(n.id)!
    const s = slot.get(n.id)!
    return { id: n.id, rank: r, slot: s, ...lugar(r, s) }
  })

  // Puntos de salida y de entrada de una caja (nodo real o carril) en la dirección del flujo
  const salida = (p: { x: number; y: number }) =>
    horizontal ? { x: p.x + nodeW, y: p.y + nodeH / 2 } : { x: p.x + nodeW / 2, y: p.y + nodeH }
  const entrada = (p: { x: number; y: number }) =>
    horizontal ? { x: p.x, y: p.y + nodeH / 2 } : { x: p.x + nodeW / 2, y: p.y }
  // Curva de Bézier suave con tangentes en la dirección del flujo, como en el lienzo de n8n
  const curva = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const bend = Math.max(24, (horizontal ? b.x - a.x : b.y - a.y) / 2)
    return horizontal
      ? `C ${a.x + bend} ${a.y}, ${b.x - bend} ${b.y}, ${b.x} ${b.y}`
      : `C ${a.x} ${a.y + bend}, ${b.x} ${b.y - bend}, ${b.x} ${b.y}`
  }

  const pos = new Map(nodes.map((n) => [n.id, n]))
  const edges: PlacedEdge[] = diagram.conexiones.map((c, i) => {
    const cajas = [
      pos.get(c.origen)!,
      ...carriles.get(i)!.map((id) => lugar(Number(id.split(':')[2]), slot.get(id)!)),
      pos.get(c.destino)!,
    ]
    let actual = salida(cajas[0])
    let path = `M ${actual.x} ${actual.y}`
    let labelX = 0
    let labelY = 0
    for (let k = 1; k < cajas.length; k++) {
      const llegada = entrada(cajas[k])
      // La etiqueta va en el primer tramo, cerca de donde sale la rama. Las curvas son simétricas: su punto medio
      // es el promedio de los extremos
      if (k === 1) [labelX, labelY] = [(actual.x + llegada.x) / 2, (actual.y + llegada.y) / 2]
      path += ` ${curva(actual, llegada)}`
      if (k < cajas.length - 1) {
        // Atraviesa el carril en línea recta
        actual = salida(cajas[k])
        path += ` L ${actual.x} ${actual.y}`
      }
    }
    return { from: c.origen, to: c.destino, label: c.etiqueta, path, labelX, labelY }
  })

  const width = padding * 2 + (horizontal ? mainSpan : crossSpan)
  const height = padding * 2 + (horizontal ? crossSpan : mainSpan)
  return { nodes, edges, width, height, nodeW, nodeH }
}

/** Más columnas que esto no caben legibles en horizontal: el mapa se dibuja en vertical también en escritorio */
export const MAX_HORIZONTAL_RANKS = 5

export function preferredOrientation(diagram: TemplateDiagram, wideScreen: boolean): Orientation {
  if (!wideScreen) return 'vertical'
  const columns = Math.max(...rankNodes(diagram).values()) + 1
  return columns > MAX_HORIZONTAL_RANKS ? 'vertical' : 'horizontal'
}

export interface FlowStep {
  /** Nodos que ocurren en este paso; más de uno = el flujo se divide en caminos */
  nodes: {
    id: string
    /** Etiqueta de la conexión que llega al nodo («sí», «no», «alta»…) */
    rama?: string
    /** Etiquetas de los nodos previos, cuando el paso anterior tenía varios caminos */
    despuesDe?: string[]
  }[]
  /** Nodo que divide el flujo en este paso (si todos los caminos salen del mismo) */
  divididoPor?: string
}

/** Pasos del flujo para la vista de lista en pantallas angostas: un paso por columna del mapa */
export function flowSteps(diagram: TemplateDiagram): FlowStep[] {
  const rank = rankNodes(diagram)
  const label = new Map(diagram.nodos.map((n) => [n.id, n.etiqueta]))
  const incoming = (id: string) => diagram.conexiones.filter((c) => c.destino === id)
  const steps: string[][] = []
  for (const id of readingOrder(diagram)) (steps[rank.get(id)!] ??= []).push(id)

  return steps.map((ids, i) => {
    const prev = steps[i - 1] ?? []
    const parentsOf = (id: string) => incoming(id).map((c) => c.origen)
    const allParents = new Set(ids.flatMap(parentsOf))
    return {
      divididoPor: ids.length > 1 && allParents.size === 1 ? label.get([...allParents][0]) : undefined,
      nodes: ids.map((id) => {
        const parents = parentsOf(id)
        return {
          id,
          rama: incoming(id).find((c) => c.etiqueta)?.etiqueta,
          despuesDe: prev.length > 1 && parents.length > 0 ? parents.map((p) => label.get(p)!) : undefined,
        }
      }),
    }
  })
}

/** Orden de lectura para lectores de pantalla: por columnas, de arriba abajo */
export function readingOrder(diagram: TemplateDiagram): string[] {
  const rank = rankNodes(diagram)
  return diagram.nodos
    .map((n, i) => ({ id: n.id, r: rank.get(n.id)!, i }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map((n) => n.id)
}
