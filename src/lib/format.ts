import type { Difficulty } from './types'

export const difficultyLabel: Record<Difficulty, string> = {
  facil: 'Fácil',
  media: 'Intermedia',
  avanzada: 'Avanzada',
}

/** Nivel 1–3 para pintar las barritas de dificultad */
export const difficultyLevel: Record<Difficulty, number> = { facil: 1, media: 2, avanzada: 3 }

export const formatMinutes = (min: number) =>
  min < 60 ? `${min} min` : `${Math.floor(min / 60)} h${min % 60 ? ` ${min % 60} min` : ''}`

/** "2026-10-01" → "1 oct 2026", sin desfase de zona horaria */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, d)),
  )
}
