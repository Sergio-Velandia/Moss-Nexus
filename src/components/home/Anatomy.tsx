import { BadgeCheck, Check, ClipboardList, Copy, HeartHandshake, ListOrdered, Network } from 'lucide-react'
import type { ReactNode } from 'react'
import { Reveal, SectionHeading } from '../ui/Reveal'

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
      {children && <div className="mt-6 flex-1">{children}</div>}
    </Reveal>
  )
}

/** Miniatura decorativa del mapa */
function MiniMap() {
  const nodes = [
    { x: 8, y: 34, c: 'var(--c-nexus)' },
    { x: 98, y: 34, c: 'var(--c-amber)' },
    { x: 188, y: 8, c: 'var(--c-moss)' },
    { x: 188, y: 60, c: 'var(--c-moss)' },
  ]
  return (
    <svg viewBox="0 0 260 96" className="dot-grid h-auto w-full rounded-2xl border border-line" aria-hidden>
      <path d="M72 48 C 85 48, 85 48, 98 48" stroke="var(--c-nexus)" strokeWidth="1.6" fill="none" />
      <path d="M162 48 C 175 48, 175 22, 188 22" stroke="var(--c-nexus)" strokeWidth="1.6" fill="none" />
      <path d="M162 48 C 175 48, 175 74, 188 74" stroke="var(--c-nexus)" strokeWidth="1.6" fill="none" />
      {nodes.map((n, i) => (
        <g key={i} transform={`translate(${n.x} ${n.y})`}>
          <rect width="64" height="28" rx="8" fill="var(--c-surface)" stroke="var(--c-line-strong)" />
          <rect x="6" y="6" width="16" height="16" rx="5" fill={n.c} opacity="0.35" />
          <rect x="27" y="10" width="30" height="4" rx="2" fill="var(--c-line-strong)" />
          <rect x="27" y="17" width="20" height="3" rx="1.5" fill="var(--c-line)" />
        </g>
      ))}
    </svg>
  )
}

export function Anatomy() {
  return (
    <section aria-labelledby="anatomia-title" className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading
        id="anatomia-title"
        eyebrow="Dentro de cada plantilla"
        title="No es solo un JSON. Es la historia completa."
        intro="Cada plantilla sigue el mismo orden para que entiendas qué vas a instalar antes de instalarlo."
      />

      <div className="mt-12 grid gap-4 md:grid-cols-6">
        <Tile
          className="md:col-span-4"
          icon={<Network size={20} aria-hidden />}
          title="Mapa visual"
          text="Ves de un vistazo de dónde llega la información, por qué pasos pasa y a dónde termina."
        >
          <MiniMap />
        </Tile>
        <Tile
          className="md:col-span-2"
          delay={0.06}
          icon={<HeartHandshake size={20} aria-hidden />}
          title="Contexto humano"
          text="Qué problema resuelve y en qué situaciones te sirve, sin jerga."
        />
        <Tile
          className="md:col-span-2"
          delay={0.04}
          icon={<ClipboardList size={20} aria-hidden />}
          title="Requisitos previos"
          text="Las cuentas y accesos que necesitas, antes de que te los pida n8n."
        >
          <ul className="space-y-2 text-sm">
            {['Cuenta de Google', 'Instancia de n8n'].map((r) => (
              <li key={r} className="flex items-center gap-2 text-ink-soft">
                <Check size={15} className="text-moss" aria-hidden /> {r}
              </li>
            ))}
          </ul>
        </Tile>
        <Tile
          className="md:col-span-2"
          delay={0.08}
          icon={<ListOrdered size={20} aria-hidden />}
          title="Pasos numerados"
          text="De copiar a tenerlo activo, sin saltarte nada."
        >
          <ol className="space-y-2 text-sm text-ink-soft">
            {['Copiar', 'Pegar en n8n', 'Conectar credenciales', 'Probar'].map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-md bg-surface-2 font-mono text-[11px] text-ink">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </Tile>
        <Tile
          className="md:col-span-2"
          delay={0.12}
          icon={<Copy size={20} aria-hidden />}
          title="Copiar flujo"
          text="Un botón. El flujo completo en tu portapapeles, listo para pegar en el lienzo."
        >
          <div className="flex flex-col gap-3">
            <span aria-hidden className="inline-flex w-fit items-center gap-2 rounded-xl bg-nexus px-4 py-2.5 text-sm font-semibold text-on-accent">
              <Copy size={16} /> Copiar flujo
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-moss">
              <BadgeCheck size={15} aria-hidden /> Sello «Probado» con fecha y versión de n8n, cuando ya se verificó
            </span>
          </div>
        </Tile>
      </div>
    </section>
  )
}
