import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, Check, CircleCheck, Copy, Download, ExternalLink, ShieldAlert, TriangleAlert } from 'lucide-react'
import { DOCKER_URL, estoMePaso, noLevanta, pasosDesdeCero, pasosImportar, type Enlace, type Paso, type Tropiezo } from '../data/primeros-pasos'
import { copyText } from '../lib/clipboard'
import { useDocumentTitle } from '../lib/useDocumentTitle'

/** Dibuja `código` y **negrita** dentro de los textos de la guía */
function Rico({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(/(`[^`]+`|\*\*[^*]+\*\*)/).map((parte, i): ReactNode => {
        if (parte.startsWith('`')) {
          return (
            <code key={i} className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.88em] text-ink [overflow-wrap:anywhere]">
              {parte.slice(1, -1)}
            </code>
          )
        }
        if (parte.startsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-ink">
              {parte.slice(2, -2)}
            </strong>
          )
        }
        return parte
      })}
    </>
  )
}

function Bloque({ etiqueta, codigo }: { etiqueta?: string; codigo: string }) {
  const [estado, setEstado] = useState<'idle' | 'ok' | 'error'>('idle')
  const timer = useRef<number>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copiar = async () => {
    const ok = await copyText(codigo)
    setEstado(ok ? 'ok' : 'error')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setEstado('idle'), 2200)
  }

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-line-strong bg-bg-deep">
      <div className="flex min-h-11 items-center justify-between gap-3 border-b border-line py-1 pl-4 pr-1.5">
        <span className="font-mono text-xs text-ink-soft">{etiqueta ?? 'Terminal'}</span>
        <button
          type="button"
          onClick={copiar}
          aria-label={`Copiar: ${etiqueta ?? 'comando de la terminal'}`}
          className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition active:scale-[0.97] ${
            estado === 'ok' ? 'text-moss' : estado === 'error' ? 'text-amber' : 'text-ink hover:bg-surface-2'
          }`}
        >
          {estado === 'ok' ? <Check size={16} aria-hidden /> : estado === 'error' ? <TriangleAlert size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
          {estado === 'ok' ? 'Copiado' : estado === 'error' ? 'No se pudo' : 'Copiar'}
        </button>
      </div>
      {/* Con foco: si la línea no cabe, el bloque se desplaza también con el teclado */}
      <pre tabIndex={0} aria-label={etiqueta ?? 'Comando de la terminal'} className="overflow-x-auto px-4 py-3.5 font-mono text-sm leading-relaxed text-ink">
        <code>{codigo}</code>
      </pre>
      <span role="status" aria-live="polite" className="sr-only">
        {estado === 'ok' ? 'Copiado al portapapeles' : estado === 'error' ? 'No se pudo copiar' : ''}
      </span>
    </div>
  )
}

function Enlaces({ enlaces }: { enlaces?: Enlace[] }) {
  if (!enlaces?.length) return null
  const cls = 'inline-flex min-h-10 items-center gap-1.5 font-medium text-nexus underline-offset-2 hover:underline'
  return (
    <p className="mt-3 flex flex-wrap gap-x-5">
      {enlaces.map((e) =>
        e.a.startsWith('/') ? (
          <Link key={e.a} to={e.a} className={cls}>
            {e.texto}
          </Link>
        ) : (
          <a key={e.a} href={e.a} target="_blank" rel="noreferrer" className={cls}>
            {e.texto} <ExternalLink size={14} aria-hidden />
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        ),
      )}
    </p>
  )
}

function PasoCard({ paso, numero }: { paso: Paso; numero: number }) {
  return (
    <li id={paso.id} className="glass rounded-3xl p-5 target:border-nexus/70 sm:p-7">
      <h3 className="flex items-start gap-3 text-xl font-semibold tracking-tight">
        <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-nexus/15 font-mono text-base text-nexus">
          {numero}
        </span>
        <span className="pt-1">
          <span className="sr-only">Paso {numero}: </span>
          {paso.titulo}
        </span>
      </h3>
      {paso.texto.map((t) => (
        <p key={t} className="mt-3 text-pretty leading-relaxed text-ink-soft">
          <Rico texto={t} />
        </p>
      ))}
      {paso.bloques?.map((b) => <Bloque key={b.codigo} etiqueta={b.etiqueta} codigo={b.codigo} />)}
      <Enlaces enlaces={paso.enlaces} />
      {paso.imagenes?.map((img) => (
        <img
          key={img.src}
          src={`${import.meta.env.BASE_URL}${img.src}`}
          alt={img.alt}
          width={img.ancho}
          height={img.alto}
          loading="lazy"
          className="mt-4 h-auto w-full rounded-2xl border border-line-strong"
        />
      ))}
      {paso.aviso && (
        <p className="mt-4 flex items-start gap-3 rounded-2xl border border-amber/50 bg-amber/[0.08] px-4 py-3 text-sm leading-relaxed text-ink-soft">
          <TriangleAlert size={18} className="mt-0.5 shrink-0 text-amber" aria-hidden />
          <span>
            <Rico texto={paso.aviso} />
          </span>
        </p>
      )}
      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-moss/40 bg-moss/[0.08] px-4 py-3">
        <CircleCheck size={18} className="mt-1 shrink-0 text-moss" aria-hidden />
        <p className="text-sm leading-relaxed text-ink-soft">
          <strong className="block font-semibold text-ink">Qué deberías estar viendo</strong>
          <Rico texto={paso.verificar} />
        </p>
      </div>
    </li>
  )
}

function TropiezoCard({ t }: { t: Tropiezo }) {
  return (
    <article id={t.id} aria-labelledby={`${t.id}-titulo`} className="glass rounded-3xl p-5 target:border-nexus/70 sm:p-7">
      <h3 id={`${t.id}-titulo`} className="text-lg font-semibold tracking-tight">
        <a href={`#${t.id}`} className="underline-offset-4 hover:underline">
          {t.titulo}
        </a>
      </h3>
      <dl className="mt-3 space-y-3 leading-relaxed">
        <div>
          <dt className="font-mono text-xs uppercase tracking-[0.14em] text-nexus">Síntoma</dt>
          <dd className="mt-0.5 text-ink">
            <Rico texto={t.sintoma} />
          </dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">Causa</dt>
          <dd className="mt-0.5 text-ink-soft">
            <Rico texto={t.causa} />
          </dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-[0.14em] text-moss">Qué hacer</dt>
          <dd className="mt-0.5 text-ink-soft">
            <Rico texto={t.queHacer} />
          </dd>
        </div>
      </dl>
      <Enlaces enlaces={t.enlaces} />
    </article>
  )
}

