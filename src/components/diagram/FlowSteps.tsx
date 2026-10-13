import { motion } from 'motion/react'
import { GitFork, Zap } from 'lucide-react'
import { getTool } from '../../data/tools'
import { flowSteps } from '../../lib/diagram'
import type { TemplateDiagram } from '../../lib/types'
import { ToolIcon } from '../ui/ToolIcon'

const joinLabels = (labels: string[]) =>
  labels.length === 1 ? `«${labels[0]}»` : `${labels.slice(0, -1).map((l) => `«${l}»`).join(', ')} o «${labels.at(-1)}»`

/**
 * El flujo como lista de pasos numerados, para pantallas angostas.
 * Un SVG con caminos en paralelo tendría que encogerse hasta ser ilegible; aquí el texto mantiene su tamaño.
 */
export function FlowSteps({ diagram }: { diagram: TemplateDiagram }) {
  const byId = new Map(diagram.nodos.map((n) => [n.id, n]))
  const steps = flowSteps(diagram)

  return (
    <ol className="relative space-y-4">
      {/* Raíl que une los pasos */}
      <span aria-hidden className="absolute bottom-5 left-[0.9375rem] top-5 w-px bg-gradient-to-b from-moss via-amber to-nexus opacity-50" />
      {steps.map((step, i) => (
        <motion.li
          key={i}
          className="relative flex gap-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 220, damping: 24, delay: Math.min(i, 6) * 0.05 }}
        >
          <span className="relative z-10 mt-2 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-strong bg-bg font-mono text-xs font-semibold">
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            {step.nodes.length > 1 && (
              <p className="mb-2 flex items-center gap-1.5 text-xs text-ink-soft">
                <GitFork size={13} className="text-nexus" aria-hidden />
                {step.divididoPor ? `«${step.divididoPor}» se divide en ${step.nodes.length} caminos` : `${step.nodes.length} caminos`}
              </p>
            )}
            <ul className="space-y-2">
              {step.nodes.map(({ id, rama, despuesDe }) => {
                const n = byId.get(id)!
                const trigger = n.tipo === 'disparador'
                return (
                  <li
                    key={id}
                    className={`glass flex items-center gap-3 rounded-xl px-3 py-2.5 ${trigger ? 'border-nexus/50' : ''}`}
                  >
                    <ToolIcon id={n.herramienta} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold leading-snug">{n.etiqueta}</span>
                      <span className="block font-mono text-[11px] text-faint">
                        {getTool(n.herramienta)?.nombre}
                        {despuesDe && <span className="font-sans"> · después de {joinLabels(despuesDe)}</span>}
                      </span>
                    </span>
                    {rama && (
                      <span className="shrink-0 rounded-full border border-line-strong bg-bg-deep px-2 py-0.5 text-[11px] font-semibold text-ink-soft">
                        <span className="sr-only">Camino: </span>
                        {rama}
                      </span>
                    )}
                    {trigger && (
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-nexus/15 text-nexus" title="Disparador">
                        <Zap size={12} fill="currentColor" aria-hidden />
                        <span className="sr-only">Disparador</span>
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </motion.li>
      ))}
    </ol>
  )
}
