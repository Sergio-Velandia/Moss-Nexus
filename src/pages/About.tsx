import { ArrowRight, BadgeCheck, BookOpen, Code2, FolderGit2, Languages, Sprout, Workflow } from 'lucide-react'
import { site } from '../data/site'
import { ButtonLink } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const principles = [
  { icon: BadgeCheck, title: 'Claro sobre las pruebas', text: 'Si una plantilla se probó en n8n, muestra la fecha y la versión. Si todavía no, se marca «Sin probar».' },
  { icon: Languages, title: 'Explicado en español claro', text: 'Primero el problema y el para qué; los detalles técnicos, solo cuando hacen falta.' },
  { icon: FolderGit2, title: 'Abierto y versionado', text: 'Las plantillas viven como archivos en un repositorio público. Sin cuentas ni bases de datos.' },
  { icon: Code2, title: 'Tú tienes el control', text: 'Copias el JSON y lo ejecutas en tu propio n8n. Nexus nunca ve tus datos ni tus credenciales.' },
]

export default function About() {
  useDocumentTitle('Acerca')
  return (
    <div className="mx-auto max-w-4xl px-4 pt-10 sm:pt-16">
      <Reveal>
        <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-nexus">Acerca</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Un recetario de flujos para quien <span className="text-gradient">sabe lo que quiere</span>
        </h1>
        <p className="mt-6 text-lg text-pretty leading-relaxed text-ink-soft">
          Mucha gente tiene clara la automatización que necesita: «cuando me escriban por WhatsApp, guardar el contacto en una hoja y
          mandarme un correo». Lo que frena es el camino técnico: webhooks, JSON, tokens, lógica. Moss Nexus entrega ese camino ya
          recorrido: el flujo armado, explicado paso a paso y listo para copiar a n8n.
        </p>
      </Reveal>

      <Reveal as="section" className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Nexus y Moss</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="glass rounded-3xl p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-moss/15 text-moss">
              <BookOpen size={20} aria-hidden />
            </span>
            <h3 className="mt-4 font-semibold">Moss</h3>
            <p className="mt-1.5 text-sm text-ink-soft">
              El jardín digital: guías, manual y bitácora sobre código, APIs y n8n. Donde se aprende el porqué.
            </p>
          </div>
          <ArrowRight className="mx-auto rotate-90 text-nexus sm:rotate-0" aria-hidden />
          <div className="glass rounded-3xl border-nexus/40 p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-nexus/15 text-nexus">
              <Workflow size={20} aria-hidden />
            </span>
            <h3 className="mt-4 font-semibold">Nexus</h3>
            <p className="mt-1.5 text-sm text-ink-soft">
              La librería de flujos: plantillas listas para copiar. Donde ese conocimiento se pone a trabajar.
            </p>
          </div>
        </div>
        <p className="mt-6 text-ink-soft">
          Son proyectos hermanos con repositorios separados. Desde Moss llegas aquí con el botón «Explorar plantillas», y desde
          cualquier página de Nexus puedes volver a Moss.
        </p>
      </Reveal>

      <section className="mt-16">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight">Principios</h2>
        </Reveal>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.06} className="glass rounded-3xl p-6">
              <p.icon size={22} className="text-nexus" aria-hidden />
              <h3 className="mt-4 font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{p.text}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <Reveal className="mt-16 flex flex-wrap gap-3">
        <ButtonLink to="/plantillas">
          Explorar plantillas <ArrowRight size={16} aria-hidden />
        </ButtonLink>
        <a href={site.mossUrl} className="glass inline-flex min-h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-moss transition hover:-translate-y-0.5">
          <Sprout size={16} aria-hidden /> Visitar Moss
        </a>
      </Reveal>

      <p className="mt-12 text-xs text-faint">
        Moss Nexus es un proyecto independiente. n8n es una marca de n8n GmbH; Nexus no está afiliado ni respaldado por ella.
      </p>
    </div>
  )
}
