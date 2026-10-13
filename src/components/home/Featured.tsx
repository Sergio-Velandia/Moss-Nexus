import { ArrowRight, LayoutGrid } from 'lucide-react'
import { Link } from 'react-router-dom'
import { balancedFeatured, templates } from '../../lib/templates'
import { TemplateCard } from '../templates/TemplateCard'
import { Reveal, SectionHeading } from '../ui/Reveal'

export function Featured() {
  const featured = balancedFeatured()
  return (
    <section aria-labelledby="destacadas-title" className="mx-auto max-w-6xl px-4 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          id="destacadas-title"
          eyebrow="Destacadas"
          title="Empieza por aquí"
          intro="Dos plantillas de cada nivel, elegidas por lo útiles que son desde el primer día."
        />
        <Reveal>
          <Link to="/plantillas" className="group inline-flex items-center gap-1.5 rounded-lg py-2 text-sm font-semibold text-nexus">
            Ver todas
            <ArrowRight size={16} aria-hidden className="transition group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((t, i) => (
          <Reveal as="li" key={t.slug} delay={i * 0.06}>
            <TemplateCard template={t} />
          </Reveal>
        ))}
      </ul>

      {templates.length > featured.length && (
        <Reveal className="mt-4">
          <Link
            to="/plantillas"
            className="group flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-line-strong px-5 py-4 transition hover:border-nexus/50"
          >
            <span className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-moss/10 text-moss">
                <LayoutGrid size={18} aria-hidden />
              </span>
              <span>
                <span className="block font-semibold">Ver las {templates.length} plantillas</span>
                <span className="block text-sm text-ink-soft">Filtra por herramienta, categoría o nivel.</span>
              </span>
            </span>
            <ArrowRight size={18} aria-hidden className="text-nexus transition group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      )}
    </section>
  )
}
