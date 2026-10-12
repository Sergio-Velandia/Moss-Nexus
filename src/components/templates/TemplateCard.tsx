import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCategory } from '../../data/categories'
import type { Template } from '../../lib/types'
import { DifficultyBadge, ExampleBadge, TestedSeal, TimeBadge } from '../ui/Badges'
import { ToolStack } from '../ui/ToolIcon'

/** Tarjeta de la galería. Toda la tarjeta es un enlace; el brillo sigue al puntero (solo con ratón). */
export function TemplateCard({ template: t, headingLevel = 3 }: { template: Template; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as const
  return (
    <Link
      to={`/plantillas/${t.slug}`}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
      }}
      className="glass group relative flex h-full flex-col overflow-hidden rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-nexus/40 focus-visible:-translate-y-1"
    >
      {/* Brillo que sigue al puntero */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(22rem circle at var(--mx, 50%) var(--my, 0%), color-mix(in oklab, var(--c-nexus) 12%, transparent), transparent 60%)' }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <ToolStack ids={t.herramientas} />
        <ArrowUpRight
          size={18}
          aria-hidden
          className="shrink-0 text-faint transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-nexus"
        />
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-faint">{getCategory(t.categoria)?.nombre}</span>
        {t.ejemplo && <ExampleBadge />}
      </div>
      <H className="relative mt-1.5 text-[17px] font-semibold leading-snug text-balance">{t.titulo}</H>
      <p className="relative mb-5 mt-2 line-clamp-2 text-sm text-ink-soft">{t.resumen}</p>

      <div className="relative mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4">
        <DifficultyBadge value={t.dificultad} />
        <TimeBadge minutes={t.tiempoEstimado} />
        <span className="ml-auto">
          <TestedSeal fecha={t.probado.fecha} version={t.probado.versionN8n} compact />
        </span>
      </div>
    </Link>
  )
}

export function TemplateCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5" aria-hidden>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-7 w-7 rounded-lg" />
        ))}
      </div>
      <div className="skeleton mt-5 h-3 w-24 rounded" />
      <div className="skeleton mt-3 h-5 w-4/5 rounded" />
      <div className="skeleton mt-2 h-4 w-full rounded" />
      <div className="skeleton mt-1.5 h-4 w-2/3 rounded" />
      <div className="mt-6 flex gap-4 border-t border-line pt-4">
        <div className="skeleton h-4 w-20 rounded" />
        <div className="skeleton h-4 w-14 rounded" />
      </div>
    </div>
  )
}

export function GallerySkeleton({ count = 6 }: { count?: number }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Cargando plantillas…</span>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <TemplateCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
