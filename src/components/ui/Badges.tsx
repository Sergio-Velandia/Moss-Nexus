import { BadgeCheck, CircleDashed, Clock, FlaskConical } from 'lucide-react'
import { difficultyLabel, difficultyLevel, formatDate, formatMinutes } from '../../lib/format'
import type { Difficulty } from '../../lib/types'

const LEVEL_COLOR = ['', 'var(--c-moss)', 'var(--c-amber)', 'var(--c-nexus)']

export function DifficultyBadge({ value }: { value: Difficulty }) {
  const level = difficultyLevel[value]
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft">
      <span aria-hidden className="flex items-end gap-0.5">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-1 rounded-full"
            style={{ height: 4 + i * 3, background: i <= level ? LEVEL_COLOR[level] : 'var(--c-line-strong)' }}
          />
        ))}
      </span>
      <span>
        <span className="sr-only">Dificultad: </span>
        {difficultyLabel[value]}
      </span>
    </span>
  )
}

export function TimeBadge({ minutes }: { minutes: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-soft">
      <Clock size={13} aria-hidden />
      <span className="sr-only">Tiempo de configuración: </span>
      {formatMinutes(minutes)}
    </span>
  )
}

export function ExampleBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-amber/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber">
      <FlaskConical size={12} aria-hidden />
      Ejemplo
    </span>
  )
}

/** La frase que acompaña a la etiqueta «Sin probar» en la tarjeta y en la ficha */
export const UNTESTED_TEXT = 'Esta plantilla se revisó, pero aún no se probó en una instancia real. Úsala como punto de partida.'

/** Plantilla publicada sin probar todavía en una instancia real de n8n */
export function UntestedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber/50 bg-amber/[0.08] px-2 py-0.5 text-xs font-semibold text-amber">
      <CircleDashed size={13} aria-hidden />
      Sin probar
    </span>
  )
}

export function UntestedNotice() {
  return (
    <p className="flex items-start gap-3 rounded-2xl border border-dashed border-amber/50 bg-amber/[0.06] px-4 py-3 text-sm text-ink-soft">
      <CircleDashed size={18} className="mt-0.5 shrink-0 text-amber" aria-hidden />
      <span>
        <strong className="text-amber">Sin probar.</strong> {UNTESTED_TEXT} Pruébalo antes de usarlo con datos reales.
      </span>
    </p>
  )
}

export function TestedSeal({
  fecha,
  version,
  hora,
  datos,
  nota,
  compact = false,
}: {
  fecha: string
  version: string
  /** HH:mm, opcional */
  hora?: string
  /** Con qué datos se hizo la prueba, opcional */
  datos?: 'ficticios' | 'reales'
  /** Aclaración propia sobre los datos de la prueba; reemplaza el texto por defecto */
  nota?: string
  compact?: boolean
}) {
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-moss">
        <BadgeCheck size={14} aria-hidden />
        Probado
      </span>
    )
  }
  const seal = (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-moss/30 bg-moss/10 py-2 pl-2 pr-4">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-moss/20 text-moss">
        <BadgeCheck size={22} aria-hidden />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold text-moss">Probado</span>
        <span className="block text-xs text-ink-soft">
          {formatDate(fecha)}
          {hora && <>, {hora}</>} · n8n <span className="font-mono">{version}</span>
        </span>
      </span>
    </div>
  )
  if (!datos && !nota) return seal
  return (
    <div className="space-y-2">
      {seal}
      <p className="max-w-md text-xs leading-relaxed text-faint">
        {nota ??
          (datos === 'ficticios'
          ? 'Probado con datos ficticios, creados solo para la prueba: no son datos de personas ni de negocios reales.'
            : 'Probado con datos reales, usados con autorización de su titular.')}
      </p>
    </div>
  )
}
