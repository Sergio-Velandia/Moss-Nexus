import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Sprout } from 'lucide-react'
import { site } from '../../data/site'
import { Logo, LogoMark } from './Logo'

const linkCls = 'text-ink-soft transition hover:text-ink'
// Se calcula al cargar el sitio: suficiente para el año del pie de página
const YEAR = new Date().getFullYear()

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-faint">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm">{children}</ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" className="inline-flex rounded-xl" aria-label="Moss Nexus, inicio">
            <Logo />
          </Link>
          <p className="mt-3 max-w-xs text-sm text-ink-soft">
            Flujos de n8n ya armados, explicados y listos para copiar. Parte del ecosistema Moss.
          </p>
        </div>
        <Column title="Explorar">
          <li>
            <Link to="/plantillas" className={linkCls}>Todas las plantillas</Link>
          </li>
          <li>
            <Link to="/acerca" className={linkCls}>Qué es Nexus</Link>
          </li>
          <li>
            <Link to="/propon-un-flujo" className={linkCls}>Propón un flujo</Link>
          </li>
        </Column>
        <Column title="Ecosistema">
          <li>
            <a href={site.mossUrl} className="inline-flex items-center gap-1.5 text-moss transition hover:underline">
              <Sprout size={14} aria-hidden /> Moss, el jardín digital
            </a>
          </li>
          <li>
            <a href={site.repoUrl} className={`inline-flex items-center gap-1 ${linkCls}`} target="_blank" rel="noreferrer">
              Código en GitHub <ArrowUpRight size={14} aria-hidden />
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </li>
        </Column>
        <Column title="Legal">
          <li>
            <Link to="/terminos" className={linkCls}>Términos</Link>
          </li>
          <li>
            <Link to="/privacidad" className={linkCls}>Privacidad</Link>
          </li>
          <li>
            <Link to="/contacto" className={linkCls}>Contacto</Link>
          </li>
          <li>
            <Link to="/terminos#licencia" className={linkCls}>Licencia</Link>
          </li>
        </Column>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <LogoMark size={16} />
            <span>© {YEAR}</span>
            <a href={site.portfolioUrl} className="text-ink-soft underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
              {site.author}
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </p>
          <p>Proyecto independiente, sin relación oficial con n8n GmbH.</p>
        </div>
      </div>
    </footer>
  )
}
