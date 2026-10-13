import { ArrowRight, Check, ClipboardList, Copy, Gauge, HeartHandshake, ListOrdered, Network, ShieldCheck } from 'lucide-react'
import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { flowSteps } from '../../lib/diagram'
import { difficultyLabel, formatMinutes } from '../../lib/format'
import { getTemplate, templates } from '../../lib/templates'
import type { Difficulty, Template } from '../../lib/types'
import { DifficultyBadge, TestedSeal, UntestedBadge } from '../ui/Badges'
import { Reveal, SectionHeading } from '../ui/Reveal'
import { ToolIcon } from '../ui/ToolIcon'

/** Plantilla que ilustra la sección. Si algún día se retira, se usa la primera disponible. */
const EJEMPLO = 'cobranza-facturas-vencidas'

const NIVELES: Record<Difficulty, string> = {
  facil: 'Un disparador y pocas acciones. Se configura en minutos.',
  media: 'Ramas, reglas de negocio o varias herramientas conectadas.',
  avanzada: 'IA, aprobaciones, pagos o lógica que conviene probar con cuidado.',
}

function Tile({ icon, title, text, children, className = '', delay = 0 }: {
  icon: ReactNode
  title: string
  text: string
  children?: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <Reveal delay={delay} className={`glass flex flex-col overflow-hidden rounded-3xl p-6 ${className}`}>
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-nexus">{icon}</span>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-ink-soft">{text}</p>
      {children && <div className="mt-5 flex-1">{children}</div>}
    </Reveal>
  )
}

/** Miniatura real del flujo: cada paso con las herramientas que usa, leído de diagram.json */
function MiniFlow({ template }: { template: Template }) {
  const byId = new Map(template.diagrama.nodos.map((n) => [n.id, n]))
  const steps = flowSteps(template.diagrama)
  return (
    <div className="dot-grid overflow-x-auto rounded-2xl border border-line p-4">
      <ol className="flex min-w-max items-start" aria-label={`Pasos de «${template.titulo}»`}>
        {steps.map((step, i) => {
          const nodes = step.nodes.map((n) => byId.get(n.id)!)
          return (
            <Fragment key={i}>
              {i > 0 && <li aria-hidden className="mx-1 mt-[1.1rem] h-px w-6 shrink-0 bg-gradient-to-r from-moss to-nexus" />}
              <li className="flex w-24 shrink-0 flex-col items-center text-center">
                <span className="flex -space-x-1.5">
                  {nodes.map((n) => (
                    <span key={n.id} className="rounded-xl ring-2 ring-bg">
                      <ToolIcon id={n.herramienta} />
                    </span>
                  ))}
                </span>
                <span className="mt-2 text-[11px] leading-tight text-ink-soft">
                  {nodes.length > 1 ? `${nodes.length} caminos` : nodes[0].etiqueta}
                </span>
              </li>
            </Fragment>
          )
        })}
      </ol>
    </div>
  )
}

/** Las dos primeras frases del problema, para citarlo sin ocupar toda la tarjeta */
const extracto = (texto: string) => (texto.match(/[^.]+\./g) ?? [texto]).slice(0, 2).join('').trim()

