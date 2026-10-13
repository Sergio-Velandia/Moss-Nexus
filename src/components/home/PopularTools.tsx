import { Link } from 'react-router-dom'
import { tools } from '../../data/tools'
import { toolUsage } from '../../lib/templates'
import { ToolIcon } from '../ui/ToolIcon'
import { Reveal, SectionHeading } from '../ui/Reveal'

export function PopularTools() {
  const usage = toolUsage()
  // Solo herramientas con plantillas, de la más usada a la menos usada: ningún chip lleva a una galería vacía
  const popular = tools.filter((t) => t.popular && (usage.get(t.id) ?? 0) > 0).sort((a, b) => usage.get(b.id)! - usage.get(a.id)!)
  return (
    <section aria-labelledby="herramientas-title" className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading
        id="herramientas-title"
        eyebrow="Herramientas populares"
        title="Empieza por lo que ya usas"
        intro="Elige una herramienta y te mostramos los flujos que la conectan."
        align="center"
      />
      <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
        {popular.map((t, i) => {
          const count = usage.get(t.id) ?? 0
          return (
            <Reveal as="li" key={t.id} delay={i * 0.035}>
              <Link
                to={`/plantillas?herramienta=${t.id}`}
                className="glass group flex min-h-12 items-center gap-3 rounded-2xl py-2 pl-2 pr-4 transition duration-300 hover:-translate-y-0.5 hover:border-line-strong"
              >
                <span className="transition duration-300 group-hover:scale-110">
                  <ToolIcon id={t.id} />
                </span>
                <span className="text-sm font-medium">{t.nombre}</span>
                <span className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-faint">
                  {count}
                  <span className="sr-only">{count === 1 ? ' plantilla' : ' plantillas'}</span>
                </span>
              </Link>
            </Reveal>
          )
        })}
      </ul>
    </section>
  )
}
