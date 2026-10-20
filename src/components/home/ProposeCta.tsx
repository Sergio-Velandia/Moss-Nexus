import { ArrowRight, Lightbulb, MessageSquare } from 'lucide-react'
import { ButtonLink } from '../ui/Button'
import { Reveal } from '../ui/Reveal'

/** Invitación a proponer un flujo cuando la librería no tiene lo que la persona necesita */
export function ProposeCta() {
  return (
    <section aria-labelledby="propon-title" className="mx-auto max-w-6xl px-4 pt-20">
      <Reveal className="glass dot-grid relative grid gap-8 overflow-hidden rounded-[2rem] px-6 py-10 sm:px-12 md:grid-cols-[1.4fr_1fr] md:items-center">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-nexus">Trabajemos juntos</p>
          <h2 id="propon-title" className="mt-3 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            ¿No está el flujo que necesitas? Proponlo.
          </h2>
          <p className="mt-3 max-w-lg text-ink-soft">
            Cuéntame tu negocio, el problema y tu idea. Puede convertirse en un flujo para ti o en la próxima plantilla de la
            librería.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          <ButtonLink to="/propon-un-flujo">
            <Lightbulb size={16} aria-hidden /> Proponer un flujo <ArrowRight size={16} aria-hidden />
          </ButtonLink>
          <ButtonLink to="/propon-un-flujo?formulario=habla-conmigo" variant="secondary">
            <MessageSquare size={16} aria-hidden /> Habla conmigo
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  )
}
