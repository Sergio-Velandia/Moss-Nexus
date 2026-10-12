import { useId, useMemo } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Zap } from 'lucide-react'
import { getTool } from '../../data/tools'
import { layoutDiagram, preferredOrientation, readingOrder, type Orientation } from '../../lib/diagram'
import type { TemplateDiagram } from '../../lib/types'
import { useMediaQuery } from '../../lib/useMediaQuery'

const NODE_W = 232
const NODE_H = 68
const MAX_LABEL = 21

const truncate = (s: string) => (s.length > MAX_LABEL ? `${s.slice(0, MAX_LABEL - 1)}…` : s)

/**
 * Mapa del flujo dibujado en SVG a partir de diagram.json.
 * Horizontal desde md, vertical en móvil. `pulses` hace viajar un punto de datos por cada conexión (hero).
 * El SVG es decorativo para lectores de pantalla: debajo va una lista ordenada con el mismo contenido.
 */
export function FlowMap({
  diagram,
  title,
  pulses = false,
  orientation,
  className = '',
}: {
  diagram: TemplateDiagram
  title: string
  pulses?: boolean
  /** Fuerza una orientación; por defecto depende del ancho de pantalla */
  orientation?: Orientation
  className?: string
}) {
  const wide = useMediaQuery('(min-width: 768px)', true)
  const dir: Orientation = orientation ?? preferredOrientation(diagram, wide)
  const reduce = useReducedMotion()
  const uid = useId().replace(/:/g, '')
  const layout = useMemo(
    () => layoutDiagram(diagram, { orientation: dir, nodeW: NODE_W, nodeH: NODE_H }),
    [diagram, dir],
  )
  const nodeById = useMemo(() => new Map(diagram.nodos.map((n) => [n.id, n])), [diagram])
  const rankOf = useMemo(() => new Map(layout.nodes.map((n) => [n.id, n.rank])), [layout])
  const horizontal = dir === 'horizontal'
  const step = 0.18 // segundos entre columnas al revelar

  return (
    <figure className={className}>
      <svg
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        className="mx-auto block h-auto w-full"
        // En flujos largos no se encoge por debajo del 72 %: el contenedor se desplaza en horizontal y el texto sigue legible
        style={{ maxWidth: layout.width, minWidth: horizontal ? Math.round(layout.width * 0.72) : undefined }}
        aria-hidden
        focusable="false"
      >
        <defs>
          <marker id={`arrow-${uid}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--c-nexus)" />
          </marker>
          {/* userSpaceOnUse: con objectBoundingBox, una arista recta (caja de alto o ancho 0) no se pintaría */}
          <linearGradient id={`edge-${uid}`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={horizontal ? layout.width : 0} y2={horizontal ? 0 : layout.height}>
            <stop offset="0%" stopColor="var(--c-moss)" />
            <stop offset="100%" stopColor="var(--c-nexus)" />
          </linearGradient>
        </defs>

        {layout.edges.map((e, i) => {
          const delay = reduce ? 0 : (rankOf.get(e.from)! + 0.6) * step
          return (
            <g key={`${e.from}-${e.to}`}>
              <path d={e.path} fill="none" stroke="var(--c-line-strong)" strokeWidth={6} strokeLinecap="round" opacity={0.35} />
              <motion.path
                id={`p-${uid}-${i}`}
                d={e.path}
                fill="none"
                stroke={`url(#edge-${uid})`}
                strokeWidth={2}
                strokeLinecap="round"
                markerEnd={`url(#arrow-${uid})`}
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay, ease: 'easeOut' }}
              />
              {pulses && !reduce && (
                <circle r={4} fill="var(--c-nexus)" style={{ filter: 'drop-shadow(0 0 6px var(--c-nexus))' }}>
                  <animateMotion dur="2.6s" repeatCount="indefinite" begin={`${1 + i * 0.45}s`} keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                    <mpath href={`#p-${uid}-${i}`} />
                  </animateMotion>
                  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="2.6s" repeatCount="indefinite" begin={`${1 + i * 0.45}s`} />
                </circle>
              )}
            </g>
          )
        })}

        {layout.edges
          .filter((e) => e.label)
          .map((e) => {
            const a = layout.nodes.find((n) => n.id === e.from)!
            const b = layout.nodes.find((n) => n.id === e.to)!
            // Las curvas son simétricas: su punto medio es el promedio de los extremos
            const mx = horizontal ? (a.x + NODE_W + b.x) / 2 : (a.x + b.x) / 2 + NODE_W / 2
            const my = horizontal ? (a.y + b.y) / 2 + NODE_H / 2 : (a.y + NODE_H + b.y) / 2
            const w = e.label!.length * 7 + 16
            return (
              <g key={`l-${e.from}-${e.to}`} transform={`translate(${mx - w / 2} ${my - 10})`}>
                <rect width={w} height={20} rx={10} fill="var(--c-bg-deep)" stroke="var(--c-line-strong)" />
                <text x={w / 2} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--c-ink-soft)">
                  {e.label}
                </text>
              </g>
            )
          })}

        {layout.nodes.map((p) => {
          const n = nodeById.get(p.id)!
          const tool = getTool(n.herramienta)!
          const Icon = tool.icon
          const trigger = n.tipo === 'disparador'
          return (
            <motion.g
              key={p.id}
              initial={reduce ? false : { opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 220, damping: 20, delay: reduce ? 0 : p.rank * step }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
              <g transform={`translate(${p.x} ${p.y})`}>
                <title>{n.etiqueta}</title>
                <rect
                  width={NODE_W}
                  height={NODE_H}
                  rx={trigger ? 22 : 14}
                  fill="var(--c-surface)"
                  stroke={trigger ? 'var(--c-nexus)' : 'var(--c-line-strong)'}
                  strokeOpacity={trigger ? 0.55 : 1}
                />
                <rect x={12} y={(NODE_H - 40) / 2} width={40} height={40} rx={11} fill={tool.color} fillOpacity={0.16} />
                <Icon x={22} y={(NODE_H - 20) / 2} size={20} color={tool.color} strokeWidth={2.1} />
                <text x={64} y={NODE_H / 2 - 3} fontSize={13.5} fontWeight={600} fill="var(--c-ink)">
                  {truncate(n.etiqueta)}
                </text>
                <text x={64} y={NODE_H / 2 + 15} fontSize={11} fill="var(--c-faint)" fontFamily="var(--font-mono)">
                  {tool.nombre}
                </text>
                {/* Manijas de conexión, como en el lienzo de n8n */}
                {!trigger && (
                  <circle cx={horizontal ? 0 : NODE_W / 2} cy={horizontal ? NODE_H / 2 : 0} r={4} fill="var(--c-bg)" stroke="var(--c-line-strong)" strokeWidth={1.5} />
                )}
                <circle cx={horizontal ? NODE_W : NODE_W / 2} cy={horizontal ? NODE_H / 2 : NODE_H} r={4} fill="var(--c-bg)" stroke="var(--c-nexus)" strokeWidth={1.5} />
                {/* El rayo va en el lado de entrada: un disparador no recibe conexiones y así no tapa la etiqueta */}
                {trigger && (
                  <g transform={horizontal ? `translate(-9 ${NODE_H / 2 - 9})` : `translate(${NODE_W / 2 - 9} -9)`}>
                    <circle cx={9} cy={9} r={9} fill="var(--c-surface)" stroke="var(--c-nexus)" strokeOpacity={0.55} />
                    <circle cx={9} cy={9} r={9} fill="var(--c-nexus)" fillOpacity={0.16} />
                    <Zap x={3} y={3} size={12} color="var(--c-nexus)" fill="var(--c-nexus)" />
                  </g>
                )}
                {pulses && trigger && !reduce && (
                  <rect width={NODE_W} height={NODE_H} rx={22} fill="none" stroke="var(--c-nexus)" className="pulse-ring" />
                )}
              </g>
            </motion.g>
          )
        })}
      </svg>
      <figcaption className="sr-only">
        {title}. Pasos del flujo:
        <ol>
          {readingOrder(diagram).map((id) => {
            const n = nodeById.get(id)!
            const next = diagram.conexiones
              .filter((c) => c.origen === id)
              .map((c) => `${nodeById.get(c.destino)!.etiqueta}${c.etiqueta ? ` (si ${c.etiqueta})` : ''}`)
            return (
              <li key={id}>
                {n.etiqueta} ({getTool(n.herramienta)?.nombre}){next.length ? `, continúa en: ${next.join(', ')}` : ''}
              </li>
            )
          })}
        </ol>
      </figcaption>
    </figure>
  )
}
