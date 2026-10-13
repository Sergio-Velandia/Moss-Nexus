import { useEffect, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { formatDate } from '../../lib/format'
import { useDocumentTitle } from '../../lib/useDocumentTitle'

export interface LegalSection {
  id: string
  title: string
  content: ReactNode
}

/**
 * Estructura común de Términos, Privacidad y Contacto: h1 único, fecha de actualización,
 * índice corto cuando la página es larga y botón de volver.
 */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string
  /** AAAA-MM-DD */
  updated: string
  intro: ReactNode
  sections: LegalSection[]
}) {
  useDocumentTitle(title)
  const navigate = useNavigate()
  const { hash } = useLocation()

  // La página carga de forma diferida: al llegar con un ancla (p. ej. /terminos#licencia), bajamos a ella al montar
  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
  }, [hash])
  // React Router guarda la posición en el historial: si se llegó desde otra página del sitio, volvemos a ella
  const back = () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (idx > 0) navigate(-1)
    else navigate('/')
  }

  return (
    <article className="mx-auto max-w-3xl px-4 pt-8 sm:pt-12">
      <button
        type="button"
        onClick={back}
        className="group inline-flex min-h-10 items-center gap-1.5 rounded-lg text-sm font-medium text-ink-soft transition hover:text-ink"
      >
        <ArrowLeft size={16} aria-hidden className="transition group-hover:-translate-x-0.5" />
        Volver
      </button>

      <header className="mt-6">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-nexus">Legal</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-faint">
          Última actualización: <time dateTime={updated}>{formatDate(updated)}</time>
        </p>
        <div className="mt-6 space-y-4 text-pretty leading-relaxed text-ink-soft">{intro}</div>
      </header>

      {sections.length >= 4 && (
        <nav aria-label="En esta página" className="glass mt-8 rounded-2xl p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">En esta página</p>
          <ol className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="flex gap-2 rounded-lg px-2 py-1.5 text-ink-soft transition hover:bg-surface-2 hover:text-ink">
                  <span className="font-mono text-faint">{i + 1}.</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="mt-10 space-y-10">
        {sections.map((s) => (
          <section key={s.id} aria-labelledby={s.id}>
            <h2 id={s.id} className="scroll-mt-28 text-xl font-semibold tracking-tight">
              {s.title}
            </h2>
            <div className="mt-3 space-y-3 text-pretty leading-relaxed text-ink-soft [&_a]:text-nexus [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
              {s.content}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-14 border-t border-line pt-6 text-xs text-faint">
        Estos textos son una base informativa para un proyecto personal y gratuito, y no constituyen asesoría jurídica.
      </p>
    </article>
  )
}
