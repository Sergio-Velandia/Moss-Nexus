import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { SlidersHorizontal, X } from 'lucide-react'
import { categories } from '../data/categories'
import { getTool, tools } from '../data/tools'
import { EmptyState } from '../components/templates/EmptyState'
import { TemplateCard } from '../components/templates/TemplateCard'
import { ToolIcon } from '../components/ui/ToolIcon'
import { SearchBox } from '../components/ui/SearchBox'
import { difficultyLabel } from '../lib/format'
import { filterTemplates, filtersFromParams, isFiltering, paramsFromFilters, type Filters } from '../lib/search'
import { templates, toolUsage } from '../lib/templates'
import type { Difficulty } from '../lib/types'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const chipBase =
  'inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition active:scale-[0.97]'
const chipOn = 'border-nexus/60 bg-nexus/12 text-ink'
const chipOff = 'border-line bg-surface/60 text-ink-soft hover:border-line-strong hover:text-ink'

export default function Templates() {
  useDocumentTitle('Plantillas')
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => filtersFromParams(params), [params])
  // El texto se escribe en local y se lleva a la URL sin crear una entrada de historial por tecla
  const [q, setQ] = useState(filters.q)
  // Si la URL cambia desde fuera (Atrás, un enlace), el campo se pone al día durante el render
  const [urlQ, setUrlQ] = useState(filters.q)
  if (urlQ !== filters.q) {
    setUrlQ(filters.q)
    setQ(filters.q)
  }

  const update = (next: Partial<Filters>, replace = false) =>
    setParams(paramsFromFilters({ ...filters, ...next }), { replace, preventScrollReset: true })

  const onQuery = (value: string) => {
    setQ(value)
    update({ q: value }, true)
  }

  const results = useMemo(() => filterTemplates(templates, filters), [filters])
  const usage = useMemo(() => toolUsage(), [])
  // Primero las herramientas que tienen plantillas; las elegidas siempre visibles
  const toolChips = tools.filter((t) => usage.has(t.id) || filters.herramientas.includes(t.id))

  const toggleTool = (id: string) =>
    update({
      herramientas: filters.herramientas.includes(id)
        ? filters.herramientas.filter((h) => h !== id)
        : [...filters.herramientas, id],
    })

  const reset = () => {
    setQ('')
    setParams(new URLSearchParams(), { preventScrollReset: true })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:pt-14">
      <header className="max-w-2xl">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-nexus">Galería</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Plantillas</h1>
        <p className="mt-3 text-ink-soft">
          {templates.length} {templates.length === 1 ? 'flujo listo' : 'flujos listos'} para copiar a n8n. Busca por lo que quieres
          lograr o filtra por la herramienta que ya usas.
        </p>
      </header>

      <div className="mt-8">
        <SearchBox value={q} onChange={onQuery} placeholder="Busca: WhatsApp, reporte, correo…" />
      </div>

      <div className="mt-6 space-y-4">
        <fieldset>
          <legend className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
            <SlidersHorizontal size={13} aria-hidden /> Herramientas
          </legend>
          <div className="flex flex-wrap gap-2">
            {toolChips.map((t) => {
              const on = filters.herramientas.includes(t.id)
              return (
                <button key={t.id} type="button" aria-pressed={on} onClick={() => toggleTool(t.id)} className={`${chipBase} pl-1.5 ${on ? chipOn : chipOff}`}>
                  <ToolIcon id={t.id} size="sm" />
                  {t.nombre}
                  <span className="font-mono text-[11px] text-faint">{usage.get(t.id) ?? 0}</span>
                </button>
              )
            })}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <fieldset>
            <legend className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-faint">Categoría</legend>
            <div className="flex flex-wrap gap-2">
              <button type="button" aria-pressed={!filters.categoria} onClick={() => update({ categoria: null })} className={`${chipBase} ${!filters.categoria ? chipOn : chipOff}`}>
                Todas
              </button>
              {categories.map((c) => {
                const on = filters.categoria === c.id
                return (
                  <button key={c.id} type="button" aria-pressed={on} onClick={() => update({ categoria: on ? null : c.id })} className={`${chipBase} ${on ? chipOn : chipOff}`}>
                    {c.nombre}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-faint">Dificultad</legend>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(difficultyLabel) as Difficulty[]).map((d) => {
                const on = filters.dificultad === d
                return (
                  <button key={d} type="button" aria-pressed={on} onClick={() => update({ dificultad: on ? null : d })} className={`${chipBase} ${on ? chipOn : chipOff}`}>
                    {difficultyLabel[d]}
                  </button>
                )
              })}
            </div>
          </fieldset>
        </div>
      </div>

      <div className="mt-8 flex min-h-10 flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <p role="status" aria-live="polite" className="text-sm text-ink-soft">
          <span className="font-semibold text-ink">{results.length}</span> {results.length === 1 ? 'resultado' : 'resultados'}
          {filters.herramientas.length > 0 && (
            <span> con {filters.herramientas.map((h) => getTool(h)?.nombre ?? h).join(' + ')}</span>
          )}
        </p>
        {isFiltering(filters) && (
          <button type="button" onClick={reset} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-ink-soft transition hover:text-nexus">
            <X size={15} aria-hidden /> Quitar filtros
          </button>
        )}
      </div>

      <div className="mt-5">
        {results.length === 0 ? (
          <EmptyState query={filters.q} onReset={reset} />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((t) => (
                <motion.li
                  key={t.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                >
                  <TemplateCard template={t} headingLevel={2} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  )
}
