import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, BookOpen, Code2, FolderGit2, Languages, Scale, Sprout, Workflow, Wrench } from 'lucide-react'
import { site } from '../data/site'
import { templates } from '../lib/templates'
import { ButtonLink } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const pruebas = [
  {
    title: 'Una instancia real de n8n',
    text: 'Importo el flujo tal como lo copias tú y lo ejecuto de principio a fin. El sello guarda la fecha y la versión de n8n de esa prueba.',
  },
  {
    title: 'Datos ficticios',
    text: 'Clientes, correos, facturas y empleados inventados, o alias de mi propio correo. Nunca datos de otras personas, y el sello dice qué datos se usaron.',
  },
  {
    title: 'Casos trampa',
    text: 'Además del caso feliz, busco lo que rompe: una bandeja vacía, una fecha que ya pasó, un recordatorio que cae en fin de semana, un correo que intenta darle órdenes a la IA o un bot que no está en el canal.',
  },
  {
    title: 'Lo que falla queda escrito',
    text: 'Cada error que encuentro se corrige en la plantilla y se documenta en «Problemas frecuentes» (síntoma y solución). Lo que la plantilla no resuelve va en «Limitaciones».',
  },
]

const principles = [
  { icon: BadgeCheck, title: 'Claro sobre las pruebas', text: 'Si una plantilla se probó en n8n, muestra la fecha y la versión. Si todavía no, se marca «Sin probar».' },
  { icon: Languages, title: 'Explicado en español claro', text: 'Primero el problema y el para qué; los detalles técnicos, solo cuando hacen falta.' },
  { icon: FolderGit2, title: 'Abierto y versionado', text: 'Las plantillas viven como archivos en un repositorio público. Sin cuentas ni bases de datos.' },
  { icon: Code2, title: 'Tú tienes el control', text: 'Copias el JSON y lo ejecutas en tu propio n8n. Nexus nunca ve tus datos ni tus credenciales.' },
  { icon: Wrench, title: 'Adaptable a tu caso', text: 'Cada plantilla es un punto de partida: cambia columnas, textos, reglas o herramientas hasta que encaje con tu operación.' },
  {
    icon: Scale,
    title: 'Libre para usar',
    text: 'Los flujos se copian sin condiciones (MIT-0); los textos se pueden reutilizar citando la fuente (CC BY 4.0).',
    to: '/terminos#licencia',
  },
]

export default function About() {
  useDocumentTitle('Acerca')
  const probadas = templates.filter((t) => t.probado).length
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

      <section className="mt-16" aria-labelledby="sello">
        <Reveal>
          <h2 id="sello" className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <BadgeCheck size={24} className="text-moss" aria-hidden /> Qué significa el sello «Probado»
          </h2>
          <p className="mt-4 text-ink-soft">
            Una plantilla con el sello se ejecutó completa en una instancia real de n8n. Hoy lo tienen{' '}
            <strong className="text-ink">
              {probadas} de {templates.length}
            </strong>{' '}
            plantillas. Las demás muestran «Sin probar»: se revisaron, pero todavía no pasaron por esta prueba, así que son un punto de
            partida.
          </p>
        </Reveal>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {pruebas.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.06} className="glass rounded-3xl p-6">
              <span className="font-mono text-xs text-moss">0{i + 1}</span>
              <h3 className="mt-2 font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{p.text}</p>
            </Reveal>
          ))}
        </ol>
        <Reveal>
          <p className="mt-6 text-sm text-ink-soft">
            Si cambio una plantilla probada, repito una prueba corta antes de actualizar la fecha del sello. El sello indica que el flujo
            funcionó en esa prueba concreta; no garantiza que funcione con otras versiones de n8n ni con tu configuración (ver{' '}
            <Link to="/terminos#plantillas" className="text-nexus underline-offset-2 hover:underline">
              términos
            </Link>
            ).
          </p>
          <Link
            to="/plantillas?probadas=1"
            className="mt-4 inline-flex min-h-10 items-center gap-1 text-sm font-medium text-nexus underline-offset-2 hover:underline"
          >
            Ver solo las plantillas probadas <ArrowRight size={14} aria-hidden />
          </Link>
        </Reveal>
      </section>

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
              {p.to && (
                <Link to={p.to} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-nexus underline-offset-2 hover:underline">
                  Ver licencias <ArrowRight size={14} aria-hidden />
                </Link>
              )}
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