const INDICE: { id: string; titulo: string; hijos: { id: string; titulo: string }[] }[] = [
  { id: 'desde-cero', titulo: 'Instalar desde cero', hijos: pasosDesdeCero },
  { id: 'importar', titulo: 'Importar una plantilla', hijos: pasosImportar },
  { id: 'no-levanta', titulo: 'Si no levanta', hijos: noLevanta },
  { id: 'esto-me-paso', titulo: 'Esto me pasó', hijos: estoMePaso },
]

function Indice() {
  return (
    <ul className="space-y-3 text-sm">
      {INDICE.map((s) => (
        <li key={s.id}>
          <a href={`#${s.id}`} className="font-semibold text-ink hover:text-nexus">
            {s.titulo}
          </a>
          <ul className="mt-1 space-y-0.5 border-l border-line pl-3">
            {s.hijos.map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`} className="block py-1 text-ink-soft hover:text-ink">
                  {h.titulo}
                </a>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

export default function GettingStarted() {
  useDocumentTitle('Primeros pasos')
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:pt-14">
      <header className="max-w-3xl">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-nexus">Primeros pasos</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">Del «quiero usar esto» a tu primera plantilla</h1>
      </header>

      <nav aria-label="Elige por dónde empezar" className="mt-8 grid gap-4 sm:grid-cols-2">
        <a href="#desde-cero" className="glass group rounded-3xl p-6 transition hover:border-nexus/50">
          <span className="flex items-center justify-between text-xl font-semibold tracking-tight">
            Empiezo de cero <Download size={20} className="text-nexus" aria-hidden />
          </span>
          <span className="mt-1.5 block text-ink-soft">Tengo Docker, pero todavía no tengo n8n.</span>
        </a>
        <a href="#importar" className="glass group rounded-3xl p-6 transition hover:border-nexus/50">
          <span className="flex items-center justify-between text-xl font-semibold tracking-tight">
            Ya tengo n8n <ArrowDown size={20} className="text-nexus" aria-hidden />
          </span>
          <span className="mt-1.5 block text-ink-soft">Solo quiero importar una plantilla.</span>
        </a>
      </nav>

      <details className="glass mt-4 rounded-2xl px-5 py-3 lg:hidden">
        <summary className="min-h-8 cursor-pointer font-medium">Índice de la guía</summary>
        <div className="mt-3 pb-2">
          <Indice />
        </div>
      </details>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_17rem]">
        <div className="min-w-0 space-y-14">
          <section aria-labelledby="desde-cero" className="space-y-5">
            <h2 id="desde-cero" className="text-3xl font-semibold tracking-tight">
              Instalar desde cero
            </h2>
            <p className="text-lg text-ink-soft">
              <strong className="font-semibold text-ink">Requisito:</strong> Docker instalado y abierto. Si no lo tienes, sigue la{' '}
              <a href={DOCKER_URL} target="_blank" rel="noreferrer" className="text-nexus underline underline-offset-2">
                guía oficial de Docker
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>{' '}
              y vuelve aquí.
            </p>
            <p className="flex items-start gap-3 rounded-2xl border border-amber/50 bg-amber/[0.08] px-4 py-3 leading-relaxed text-ink-soft">
              <ShieldAlert size={20} className="mt-0.5 shrink-0 text-amber" aria-hidden />
              <span>
                <strong className="font-semibold text-ink">Esta instalación es local y no está pensada para exponerla a internet.</strong> Sirve para
                aprender y probar. Las plantillas que reciben webhooks de servicios externos, como Stripe, HubSpot o WhatsApp, necesitan una instancia
                accesible desde internet.
              </span>
            </p>
            <ol className="space-y-5">
              {pasosDesdeCero.map((p, i) => (
                <PasoCard key={p.id} paso={p} numero={i + 1} />
              ))}
            </ol>
          </section>

          <section aria-labelledby="importar" className="space-y-5">
            <h2 id="importar" className="text-3xl font-semibold tracking-tight">
              Importar una plantilla
            </h2>
            <ol className="space-y-5">
              {pasosImportar.map((p, i) => (
                <PasoCard key={p.id} paso={p} numero={i + 1} />
              ))}
            </ol>
          </section>

          <section aria-labelledby="no-levanta" className="space-y-5">
            <h2 id="no-levanta" className="text-3xl font-semibold tracking-tight">
              Si no levanta
            </h2>
            {noLevanta.map((t) => (
              <TropiezoCard key={t.id} t={t} />
            ))}
          </section>

          <section aria-labelledby="esto-me-paso" className="space-y-5">
            <h2 id="esto-me-paso" className="text-3xl font-semibold tracking-tight">
              Esto me pasó
            </h2>
            <p className="text-lg text-ink-soft">Tropiezos reales al probar las plantillas. Busca por lo que estás viendo.</p>
            {estoMePaso.map((t) => (
              <TropiezoCard key={t.id} t={t} />
            ))}
          </section>
        </div>

        <aside className="hidden lg:block">
          <nav aria-label="Índice de la guía" className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pr-2">
            <Indice />
          </nav>
        </aside>
      </div>
    </div>
  )
}
