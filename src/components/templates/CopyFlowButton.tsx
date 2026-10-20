import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Copy, Download, LoaderCircle, TriangleAlert } from 'lucide-react'
import { copyText, downloadJson } from '../../lib/clipboard'
import type { Template } from '../../lib/types'

type State = 'idle' | 'loading' | 'copied' | 'error'

const LABEL: Record<Exclude<State, 'idle'>, string> = {
  loading: 'Preparando…',
  copied: '¡Copiado!',
  error: 'No se pudo copiar',
}

/**
 * El botón maestro: copia el JSON de n8n listo para pegar en el lienzo.
 * Con `load`, `label` y `fileName` copia otro JSON de la plantilla (por ejemplo, su flujo de prueba).
 */
export function CopyFlowButton({
  template,
  size = 'lg',
  load = template.loadWorkflow,
  label = 'Copiar flujo',
  fileName = `${template.slug}.json`,
  variant = 'primary',
}: {
  template: Template
  size?: 'md' | 'lg'
  load?: () => Promise<unknown>
  label?: string
  fileName?: string
  /** secondary: para JSON de apoyo, que no compita con el botón principal */
  variant?: 'primary' | 'secondary'
}) {
  const [state, setState] = useState<State>('idle')
  const [json, setJson] = useState<string | null>(null)
  const timer = useRef<number>(undefined)

  // El workflow se descarga en cuanto se abre el detalle: al pulsar, la copia es instantánea
  useEffect(() => {
    let alive = true
    load().then((wf) => alive && setJson(JSON.stringify(wf, null, 2)))
    return () => {
      alive = false
      window.clearTimeout(timer.current)
    }
  }, [load])

  const copy = async () => {
    setState('loading')
    const text = json ?? JSON.stringify(await load(), null, 2)
    const ok = await copyText(text)
    setState(ok ? 'copied' : 'error')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), ok ? 2200 : 4000)
  }

  const Icon = { idle: Copy, loading: LoaderCircle, copied: Check, error: TriangleAlert }[state]
  const lg = size === 'lg'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={copy}
        disabled={state === 'loading'}
        className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-semibold transition active:scale-[0.97] disabled:cursor-progress ${
          lg ? 'min-h-13 px-7 text-base' : 'min-h-11 px-5 text-sm'
        } ${
          state === 'copied'
            ? 'bg-moss text-on-accent'
            : state === 'error'
              ? 'bg-amber text-on-accent'
              : variant === 'secondary'
                ? 'border border-line-strong text-ink hover:border-nexus/50'
                : 'bg-nexus text-on-accent shadow-[0_10px_34px_-10px_var(--c-nexus)] hover:brightness-110'
        }`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={state}
            initial={{ y: 14, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="inline-flex items-center gap-2"
          >
            <Icon size={lg ? 20 : 17} aria-hidden className={state === 'loading' ? 'animate-spin' : ''} />
            {state === 'idle' ? label : LABEL[state]}
          </motion.span>
        </AnimatePresence>
      </button>
      {json && (
        <button
          type="button"
          onClick={() => downloadJson(fileName, json)}
          className={`inline-flex items-center gap-2 rounded-xl px-4 font-medium text-ink-soft transition hover:bg-surface-2 hover:text-ink ${
            lg ? 'min-h-13 text-sm' : 'min-h-11 text-sm'
          }`}
        >
          <Download size={16} aria-hidden />
          Descargar .json
        </button>
      )}
      {/* Anuncio para lectores de pantalla */}
      <span className="sr-only" role="status" aria-live="polite">
        {state === 'copied' ? 'Flujo copiado al portapapeles. Pégalo en el lienzo de n8n.' : state === 'error' ? 'No se pudo copiar. Usa Descargar .json.' : ''}
      </span>
    </div>
  )
}
