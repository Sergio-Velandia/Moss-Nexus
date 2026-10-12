import { ArrowRight, BookOpen, Sprout, Workflow } from 'lucide-react'
import { site } from '../../data/site'
import { ButtonLink } from '../ui/Button'
import { Reveal } from '../ui/Reveal'

/** Moss + Nexus: aprender y aplicar. Cierra el Inicio con la llamada final. */
export function Ecosystem() {
  return (
    <section aria-labelledby="ecosistema-title" className="mx-auto max-w-6xl px-4 py-20">
      <Reveal className="glass relative overflow-hidden rounded-[2rem] px-6 py-12 sm:px-12 sm:py-16">
        <div aria-hidden className="dot-grid absolute inset-0 [mask-image:linear-gradient(to_left,black,transparent_70%)]" />
        <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-nexus/15 blur-3xl" />
        <div aria-hidden className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-moss/15 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-moss">Ecosistema Moss</p>
            <h2 id="ecosistema-title" className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Aprende en Moss. <span className="text-gradient">Automatiza en Nexus.</span>
            </h2>
            <p className="mt-4 max-w-lg text-ink-soft">
              Moss es el jardín digital donde se documenta el porqué: guías de n8n, webhooks, APIs y errores reales. Nexus es
              donde ese conocimiento se convierte en flujos que copias y usas hoy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/plantillas">
                Explorar plantillas <ArrowRight size={16} aria-hidden />
              </ButtonLink>
              <a
                href={site.mossUrl}
                className="glass inline-flex min-h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-moss transition hover:-translate-y-0.5"
              >
                <Sprout size={16} aria-hidden /> Ir a Moss
              </a>
            </div>
          </div>

          {/* Dos nodos del ecosistema conectados */}
          <div aria-hidden className="relative mx-auto flex w-full max-w-sm flex-col items-stretch gap-0">
            <div className="glass flex items-center gap-4 rounded-2xl p-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-moss/15 text-moss">
                <BookOpen size={22} />
              </span>
              <span>
                <span className="block font-semibold">Moss</span>
                <span className="block text-sm text-ink-soft">Guías, manual y bitácora</span>
              </span>
            </div>
            <svg viewBox="0 0 40 56" className="mx-auto h-14 w-10">
              <path d="M20 0 V 56" stroke="url(#eco-grad)" strokeWidth="2" strokeDasharray="4 5" className="[animation:dash_1.2s_linear_infinite]" />
              <defs>
                <linearGradient id="eco-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="56">
                  <stop offset="0" stopColor="var(--c-moss)" />
                  <stop offset="1" stopColor="var(--c-nexus)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="glass flex items-center gap-4 rounded-2xl border-nexus/40 p-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-nexus/15 text-nexus">
                <Workflow size={22} />
              </span>
              <span>
                <span className="block font-semibold">Nexus</span>
                <span className="block text-sm text-ink-soft">Flujos listos para copiar</span>
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
