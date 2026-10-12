import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { featuredTemplates } from '../../lib/templates'
import { TemplateCard } from '../templates/TemplateCard'
import { Reveal, SectionHeading } from '../ui/Reveal'

export function Featured() {
  const featured = featuredTemplates().slice(0, 5)
  return (
    <section aria-labelledby="destacadas-title" className="mx-auto max-w-6xl px-4 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading id="destacadas-title" eyebrow="Destacadas" title="Empieza por aquí" intro="Flujos elegidos por lo útiles que son desde el primer día." />
        <Reveal>
          <Link to="/plantillas" className="group inline-flex items-center gap-1.5 rounded-lg py-2 text-sm font-semibold text-nexus">
            Ver todas
            <ArrowRight size={16} aria-hidden className="transition group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((t, i) => (
          <Reveal as="li" key={t.slug} delay={i * 0.07}>
            <TemplateCard template={t} />
          </Reveal>
        ))}
        {/* Mientras la librería crece, la última casilla anuncia lo que viene */}
        {featured.length < 6 && (
          <Reveal as="li" delay={featured.length * 0.07}>
            <div className="flex h-full min-h-56 flex-col items-start justify-between rounded-2xl border border-dashed border-line-strong p-5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-moss/10 text-moss">
                <Sparkles size={18} aria-hidden />
              </span>
              <div>
                <p className="font-semibold">Más plantillas en camino</p>
                <p className="mt-1.5 text-sm text-ink-soft">
                  La librería crece de a una plantilla, cada una explicada paso a paso.
                </p>
              </div>
            </div>
          </Reveal>
        )}
      </ul>
    </section>
  )
}
