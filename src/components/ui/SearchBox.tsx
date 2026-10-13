import { Search, X } from 'lucide-react'
import { useId } from 'react'

/** Buscador accesible. `size="lg"` es el del hero; el resto de páginas usa el normal. */
export function SearchBox({
  value,
  onChange,
  onSubmit,
  placeholder = '¿Qué quieres automatizar?',
  label = 'Buscar plantillas',
  size = 'md',
  action,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit?: () => void
  placeholder?: string
  label?: string
  size?: 'md' | 'lg'
  /** Botón opcional a la derecha (p. ej. "Buscar" en el hero) */
  action?: string
}) {
  const id = useId()
  const lg = size === 'lg'
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.()
      }}
      className={`glass group flex items-center gap-3 transition focus-within:border-nexus focus-within:ring-2 focus-within:ring-nexus/50 focus-within:ring-offset-2 focus-within:ring-offset-bg ${
        lg ? 'rounded-2xl p-2 pl-5' : 'rounded-xl px-4'
      }`}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search size={lg ? 22 : 18} className="shrink-0 text-faint transition group-focus-within:text-nexus" aria-hidden />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        enterKeyHint="search"
        className={`w-full min-w-0 bg-transparent outline-none placeholder:text-faint [&::-webkit-search-cancel-button]:hidden ${
          lg ? 'py-3 text-base sm:text-lg' : 'py-3 text-sm'
        }`}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Borrar búsqueda"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-faint transition hover:bg-surface-2 hover:text-ink"
        >
          <X size={16} aria-hidden />
        </button>
      )}
      {action && (
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-nexus px-4 py-3 text-sm font-semibold text-on-accent transition hover:brightness-110 active:scale-[0.97] sm:px-6"
        >
          {action}
        </button>
      )}
    </form>
  )
}
