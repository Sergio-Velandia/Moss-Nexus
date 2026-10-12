import { useSyncExternalStore } from 'react'
import { Moon, Sun } from 'lucide-react'
import { getTheme, setTheme, subscribeTheme } from '../../lib/theme'

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => 'dark' as const)
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={next === 'dark' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'}
      title={next === 'dark' ? 'Tema oscuro' : 'Tema claro'}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink-soft transition hover:bg-surface-2 hover:text-ink active:scale-95"
    >
      {theme === 'dark' ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
    </button>
  )
}
