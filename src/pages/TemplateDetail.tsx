import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, CircleCheck, ExternalLink, FlaskConical, Lightbulb, ListChecks, Network, Rocket, Target } from 'lucide-react'
import { getCategory } from '../data/categories'
import { getTool } from '../data/tools'
import { FlowMap } from '../components/diagram/FlowMap'
import { CopyFlowButton } from '../components/templates/CopyFlowButton'
import { TemplateCard } from '../components/templates/TemplateCard'
import { DifficultyBadge, ExampleBadge, TestedSeal, TimeBadge, UntestedBadge, UntestedNotice } from '../components/ui/Badges'
import { Reveal } from '../components/ui/Reveal'
import { ToolIcon } from '../components/ui/ToolIcon'
import { getTemplate, relatedTemplates } from '../lib/templates'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import NotFound from './NotFound'

function Section({ id, icon, title, children }: { id: string; icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <Reveal as="section" className="scroll-mt-24">
      <h2 id={id} className="flex items-center gap-3 text-xl font-semibold tracking-tight">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-surface-2 text-nexus">{icon}</span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </Reveal>
  )
}

export default function TemplateDetail() {
  const { slug = '' } = useParams()
  const t = getTemplate(slug)
  useDocumentTitle(t?.titulo ?? 'Plantilla no encontrada')
  if (!t) return <NotFound />

  const related = relatedTemplates(t)

  return (
    <article className="mx-auto max-w-6xl px-4 pt-8 sm:pt-12">
      <Link to="/plantillas" className="group inline-flex min-h-10 items-center gap-1.5 rounded-lg text-sm font-medium text-ink-soft transition hover:text-ink">
        <ArrowLeft size={16} aria-hidden className="transition group-hover:-translate-x-0.5" />
        Plantillas
      </Link>

      {t.ejemplo && (
        <p className="mt-4 flex items-start gap-3 rounded-2xl border border-dashed border-amber/50 bg-amber/[0.06] px-4 py-3 text-sm text-ink-soft">
          <FlaskConical size={18} className="mt-0.5 shrink-0 text-amber" aria-hidden />
          <span>
            <strong className="text-amber">Plantilla de ejemplo.</strong> Sirve para probar el diseño de Nexus; su flujo es un marcador de
            posición y no está listo para usarse.
          </span>
        </p>
      )}

      {/* 1. Cabecera */}
      <header className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/plantillas?categoria=${t.categoria}`}
              className="rounded-md font-mono text-xs uppercase tracking-[0.14em] text-nexus underline-offset-4 hover:underline"
            >
              {getCategory(t.categoria)?.nombre}
            </Link>
            {t.ejemplo && <ExampleBadge />}
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.08]">{t.titulo}</h1>
          <p className="mt-4 max-w-2xl text-lg text-pretty text-ink-soft">{t.resumen}</p>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Herramientas que conecta">
            {t.herramientas.map((h) => (
              <li key={h}>
                <Link
                  to={`/plantillas?herramienta=${h}`}
                  className="glass inline-flex min-h-10 items-center gap-2 rounded-xl py-1 pl-1 pr-3 text-sm font-medium transition hover:border-line-strong"
                >
                  <ToolIcon id={h} size="sm" />
                  {getTool(h)?.nombre}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
            <DifficultyBadge value={t.dificultad} />
            <TimeBadge minutes={t.tiempoEstimado} />
            {t.probado ? <TestedSeal fecha={t.probado.fecha} version={t.probado.versionN8n} compact /> : <UntestedBadge />}
          </div>
        </div>
      </header>

      {/* 2. Mapa visual */}
      <Reveal as="section" className="mt-10">
        <h2 id="mapa" className="sr-only">
          Mapa del flujo
        </h2>
        <div className="glass overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-5">
            <span className="flex items-center gap-2 text-sm font-medium text-ink-soft">
              <Network size={16} className="text-nexus" aria-hidden /> Mapa del flujo
            </span>
            <span className="font-mono text-xs text-faint">
              {t.diagrama.nodos.length} nodos · {t.diagrama.conexiones.length} conexiones
            </span>
          </div>
          <div className="dot-grid overflow-x-auto px-3 py-8 sm:px-8 sm:py-12" tabIndex={0} role="region" aria-label="Mapa del flujo">
            <FlowMap diagram={t.diagrama} title={`Mapa del flujo: ${t.titulo}`} />
          </div>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-10">
        <div className="min-w-0 space-y-14">
          {/* 3. Contexto humano */}
          <Section id="contexto" icon={<Target size={18} aria-hidden />} title="Qué problema resuelve">
            <p className="max-w-2xl text-pretty leading-relaxed text-ink-soft">{t.problema}</p>
            <h3 className="mt-8 flex items-center gap-2 text-sm font-semibold">
              <Lightbulb size={16} className="text-amber" aria-hidden /> Escenarios en los que te sirve
            </h3>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {t.escenarios.map((e) => (
                <li key={e} className="glass rounded-2xl p-4 text-sm leading-relaxed">
                  {e}
                </li>
              ))}
            </ul>
          </Section>

          {/* 4. Requisitos previos */}
          <Section id="requisitos" icon={<ListChecks size={18} aria-hidden />} title="Antes de empezar necesitas">
            <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
              {t.requisitos.map((r) => (
                <li key={r} className="flex items-start gap-3 bg-surface/40 px-4 py-3.5">
                  <CircleCheck size={18} className="mt-0.5 shrink-0 text-moss" aria-hidden />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            {t.guias && t.guias.length > 0 && (
              <div className="mt-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <BookOpen size={16} className="text-moss" aria-hidden /> Guías útiles
                </h3>
                <ul className="mt-3 space-y-2">
                  {t.guias.map((g) => (
                    <li key={g.url}>
                      <a
                        href={g.url}
                        target="_blank"
                        rel="noreferrer"
                        className="glass group inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition hover:border-moss/50"
                      >
                        {g.titulo}
                        <ExternalLink size={14} aria-hidden className="text-moss transition group-hover:translate-x-0.5" />
                        <span className="sr-only"> (se abre en una pestaña nueva)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Section>

          {/* 5. Cómo usarla */}
          <Section id="pasos" icon={<Rocket size={18} aria-hidden />} title="Cómo usarla">
            <ol className="relative space-y-6">
              <span aria-hidden className="absolute bottom-4 left-[1.0625rem] top-4 w-px bg-gradient-to-b from-moss via-amber to-nexus opacity-40" />
              {t.pasos.map((p, i) => (
                <li key={p} className="relative flex gap-4">
                  <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line-strong bg-surface font-mono text-sm font-semibold">
                    {i + 1}
                  </span>
                  <p className="pt-1.5 leading-relaxed">{p}</p>
                </li>
              ))}
            </ol>
          </Section>

          {/* 6 y 7. Copiar flujo + sello Probado */}
          <Reveal as="section" className="relative overflow-hidden rounded-3xl border border-nexus/30 bg-nexus/[0.06] p-6 sm:p-8">
            <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-nexus/20 blur-3xl" />
            <h2 id="copiar" className="relative text-2xl font-semibold tracking-tight">
              Llévatelo a n8n
            </h2>
            <p className="relative mt-2 max-w-lg text-ink-soft">
              Copia el flujo, abre un flujo nuevo en n8n y pégalo directamente sobre el lienzo.
            </p>
            {!t.probado && (
              <div className="relative mt-5">
                <UntestedNotice />
              </div>
            )}
            <div className="relative mt-6">
              <CopyFlowButton template={t} />
            </div>
            {t.probado && (
              <div className="relative mt-8 border-t border-line pt-6">
                <TestedSeal fecha={t.probado.fecha} version={t.probado.versionN8n} hora={t.probado.hora} />
              </div>
            )}
          </Reveal>
        </div>

        {/* Resumen fijo en escritorio */}
        <aside className="hidden lg:block" aria-label="Resumen de la plantilla">
          <div className="glass sticky top-24 rounded-3xl p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">Resumen</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-soft">Dificultad</dt>
                <dd><DifficultyBadge value={t.dificultad} /></dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-soft">Configuración</dt>
                <dd><TimeBadge minutes={t.tiempoEstimado} /></dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-soft">Pasos</dt>
                <dd className="font-mono text-xs">{t.pasos.length}</dd>
              </div>
            </dl>
            <div className="mt-5 border-t border-line pt-5">
              <CopyFlowButton template={t} size="md" />
            </div>
            <nav aria-label="En esta página" className="mt-5 border-t border-line pt-4">
              <ul className="space-y-1 text-sm">
                {[
                  ['contexto', 'Qué problema resuelve'],
                  ['requisitos', 'Requisitos'],
                  ['pasos', 'Cómo usarla'],
                  ['copiar', 'Copiar flujo'],
                ].map(([id, label]) => (
                  <li key={id}>
                    <a href={`#${id}`} className="block rounded-lg px-2 py-1.5 text-ink-soft transition hover:bg-surface-2 hover:text-ink">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      </div>

      {/* 8. Relacionadas */}
      {related.length > 0 && (
        <section aria-labelledby="relacionadas" className="mt-20">
          <h2 id="relacionadas" className="text-xl font-semibold tracking-tight">
            Plantillas relacionadas
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r, i) => (
              <Reveal as="li" key={r.slug} delay={i * 0.06}>
                <TemplateCard template={r} />
              </Reveal>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
