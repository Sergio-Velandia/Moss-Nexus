export type Theme = 'light' | 'dark'

const KEY = 'nexus-theme'
const listeners = new Set<() => void>()

/** El tema vive en <html data-theme="...">; index.html lo fija antes de pintar. Oscuro por defecto. */
export const getTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0e130e' : '#faf7ef')
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* almacenamiento bloqueado: el tema solo dura la sesión */
  }
  listeners.forEach((l) => l())
}

export function subscribeTheme(callback: () => void) {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}
