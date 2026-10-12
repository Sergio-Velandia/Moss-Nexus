import { SearchX } from 'lucide-react'

/** Sin resultados: un nodo desconectado y caminos para salir */
export function EmptyState({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <div className="glass dot-grid relative overflow-hidden rounded-3xl px-6 py-14 text-center">
      <svg viewBox="0 0 220 60" className="mx-auto h-14 w-auto" aria-hidden>
        <rect x="2" y="12" width="60" height="36" rx="10" fill="var(--c-surface)" stroke="var(--c-line-strong)" />
        <path d="M62 30 C 82 30, 86 30, 100 30" stroke="var(--c-moss)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M120 30 C 134 30, 138 30, 158 30" stroke="var(--c-nexus)" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="3 5" />
        <circle cx="110" cy="30" r="3" fill="var(--c-faint)" />
        <rect x="158" y="12" width="60" height="36" rx="10" fill="none" stroke="var(--c-nexus)" strokeDasharray="4 4" />
      </svg>
      <div className="mx-auto mt-5 grid h-11 w-11 place-items-center rounded-xl bg-nexus/10 text-nexus">
        <SearchX size={20} aria-hidden />
      </div>
      <h2 className="mt-4 text-xl font-semibold">No hay resultados</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
        {query ? (
          <>
            Ninguna plantilla coincide con <strong className="text-ink">«{query}»</strong> y los filtros elegidos. Prueba con
            otras palabras, como el nombre de una herramienta.
          </>
        ) : (
          'Ninguna plantilla coincide con estos filtros todavía. La librería crece poco a poco.'
        )}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex min-h-11 items-center rounded-xl border border-line-strong px-5 text-sm font-semibold transition hover:border-nexus/50 hover:text-nexus"
      >
        Quitar filtros
      </button>
    </div>
  )
}
