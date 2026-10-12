import { ArrowRight, Home } from 'lucide-react'
import { ButtonLink } from '../components/ui/Button'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Página no encontrada')
  return (
    <div className="mx-auto max-w-2xl px-4 pt-16 text-center sm:pt-24">
      {/* Un flujo con la conexión rota */}
      <svg viewBox="0 0 320 90" className="mx-auto h-auto w-full max-w-sm" aria-hidden>
        <rect x="4" y="22" width="96" height="46" rx="14" fill="var(--c-surface)" stroke="var(--c-line-strong)" />
        <rect x="16" y="34" width="22" height="22" rx="7" fill="var(--c-moss)" opacity="0.35" />
        <rect x="46" y="38" width="42" height="5" rx="2.5" fill="var(--c-line-strong)" />
        <rect x="46" y="48" width="28" height="4" rx="2" fill="var(--c-line)" />
        <path d="M100 45 C 120 45, 124 45, 138 45" stroke="var(--c-moss)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M144 40 l 8 10 M 152 40 l -8 10" stroke="var(--c-nexus)" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M160 45 C 176 45, 180 45, 216 45" stroke="var(--c-nexus)" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="3 6" />
        <rect x="216" y="22" width="96" height="46" rx="14" fill="none" stroke="var(--c-nexus)" strokeDasharray="5 5" />
        <text x="264" y="50" textAnchor="middle" fontSize="13" fontFamily="var(--font-mono)" fill="var(--c-nexus)">404</text>
      </svg>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-nexus">Error 404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Este nodo no tiene conexión</h1>
      <p className="mx-auto mt-3 max-w-md text-ink-soft">
        La página que buscas no existe o cambió de dirección. Las plantillas, en cambio, siguen donde siempre.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink to="/plantillas">
          Ver plantillas <ArrowRight size={16} aria-hidden />
        </ButtonLink>
        <ButtonLink to="/" variant="secondary">
          <Home size={16} aria-hidden /> Ir al inicio
        </ButtonLink>
      </div>
    </div>
  )
}
