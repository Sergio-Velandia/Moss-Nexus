import { BookOpenText, ClipboardPaste, Compass } from 'lucide-react'
import { Reveal, SectionHeading } from '../ui/Reveal'

const steps = [
  {
    icon: Compass,
    title: 'Explora',
    text: 'Busca por lo que quieres lograr o por la herramienta que ya usas: WhatsApp, Gmail, Sheets…',
    color: 'var(--c-moss)',
  },
  {
    icon: BookOpenText,
    title: 'Entiende',
    text: 'Mira el mapa del flujo, para qué sirve cada paso y qué cuentas necesitas antes de empezar.',
    color: 'var(--c-amber)',
  },
  {
    icon: ClipboardPaste,
    title: 'Copia y pega',
    text: 'Un clic copia el flujo. Lo pegas en n8n, conectas tus credenciales, lo ajustas a tu caso y lo pruebas.',
    color: 'var(--c-nexus)',
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" aria-labelledby="como-title" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20">
      <SectionHeading id="como-title" eyebrow="Cómo funciona" title="Tres pasos, ningún callejón sin salida" align="center" />

      <ol className="relative mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
        {steps.map((s, i) => (
          <Reveal as="li" key={s.title} delay={i * 0.1} className="glass relative rounded-3xl p-6 text-center">
            <span
              className="relative mx-auto grid h-[4.5rem] w-[4.5rem] place-items-center rounded-2xl border border-line bg-surface"
              style={{ boxShadow: `0 12px 30px -12px ${s.color}` }}
            >
              <s.icon size={28} style={{ color: s.color }} aria-hidden />
              <span
                className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full font-mono text-xs font-bold text-on-accent"
                style={{ background: s.color }}
              >
                {i + 1}
              </span>
            </span>
            {/* Conexión con el paso siguiente, como una arista del flujo */}
            {i < steps.length - 1 && (
              <span aria-hidden className="absolute -right-6 top-[3.75rem] hidden h-0.5 w-6 md:block" style={{ background: `linear-gradient(90deg, ${s.color}, ${steps[i + 1].color})` }} />
            )}
            <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-ink-soft">{s.text}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
