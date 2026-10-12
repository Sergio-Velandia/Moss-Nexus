import { BadgeCheck, Clock, FlaskConical } from 'lucide-react'
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

export function TestedSeal({ fecha, version, compact = false }: { fecha: string; version: string; compact?: boolean }) {
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-moss">
        <BadgeCheck size={14} aria-hidden />
        Probado
      </span>
    )
  }
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-moss/30 bg-moss/10 py-2 pl-2 pr-4">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-moss/20 text-moss">
        <BadgeCheck size={22} aria-hidden />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold text-moss">Probado</span>
        <span className="block text-xs text-ink-soft">
          {formatDate(fecha)} · n8n <span className="font-mono">{version}</span>
        </span>
      </span>
    </div>
  )
}
