import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, BadgeCheck, Copy, MessageSquareText } from 'lucide-react'
import type { TemplateDiagram } from '../../lib/types'
import { FlowMap } from '../diagram/FlowMap'
import { ButtonLink } from '../ui/Button'
import { SearchBox } from '../ui/SearchBox'

/** Flujo ilustrativo del hero: el caso que inspiró Nexus. No es una plantilla del catálogo. */
const showcase: TemplateDiagram = {
  nodos: [
    { id: 'wa', etiqueta: 'Mensaje nuevo', herramienta: 'whatsapp', tipo: 'disparador' },
    { id: 'datos', etiqueta: 'Extraer contacto', herramienta: 'n8n', tipo: 'logica' },
    { id: 'sheets', etiqueta: 'Guardar en la hoja', herramienta: 'google-sheets', tipo: 'accion' },
    { id: 'gmail', etiqueta: 'Enviar correo', herramienta: 'gmail', tipo: 'accion' },
  ],
  conexiones: [
    { origen: 'wa', destino: 'datos' },
    { origen: 'datos', destino: 'sheets' },
    { origen: 'datos', destino: 'gmail' },
  ],
}

const spring = { type: 'spring', stiffness: 140, damping: 20 } as const

export function Hero() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const go = () => navigate(`/plantillas${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`)

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden px-4 pb-20 pt-14 sm:pt-20">
      {/* Rejilla de puntos que se desvanece hacia los bordes */}
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="glass mx-auto inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-ink-soft"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-moss opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-moss" />
          </span>
          Plantillas de n8n probadas y explicadas
        </motion.p>

        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.05 }}
          className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-6xl sm:leading-[1.05]"
        >
          Del problema al flujo <span className="text-gradient">en minutos</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.1 }}
          className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-ink-soft"
        >
          Tú sabes qué quieres que pase. Nexus te da el flujo ya armado, te explica cada paso y lo copias a n8n con un clic.
          Sin pelearte con webhooks, JSON ni tokens.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.15 }}
          className="mx-auto mt-9 max-w-2xl"
        >
          <SearchBox size="lg" value={q} onChange={setQ} onSubmit={go} action="Buscar" placeholder="¿Qué quieres automatizar?" />
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <ButtonLink to="/plantillas" variant="ghost" className="px-3">
              Ver todas las plantillas <ArrowRight size={16} aria-hidden />
            </ButtonLink>
            <a href="#como-funciona" className="rounded-lg px-3 py-2 font-medium text-ink-soft transition hover:text-ink">
              Cómo funciona
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.25 }}
        className="relative mx-auto mt-16 max-w-5xl"
      >
        {/* Halo detrás de la ventana */}
        <div aria-hidden className="absolute -inset-x-10 -inset-y-6 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,var(--glow-nexus),transparent)] blur-2xl" />
        <div className="glass overflow-hidden rounded-3xl">
          {/* Barra de ventana */}
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <span aria-hidden className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-nexus/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-moss/70" />
            </span>
            <span className="truncate font-mono text-xs text-faint">nexus / plantillas / whatsapp-a-sheets</span>
          </div>

          {/* La frase de la persona → el flujo */}
          <div className="border-b border-line bg-bg-deep/50 px-4 py-4 sm:px-6">
            <p className="flex items-start gap-3 text-left text-sm sm:text-base">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-moss/15 text-moss">
                <MessageSquareText size={15} aria-hidden />
              </span>
              <span>
                <span className="text-faint">Quiero que </span>
                «cuando me escriban por <mark className="rounded bg-transparent text-ink underline decoration-nexus decoration-2 underline-offset-4">WhatsApp</mark>, se{' '}
                <mark className="rounded bg-transparent text-ink underline decoration-moss decoration-2 underline-offset-4">guarde el contacto</mark> en una hoja y me llegue un{' '}
                <mark className="rounded bg-transparent text-ink underline decoration-amber decoration-2 underline-offset-4">correo</mark>»
              </span>
            </p>
          </div>

          <div className="dot-grid px-3 py-6 sm:px-8 sm:py-10">
            <FlowMap diagram={showcase} title="Ejemplo: de un mensaje de WhatsApp a Google Sheets y Gmail" pulses className="mx-auto max-w-[44rem]" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 sm:px-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-moss">
              <BadgeCheck size={15} aria-hidden /> Probado en n8n
            </span>
            <span aria-hidden className="inline-flex items-center gap-2 rounded-lg bg-nexus px-3 py-1.5 text-xs font-semibold text-on-accent">
              <Copy size={13} /> Copiar flujo
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