export function Anatomy() {
  const t = getTemplate(EJEMPLO) ?? templates[0]
  if (!t) return null
  const porNivel = (d: Difficulty) => templates.filter((x) => x.dificultad === d).length

  return (
    <section aria-labelledby="anatomia-title" className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading
        id="anatomia-title"
        eyebrow="Dentro de cada plantilla"
        title="No es solo un JSON. Es la historia completa."
        intro="Cada plantilla sigue el mismo orden para que entiendas qué vas a instalar antes de instalarlo. Así se ve en una plantilla real del catálogo."
      />
      <Reveal className="mt-6">
        <Link
          to={`/plantillas/${t.slug}`}
          className="group inline-flex items-center gap-2 rounded-xl border border-line-strong px-3 py-2 text-sm transition hover:border-nexus/50"
        >
          <span className="font-mono text-[11px] uppercase tracking-wider text-faint">Ejemplo real</span>
          <span className="font-medium">{t.titulo}</span>
          <ArrowRight size={15} aria-hidden className="text-nexus transition group-hover:translate-x-0.5" />
        </Link>
      </Reveal>

      <div className="mt-8 grid gap-4 md:grid-cols-6">
        <Tile
          className="md:col-span-4"
          icon={<Network size={20} aria-hidden />}
          title="Mapa visual"
          text="De dónde llega la información, por qué pasos pasa y a dónde termina. En la plantilla lo ves completo, con cada conexión."
        >
          <MiniFlow template={t} />
          <p className="mt-3 font-mono text-[11px] text-faint">
            {t.diagrama.nodos.length} nodos · {t.diagrama.conexiones.length} conexiones
          </p>
        </Tile>

        <Tile
          className="md:col-span-2"
          delay={0.06}
          icon={<HeartHandshake size={20} aria-hidden />}
          title="Contexto humano"
          text="Qué problema resuelve y en qué situaciones te sirve, sin jerga."
        >
          <blockquote className="border-l-2 border-nexus/60 pl-3 text-sm italic leading-relaxed text-ink">
            «{extracto(t.problema)}»
          </blockquote>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-faint">Te sirve si…</p>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
            {t.escenarios.slice(0, 3).map((e) => (
              <li key={e} className="flex gap-2">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-nexus" />
                {e}
              </li>
            ))}
          </ul>
        </Tile>

        <Tile
          className="md:col-span-2"
          delay={0.04}
          icon={<ClipboardList size={20} aria-hidden />}
          title="Requisitos previos"
          text="Las cuentas y accesos que necesitas, antes de que te los pida n8n."
        >
          <ul className="space-y-2 text-sm">
            {t.requisitos.slice(0, 3).map((r) => (
              <li key={r} className="flex items-start gap-2 text-ink-soft">
                <Check size={15} className="mt-0.5 shrink-0 text-moss" aria-hidden /> {r}
              </li>
            ))}
          </ul>
          {t.requisitos.length > 3 && <p className="mt-2 text-xs text-faint">y {t.requisitos.length - 3} más en la plantilla</p>}
        </Tile>

        <Tile
          className="md:col-span-2"
          delay={0.08}
          icon={<ListOrdered size={20} aria-hidden />}
          title="Pasos numerados"
          text={`De copiar a tenerlo activo: ${t.pasos.length} pasos en esta plantilla, sin saltarte nada.`}
        >
          <ol className="space-y-2 text-sm text-ink-soft">
            {t.pasos.slice(0, 3).map((s, i) => (
              <li key={s} className="flex items-start gap-2">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-surface-2 font-mono text-[11px] text-ink">{i + 1}</span>
                <span className="line-clamp-2">{s}</span>
              </li>
            ))}
          </ol>
        </Tile>

        <Tile
          className="md:col-span-2"
          delay={0.12}
          icon={<Copy size={20} aria-hidden />}
          title="Copiar flujo"
          text="Un botón. El flujo completo en tu portapapeles, listo para pegar en el lienzo de n8n, o descargado como .json."
        >
          <span aria-hidden className="inline-flex w-fit items-center gap-2 rounded-xl bg-nexus px-4 py-2.5 text-sm font-semibold text-on-accent">
            <Copy size={16} /> Copiar flujo
          </span>
        </Tile>

        <Tile
          className="md:col-span-3"
          delay={0.04}
          icon={<Gauge size={20} aria-hidden />}
          title="Nivel y tiempo"
          text={`Esta plantilla es de nivel ${difficultyLabel[t.dificultad].toLowerCase()} y se configura en unos ${formatMinutes(t.tiempoEstimado)}.`}
        >
          <ul className="space-y-2.5">
            {(Object.keys(NIVELES) as Difficulty[]).map((d) => (
              <li
                key={d}
                className={`flex items-start gap-3 rounded-xl px-3 py-2 text-sm ${d === t.dificultad ? 'bg-surface-2' : ''}`}
                aria-current={d === t.dificultad ? 'true' : undefined}
              >
                <span className="w-24 shrink-0 pt-0.5">
                  <DifficultyBadge value={d} />
                </span>
                <span className="text-ink-soft">
                  {NIVELES[d]} <span className="text-faint">({porNivel(d)} en la librería)</span>
                </span>
              </li>
            ))}
          </ul>
        </Tile>

        <Tile
          className="md:col-span-3"
          delay={0.08}
          icon={<ShieldCheck size={20} aria-hidden />}
          title="Probado o sin probar"
          text="Cada plantilla dice con claridad si ya se ejecutó en una instancia real de n8n."
        >
          <dl className="space-y-3 text-sm">
            <div className="rounded-xl bg-surface-2 px-3 py-2.5">
              <dt>
                <TestedSeal fecha="" version="" compact />
              </dt>
              <dd className="mt-1 text-ink-soft">Funcionó en una prueba real. Muestra la fecha y la versión de n8n en que se probó.</dd>
            </div>
            <div className="rounded-xl bg-surface-2 px-3 py-2.5">
              <dt>
                <UntestedBadge />
              </dt>
              <dd className="mt-1 text-ink-soft">
                Está armada y explicada, pero aún no se ejecutó en n8n. Revísala y pruébala antes de usarla con datos reales.
              </dd>
            </div>
          </dl>
        </Tile>
      </div>
    </section>
  )
}
