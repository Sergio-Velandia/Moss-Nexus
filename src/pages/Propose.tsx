import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Lightbulb, Loader2, MessageSquare, Send, ShieldAlert } from 'lucide-react'
import {
  buildEmail,
  emailjsReady,
  FORMS,
  HONEYPOT,
  sendEmail,
  validate,
  type Field,
  type FormKind,
  type Values,
} from '../lib/contact-form'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const TABS: { kind: FormKind; param: string; icon: typeof Lightbulb; blurb: string }[] = [
  { kind: 'propuesta', param: 'propuesta', icon: Lightbulb, blurb: 'Cuéntame tu negocio, el problema y tu idea.' },
  { kind: 'conversacion', param: 'habla-conmigo', icon: MessageSquare, blurb: 'Escríbeme directamente, sin más preguntas.' },
]

const control =
  'w-full rounded-xl border border-line-strong bg-bg-deep px-4 py-3 text-sm text-ink outline-none transition placeholder:text-faint focus-visible:border-nexus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexus/40 aria-[invalid=true]:border-nexus'

function FieldControl({ field, error, formId }: { field: Field; error?: string; formId: string }) {
  const id = `${formId}-${field.name}`
  const hintId = field.hint ? `${id}-ayuda` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  const common = { id, name: field.name, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy }
  const label = (
    <>
      {field.label}
      {field.required ? <span className="text-nexus"> *</span> : <span className="font-normal text-faint"> (opcional)</span>}
    </>
  )
  const help = (
    <>
      {field.hint && (
        <p id={hintId} className="mt-1.5 text-xs text-faint">
          {field.hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-nexus">
          <AlertCircle size={14} aria-hidden /> {error}
        </p>
      )}
    </>
  )

  if (field.type === 'checkbox') {
    return (
      <div>
        <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-ink-soft">
          <input {...common} type="checkbox" value="sí" className="mt-0.5 h-5 w-5 shrink-0 accent-nexus" />
          <span>
            {field.label}
            {field.name === 'autorizacion' && (
              <>
                {' '}
                <Link to="/privacidad#formularios" className="text-nexus underline underline-offset-2">
                  Leer la política
                </Link>
              </>
            )}
            {field.required && <span className="text-nexus"> *</span>}
          </span>
        </label>
        {help}
      </div>
    )
  }

  if (field.type === 'radio' || field.type === 'tools') {
    const multiple = field.type === 'tools'
    return (
      <fieldset aria-describedby={describedBy} aria-invalid={error ? true : undefined}>
        <legend className="text-sm font-semibold text-ink">{label}</legend>
        <div className={`mt-2 ${multiple ? 'flex flex-wrap gap-2' : 'grid gap-2'}`}>
          {field.options!.map((o, i) => (
            <label
              key={o}
              htmlFor={`${id}-${i}`}
              className={`flex min-h-11 cursor-pointer items-center gap-2.5 border border-line-strong text-sm text-ink-soft transition hover:border-nexus/50 has-checked:border-nexus has-checked:bg-nexus/10 has-checked:text-ink has-focus-visible:ring-2 has-focus-visible:ring-nexus/50 ${
                multiple ? 'rounded-full px-3.5' : 'rounded-xl px-4'
              }`}
            >
              <input
                id={`${id}-${i}`}
                type={multiple ? 'checkbox' : 'radio'}
                name={field.name}
                value={o}
                className={multiple ? 'sr-only' : 'h-4 w-4 shrink-0 accent-nexus'}
              />
              {o}
            </label>
          ))}
        </div>
        {help}
      </fieldset>
    )
  }

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="mt-2">
        {field.type === 'textarea' ? (
          <textarea {...common} rows={4} maxLength={field.maxLength} placeholder={field.placeholder} className={`${control} min-h-28 resize-y`} />
        ) : field.type === 'select' ? (
          <select {...common} defaultValue="" className={control}>
            <option value="">Sin especificar</option>
            {field.options!.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ) : (
          <input
            {...common}
            type={field.type}
            maxLength={field.maxLength}
            autoComplete={field.autoComplete}
            placeholder={field.placeholder}
            inputMode={field.type === 'email' ? 'email' : undefined}
            className={control}
          />
        )}
      </div>
      {help}
    </div>
  )
}

/** Lee el formulario según sus definiciones: las casillas múltiples como lista y las sueltas como «sí» o vacío */
function readValues(form: HTMLFormElement, fields: Field[]): Values {
  const data = new FormData(form)
  const values: Values = { [HONEYPOT]: String(data.get(HONEYPOT) ?? '') }
  for (const f of fields) values[f.name] = f.type === 'tools' ? data.getAll(f.name).map(String) : String(data.get(f.name) ?? '')
  return values
}

function ContactForm({ kind }: { kind: FormKind }) {
  const { fields, title } = FORMS[kind]
  const formId = useId().replace(/:/g, '')
  const formRef = useRef<HTMLFormElement>(null)
  const doneRef = useRef<HTMLHeadingElement>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [replyTo, setReplyTo] = useState('')
  const ready = emailjsReady()

  useEffect(() => {
    if (status === 'sent') doneRef.current?.focus()
  }, [status])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const values = readValues(form, fields)
    // Un bot llenó el campo trampa: se le muestra éxito y no se envía nada
    if (values[HONEYPOT]) {
      setStatus('sent')
      return
    }
    const found = validate(kind, values)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    if (!ready) {
      setStatus('error')
      return
    }
    setStatus('sending')
    try {
      await sendEmail(buildEmail(kind, values))
      setReplyTo(String(values.correo))
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  // Al corregir un campo, su error desaparece
  const onInput = (e: FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name
    if (errors[name]) setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => k !== name)))
  }

  if (status === 'sent') {
    return (
      <div className="py-6 text-center" role="status">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-moss/15 text-moss">
          <CheckCircle2 size={24} aria-hidden />
        </div>
        <h3 ref={doneRef} tabIndex={-1} className="mt-4 text-xl font-semibold outline-none">
          ¡Gracias! Tu mensaje llegó
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
          {replyTo ? (
            <>
              Te responderé a <strong className="text-ink">{replyTo}</strong> en cuanto pueda.
            </>
          ) : (
            'Te responderé en cuanto pueda.'
          )}
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 inline-flex min-h-11 items-center rounded-xl border border-line-strong px-5 text-sm font-semibold transition hover:border-nexus/50 hover:text-nexus"
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  const errorCount = Object.keys(errors).length
  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} onInput={onInput} onChange={onInput} aria-label={title} className="grid gap-6">
      {!ready && (
        <p className="flex items-start gap-2 rounded-xl border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-ink">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber" aria-hidden />
          <span>
            El envío todavía no está activo. Mientras tanto, escríbeme desde la página de{' '}
            <Link to="/contacto#correo" className="text-nexus underline underline-offset-2">
              contacto
            </Link>
            .
          </span>
        </p>
      )}
      {fields.map((f) => (
        <FieldControl key={f.name} field={f} error={errors[f.name]} formId={formId} />
      ))}
      {/* Campo trampa para bots: fuera de la vista, del teclado y de los lectores de pantalla */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${formId}-${HONEYPOT}`}>No llenes este campo</label>
        <input id={`${formId}-${HONEYPOT}`} name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-faint">
          <span className="text-nexus">*</span> Obligatorio
        </p>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-nexus px-6 text-sm font-semibold text-on-accent shadow-[0_8px_30px_-8px_var(--c-nexus)] transition hover:brightness-110 active:scale-[0.97] disabled:cursor-wait disabled:opacity-70"
        >
          {status === 'sending' ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Send size={16} aria-hidden />}
          {status === 'sending' ? 'Enviando…' : 'Enviar'}
        </button>
      </div>
      <p role="status" aria-live="polite" className="text-sm empty:hidden">
        {status === 'sending'
          ? 'Enviando tu mensaje…'
          : status === 'error'
            ? 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo, o escríbeme desde la página de contacto.'
            : errorCount
              ? `Revisa ${errorCount === 1 ? 'un campo' : `${errorCount} campos`} marcado${errorCount === 1 ? '' : 's'} antes de enviar.`
              : ''}
      </p>
    </form>
  )
}

export default function Propose() {
  useDocumentTitle('Propón un flujo')
  const [params, setParams] = useSearchParams()
  const active = TABS.find((t) => t.param === params.get('formulario')) ?? TABS[0]
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const select = (i: number) => setParams(i === 0 ? {} : { formulario: TABS[i].param }, { replace: true, preventScrollReset: true })

  // Flechas izquierda y derecha entre pestañas, como pide el patrón de ARIA
  const onKeyDown = (e: KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length
    select(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:pt-12">
      <header className="max-w-2xl">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-nexus">Trabajemos juntos</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          ¿Qué quieres <span className="text-gradient">automatizar</span>?
        </h1>
        <p className="mt-4 text-pretty leading-relaxed text-ink-soft">
          Si no encuentras la plantilla que necesitas, proponla. Cuéntame cómo funciona tu negocio, qué problema quieres
          resolver y qué idea tienes: puede convertirse en un flujo para ti o en una plantilla nueva de la librería. Y si
          prefieres conversar, escríbeme directamente.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div>
          <div role="tablist" aria-label="Tipo de mensaje" className="grid gap-3 sm:grid-cols-2">
            {TABS.map((t, i) => {
              const selected = t.kind === active.kind
              const Icon = t.icon
              return (
                <button
                  key={t.kind}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${t.param}`}
                  aria-selected={selected}
                  aria-controls={`panel-${t.param}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                    selected ? 'border-nexus/60 bg-nexus/10' : 'glass hover:-translate-y-0.5 hover:border-line-strong'
                  }`}
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${selected ? 'bg-nexus text-on-accent' : 'bg-surface-2 text-nexus'}`}>
                    <Icon size={20} aria-hidden />
                  </span>
                  <span>
                    <span className="block font-semibold text-ink">{FORMS[t.kind].title}</span>
                    <span className="mt-0.5 block text-sm text-ink-soft">{t.blurb}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <section
            id={`panel-${active.param}`}
            role="tabpanel"
            aria-labelledby={`tab-${active.param}`}
            className="glass relative mt-4 rounded-3xl p-5 sm:p-8"
          >
            {/* key: al cambiar de pestaña, el formulario empieza limpio */}
            <ContactForm key={active.kind} kind={active.kind} />
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="glass rounded-2xl p-5">
            <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-faint">Qué pasa después</h2>
            <ol className="mt-4 space-y-4 text-sm text-ink-soft">
              {[
                'Tu mensaje me llega por correo, con tus datos para responderte.',
                'Lo leo y te escribo, normalmente con preguntas para entender mejor el caso.',
                'Si la idea sirve a más personas y lo aceptaste, puede volverse una plantilla pública, sin tus datos.',
              ].map((paso, i) => (
                <li key={paso} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-nexus/15 font-mono text-xs text-nexus">{i + 1}</span>
                  {paso}
                </li>
              ))}
            </ol>
          </div>
          <div className="glass flex gap-3 rounded-2xl p-5 text-sm text-ink-soft">
            <ShieldAlert size={18} className="mt-0.5 shrink-0 text-amber" aria-hidden />
            <p>
              <strong className="text-ink">No envíes contraseñas, tokens ni datos de tus clientes.</strong> Para entender el caso
              basta con describirlo; si hace falta un ejemplo, usa datos inventados.
            </p>
          </div>
          <p className="px-1 text-xs text-faint">
            ¿Encontraste un error en una plantilla? Es mejor reportarlo en{' '}
            <Link to="/contacto#github" className="text-ink-soft underline underline-offset-2 hover:text-ink">
              GitHub Issues
            </Link>
            .
          </p>
        </aside>
      </div>
    </div>
  )
}
